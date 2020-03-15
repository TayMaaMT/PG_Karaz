const router = require('express').Router();
const { nexmo, transporter } = require('../config/Configure');
const { GenarateRandom } = require('../config/use');
const { update, findOne } = require('../models/users');
const { verification, auth } = require('../middleware/auth');
require('dotenv').config();
let host = "";

router.get('/Send', verification, async function(req, res) {
    try {
        if (req.user.email) {
            res.redirect('SendEmail')
        } else if (req.user.phone) {
            res.redirect('SendSMS');
        }

    } catch (err) {
        res.status(400).json({ Error: "please authanticate" })

    }
});

router.get('/MobileSend', verification, async function(req, res) {
    try {
        if (req.user.email) {
            res.redirect('sendEmailCode')
        } else if (req.user.phone) {
            res.redirect('SendSMS');
        }

    } catch (err) {
        res.status(400).json({ Error: "please authanticate" })

    }
});

router.get('/SendSMS', verification, async function(req, res) {
    try {
        const random = GenarateRandom();
        await update('users', req.user, { verification_code: random });
        let text = "code to verify account ( " + random + " )";
        nexmo.message.sendSms("Nexmo", req.user.phone, text, { type: "unicode" }, (err, responseData) => {
            if (err) {
                res.send(err);
            } else {
                if (responseData.messages[0]['status'] === "0") {
                    res.status(200).json({
                        sucess: {
                            massege: "send SMS",
                            id: req.user.id
                        }
                    });
                } else {
                    res.send(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                }
            }
        })
    } catch (err) {
        res.status(400).json({ Error: "please authanticate" })
    }
})
router.get('/sendEmail', verification, async function(req, res) {
    try {
        const random = GenarateRandom();
        await update('users', req.user, { verification_code: random });
        host = req.get('host');
        const link = "http://" + req.get('host') + "/api/verifyAccount/verify?User_ID=" + req.user.id + "&code=" + random;
        const mailOptions = {
            to: req.user.email,
            subject: "Please confirm your Email account",
            html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
        }
        transporter.sendMail(mailOptions, function(error, response) {
            if (error) {
                res.status(400).json({ Error: error });

            } else {
                res.status(200).json({ sucess: "sent email" });

            }
        });
    } catch (err) {
        res.status(400).json({ Error: "please authanticate" })
    }

});

router.get('/sendEmailCode', verification, async function(req, res) {
    try {
        const random = GenarateRandom();
        await update('users', req.user, { verification_code: random });
        const mailOptions = {
            to: req.user.email,
            subject: "Please confirm your Email account",
            html: "Hello,<br> code to verify account ( " + random + " ) "
        }
        transporter.sendMail(mailOptions, function(error, response) {
            if (error) {
                res.status(400).json({ Error: error });
            } else {
                res.status(200).json({ sucess: "sent email" });
            }
        });
    } catch (err) {
        res.status(400).json({ Error: "please authanticate" })
    }

});

router.post('/CodeVerify', verification, async function(req, res) {
    try {

        if (req.user.verification_code == req.body.random && req.body.random != null) {
            await update('users', req.user, { verification_code: null, is_verified: true });
            res.status(200).json({ sucess: "Account has been Successfully verified " });
        } else {
            res.status(400).json({ Error: "code dosent match" });
        }
    } catch (err) {
        res.status(400).json({ Error: "please authanticate" })

    }
});



router.get('/verify', async function(req, res) {
    try {

        if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
            const user = await findOne('users', { id: req.query.User_ID });
            if (req.query.code == user.verification_code) {
                await update('users', user, { verification_code: null, is_verified: true });
                res.status(200).json({ sucess: "Account has been Successfully verified " + user });
                //res.redirect('http://localhost:3000/verify-account');
            } else {
                res.status(400).json({ Error: "Bad Request" });
            }
        } else {
            res.status(400).json({ Error: "Request is from unknown source" });
        }
    } catch (err) {
        res.status(400).json({ Error: "please authanticate" })

    }
});


router.get('/ISverify', auth, async function(req, res) {
    try {
        if (req.user.is_verified) {
            res.status(200).json({ sucess: "your email is verified " });
        } else {
            res.status(400).json({ Error: "your email is not verified " });
        }

    } catch (err) {
        res.status(400).json({ Error: "please authanticate" })
    }
});


module.exports = router;