const usersResolvers = require('./users');

module.exports = {
    Query: {
        sayHi: () => "Hello world!"
    },
    Mutation: {
        ...usersResolvers.Mutation
    }
};