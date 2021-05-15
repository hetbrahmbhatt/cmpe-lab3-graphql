const mongoose = require('mongoose')
var Schema = mongoose.Schema;

var individualMessageSchema = new Schema({
    name: String,
    message: String
})


var messageSchema = new Schema({
    userID: String,
    groupID: String,
    groupName: String,
    userName: String,
    conversations: [individualMessageSchema]
})
var invitedGroupSchema = new Schema({
    groupID: String,
    groupName: String,
    invitedBy: String
})
var acceptedGroupSchema = new Schema({
    groupID: String,
    groupName: String,
    invitedBy: String
})
var debts = new Schema({
    userID: String,
    currency: String,
    userName: String,
    amount: Number,
    groupID: String,
    groupName: String
})
var groupSummary = new Schema({
    userID: String,
    currency: String,
    userName: String,
    amount: Number,
    groupID: String,
    groupName: String,
    timestamp: String
})
var recentactivity = new Schema({
    userID: String,
    userName: String,
    currency: String,
    groupID: String,
    groupName: String,
    description: String,
    amount: Number,
    timestamp: String,
    settleflag: String
})

var userSchema = new Schema({
    name: String,
    email: { type: String, unique: true, index: true, dropDups: true },
    password: String,
    language: String,
    timezone: { type: String, default: "America/Los_Angeles" },
    phoneno: String,
    defaultCurrency: { type: String, default: "$" },
    image: String,
    messages: [messageSchema],
    invitedGroups: [invitedGroupSchema],
    acceptedGroups: [acceptedGroupSchema],
    debts: [debts],
    recentactivity: [recentactivity]
}
    , { collection: 'users' }
);
mongoose.model('userSchema', userSchema).createIndexes();

module.exports = mongoose.model('userSchema', userSchema);  