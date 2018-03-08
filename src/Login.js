import React, {Component} from 'react';
import './index.css';
import axios from 'axios'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loginError: ''
        };
    }

    handleClick(event) {
        let apiBaseUrl = 'http://udaan18-participants-api.herokuapp.com/users/login';
        let self = this;
        const payload = {
            username: this.state.username,
            password: this.state.password
        };
        const headers = {
            'Content-Type': 'application/json'
        };
        axios.post(apiBaseUrl, payload, {headers})
            .then((response) => {
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
                self.setState(() => ({loginError: 'Login failed.'}));
                console.log(error);
            });
    }


    render() {
        return (
            <div>
                <div>
                    <input type="text"
                           value={this.state.username}
                           onChange={e => this.setState({username: e.target.value})}
                    />
                </div>
                <div>
                    <input type="password"
                           value={this.state.password}
                           onChange={e => this.setState({password: e.target.value})}
                    />
                </div>
                <div>
                    <button value="Login" onClick={(event) => this.handleClick(event)}>
                        Login
                    </button>
                </div>
                <div>
                    {this.state.loginError}
                </div>
            </div>
        );
    };
}

export default Login;
