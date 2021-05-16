const mongoose = require('mongoose')
var Schema = mongoose.Schema;
var individialMessageSchema = new Schema({
    name: String,
    message: String
},
    {
        timestamps: true
    }
)
var groupSummary = new Schema({
    userID: String,
    currency: String,
    userName: String,
    amount: Number,
    groupID: String,
    groupName: String,
    description: String,
    settleFlag: String,
},
    { timestamps: true }
);
module.exports = mongoose.model('groupSummary', groupSummary);  