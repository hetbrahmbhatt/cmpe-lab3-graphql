const graphql = require('graphql');
var users = require('../models/user')
var bcrypt = require('bcrypt');

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
    })
});

const groupType = new GraphQLObjectType({
    name: 'group',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        timing: { type: GraphQLString },
        count: { type: GraphQLString },
        members: {
            type: new GraphQLList(membersType),
        }
    })
});
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
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

    }
}
)
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

module.exports = schema;