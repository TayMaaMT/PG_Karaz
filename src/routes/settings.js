const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { loggers, findOne, deletOne, update } = require('../models/users');
const { private } = require('../middleware/auth');
const { client } = require('../config/redis_');


router.get('/logger', async(req, res) => {
    const logger = await loggers();
    res.send(logger)
})

router.get('/activities', private, async(req, res) => {
    try {
        const activities = await findOne('login', { user_id: req.user_id });
        console.log(activities[0].ip.city);
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
        console.log(user[0].id);
        await update('users', user[0], { password: hashPassword });
        res.send("reset success")
    } catch (err) {
        console.log("some erorr");
        res.send(err)
    }
})


module.exports = router;