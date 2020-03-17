const db = require('../config/db');
const getCountReg = async(datetime, type) => {

    const Datequery1 = await db.query(`select count(*) FROM users Where reg_date BETWEEN '${datetime}'::date - interval '1 ${type}' AND '${datetime}'::date `)
    const Datequery2 = await db.query(`select count(*) FROM users Where reg_date BETWEEN '${datetime}'::date - interval '2 ${type}' AND '${datetime}'::date `)

    return {
        count1: Datequery1.rows[0].count,
        count2: Datequery2.rows[0].count
    }
}

// const getCountReg = async(datetime, type) => {

//     const Datequery1 = await db.query(` FOR datetime  in (${datetime}) loop
//     select count(*) FROM users Where reg_date BETWEEN 'datetime'::date - interval '1 ${type}' AND 'datetime'::date 
//     end loop `)
//     const Datequery2 = await db.query(`select count(*) FROM users Where reg_date BETWEEN '${datetime}'::date - interval '2 ${type}' AND '${datetime}'::date `)

//     return {
//         count1: Datequery1.rows[0].count,
//         count2: Datequery2.rows[0].count
//     }
// }

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
    const { rows } = await db.query(`SELECT count(phone) as phone,count(google_id) as google,count(password) as password,count(fb_id) as facebook FROM users`)

    return {
        email: rows[0].password - rows[0].phone,
        phone: rows[0].phone,
        google: rows[0].google,
        facebook: rows[0].facebook
    }
}

const activeuser = async() => {
    const { rows } = await db.query(`SELECT count(is_active) as active FROM users where is_active = true `);

    return {
        active: rows[0].active
    }
}

const locations = async() => {
    const { rows } = await db.query(`SELECT count(location) as location FROM users `);
    return {
        location: rows[0].location
    }
}

const getusers = async() => {
    try {
        const { rows } = await db.query('SELECT * FROM users ')
        const users = rows.map(row => {

            return {
                name: row.name,
                date: row.reg_date,
                google: row.google_id ? true : false,
                email: row.password && row.email ? true : false,
                phone: row.phone ? true : false,
                facebook: row.fb_id ? true : false,
                location: row.location
            }
        });
        return users;
    } catch (err) {
        throw err.detail;
    }

}

module.exports = {
    getCountReg,
    getvisits,
    getSignupType,
    activeuser,
    locations,
    getusers
}