const express = require('express');
const {createTeam, registerEventUser, removeEventUser, getRegEvents, getMates, getTeamInfo, getEventTeamInfo, getRegEventsByID } = require('../../database/queries');
const { GoogleAuthMiddleware } = require('../../google_auth/auth');
const { createUserController, registerUserController, checkJwt, isRegistered } = require('../controller/controller');


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

const AndroidRouter = express.Router()

AndroidRouter.post("/login", GoogleAuthMiddleware, async (req, res)=>{
    await createUserController(req, res);
})

// return new jwt token with registered = true
AndroidRouter.post("/register", checkJwt, async (req, res) =>{
    await registerUserController(req, res);
})


AndroidRouter.post("/createteam", check_registration_status, checkJwt, isRegistered, async (req, res)=>{
    await createTeam(req, res)
})


AndroidRouter.post("/regevent", check_registration_status, checkJwt, isRegistered, async (req, res)=>{
    await registerEventUser(req, res)
})

AndroidRouter.delete("/remevent", check_registration_status, checkJwt, isRegistered, async (req, res)=>{
    await removeEventUser(req, res)
})

AndroidRouter.post("/getreg", checkJwt, getRegEvents);

AndroidRouter.post("/getteam", checkJwt, getEventTeamInfo);

AndroidRouter.post("/getregbyid", getRegEventsByID);

module.exports = {AndroidRouter}
