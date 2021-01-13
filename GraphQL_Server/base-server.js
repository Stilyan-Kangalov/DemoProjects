const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql');
const app = express();
const http = require('http');

const demoSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'HelloWorld',
        fields: () => ({
            message: {type: GraphQLString,
            resolve: () => 'Hello World!'}
        })
    })
});

app.use('/server', graphqlHTTP({
    schema: demoSchema,
    graphiql: true
}));

http.createServer(app).listen(80);
