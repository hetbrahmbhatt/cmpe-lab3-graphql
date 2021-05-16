const graphql = require('graphql');
var users = require('../models/user')
var userSchema = require('../models/user')

var bcrypt = require('bcrypt');
var groupSchema = require('../models/groups')
var ObjectId = require('mongodb').ObjectID;


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