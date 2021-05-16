const graphql = require('graphql');
var users = require('../models/user')
var userSchema = require('../models/user')
var groupBalanceSchema = require('../models/groupBalance')
var recentActivitySchema = require('../models/recentactivity')
var groupSummarySchema = require('../models/groupSummary')
var DebtsSchema = require('../models/debts')

var bcrypt = require('bcrypt');
var groupSchema = require('../models/groups')
var ObjectId = require('mongodb').ObjectID;
const groupSummary = require('../models/groupSummary');


const {
    GraphQLObjectType,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;
const userType = new GraphQLObjectType({
    name: 'user',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        language: { type: GraphQLString },
        timezone: { type: GraphQLString },
        phoneno: { type: GraphQLString },
        defaultcurrency: { type: GraphQLString },
        image: { type: GraphQLString },
        groupName: { type: GraphQLString },
        acceptedGroups: { type: GraphQLList(groupsType) },
        invitedGroups: { type: GraphQLList(groupsType) },
        // acceptedGroups: { type: GraphQLList(groupsType) },
    })
});
var groupsType = new GraphQLObjectType({
    name: 'groupInput',
    fields: () => ({
        _id: { type: GraphQLString },
        groupID: { type: GraphQLString },
        groupName: { type: GraphQLString },
        invitedBy: { type: GraphQLString },

    })
})
var addExpenseType = new GraphQLObjectType({
    name: 'addExpense',
    fields: () => ({
        groupID: { type: GraphQLString },
        groupName: { type: GraphQLString },
        groupImagePath: { type: GraphQLString },
        currency: { type: GraphQLString },
        userID: { type: GraphQLString },
        description: { type: GraphQLString },
        amount: { type: GraphQLString },

    })
})

var leaveGroupType = new GraphQLObjectType({
    name: 'leaveGroup',
    fields: () => ({
        userID: { type: GraphQLString },
        groupID: { type: GraphQLString },

    })
})



const updateGroupStatusType = new GraphQLObjectType({
    name: 'updateGroupStatusType',
    fields: () => ({
        userID: { type: GraphQLString },
        groupID: { type: GraphQLString },
        type: { type: GraphQLString },
        groupName: { type: GraphQLString },
        userName: { type: GraphQLString },

    })
})
const acceptedGroupType = new GraphQLObjectType({
    name: 'group',
    fields: () => ({
        acceptedGroups: { type: GraphQLList },

        invitedGroups: { type: GraphQLList }

    })
});
const somegroupType = new GraphQLObjectType({
    name: 'somegroup',
    fields: () => ({
        userID: { type: GraphQLID },
        groupName: { type: GraphQLString },

    })
});

var groupSummaryType = new GraphQLObjectType({
    name: 'groupSummary',
    fields: () => ({
        groupName: { type: GraphQLString },
        description: { type: GraphQLString },
        amount: { type: GraphQLString },
        settleFlag: { type: GraphQLString },
        userID: { type: GraphQLString },
        createdAt: { type: GraphQLString },
    })
});


const groupSummaryReturn = new GraphQLObjectType({
    name: 'groupSummaryReturn',
    fields: () => ({
        groupSummaryDetails: { type: new GraphQLList(groupSummaryType) }
    })

})
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getGroupDetails: {
            type: userType,
            args: {
                id: {
                    type: GraphQLString
                },
            },
            resolve(parent, args) {
                return users.findOne({ _id: args.id }).then(doc => {

                    return doc


                }).catch(error => {
                    console.log("error", error)
                    return "404"

                })
            }
        },
        getUserProfile: {
            type: userType,
            args: {
                email: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log("In fetch owner profile " + args.email)
                return users.findOne({ "email": args.email }).then(doc => {

                    return doc
                }).catch(error => {
                    console.log("error", error)
                    return error

                })
            }
        },
        groupSummaryDetails: {
            type: groupSummaryReturn,
            args: {
                groupID: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                console.log(args.groupID)
                const docs = await groupSummarySchema.find({ groupID: args.groupID }).sort({ createdAt: '-1' })
                console.log("jhsbchjbsahjcbasjhasbchja", docs)
                return docs;
            }
        },
        getTotalInternalBalance: {
            type: new GraphQLList(groupSummaryType),
            args: {
                groupID: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                DebtsSchema.find({ groupID: args.groupID }).then(docs => {
                    console.log(docs)
                    return docs;

                    // res.status(200).send(docs)
                });
            }
        },
    }
})
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        userLogin: {
            type: userType,
            args: {
                email: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                console.log("In user login " + args.email)
                return users.findOne({ "email": args.email }).then(doc => {
                    if (bcrypt.compareSync(args.password, doc.password)) {
                        let payload = {
                            _id: doc._id,
                            type: "users",
                            email: doc.email,
                            name: doc.name
                        }
                        return payload
                    } else {
                        console.log("invalid credentials")
                        return "Invalid Credentials"
                    }

                }).catch(error => {
                    console.log("error", error)
                    return "404"

                })
            }
        },
        leaveGroup: {
            type: leaveGroupType,
            args: {
                userID: {
                    type: GraphQLString
                },
                groupID: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                DebtsSchema.find({
                    $or: [
                        {
                            userID1: args.userID,
                            groupID: args.groupID,
                            amount: { $ne: 0 }
                        },
                        {
                            userID2: args.userID,
                            groupID: args.groupID,
                            amount: { $ne: 0 }
                        }
                    ]
                }).then(response => {
                    console.log("Response",response)
                    if (response.length != 0) {
                    }
                    else {
                        userSchema.findByIdAndUpdate({ _id: args.userID }
                            , { $pull: { acceptedGroups: { groupID: args.groupID } } }, { new: true }
                        ).then(res => {
                            if (res) {
                            }
                        })
                    }
                })
            }
        },

        userSignUp: {
            type: userType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                return bcrypt.hash(args.password, 10).then((hash) => {

                    let user = new users({
                        name: args.name,
                        email: args.email,
                        password: hash,

                    })

                    return user.save().then(doc => {
                        console.log("Signup successfull", doc)
                        return doc
                    }).catch(error => {
                        console.log("Error", error)
                        return error
                    })

                }).catch(error => {
                    console.log("bcrypt error", error)
                    return error
                })
            }
        },
        updateGroupStatus: {
            type: updateGroupStatusType,
            args: {
                userName: { type: GraphQLString },
                groupName: { type: GraphQLString },

                groupID: { type: GraphQLString },
                userID: { type: GraphQLString },
                type: { type: GraphQLString }
            },
            resolve(parent, args) {
                if (args.type == 'accept') {
                    console.log(args)
                    console.log("Inside Accept");
                    userSchema.findOneAndUpdate({ _id: args.userID }
                        , { $pull: { invitedGroups: { groupID: args.groupID } } }, { new: true }
                    ).then(doc => {
                        console.log("Invited Group Removed", doc)
                        let newInvitation = {
                            groupID: args.groupID,
                            groupName: args.groupName,
                            invitedBy: args.invitedBy,
                        }
                        userSchema.findOneAndUpdate({ _id: args.userID }
                            , { $push: { acceptedGroups: newInvitation } }, { new: true }
                        ).then(doc => {
                            groupSchema.findOneAndUpdate({ _id: args.groupID },
                                {
                                    $inc: {
                                        count: 1,
                                    }
                                }
                            ).then(response => {
                                let membersSchema = {
                                    groupID: args.groupID,
                                    userID: args.userID,
                                    userName: args.userName
                                }
                                groupSchema.findOneAndUpdate({ _id: args.groupID }
                                    , { $push: { membersSchema: membersSchema } }, { new: true }
                                ).then(doc => {

                                })
                                console.log("Update successful")
                                console.log(response);
                            }).catch(error => {
                                console.log("Error in update", error)
                            })
                            // res.status( 200 ).send( doc );
                        }).catch(error => {
                            console.log("error", error);
                            // res.status( 400 ).send( "Error following" );
                        })
                    })
                }
                if (args.type == "ignore") {
                    console.log("In ignore");
                    userSchema.findOneAndUpdate({ _id: args.userID }
                        , { $pull: { invitedGroups: { groupID: args.groupID } } }, { new: true }
                    ).then(doc => {
                        console.log("Invited Group Removed", doc)
                    }).catch(error => {
                        console.log("error", error);
                    })
                }
            }

        },
        addExpense: {
            type: addExpenseType,
            args: {
                groupID: { type: GraphQLString },
                groupName: { type: GraphQLString },
                groupImagePath: { type: GraphQLString },
                currency: { type: GraphQLString },
                userID: { type: GraphQLString },
                description: { type: GraphQLString },
                amount: { type: GraphQLString },
            },
            resolve(parent, args) {
                groupSchema.find({ _id: args.groupID },
                ).then(doc => {
                    let totalGroupMembers = doc[0].membersSchema.length;
                    let takeAmount = Number((args.amount) / totalGroupMembers);
                    if (Number.isInteger(takeAmount)) {

                    }
                    else {
                        takeAmount = takeAmount.toString();
                        takeAmount = takeAmount.slice(0, (takeAmount.indexOf(".")) + 3);
                    }
                    var groupMembersminusonee = totalGroupMembers - 1;
                    let takingAmountForRecentActivitys = (groupMembersminusonee) * (args.amount / totalGroupMembers);
                    if (Number.isInteger(takingAmountForRecentActivitys)) {

                    }
                    else {
                        takingAmountForRecentActivitys = takingAmountForRecentActivitys.toString();
                        takingAmountForRecentActivitys = takingAmountForRecentActivitys.slice(0, (takingAmountForRecentActivitys.indexOf(".")) + 3);
                    }
                    for (let i = 0; i < doc[0].membersSchema.length; i++) {
                        if (doc[0].membersSchema[i].userID < args.userID) {
                            DebtsSchema.find({
                                userID1: doc[0].membersSchema[i].userID,
                                userID2: args.userID,
                                groupID: args.groupID,
                                currency: args.currency,
                            }).then(response => {

                                if (response.length == 0) {
                                    let newDebts1 = new DebtsSchema({
                                        userID1: doc[0].membersSchema[i].userID,
                                        userID1Name: doc[0].membersSchema[i].userName,
                                        userID2: args.userID,
                                        userID2Name: args.userName,
                                        groupID: args.groupID,
                                        groupName: args.groupName,
                                        currency: args.currency,
                                        amount: takeAmount
                                    })
                                    newDebts1.save().then(response => {

                                    })
                                }
                                else {

                                    DebtsSchema.findOne(
                                        { _id: ObjectId(response[0]._id) },
                                    ).then(response1 => {

                                        if (response1 == null) {

                                        }
                                        else {
                                            let newAmount = Number(response1.amount) + Number(takeAmount);
                                            newAmount = Number(newAmount);
                                            DebtsSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
                                                {
                                                    $set: {
                                                        amount: newAmount,
                                                    }
                                                }
                                            ).then(resposne => {
                                            })
                                        }

                                    })
                                }

                            })

                        }
                        else if (doc[0].membersSchema[i].userID > args.userID) {
                            DebtsSchema.find({
                                userID1: args.userID,
                                userID2: doc[0].membersSchema[i].userID,
                                groupID: args.groupID,
                                currency: args.currency,
                            }).then(response => {
                                if (response.length == 0) {
                                    let newDebts1 = new DebtsSchema({
                                        userID1: args.userID,
                                        userID1Name: args.userName,
                                        userID2: doc[0].membersSchema[i].userID,
                                        userID2Name: doc[0].membersSchema[i].userName,
                                        groupID: args.groupID,
                                        groupName: args.groupName,
                                        currency: args.currency,
                                        amount: -1 * takeAmount
                                    })
                                    newDebts1.save().then(response => {
                                    })
                                }
                                else {
                                    DebtsSchema.findOne(
                                        { _id: ObjectId(response[0]._id) },
                                    ).then(response1 => {

                                        if (response1 == null) {

                                        }
                                        else {
                                            takeAmount = Number(takeAmount);
                                            let newAmount = response1.amount - (takeAmount);
                                            newAmount = Number(newAmount);
                                            DebtsSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
                                                {
                                                    $set: {
                                                        amount: newAmount,
                                                    }
                                                }
                                            ).then(resposne => {
                                            })
                                        }

                                    })
                                }
                            })
                        }
                    }
                    for (let i = 0; i < doc[0].membersSchema.length; i++) {
                        if (doc[0].membersSchema[i].userID != args.userID) {
                            groupBalanceSchema.find({
                                userID: doc[0].membersSchema[i].userID,
                                groupID: args.groupID,
                                currency: args.currency,
                            }).then(response => {
                                if (response.length == 0) {
                                    let groupBalance = new groupBalanceSchema({
                                        userID: doc[0].membersSchema[i].userID,
                                        useerName: doc[0].membersSchema[i].userName,
                                        groupID: args.groupID,
                                        groupName: args.groupName,
                                        amount: -1 * takeAmount,
                                        currency: args.currency,
                                    })
                                    groupBalance.save().then(response => {
                                    })
                                }
                                else {
                                    groupBalanceSchema.findOne(
                                        { _id: ObjectId(response[0]._id) },
                                    ).then(response1 => {

                                        let newy = Number(response1.amount) - Number(takeAmount);
                                        groupBalanceSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
                                            {
                                                $set: {
                                                    amount: newy,
                                                }
                                            }
                                        ).then(resposne => {
                                        })
                                    })
                                }
                            })

                        }
                        else if (doc[0].membersSchema[i].userID == args.userID) {
                            groupBalanceSchema.find({
                                userID: doc[0].membersSchema[i].userID,
                                groupID: args.groupID,
                                currency: args.currency,
                            }).then(response => {
                                if (response.length == 0) {
                                    let groupBalance = new groupBalanceSchema({
                                        userID: args.userID,
                                        useerName: args.userName,
                                        groupID: args.groupID,
                                        groupName: args.groupName,
                                        amount: takingAmountForRecentActivitys,
                                        currency: args.currency,
                                    })
                                    groupBalance.save().then(response => {
                                    })
                                }
                                else {
                                    groupBalanceSchema.findOne(
                                        { _id: ObjectId(response[0]._id) },
                                    ).then(response1 => {
                                        let newx = Number(response1.amount) + Number(takingAmountForRecentActivitys);
                                        groupBalanceSchema.findOneAndUpdate({ _id: ObjectId(response1._id) },
                                            {
                                                $set: {
                                                    amount: newx,
                                                }
                                            }
                                        ).then(resposne => {
                                        })
                                    })
                                }
                            })

                        }
                    }

                })
                let ts = Date.now();
                let date_ob = new Date(ts);
                let date = date_ob.getDate().toString();
                let month = (date_ob.getMonth() + 1).toString();
                let year = date_ob.getFullYear().toString();
                let time = date_ob.getHours().toString() + "-" + date_ob.getMinutes().toString() + "-" + date_ob.getSeconds().toString();
                let timestamp = year + "-" + month + "-" + date + "-" + time;

                groupSchema.find({ _id: args.groupID },
                ).then(doc => {
                    let totalGroupMembers = doc[0].membersSchema.length;
                    let takingAmount = ((args.amount) / totalGroupMembers);

                    var groupMembersminusone = totalGroupMembers - 1;
                    let takingAmountForRecentActivity = (groupMembersminusone) * (args.amount / totalGroupMembers);
                    let givingAmount = -1 * ((args.amount) / totalGroupMembers);
                    for (let i = 0; i < doc[0].membersSchema.length; i++) {
                        if (doc[0].membersSchema[i].userID == args.userID) {
                            let newRecentActivity = new recentActivitySchema({
                                userID: doc[0].membersSchema[i].userID,
                                payeeID: args.userID,
                                userName: args.userName,
                                currency: args.currency,
                                groupID: args.groupID,
                                groupName: args.groupName,
                                description: args.description,
                                amount: takingAmountForRecentActivity,
                                timestamp: timestamp,
                                settleflag: 0
                            })
                            newRecentActivity.save().then(response => {
                            })
                        }
                        else {
                            let newRecentActivity = new recentActivitySchema({
                                userID: doc[0].membersSchema[i].userID,
                                payeeID: args.userID,
                                userName: args.userName,
                                currency: args.currency,
                                groupID: args.groupID,
                                groupName: args.groupName,
                                description: args.description,
                                amount: givingAmount,
                                timestamp: timestamp,
                                settleflag: 0
                            })
                            newRecentActivity.save().then(response => {
                            })
                        }

                    }

                    let groupSummary = new groupSummarySchema({
                        userID: args.userID,
                        userName: args.userName,
                        currency: args.currency,
                        groupID: args.groupID,
                        groupName: args.groupName,
                        description: args.description,
                        amount: args.amount,
                        settleFlag: 0
                    })
                    groupSummary.save().then(response => {
                    })


                    for (let i = 0; i < doc[0].membersSchema.length; i++) {
                        if (doc[0].membersSchema[i].userID == args.userID) {
                            for (let i = 0; i < doc[0].membersSchema.length; i++) {
                                if (doc[0].membersSchema[i].userID != args.userID) {
                                    let debts = {
                                        userID: doc[0].membersSchema[i].userID,
                                        userName: doc[0].membersSchema[i].userName,
                                        currency: args.currency,
                                        amount: takingAmount,
                                        groupID: doc[0].membersSchema[i].groupID,
                                        groupName: args.groupName,
                                    }
                                    userSchema.findOneAndUpdate({ _id: args.userID }
                                        , { $push: { debts: debts } }, { new: true }
                                    ).then(doc => {

                                        // console.log("Logged in user", doc);
                                    }).catch(error => {
                                        // res.status(400).send(error)
                                    })
                                }
                                else {
                                    let recentActivity = {
                                        userID: args.userID,
                                        userName: args.userName,
                                        currency: args.currency,
                                        groupID: args.groupID,
                                        groupName: args.groupName,
                                        description: args.description,
                                        amount: takingAmountForRecentActivity,
                                        timestamp: timestamp,
                                        settleflag: 0
                                    }
                                    userSchema.findOneAndUpdate({ _id: args.userID }
                                        , { $push: { recentactivity: recentActivity } }, { new: true }
                                    ).then(doc => {
                                    })
                                }
                            }
                        }
                        else {
                            let recentActivity = {
                                userID: args.userID,
                                userName: args.userName,
                                currency: args.currency,
                                groupID: args.groupID,
                                groupName: args.groupName,
                                description: args.description,
                                amount: givingAmount,
                                timestamp: timestamp,
                                settleflag: 0
                            }
                            userSchema.findOneAndUpdate({ _id: doc[0].membersSchema[i].userID }
                                , { $push: { recentactivity: recentActivity } }, { new: true }
                            ).then(doc => {
                            })
                            let debts = {
                                userID: doc[0].membersSchema[i].userID,
                                userName: args.userName,
                                currency: args.currency,
                                amount: givingAmount,
                                groupID: doc[0].membersSchema[i].groupID,
                                groupName: args.groupName,
                            }
                            userSchema.findOneAndUpdate({ _id: doc[0].membersSchema[i].userID }
                                , { $push: { debts: debts } }, { new: true }
                            ).then(doc => {
                                // console.log("Other ID'S",doc[0].membersSchema[i].userID);
                                responsenew123.status(200).send(doc);

                            }).catch(error => {
                                // res.status(400).send(error)
                            })
                        }
                    }
                })
            }
        }
        ,
        updateUserProfile: {
            type: userType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phoneno: { type: GraphQLString },
                language: { type: GraphQLString },
                timezone: { type: GraphQLString },
                defaultcurrency: { type: GraphQLString },
            },
            resolve(parent, args) {

                return users.findOneAndUpdate({ email: args.email },
                    {
                        $set: {
                            name: args.name,
                            email: args.email,
                            phoneno: args.phoneno,
                            language: args.language,
                            timezone: args.timezone,
                            defaultcurrency: args.defaultcurrency,
                        }
                    }, { new: true }
                ).then(response => {
                    console.log("Update successfull")
                    return response
                }).catch(error => {
                    console.log("Error in update", error)
                    return error
                })


            }
        },
        addGroup: {
            type: GraphQLString,
            args: {
                userID: { type: GraphQLString },
                groupName: { type: GraphQLString },
                userName: { type: GraphQLString },
                membersValue: { type: GraphQLList(GraphQLString) },
                membersLabel: { type: GraphQLList(GraphQLString) }

            },
            resolve(parent, args) {
                // return args.userID

                let newGroup = new groupSchema({
                    userID: args.userID,
                    groupName: args.groupName,
                    timestamp: Date.now(),
                    count: 1,
                    invitedBy: args.userName
                })
                console.log(args.userID)

                newGroup.save().then(response => {
                    let newGroupObjForInvitee = {
                        groupID: response._id,
                        groupName: args.groupName,
                        invitedBy: "You"
                    }
                    console.log(newGroupObjForInvitee);
                    console.log(response._id)
                    users.findByIdAndUpdate({ _id: args.userID }
                        , { $push: { acceptedGroups: newGroupObjForInvitee } }, { new: true }
                    ).then(doc => {
                        console.log(doc)
                        let membersSchema = {
                            groupID: response._id,
                            userID: args.userID,
                            userName: args.userName
                        }
                        groupSchema.findByIdAndUpdate({ _id: response._id }
                            , { $push: { membersSchema: membersSchema } }, { new: true }
                        ).then(doc => {
                            for (let i = 0; i < args.membersValue.length; i++) {
                                let newInvitation = {
                                    groupID: response._id,
                                    groupName: args.groupName,
                                }
                                users.findByIdAndUpdate({ _id: args.membersValue[i] }
                                    , { $push: { invitedGroups: newInvitation } }, { new: true }
                                ).then(doc => {
                                }).catch(error => {
                                    console.log("error", error);
                                    // res.status( 400 ).send( "Error following" );
                                })
                            }
                            // res.status(200).send(doc);

                        })

                    }).catch(error => {

                        // res.status( 400 ).send( "Error following" );
                    })

                    // res.status(200).send(obj)
                }).catch(error => {
                    console.log(error)
                })
            }
        },

    }
}
)
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

module.exports = schema;