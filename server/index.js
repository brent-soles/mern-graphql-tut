// import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/test");

const Todo = mongoose.model('Todo', {
  text: String,
  complete: Boolean
});

const Board = mongoose.model('Board', {
  elevation: Number, //Difference in JS and GraphQL look @ line 33
  containsList: Boolean,
});


// [Todo] = return an array of Todo objects
// Typedef => operationName(argeName: args): ReturnType
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
    boards: [Board]
  }
  type TodoGet {
    id: ID!
    text: String!
    complete: Boolean!
  }
  input TodoIn {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Board {
    id: ID!
    elevation: Int!
    containsList: Boolean!
    list: [Todo]
  }
  type Mutation {
    createTodo(text: String!): TodoIn
    updateTodo(id: ID!, complete: Boolean!): Boolean
    removeTodo(id: ID!): Boolean  
    createBoard(elevation: Int!): Board
    updateBoard(id: ID!, todo: Int!): Board
  }
`

// _ passes parent
const resolvers = {
  Query: {
    todos: () => Todo.find(),
    boards: () => Board.find()
  },
  Mutation: {
    createTodo: async (_, { text }) => {
      const todo = new Todo({text, complete: false});
      await todo.save(); // Returns promise, await until complete
      return todo;
    },
    updateTodo: async (_, {id, complete}) => {
      await Todo.findByIdAndUpdate(id, {complete});
      return true;
    },
    removeTodo: async (_, {id}) => {
      await Todo.findByIdAndRemove(id);
      return true;
    },
    createBoard: async(_, {elevation}) => {
      const board = new Board({elevation, containsList: false}); // Making call to mongoose
      board['list'] = [];
      await board.save();
      return board;
    },
    updateBoard: async (_, {id, todo}) => {
      await Board.findById(id, function(err, elem){
        if (err) return null;
        elem['list'].push(todo);
        elem.save();
        return elem;
      })
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function(){
  server.start(() => console.log('Server is running on localhost:4000'));
});
