const { OAuth2Client } = require('google-auth-library');

const clientIdWeb = process.env['CLIENT_ID_WEB'];
const clientIdAndroid = process.env['CLIENT_ID_ANDROID'];
const clientSecret = process.env['CLIENT_SECRET'];

const oAuth2Client = new OAuth2Client(
    clientIdWeb,
    clientSecret,
    'postmessage'
);


const GoogleAuthMiddleware =  async (req, res, next) =>{
    try{
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: req.body.idToken,
            audience: [clientIdWeb, clientIdAndroid]  // Specify the CLIENT_ID of the authrouter that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        // console.log(payload)
        req.user_uuid = payload['sub'];
        req.user_name = payload['name'];
        req.email = payload['email']

        next()

    } catch (e) {
        res.status(401).json({
            "error":"invalid token"
        })
    }
}

module.exports = {
    GoogleAuthMiddleware
};
