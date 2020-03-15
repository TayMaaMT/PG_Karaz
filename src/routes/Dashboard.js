const router = require('express').Router();
const { getdate, getInterval, getAllDates, getRang } = require('../config/useDash');
const { getCountReg, getvisits, getSignupType } = require('../models/dashboard');

router.post('/count', async(req, res) => {
    try {
        const { date, type } = req.body;
        const timeZone = getdate(date, type);
        const { count1, count2 } = await getCountReg(timeZone, type);

        const precentage = getRang(count1, count2);
        res.status(200).json({
            result: count1,
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
            const { count1 } = await getCountReg(ArrayTimeZone[timeZone], type);
            countObj.push(count1);
        }
        res.status(200).json({ results: countObj });
    } catch (err) {
        res.status(400).json({ Error: err });
    }

})

router.post('/visits', async(req, res) => {
    try {
        const { date, type } = req.body;
        const timeZone = getdate(date, type);
        const { visitor1, visitor2, visits1, visits2, users1, users2 } = await getvisits(timeZone, type);
        const precentvisitor = getRang(visitor1, visitor2);
        const precentvisits = getRang(visits1, visits2);
        const precentusers = getRang(users1, users2);
        res.send({
            visits: visits1,
            precentvisits,
            visitor: visitor1,
            precentvisitor,
            users: users1,
            precentusers
        })
    } catch (err) {
        res.send(err);
    }

})

router.get('/sigupType', async(req, res) => {
    try {
        const { email, phone, google, facebook } = await getSignupType();
        res.send({
            email,
            phone,
            google,
            facebook
        })
    } catch (err) {
        res.send(err);
    }

})



module.exports = router;