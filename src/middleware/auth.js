const { verifyAuthToken } = require('../models/users');
const { User } = require('../config/use');



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
        console.log(user);
        if (!user) {
            throw new Error();
        } else if (!user.is_verified) {
            req.token = token;
            const returnUser = new User(user);
            req.user = returnUser.data;
            next();
        } else {
            res.status(200).json({ sucess: "your email is verified " });
        }

    } catch (err) {
        res.status(500).send("Error :please authanticate");
    }

}


module.exports = { auth, verification };