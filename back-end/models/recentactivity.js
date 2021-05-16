const mongoose = require('mongoose')
var Schema = mongoose.Schema;
var recentactivity = new Schema({
    userID: String,
    payeeID: String,
    userName: String,
    currency: String,
    groupID: String,
    groupName: String,
    description: String,
    amount: Number,
    timestamp: String,
    settleflag: String,
    commentFlag: String,
    message: String
},
    { timestamps: true }
);
module.exports = mongoose.model('recentactivity', recentactivity);  