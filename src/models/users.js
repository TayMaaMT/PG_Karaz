const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { CreatQuery, SelectQuerytable, UpdateQuerytable } = require('../config/use');
require('dotenv').config();



const creat = async(table, user) => {
    try {
        const colval = Object.keys(user).map(function(key) {
            return user[key];
        });
        const QueryUser = CreatQuery(table, user);
        const { rows } = await db.query(`${QueryUser}`, colval);
        return rows[0].id;
    } catch (err) {
        throw err.detail;
    }
}



const getusers = async() => {
    try {
        const { rows } = await db.query('SELECT * FROM users ')
        return rows;
    } catch (err) {
        throw err.detail;
    }

}

const findOneUser = async(email, phone) => {
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1 OR phone =$2', [email, phone])
        return rows[0];
    } catch (err) {
        throw "bad request"
    }

}


const findOne = async(table, data) => {
    try {
        const colval = Object.keys(data).map(function(key) {
            return data[key];
        });
        const SelectQuery = SelectQuerytable(table, data);
        const { rows } = await db.query(`${SelectQuery}`, colval);
        return rows[0];
    } catch (err) {
        throw err.detail;
    }

}



const genarateAuthToken = (id) => {
    const token = jwt.sign({ id: id.toString() }, process.env.TOKEN_KEY)
    return token;
}

const verifyAuthToken = async(token) => {
    try {
        const deacode = jwt.verify(token, process.env.TOKEN_KEY);
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1 ', [deacode.id])
        return rows[0];
    } catch (err) {
        throw "please authanticate"
    }
}

const findByCredentials = async(email, phone, password) => {
    try {
        const user = await findOneUser(email, phone);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw "Unable to login ";
        }
        return user.id;

    } catch (err) {
        throw "Unable to login ";
    }
}



const update = async(table, user, data) => {
    try {
        const id = user.id;
        const colval = Object.keys(data).map(function(key) {
            return data[key];
        });
        const UpdateQuery = UpdateQuerytable(table, id, data);
        await db.query(`${UpdateQuery}`, colval);
    } catch (err) {
        throw err.detail;
    }


}

module.exports = {
    creat,
    getusers,
    findOneUser,
    genarateAuthToken,
    findByCredentials,
    verifyAuthToken,
    update,
    findOne
}