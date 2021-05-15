var mysql = require('mysql')
var mongoose = require('mongoose');
// mongodb+srv://jainishp:cmpe273@cluster0.vcynn.mongodb.net/Yelp?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://jainishp:cmpe273@cluster0.vcynn.mongodb.net/YelpG?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useMongoClient: true
}, error => {
    if (error) {
        console.log("Error Connecting to Mongo");
    } else {
        console.log("Connection to Database Successfull");
    }
})