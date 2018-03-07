import React, {Component} from 'react';
import Login from './Login'
import './App.css';
import Table from "./Table";

// import handsontable from 'handsontable';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            token: null
        };
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin({token}) {
        this.setState((prevState) => ({
            isLoggedIn: true,
            token
        }));
    }

    render() {
        if (this.state.isLoggedIn) {
            return <Table/>;
        } else  {
            return <Login onLogin={this.handleLogin}/>;
        }
    }

}

export default App;
