const { sql } = require("../database/db");
const jwt = require('jsonwebtoken');
const cookieName = 'SSIDCPAD';
const jwt_secret = process.env['JWT_SECRET'];

const getEventData = async (req, res) => {
    const { event_id } = req.params;
    //  console.log(req.eids)
    if (!event_id) {
        return res.status(500).json({
            'message': 'pass event_id'
        })
    }
    let req_event_id = false;
    for(eid of req.eids){
        if(eid == 0 || eid == event_id){
            req_event_id = true;
            break;
        }
    }

    if(!req_event_id){
        return res.status(500).json({
            "message":"can't access"
        })
    }
    try {
        const result = await sql`
        SELECT r.user_name, r.email, r.college, r.grade, r.mobile, t.team_name, t.team_code 
        FROM eventteam e
        INNER JOIN registered_users r ON e.user_id = r.id
        INNER JOIN team t ON e.team_id = t.id
        where e.event_id = ${event_id};    
        `
        return res.json(result)
    } catch (e) {
        return res.status(500).json({
            'message': e
        })
    }
}

const checkAdminJwt = async (req, res, next) => {
    const token = req.cookies[cookieName];

    if (!token) {
        return res.status(401).json({
            "message": "token not provided"
        })
    }

    try {
        const decoded = jwt.verify(token, jwt_secret);
        req.eids = decoded.eids;
        next()

    } catch (error) {
        console.log(error)
        return res.status(401).send({
            message: "invalid token"
        });
    }
}

const login = async (req, res) => {
    const result = await sql`
    SELECT * FROM ceph_admin
    WHERE
        email=${req.email}
    `
    // console.log(result)
    const eids = []
    for(x of result){
        // console.log(x)
        eids.push(x.event_id)
    }
    // console.log(eids)
    if (result.length === 0) {
        return res.status(401).json({
            "message": "user's not admin"
        })
    }
    const payload = {
	    eids: eids        
    }
    const jwt_options = {
        expiresIn: '1d'
    }
    const cookieOptions = {
        sameSite: 'Strict',
        path: "/",
        expires: new Date(Date.now() + 86100000), // 1day
        httpOnly: true,
        secure: true
    }
    const token = jwt.sign(payload, jwt_secret, jwt_options);

    return res.cookie(cookieName, token, cookieOptions).json()

}

const logout = async (req, res) => {
    return res.clearCookie(
        cookieName,
        {
            // domain:'.cyclic.app',
            path: '/',
            sameSite: "Strict",
            secure: true,
        }
    ).json({"message":"removed"})
}

module.exports = { getEventData, login, checkAdminJwt, logout }
