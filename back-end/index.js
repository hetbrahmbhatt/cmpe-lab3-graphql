const PORT = 3001;

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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



app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));


//get index page
app.get('/', (req, res) => {
    res.send('Welcome to yelp');
});

//starting the server
app.listen(PORT, () => {
    console.log("Server listening on port: ", PORT);
});