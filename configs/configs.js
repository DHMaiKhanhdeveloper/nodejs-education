module.exports = {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    JWT_TOKEN: process.env.JWT_TOKEN,
    auth: {
        google: {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        facebook: {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        },
    },
};
