const mongoose = require('mongoose')
var Schema = mongoose.Schema;
var debtsSchema = new Schema({
    userID1: String,
    userID1Name: String,
    userID2: String,
    userID2Name: String,
    groupID: String,
    groupName: String,
    currency: String,
    amount: Number

}
    , { timestamps: true }
    , { collection: 'debts' }
);
module.exports = mongoose.model('debts', debtsSchema);