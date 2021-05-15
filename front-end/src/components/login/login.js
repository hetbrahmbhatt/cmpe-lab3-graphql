import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from "react-cookies";
// import { connect } from "react-redux";
import { Redirect } from 'react-router';
import splitwiselogo from '../../images/signup.png'
// Importing the login action
// import loginAction from '../../actions/login-action'
import { userLogin } from '../../mutations/mutation'
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';


export class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: false,
            errorMessage: '',
        }
    }

    handlePasswordChange = inp => {
        this.setState({
            password: inp.target.value
        })

    }

    handleEmailChange = inp => {
        if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(inp.target.value)) {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value,
                errorMessage: " "
            })
        } else {
            this.setState({
                error: true,
                errorMessage: "Please correct email",
                [inp.target.name]: ""
            })
        }
    }
    //handle input change
    handleInputChange = inp => {
        // console.log( inp.target.name, inp.target.value );
        if (/[~`!#$@%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(inp.target.value)) {
            this.setState({
                error: true,
                errorMessage: "Special characters not allowed",
                [inp.target.name]: ""
            })
        } else {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value
            })
        }
    }
    //handle submit
    handleSubmit = e => {
        e.preventDefault();
        if (!this.state.error) {
            this.props.userLogin({
                variables: {
                    email: this.state.email,
                    password: this.state.password,
                }
            }).then((response) => {
                if (response.data.userLogin._id === null) {
                    this.setState({
                        error: true,
                        errorMessage: "Invalid Credentials"
                    })
                } else {
                    this.setState({
                        error: false,
                        errorMessage: ""
                    })
                    cookie.save("auth", true, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    cookie.save("id", response.data.userLogin._id, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    cookie.save("name", response.data.userLogin.name, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    cookie.save("email", response.data.userLogin.email, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    window.location.assign('/dashboard');
                }
            });
        }
    }


    render() {
        let renderError = null
        let renderCredentialsError = null
        let redirectVar = null
        if (cookie.load('auth')) {
            redirectVar = <Redirect to='/dashboard' />
        }
        if (this.props.error) {
            renderCredentialsError = <div style={{ 'color': 'red' }}>Please enter valid credentials</div>
        }
        if (this.state.error) {
            renderError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        return (
            <div style={{ "marginLeft": "30%", "margin-top": "-100px" }}>
                {redirectVar}
                <div className="row" style={{ height: "100vh", "padding": "10%" }}>

                    <div className="col-5" style={{ "paddingLeft": "10%" }}>
                        <div className="row" style={{ height: "10%" }}>
                        </div>
                        <div className="row" style={{ height: "90%" }}>

                            <div className="col-12">
                                {/* <h4 style={{ "margin": "10px", 'color': 'green' }}>Login to Splitwise</h4> */}
                                <form onSubmit={this.handleSubmit} id="Login">
                                    <div className="row" style={{ "padding": "5%" }}>
                                        <img src={splitwiselogo} style={{ "paddingLeft": "0%" }} width="100%" height="100%" alt="" />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="email" required
                                            autoFocus placeholder="Enter Email" onChange={this.handleEmailChange} />

                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" name="password" required
                                            placeholder="Enter Password" onChange={this.handlePasswordChange} />
                                    </div>
                                    <button type="submit" style={{ "marginLeft": "80px", "backgroundColor": "#FF8C00" }} className="btn btn-danger" onSubmit={this.handleSubmit}>Login</button>

                                </form>
                                {renderError}
                                {renderCredentialsError}
                            </div>

                        </div>
                    </div>
                    <div className="col-7">
                        {/* <div className="row" style={ { height: "10%" } }>
                        </div> */}
                        <div className="row">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default compose(
    graphql(userLogin, { name: "userLogin" }),

)(login);