const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require('passport-facebook-token');
const UsersModel = require("../models/userModel");
const passportConfig = require("../middlewares/passport");
const { JWT_TOKEN, auth } = require("../configs/configs");
// passport lấy token từ client và gửi lên server giải mã token có đúng ko ?
// passport jwt
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken("Authorization");
opts.secretOrKey = JWT_TOKEN;
passport.use(
    new JwtStrategy(opts, async (payload, done) => {
        try {
            console.log("payload", payload);
            const user = await UsersModel.findById(payload.sub);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);
// passport local
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
        },
        async (email, password, done) => {
            try {
                const user = await UsersModel.findOne({ email });
                if (!user) {
                    return done(null, false);
                }
                const authenticate_password = await user.isValidPasword(
                    password
                ); //methods  isValidPasword là async vì thế phải có const await
                if (!authenticate_password) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
//passport-google-plus-token
passport.use(
    new GooglePlusTokenStrategy(
        {
            clientID: auth.google.clientID,
            clientSecret: auth.google.clientSecret,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log( 'accessToken', accessToken);
                console.log( 'refreshToken', refreshToken);
                console.log( 'profile', profile);
                const user = await UsersModel.findOne({
                    GoogleID: profile.id,
                    authType: 'google',
                });
                // console.log( 'user', user);
                if (user) {
                    return done(null, user);
                }

                const newUser = new UsersModel({
                    GoogleID: profile.id,
                    authType: 'google',
                    email: profile.emails[0].value,// mảng  emails: [ { value: 'khanhdohoangmai4444@gmail.com', type: 'ACCOUNT' } ]
                    firstName: profile.name.familyName, // object  name: { familyName: 'khanh', givenName: 'đỗ hoàng mai' },
                    lastName: profile.name.givenName
                });
                await newUser.save();
                console.log( 'newUser', newUser);
                done(null, newUser);


            } catch (error) {
                console.log( 'error', error);
                return done(error, false);
                // return res.status(500).json(error);
            }
        }
    )
);
// passport-facebook-token
passport.use(new FacebookTokenStrategy({
    clientID: auth.facebook.clientID ,
    clientSecret: auth.facebook.clientSecret
  }, async (accessToken, refreshToken, profile, done) =>{
    try {
        // console.log( 'accessToken', accessToken);
        // console.log( 'refreshToken', refreshToken);
        // console.log( 'profile', profile);
        const user = await UsersModel.findOne({
            FacebookID: profile.id,
            authType: 'facebook',
        });
        // console.log( 'user', user);
        if (user) {
            return done(null, user);
        }

        const newUser = new UsersModel({
            FacebookID: profile.id,
            authType: 'facebook',
            email: profile.emails[0].value, // mảng  emails: [ { value: 'khanhdohoangmai4444@gmail.com', type: 'ACCOUNT' } ]
            firstName: profile.name.familyName, // object  name: { familyName: 'khanh', givenName: 'đỗ hoàng mai' },
            lastName: profile.name.givenName
        });
        await newUser.save();
        console.log( 'newUser', newUser);
        done(null, newUser);


    } catch (error) {
        console.log( 'error', error);
        return done(error, false);
        
    }
  }
));

// passport.use(new JwtStrategy({
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
//     secretOrKey: JWT_TOKEN
//   },  (payload, done) => {

//     console.log( 'payload', payload);
//     try {
//       const user = await User.findById(payload.sub)

//       if (!user) return done(null, false)

//       done(null, user)
//     } catch (error) {
//       done(error, false)
//     }

//   }))
