const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;
// const _ = require('lodash');
const axios = require('axios');
const localUrl = 'http://localhost:3000';

// const users = [
//   { id: '23', firstName: 'Bill', age: 20 },
//   { id: '47', firstName: 'Samantha', age: 21},
// ];

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }
});

const UserType = new GraphQLObjectType({
  name: 'User', // Capitalize
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType, // nested query
      resolve(parentValue, args) {
        console.log(parentValue);
        return axios.get(`${localUrl}/companies/${parentValue.companyId}`)
          .then(res => res.data);
      },
    },
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
        // return _.find(users, { id: args.id });
        return axios.get(`${localUrl}/users/${args.id}`)
          .then(res => res.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`${localUrl}/companies/${args.id}`)
          .then(res => res.data);
      },
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery
});