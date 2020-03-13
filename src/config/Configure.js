const nodemailer = require("nodemailer");
// const sendgridTransport = require('nodemailer-sendgrid-transport');
const Nexmo = require('nexmo');
require('dotenv').config();

const FacebookOption = {
    //option of the faceboook strategy 
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://karaz6.herokuapp.com/api/user/facebook/redirect',
    profileFields: ["id", "displayName", "email", "gender"],
    proxy: true
}

const googleOption = {
    //option of the google strategy 
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://karaz6.herokuapp.com/api/user/google/redirect',
    profileFields: ["id", "displayName", "email", "phones"],
    proxy: true
}


// Configure Nodemailer SendGrid Transporter
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SENDGRID_API_USER, // SG username
        pass: process.env.SENDGRID_API_PASSWORD, // SG password
    },
});

// Configure Nexmo SendPhone SMS
const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_API_KEY,
    apiSecret: process.env.NEXMO_API_SECRET
})

module.exports = {
    nexmo,
    transporter,
    FacebookOption,
    googleOption
}