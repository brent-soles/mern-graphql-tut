import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Form from './Form';
import AddBoard from './AddBoard'

const TodosQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;

const CreateTodoMutation = gql`
  mutation($text: String!){
    createTodo(text: $text) {
      id
      text
      complete
    }
  }
`;

const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`;

const RemoveMutation = gql`
mutation($id: ID!) {
  removeTodo(id: $id)
}
`;

class App extends Component {

  createTodo = async text => {
    await this.props.createTodo({
      variables: {
        text
      },
      update: (store, {data: { createTodo }}) => {
        //Reads data from the cache
        const data = store.readQuery({ query: TodosQuery });
        //find todo, then map new complete value in cache
        data.todos.unshift(createTodo);
        //Update modified cache
        store.writeQuery({query: TodosQuery, data});
      }
    });
  };

  //TODO: look up lambda syntax
  updateTodo = async todo => {
    //Update todo
    await this.props.updateTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete
      },
      update: store => {
        //Reads data from the cache
        const data = store.readQuery({ query: TodosQuery });
        //find todo, then map new complete value in cache
        data.todos = data.todos.map(x => x.id === todo.id ? ({
          ...todo,
          complete: !todo.complete
        }) : x);
        //Update modified cache
        store.writeQuery({query: TodosQuery, data});
      }
    });
  };

  removeTodo = async todo => {
    //Remove todo
    await this.props.removeTodo(
      {
        variables: {
          id: todo.id
        },
        update: store => {
          const data = store.readQuery({query: TodosQuery});
          data.todos = data.todos.filter(x => x.id !== todo.id);
          store.writeQuery({query: TodosQuery, data});
        }
      }
    );
  };

  render() {
    const {
      data: {loading, todos}
    } = this.props;
    if(loading) {
      return null;
    }
    return (
      <div style={{ display: "flex" }} className="App">
        <div style={{ margin: "auto", width: 400}}>
          <Paper elevation={7} style={{padding: "10px"}}>
            <Form submit={this.createTodo} />
            <List>
              {todos.map(todo =>(
                <ListItem
                  key={todo.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => this.updateTodo(todo)}
                >
                  <Checkbox
                    checked={todo.complete}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={todo.text} />
                  <ListItemSecondaryAction>
                    <IconButton 
                      aria-label="Comments"
                      onClick={() => this.removeTodo(todo)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
          <AddBoard />
        </div>
      </div>
    );
  }
}

//export default App;
export default compose(
  graphql(CreateTodoMutation, {name: "createTodo"}),
  graphql(RemoveMutation, {name: "removeTodo"}),
  graphql(UpdateMutation, {name: "updateTodo"}),
  graphql(TodosQuery)
)(App);