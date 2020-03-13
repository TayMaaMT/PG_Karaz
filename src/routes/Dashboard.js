const router = require('express').Router();
const db = require('../config/db');

const getdate = (datetime, type, i = 1) => {
    const timeZone = new Date(datetime);
    // var time = timeZone.getHours() + ":" + timeZone.getMinutes() + ":" + timeZone.getSeconds();
    if (type == 'day') {
        const newDate = new Date(timeZone.setDate((timeZone.getDate() + i)));
        var date = newDate.getFullYear() + '-' + (("0" + (newDate.getMonth() + 1)).slice(-2)) + '-' + (newDate.getDate());

    } else if (type == 'month') {
        if ((("0" + (timeZone.getMonth() + i)).slice(-2)) >= '12') {
            let count = (timeZone.getMonth() + i) - '11'
            var date = (timeZone.getFullYear() + 1) + '-' + (("0" + count).slice(-2)) + '-' + '1';
        } else {
            var date = timeZone.getFullYear() + '-' + (("0" + (timeZone.getMonth() + 1 + i)).slice(-2)) + '-' + '1';
        }
    } else if (type == 'year') {
        var date = (timeZone.getFullYear() + i) + '-' + '01' + '-' + '1';

    } else {
        throw "Error type"
    }

    return date;
}

const getCount = (datetime, type) => {

    const Datequery1 = `select count(*) FROM users Where reg_date BETWEEN '${datetime}'::date - interval '1 ${type}' AND '${datetime}'::date `
    const Datequery2 = `select count(*) FROM users Where reg_date BETWEEN '${datetime}'::date - interval '2 ${type}' AND '${datetime}'::date `

    return {
        Datequery1,
        Datequery2
    }
}

const getRang = (query1, query2) => {
    const percent1 = (query1.rows[0].count / query2.rows[0].count) * 100;
    const percent2 = ((query2.rows[0].count - query1.rows[0].count) / query2.rows[0].count) * 100;
    const perRang = percent1 - percent2;
    return perRang;
}

const getDiffer = {

    inDays: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000));
    },

    inWeeks: function(d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();

        return parseInt((t2 - t1) / (24 * 3600 * 1000 * 7));
    },

    inMonths: function(d1, d2) {
        var d1Y = d1.getFullYear();
        var d2Y = d2.getFullYear();
        var d1M = d1.getMonth();
        var d2M = d2.getMonth();

        return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
    },

    inYears: function(d1, d2) {
        return d2.getFullYear() - d1.getFullYear();
    }
}

const getInterval = (startDate, endDate, type) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (type == 'day') {
        var interval = getDiffer.inDays(start, end) + 1;
    } else if (type == 'month') {
        var interval = getDiffer.inMonths(start, end) + 1;
        console.log(interval);
    } else if (type == 'year') {
        var interval = getDiffer.inYears(start, end) + 1;
    } else {
        throw "Error type"
    }

    return interval;
}

const getAllDates = (datetime, interval, type) => {
    const timeZone = new Date(datetime);
    //var time = timeZone.getHours() + ":" + timeZone.getMinutes() + ":" + timeZone.getSeconds();
    let Array = [];
    for (let i = 1; i <= interval; i++) {
        Array.push(getdate(timeZone, type, i));

    }
    return Array;
}

router.post('/count', async(req, res) => {
    try {
        const { date, type } = req.body;
        const timeZone = getdate(date, type);
        const { Datequery1, Datequery2 } = getCount(timeZone, type);
        const result1 = await db.query(Datequery1)
        const result2 = await db.query(Datequery2)
        const precentage = getRang(result1, result2);
        res.status(200).json({
            result: result1.rows[0].count,
            precentage
        });

    } catch (err) {
        res.status(400).json({ Error: err });
    }

})



router.post('/chart', async(req, res) => {
    try {
        let countObj = [];
        const { dateStart, dateEnd, type } = req.body;
        const interval = getInterval(dateStart, dateEnd, type);
        const ArrayTimeZone = getAllDates(dateStart, interval, type);
        for (let timeZone in ArrayTimeZone) {
            const { Datequery1 } = getCount(ArrayTimeZone[timeZone], type);
            const result = await db.query(Datequery1);
            countObj.push(result.rows[0].count);
        }
        res.status(200).json({ results: countObj });
    } catch (err) {
        res.status(400).json({ Error: err });
    }

})

router.get('/visits', async(req, res) => {
    try {
        const visitor = await db.query(`SELECT count(*) FROM users_logs Where user_id is null`)
        const visits = await db.query('SELECT count(*) FROM users_logs ')
        const users = visits.rows[0].count - visitor.rows[0].count;
        res.send({
            visits: visits.rows[0].count,
            visitor: visitor.rows[0].count,
            users: users
        })
    } catch (err) {
        res.send(err);
    }

})

router.get('/sigupType', async(req, res) => {
    try {
        const email = await db.query(`SELECT count(*) FROM users Where email is not null AND password is not null`)
        const phone = await db.query(`SELECT count(*) FROM users Where phone is not null`)
        const google = await db.query(`SELECT count(*) FROM users Where google_id is not null `)
        const facebook = await db.query(`SELECT count(*) FROM users Where fb_id is not null `)

        res.send({
            email: email.rows[0].count,
            phone: phone.rows[0].count,
            google: google.rows[0].count,
            facebook: facebook.rows[0].count
        })
    } catch (err) {
        res.send(err);
    }

})



module.exports = router;