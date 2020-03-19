const router = require('express').Router();
const { nexmo, transporter } = require('../config/Configure');
const { update, findOne } = require('../models/users');
const { GenarateRandom } = require('../config/use');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post('/FindAccount', async function(req, res) {
    try {
        if (req.body.email) {
            const user = await findOne('users', { email: req.body.email });
            user[0] ? res.status(200).json({
                user: {
                    id: user[0].id,
                    name: user[0].name,
                    email: user[0].email,
                    phone: user[0].phone
                }
            }) : res.status(400).json({ Error: "Account not found" });
        } else if (req.body.phone) {
            const user = await findOne('users', { phone: req.body.phone });
            user[0] ? res.status(200).json({
                user: {
                    id: user[0].id,
                    name: user[0].name,
                    email: user[0].email,
                    phone: user[0].phone
                }
            }) : res.status(400).json({ Error: "Account not found" });

        } else {
            res.status(400).json({ Error: "bad request" });
        }


    } catch (err) {
        res.status(400).json({ Error: error });
    }


})

router.post('/SendSMS', async function(req, res) {
    try {
        const user = await findOne('users', { phone: req.body.phone });
        const random = GenarateRandom();
        await update('users', user[0], { verification_code: random });
        let text = "code to reset password ( " + random + " )";
        nexmo.message.sendSms("Nexmo", user[0].phone, text, { type: "unicode" }, (err, responseData) => {
            if (err) {
                res.send(err);
            } else {
                if (responseData.messages[0]['status'] === "0") {
                    res.status(200).json({
                        sucess: {
                            massege: "send SMS",
                            id: user[0].id
                        }
                    });
                } else {
                    res.status(400).json(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    } catch (err) {
        res.status(400).json({ Error: "connot find user" });
    }
})



router.post('/sendEmail', async function(req, res) {
    try {
        const user = await findOne('users', { email: req.body.email });
        const random = GenarateRandom();
        await update('users', user[0], { verification_code: random });
        const mailOptions = {
            to: user[0].email,
            subject: "Reset Password",
            html: "<h1>Hello</h1>,<br> <h3> use this code to reset your password ( " + random + " )></h3>"
        }

        transporter.sendMail(mailOptions, function(error, response) {
            if (error) {
                res.status(400).json({ Error: error });
            } else {
                res.status(200).json({
                    sucess: {
                        massege: "send email",
                        id: user[0].id
                    }
                });
            }
        });
    } catch (err) {
        res.status(400).json({ Error: "No user have this email" });
    }
})


router.post('/verifyCode', async function(req, res) {
    try {
        const user = await findOne('users', { id: req.body.id, verification_code: req.body.random });
        user[0] ? res.status(200).json({ sucess: "user is verify" }) : res.status(400).json({ Error: "Code dosent match" });
    } catch (err) {
        res.status(400).json({ Error: "Code dosent match" });
    }
});

router.post('/changePassword', async function(req, res) {
    try {
        const user = await findOne('users', { id: req.body.id, verification_code: req.body.random });
        if (req.body.password == req.body.passwordConfirm) {
            const hashPassword = await bcrypt.hash(req.body.password, 8);
            await update('users', user[0], { verification_code: null, password: hashPassword });
            res.status(200).json({ sucess: "change password success!" });
        } else {
            res.status(400).json({ Error: "Tow password does not mach" });
        }
    } catch (err) {
        res.status(400).json({ Error: "bad request" });
    }

});

module.exports = router;