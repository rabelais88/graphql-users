const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// add middleware
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true // remember not graphQL but graphiql
}));

app.listen(4000, () => {
  console.log(`listening ${process.env.PORT}`);
});