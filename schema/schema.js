const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
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
  fields: () => ({ // to avoid order of import errors(UserType is referred inside CompanyType)
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users : {
      type: new GraphQLList(UserType), // when it's not a single stuff, but an array of data
      resolve(parentValue, args) {
        return axios.get(`${localUrl}/companies/${parentValue.id}/users`)
          .then(res => res.data);
      },
    },
  })
});

const UserType = new GraphQLObjectType({
  name: 'User', // Capitalize
  fields: () => ({ // make it as function to avoid order of import errors
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
  })
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

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { firstName, age }) {
        return axios.post(`${localUrl}/users`, { firstName, age })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`${localUrl}/users/${id}`)
          .then(res => res.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, { id, firstName, age, companyId }) {
        return axios.put(`${localUrl}/users/${id}`, { firstName, age, companyId })
          .then(res => res.data);
      }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});