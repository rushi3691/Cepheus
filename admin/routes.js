const express = require('express');
const { GoogleAuthMiddleware } = require('../google_auth/auth');
const { getEventData, login, checkAdminJwt, logout } = require('./controller');

AdminRouter = express.Router();

AdminRouter.post("/login", GoogleAuthMiddleware, async(req, res)=>{
    return await login(req, res);
})
AdminRouter.get("/event/:event_id", checkAdminJwt, async (req, res)=>{
    return await getEventData(req, res);
})


// AdminRouter.post("/logout", logout(req, res));
AdminRouter.post("/logout", async (req, res)=>{
    await logout(req, res);
})

module.exports = {AdminRouter}
