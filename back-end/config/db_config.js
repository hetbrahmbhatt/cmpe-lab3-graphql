var mysql = require('mysql')
var mongoose = require('mongoose');
// mongodb+srv://jainishp:cmpe273@cluster0.vcynn.mongodb.net/Yelp?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://hetb:hetb@splitwiseg.qw6zo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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