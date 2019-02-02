const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;
const _ = require('lodash');

const users = [
  { id: '23', firstName: 'Bill', age: 20 },
  { id: '47', firstName: 'Samantha', age: 21},
];

const UserType = new GraphQLObjectType({
  name: 'User', // Capitalize
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  }
});

// ROOT QUERY --- all other details are branched from here
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // custom fields
    // type - returned data
    // args - required arguments
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return _.find(users, { id: args.id });
      }
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery
});