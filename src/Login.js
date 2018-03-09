import React, {Component} from 'react';
import './login.css';
import axios from 'axios';
import {Input, Row, Col, Button} from 'react-materialize';

import {apiBaseUrl} from './data';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loginError: '',
            loginBtnDisabled: false
        };
    }

    handleClick(event) {

        this.setState(() => ({
            loginBtnDisabled: true
        }));

        const apiUrl = apiBaseUrl + 'users/login';
        const self = this;
        const payload = {
            username: this.state.username,
            password: this.state.password
        };
        const headers = {
            'Content-Type': 'application/json'
        };
        axios.post(apiUrl, payload, {headers})
            .then((response) => {

                this.setState(() => ({
                    loginBtnDisabled: false
                }));

                console.log(response);
                if (response.status === 200) {
                    console.log("Login successful");
                    self.props.onLogin({token: response.data.token, username: self.state.username});
                }
                else {
                    self.setState(() => ({loginError: 'Login failed.'}));
                    console.log("Login Failed.");
                }
            })
            .catch((error) => {

                this.setState(() => ({
                    loginBtnDisabled: false
                }));

                self.setState(() => ({loginError: 'Login failed.'}));
                console.log(error);
            });
    }


    render() {
        return (
            <div>
                <Row>
                    <Col s={4} offset="s4" align="center">
                        <img src="./logo.png" alt="udaan-logo" className="responsive-img"/>
                    </Col>
                </Row>
                <Row>
                    <Col s={4} offset="s4">
                        <Input s={12} type="text" lable="User name" placeholder="Username" value={this.state.username}
                               onChange={e => this.setState({username: e.target.value})}/></Col>
                </Row>
                <Row>
                    <Col s={4} offset="s4">
                        <Input type="password" s={12} lable="Password" placeholder="Password" value={this.state.password}
                               onChange={e => this.setState({password: e.target.value})}/></Col>
                </Row>
                <Row>
                    <Col s={4} offset="s4" align="center">
                        <Button disabled={this.state.loginBtnDisabled}
                            waves="light" onClick={(event) => this.handleClick(event)}>Login</Button>
                    </Col>
                </Row>
                <Row align="center">
                    <div>
                        {this.state.loginError}
                    </div>
                </Row>
            </div>
        );
    };
}

export default Login;
