const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// add middleware
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true // remember not graphQL but graphiql
}));

const defaultPort = process.env.PORT || 4000;
app.listen(defaultPort, () => {
  console.log(`listening ${defaultPort}`);
});