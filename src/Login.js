import React, {Component} from 'react';
import './index.css';
import axios from 'axios'

// function userLogin(props) {
//     return <h1>Hello, {props.userLogin}</h1>;
// }

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    handleClick(event) {
        this.props.onLogin({token: 'abhasfyuafgw'});
        /*
        let apiBaseUrl = 'http://demo1164694.mockable.io/';
        let self = this;
        const payload = {
            "user": this.state.username,
            "password": this.state.password
        };
        axios.post(apiBaseUrl + 'login', payload)
            .then(function (response) {
                console.log(response);
                if (response.status === 200) {
                    console.log("Login successfull");
                    self.props.onLogin({token: response.data.token});
                }
                else if (response.data.code) {
                    console.log("not match");
                    alert("not match")
                }
                else {
                    console.log("Username does not exists");
                    alert("Username does not exist");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
            */
    }


    render() {
        return (
            <div>
                <div><input type="text" onChange={newValue => this.setState({username: newValue.target.value})}/></div>
                <div><input type="password" onChange={newValue => this.setState({password: newValue.target.value})}/>
                </div>
                <div><input type="submit" value="Login" onClick={(event) => this.handleClick(event)}/></div>
            </div>
        );
    };
}

export default Login;