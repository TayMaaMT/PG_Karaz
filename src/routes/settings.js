const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { loggers, findOne, deletOne, update } = require('../models/users');
const { private } = require('../middleware/auth');
const { client } = require('../config/redis_');
const geoip = require('geoip-lite');

class dataSettings {
    constructor({ name, email, phone, location, bairthday }) {
        if (name) { this.name = name }
        if (email) { this.email = email }
        if (phone) { this.phone = phone }
        if (location) { this.location = location }
        if (bairthday) { this.bairthday = bairthday }
    }
    getData() {
        return this
    }
}


router.post('/editProfile', private, async(req, res) => {
    try {
        const { name, email, phone, location, bairthday } = req.body;
        const Data = new dataSettings({ name, email, phone, location, bairthday });
        const user = await findOne('users', { id: req.user_id });
        await update('users', user[0], Data);
    } catch (err) {
        res.send(err)
    }
    res.send(user1)
})


router.get('/logger', async(req, res) => {
    const logger = await loggers();
    res.send(logger)
})

router.get('/activities', private, async(req, res) => {
    try {
        const activities = await findOne('login', { user_id: req.user_id });
        console.log(activities[2].ip);
        var geo = geoip.lookup("158.140.100.70")
        console.log(geo);
        res.send(activities)
    } catch (err) {

        res.send(err)
    }
})

router.get('/logout', private, async(req, res) => {
    try {
        const logout_user = await deletOne('login', { user_id: req.user_id, serial_number: req.serial_number });
        client.del(`${req.serial_number}`, function(err, reply) {
            res.send('delet')

        });
    } catch (err) {

        res.send(err)
    }
})
router.get('/logoutAll', private, async(req, res) => {
    try {
        const activities = await findOne('login', { user_id: req.user_id })
        for (let user in activities) {
            if (activities[user].serial_number != req.serial_number) {

                const logout_user = await deletOne('login', { user_id: req.user_id, serial_number: activities[user].serial_number });
                client.del(`${activities[user].serial_number}`, function(err, reply) {
                    if (err) {
                        res.send(err)
                    }

                })
            }
        }
        res.send('deletAll')
    } catch (err) {
        res.send(err)
    }
})

router.post('/logout_attac', async(req, res) => {
    try {
        const { serial_number } = req.body;
        await deletOne('login', { serial_number });
        client.del(`${serial_number}`, function(err, reply) {
            res.send('delet')
        });
    } catch (err) {

        res.send(err)
    }
})

router.post('/resetPassword', private, async(req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await findOne('users', { id: req.user_id });
        console.log(oldPassword);
        const isMatch = await bcrypt.compare(oldPassword, user[0].password);
        console.log(isMatch);
        if (!isMatch) {
            throw "password is not correct ";
        }
        const hashPassword = await bcrypt.hash(newPassword, 8);

        await update('users', user[0], { password: hashPassword });
        res.send("reset success")
    } catch (err) {
        console.log("some erorr");
        res.send(err)
    }
})

router.post('/NewPassword', private, async(req, res) => {
    try {
        const { newPassword } = req.body;
        const user = await findOne('users', { id: req.user_id });
        console.log(oldPassword);
        const isMatch = await bcrypt.compare(oldPassword, user[0].password);
        console.log(isMatch);
        if (!isMatch) {
            throw "password is not correct ";
        }
        const hashPassword = await bcrypt.hash(newPassword, 8);

        await update('users', user[0], { password: hashPassword });
        res.send("reset success")
    } catch (err) {
        console.log("some erorr");
        res.send(err)
    }
})



module.exports = router;