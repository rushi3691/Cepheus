const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
var compression = require('compression')
require('dotenv').config()
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const PORT = process.env.PORT || 8000;

// TODO: ADD DATA VALIDATION
// TODO: ADD ROUTES FOR PROFILE PAGE
//* TODO: CHANGE DB LIBRARY TO `postgres`
// TODO: ADD SECURITY LIKE HELMET, etc
// TODO: ADD COMPRESSION 
// TODO: MAKE PRODUCTION READY
// TODO: BENCHMARK
// TODO: CHECK EDGE CASES
// TODO: CODE CLEAN-UP
// TODO: SHIFT CODEBASE TO GOLANG


const { AndroidRouter } = require('./android/routes/routes');
const { FrontendRouter } = require('./frontend/routes/routes');
const { sql } = require('./database/db');
const { AdminRouter } = require('./admin/routes');

const app = express();
app.use(compression())
app.use(express.json());

app.use(cors({
    origin: [
        "https://cepheustest.netlify.app",
        "http://localhost:3000",
        "https://iitgoa.ac.in",
        "https://admin.backendcepheus.cf",
        "https://cepheus-events.netlify.app"
    ],
    credentials: true,
    
}));

app.use(cookieParser(process.env['COOKIE_SECRET']))



// routes
app.use("/apiM1", AndroidRouter);
app.use("/apiM2", FrontendRouter);
app.use("/admin", AdminRouter);

app.get("/", (req, res) => {
    return res.json({
        'message': "hell!",
    });
})

app.get("/checkenv", (req, res)=>{
    return res.json({
        envs: process.env
    })
})

var server = app.listen(PORT, function () {
    console.log(`http://localhost:${PORT}`)
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server')
    server.close(async () => {
        console.log('HTTP server closed')
        await sql.end()
        process.exit(1);
    })
})

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server')
    server.close(async () => {
        await sql.end()
        console.log('HTTP server closed')
        process.exit(1);
    })
})

