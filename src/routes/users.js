const router = require('express').Router();
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { creat, getusers, findOneUser, genarateAuthToken, findByCredentials, findOne } = require('../models/users');
require('dotenv').config();
router.get('/signup', (req, res) => {
    res.send('sign up  page');
})

router.get('/visitor', async(req, res) => {
    const users = await getusers();
    console.log(users);
    res.send(users)
})


router.get('/users', async(req, res) => {
    const users = await getusers();
    res.send(users)
})

router.get('/delet', async(req, res) => {
    const users = await db.query('DELETE FROM users RETURNING *; ')

    res.send(users)
})


/////////////////////// important
router.post('/findUser', async function(req, res) {
    try {
        const { email, phone } = req.body;
        if (email || phone) {
            const user = await findOneUser(email, phone);
            user ? res.status(400).json({ faild: "duplicated user" }) : res.status(200).json({ sucess: "uniqe" })
        } else {
            throw "bad request"
        }
    } catch (err) {
        res.status(400).json({ Error: err });
    }
})

router.post('/signup', async(req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 8);
        const reg_date = new Date();
        const user_id = await creat('users', { name, email, phone, password: hashPassword, reg_date });
        const token = genarateAuthToken(user_id);
        res.status(200).json({ token: token });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err });
    }
})

// router.post('/findone', async(req, res) => {
//     try {
//         const { email } = req.body;
//         console.log(email);
//         const user = await findOne('users', { email });
//         res.status(200).json({ token: token });
//     } catch (err) {
//         res.status(400).json({ Error: "Unable to login" })
//     }
// })


router.post('/login', async(req, res) => {
    try {
        const { email, phone, password } = req.body;
        const user_id = await findByCredentials(email, phone, password);
        const token = genarateAuthToken(user_id);
        res.status(200).json({ token: token });
    } catch (err) {
        res.status(400).json({ Error: "Unable to login" })
    }
})

router.get('/profile', auth, async(req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (err) {
        res.status(400).json({ Error: err });
    }
})

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: "/", session: false }), async(req, res) => {
    // const token = await req.user.genarateAuthToken();
    // res.redirect("http://localhost:3000/verify-account/?token=" + token);
    const token = genarateAuthToken(req.user.id);
    res.status(200).json({ token: token });
})

router.get('/facebook', passport.authenticate('facebook', { scope: "email" }))
router.get('/facebook/redirect', passport.authenticate('facebook', { failureRedirect: "/", session: false }), async(req, res) => {
    try {

        //res.redirect("http://localhost:3000/verify-account/?token=" + token);
        const token = genarateAuthToken(req.user.id);
        res.status(200).json({ token: token });

    } catch (err) {
        res.status(400).json({ Error: err })
    }

})


module.exports = router;