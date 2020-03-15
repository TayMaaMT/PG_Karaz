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

const getAllDates = (datetime, interval, type) => {
    const timeZone = new Date(datetime);
    //var time = timeZone.getHours() + ":" + timeZone.getMinutes() + ":" + timeZone.getSeconds();
    let Array = [];
    for (let i = 1; i <= interval; i++) {
        Array.push(getdate(timeZone, type, i));

    }
    return Array;
}

const getRang = (query1, query2) => {
    const percent1 = (query1 / query2) * 100;
    const percent2 = ((query2 - query1) / query2) * 100;
    const perRang = percent1 - percent2;
    return perRang;
}

module.exports = {
    getdate,
    getInterval,
    getAllDates,
    getRang

}