const PORT = 3002;

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('./config/db_config');
var path = require('path')
var app = express();
var session = require("express-session");
var cookieParser = require("cookie-parser");
var multer = require('multer');
var cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
var schema = require("./schema/schema")
var userSchema = require("./models/user")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))
app.use(cors({ origin: "http://localhost:3006", credentials: true }));
app.use(
    session({
        key: 'user_sid',
        secret: "cmpe_273_lab1",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 6000000
        }
    })
);
app.get('/users/searchbyname', (req, res) => {
    userSchema.find({ "name": { $regex: req.query.name_like } }).then(response => {
        console.log(response)
        res.status(200).send(response)
        // callback(null/, response)
    }
    ).catch(error => {
        console.log("Error in update", error)
        // callback(error, null)
    })
});
app.get('/users/searchbyemail', (req, res) => {
    userSchema.find({ "email": { $regex: req.query.email_like } }).then(response => {
        console.log(response)
        res.status(200).send(response)
    }
    ).catch(error => {
        console.log("Error in update", error)
        // callback(error, null)
    })
});

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));
//get index page
app.get('/', (req, res) => {
    res.send('Welcome to splitwise');
});

//starting the server
app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});