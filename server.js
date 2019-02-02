const express = require('express');
const expressGraphQL = require('express-graphql');

const app = express();

// add middleware
app.use('/graphql', expressGraphQL({
  graphqiql: true // remember not graphQL but graphiql
}));

app.listen(4000, () => {
  console.log(`listening ${process.env.PORT}`);
});