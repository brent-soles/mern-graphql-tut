import React from 'react';
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

class AddBoard extends React.Component {


    render(){
        return (
            <div className="AddBoard">
                <Button variant="fab" color="primary" className="addButton">
                    <AddIcon />
                </Button>
            </div>
        );
    }
}

export default AddBoard;