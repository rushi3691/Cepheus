
const jwt = require('jsonwebtoken');
const { createUser, registerUser } = require('../../database/queries');
const { getInitials } = require("../../utils");
const jwt_secret = process.env['JWT_SECRET'];

const checkJwt = async (req, res, next) =>{
    const {token} = req.body;
    if(!token){
        return res.status(401).json({
            "message":"token not provided"
        })
    }

    try{
        const decoded = jwt.verify(token, jwt_secret);
        req.id = decoded.uid;
        req.ini = decoded.ini;
        // req.grade = decoded.grade;
        req.registered = decoded.registered;
        next()

    }catch(error){
        return res.status(401).send({
            message:"invalid token"
        });
    }
}

const isRegistered = async (req, res, next) =>{
    if(req.registered){
        next()
    }else{
        return res.status(401).json({
            "message":"user is not registered"
        });
    }
}

const createUserController = async  (req, res) =>{
    const data = await createUser(req.user_uuid, req.email, req.user_name)
    
    if(data instanceof Error){
        return res.status(500).json(data)
    }else{
        const payload = {
            uid: data.user.id,
            ini: getInitials(data.user.user_name),
            // grade: data.user.grade || 0,
            registered: data.user.registered
        }
        const jwt_options = {
            expiresIn: '5d'
        }
        const token = jwt.sign(payload, jwt_secret, jwt_options);
        return res.json({user:data.user, token});
    }
}

const validateMobile = (inputtxt) => {
    var phoneno = /^\d{10}$/;
    if(inputtxt.match(phoneno)){
        return true;
    }
    else {
        return false;
    }
}

const registerUserController = async (req, res) =>{
    const {user_name, college, grade, mobile, image_url} = req.body

    if(!user_name || !college || !grade || !mobile){
        return res.status(500).json({
            "message":"pass all params"
        })
    }
    if(!validateMobile(mobile)){
        return res.status(500).json({
            "message":"provide valid mobile number"
        })
    }
    const data = await registerUser(req.id, user_name, college, grade, mobile, image_url);

    if(data instanceof Error){
        return res.status(500).json(data)
    }else{
        let payload = {
            uid: data.id,
            ini: getInitials(data.user_name),
            // grade: data.grade,
            registered: true
        }
        let jwt_options = {
            expiresIn: '5d'
        }
        let token = jwt.sign(payload, jwt_secret, jwt_options);
        return res.status(200).json({user:{...data, registered:true}, token});
    }
}

module.exports = {
    createUserController,
    registerUserController,
    checkJwt,
    isRegistered
}
