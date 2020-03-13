const exprss = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const macaddress = require('macaddress');
const users = require('./routes/users');
const verifyAccount = require('./routes/verifyAccount');
const forgetPassword = require('./routes/forgetPassword');
const Dashboard = require('./routes/Dashboard');
require('dotenv').config();
require("./config/db");
const app = exprss();

function getCallerIP(request) {
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    return ip;
}

function getCallerPort(request) {
    var port =
        request.connection.remotePort ||
        request.socket.remotePort ||
        request.connection.socket.remotePort;

    return port;
}

app.use(cors({
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport');
app.use('/user', users);
app.use('/verifyAccount', verifyAccount);
app.use('/forgetPassword', forgetPassword);
app.use('/dashboard', Dashboard);
app.get('/', (req, res) => {

    // macaddress.all(function(err, all) {
    const port = getCallerPort(req);
    const ip = getCallerIP(req);
    //     res.send('Wellcom to Karaz API .... your IP is :' + ip + " : macAddress" + JSON.stringify(all, null, 2));
    // });
    res.send('Wellcom to Karaz API .... your IP is :' + ip + " your port is " + port)

});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("your server is running on port " + port);
})