const express = require('express');
const {createTeam, registerEventUser, removeEventUser, getRegEvents, getMates, getTeamInfo } = require('../../database/queries');
const { GoogleAuthMiddleware } = require('../../google_auth/auth');
const { createUserController, registerUserController, checkJwt, isRegistered, logout } = require('../controller/controller');

const reg_status = process.env.TAKE_REGISTRATIONS;

const check_registration_status = async (req, res, next) => {
    if (reg_status == 1) {
        next();
    } else {
        return res.status(500).json({
            "message":"Cepheus is no longer accepting new registrations"
        });
    }
}

const FrontendRouter = express.Router()
// take auth token from google 
// return jwt token with registered = false
FrontendRouter.post("/login", GoogleAuthMiddleware, async (req, res)=>{
    await createUserController(req, res);
})

// return new jwt token with registered = true
FrontendRouter.post("/register", checkJwt, async (req, res) =>{
    // const {user_uuid, user_name, college, grade, mobile} = req.body
    await registerUserController(req, res);
})


FrontendRouter.post("/createteam", check_registration_status, checkJwt, isRegistered, async (req, res)=>{
    await createTeam(req, res)
})



FrontendRouter.post("/regevent", check_registration_status, checkJwt, isRegistered, async (req, res)=>{
    await registerEventUser(req, res)
})

FrontendRouter.delete("/remevent", check_registration_status, checkJwt, isRegistered, async (req, res)=>{
    await removeEventUser(req, res)
})

FrontendRouter.post("/getreg", checkJwt ,getRegEvents);
FrontendRouter.post("/getmates", checkJwt, getMates);
FrontendRouter.post("/getteam", checkJwt, getTeamInfo);

FrontendRouter.post("/logout", async (req, res)=>{
    await logout(req, res);
})

module.exports = {FrontendRouter}
