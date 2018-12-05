import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {
    state = {
        text: '',
    }
    
    handleChange = (event) => {
        const newText = event.target.value;
        this.setState({
            text: newText
        });
    };

    handleKeyDown = (event) => {
        if(event.key === 'Enter'){
            this.props.submit(this.state.text);
            this.setState({
                text: ''
            })
        }
    }

    render(){
        const { text  } = this.state;
        return (
            <TextField 
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                id={this.props.id}
                label="New"
                margin="normal"
                value={text}
                fullWidth
            />
        );
    }
};