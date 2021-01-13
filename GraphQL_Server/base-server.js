const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');
const app = express();
const http = require('http');

const authors = [
	{ id: 1, name: 'Stephen King' },
	{ id: 2, name: 'Douglas Crockford' },
	{ id: 3, name: 'Nicholas C. Zakas' }
]

const books = [
	{ id: 1, name: 'Pet Sematery', authorId: 1 },
	{ id: 2, name: 'Carrie', authorId: 1 },
	{ id: 3, name: 'Rose Red', authorId: 1 },
	{ id: 4, name: 'JavaScript - The Good Parts', authorId: 2 },
	{ id: 5, name: 'How Javascript Works', authorId: 2 },
	{ id: 6, name: 'Beautiful Code: Leading Programmers Explain How They Think', authorId: 2 },
	{ id: 7, name: 'High Performance JavaScript', authorId: 3 },
	{ id: 8, name: 'Maintainable JavaScript', authorId: 3 }
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      authorId: { type: GraphQLNonNull(GraphQLInt) },
      author: {
        type: AuthorType,
        resolve: (book) => {
          return authors.find(author => author.id === book.authorId);
        }
      }
    })
  });
  
  const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author of a book',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      books: {
        type: new GraphQLList(BookType),
        resolve: (author) => {
          return books.filter(book => book.authorId === author.id);
        }
      }
    })
  });
  
  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      book: {
        type: BookType,
        description: 'A Single Book',
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (parent, args) => books.find(book => book.id === args.id)
      },
      books: {
        type: new GraphQLList(BookType),
        description: 'List of All Books',
        resolve: () => books
      },
      authors: {
        type: new GraphQLList(AuthorType),
        description: 'List of All Authors',
        resolve: () => authors
      },
      author: {
        type: AuthorType,
        description: 'A Single Author',
        args: {
          id: { type: GraphQLInt }
        },
        resolve: (parent, args) => authors.find(author => author.id === args.id)
      }
    })
  });
  
  const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addBook: {
        type: BookType,
        description: 'Add a book',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          authorId: { type: GraphQLNonNull(GraphQLInt) }
        },
        resolve: (parent, args) => {
          const book = { id: books.length + 1, name: args.name, authorId: args.authorId };
          books.push(book);
          return book;
        }
      },
      addAuthor: {
        type: AuthorType,
        description: 'Add an author',
        args: {
          name: { type: GraphQLNonNull(GraphQLString) }
        },
        resolve: (parent, args) => {
          const author = { id: authors.length + 1, name: args.name };
          authors.push(author);
          return author;
        }
      }
    })
  })
  
  const demoSchema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
  })

app.use('/server', graphqlHTTP({
    schema: demoSchema,
    graphiql: true
}));

http.createServer(app).listen(80);
