const mongoose = require('mongoose')
var Schema = mongoose.Schema;
var groupBalance = new Schema({
    userID: String,
    useerName: String,
    groupID: String,
    groupName: String,
    amount: Number,
    currency: String,
},
    { timestamps: true }
);
module.exports = mongoose.model('groupBalance', groupBalance);  