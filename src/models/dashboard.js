const db = require('../config/db');
const getCountReg = async(datetime, type) => {

    const Datequery1 = await db.query(`select count(*) FROM users Where reg_date BETWEEN '${datetime}'::date - interval '1 ${type}' AND '${datetime}'::date `)
    const Datequery2 = await db.query(`select count(*) FROM users Where reg_date BETWEEN '${datetime}'::date - interval '2 ${type}' AND '${datetime}'::date `)

    return {
        count1: Datequery1.rows[0].count,
        count2: Datequery2.rows[0].count
    }
}

const getvisits = async(timeZone, type) => {

    const visits1 = await db.query(`SELECT count(*) FROM users_logs  where login_date BETWEEN '${timeZone}'::date - interval '1 ${type}' AND '${timeZone}'::date`)
    const visits2 = await db.query(`SELECT count(*) FROM users_logs  where login_date BETWEEN '${timeZone}'::date - interval '2 ${type}' AND '${timeZone}'::date`)
    const visitor1 = await db.query(`SELECT count(*) FROM users_logs Where user_id is null AND (login_date BETWEEN '${timeZone}'::date - interval '1 ${type}' AND '${timeZone}'::date)`)
    const visitor2 = await db.query(`SELECT count(*) FROM users_logs Where user_id is null AND (login_date BETWEEN '${timeZone}'::date - interval '2 ${type}' AND '${timeZone}'::date)`)

    return {
        visits1: visits1.rows[0].count,
        visits2: visits2.rows[0].count,
        visitor1: visitor1.rows[0].count,
        visitor2: visitor2.rows[0].count,
        users1: visits1.rows[0].count - visitor1.rows[0].count,
        users2: visits2.rows[0].count - visitor2.rows[0].count
    }
}

const getSignupType = async() => {
    const email = await db.query(`SELECT count(*) FROM users Where email is not null AND password is not null`)
    const phone = await db.query(`SELECT count(*) FROM users Where phone is not null`)
    const google = await db.query(`SELECT count(*) FROM users Where google_id is not null `)
    const facebook = await db.query(`SELECT count(*) FROM users Where fb_id is not null `)

    return {
        email: email.rows[0].count,
        phone: phone.rows[0].count,
        google: google.rows[0].count,
        facebook: facebook.rows[0].count
    }
}

module.exports = {
    getCountReg,
    getvisits,
    getSignupType
}