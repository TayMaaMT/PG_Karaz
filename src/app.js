const exprss = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const macaddress = require('macaddress');
const users = require('./routes/users');
const verifyAccount = require('./routes/verifyAccount');
const forgetPassword = require('./routes/forgetPassword');
const Dashboard = require('./routes/Dashboard');
const settings = require('./routes/settings');
require('dotenv').config();
require("./config/db");
require("./config/redis_");
const app = exprss();

app.use(cors({
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport');
app.use('/api/user', users);
app.use('/api/verifyAccount', verifyAccount);
app.use('/api/forgetPassword', forgetPassword);
app.use('/api/dashboard', Dashboard);
app.use('/api/settings', settings);
app.get('/', (req, res) => {

    // macaddress.all(function(err, all) {
    //const port = getCallerPort(req);
    //     res.send('Wellcom to Karaz API .... your IP is :' + ip + " : macAddress" + JSON.stringify(all, null, 2));
    // });
    res.send('Wellcom to Karaz API .... ');


});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("your server is running on port " + port);
})