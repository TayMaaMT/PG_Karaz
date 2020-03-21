const passport = require('passport');
const facebookeStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const { FacebookOption, googleOption } = require('./Configure');
const { update, creat, findOne } = require('../models/users');
require('dotenv').config();


passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(
    new facebookeStrategy(FacebookOption, async(accessToken, refreshToken, profile, done) => {
        try {
            const currentUser = await findOne('users', { fb_id: profile._json.id });
            if (currentUser[0]) {
                // if the user is not new (has created )
                done(null, currentUser[0]);
            } else {
                // if the user is new (not created yet)
                const user = await findOne('users', { email: profile._json.email });
                if (user[0]) {
                    await update('users', user[0], { fb_id: profile._json.id });
                    done(null, user[0]);
                } else {
                    const user_id = await creat('users', {
                        name: profile._json.name,
                        fb_id: profile._json.id,
                        email: profile._json.email,
                        is_verified: true
                    });
                    const newUser = await findOne('users', { fb_id: profile._json.id });
                    done(null, newUser[0]);
                }
            }
        } catch (err) {
            done(null, false);
        }

    }))




passport.use(
    new GoogleStrategy(googleOption, async(accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const currentUser = await findOne('users', { google_id: profile.id });
            if (currentUser[0]) {
                // if the user is not new (has created )
                done(null, currentUser[0]);
            } else {
                // if the user is new (not created yet)
                const user = await findOne('users', { email: profile.email });

                if (user[0]) {

                    await update('users', user[0], { google_id: profile.id, is_verified: profile.email_verified });
                    done(null, user[0]);
                } else {
                    const reg_date = new Date();
                    const user_id = await creat('users', {
                        name: profile.displayName,
                        google_id: profile.id,
                        email: profile.email,
                        is_verified: profile.email_verified,
                        reg_date
                    });

                    const newUser = await findOne('users', { google_id: profile.id });
                    done(null, newUser[0]);
                }
            }
        } catch (err) {
            done(null, false);
        }


    }))