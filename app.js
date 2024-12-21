const path = require('path')
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
//////////////////////////////////////////////
const userRouter = require("./routes/userRoute")
const authRouter = require("./routes/authRoute")
const walletRouter = require("./routes/walletRoute")
const tubeRouter = require("./routes/tubeRoute")


const app = express();


//////////////////////////////////////////////
//// MIDDLEWARES ////
//////////////////////////////////////////////

// MORGAN REQUEST MIDDLEWARE
app.use(morgan("dev"));

// EXPRESS BODY PARSER
app.use(express.json({ limit: "10mb" }));

// COOKIE PARSER
app.use(cookieParser());

// CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


// ALLOWING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));


// REQUEST GLOBAL MIDDLEWARE
app.use(function (_, _, next) {
	console.log("Making Request..");
    
	next();
});


//////////////////////////////////////////////
//// MOUNTING ROUTES ////
//////////////////////////////////////////////
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/wallets', walletRouter);
app.use('/api/tubes', tubeRouter);


module.exports = app;