const { verifyAuthToken } = require('../models/users');
const { User } = require('../config/use');
const jwt = require('jsonwebtoken');
require('dotenv').config();




const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const user = await verifyAuthToken(token);

        if (!user) {
            res.status(400).send({ Error: "please authanticate" });
        }
        if (!user.is_verified) {
            res.status(201).send({ Error: "please verify your account" });
        }
        req.token = token;
        const returnUser = new User(user);
        req.user = returnUser.data;
        next();
    } catch (err) {
        res.status(400).send({ Error: err });
    }

}

const verification = async(req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '');
        const user = await verifyAuthToken(token);
        if (!user) {
            res.status(400).json({ Error: "please authanticate" })
        } else if (!user.is_verified) {
            req.token = token;
            const returnUser = new User(user);
            req.user = returnUser.data;
            next();
        } else {
            res.status(201).json({ sucess: "your email is verified " });
        }

    } catch (err) {
        res.status(400).json({ Error: "please authanticate" })
    }

}

const visitor = (req, res, next) => {


    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const deacode = jwt.verify(token, process.env.TOKEN_KEY);
        if (!deacode) {
            next();
        } else {
            req.id = deacode.id;
            console.log(req.id);
            next();
        }
    } catch (err) {
        next();
    }

}


module.exports = { auth, verification, visitor };