import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BACKEND_URL from '../../config/config';
import splitwiselogo from '../../images/signup.png'
import cookie from "react-cookies";
import { Redirect } from 'react-router'
import { userSignUpMutation } from '../../mutations/mutation'
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';


export class signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            error: false,
            errorMessage: "",
            emailError: false
        }
    }

    handlePasswordChange = inp => {
        this.setState({
            password: inp.target.value
        })

    }

    handleNumberChange = inp => {
        if (/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(inp.target.value)) {
            this.setState({
                error: false,
                [inp.target.name]: inp.target.value,
                errorMessage: " "
            })
        } else {
            this.setState({
                error: true,
                errorMessage: "Please write in standard format",
                [inp.target.name]: ""
            })
        }
    }
    handleEmailChange = inp => {
        console.log(inp.target.name, inp.target.value);
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
                [inp.target.name]: inp.target.value,
                errorMessage: " "

            })
        }
    }
    //handle submit
    handleSubmit = e => {
        if (!this.state.error) {
            e.preventDefault();
            console.log(this.props)
            this.props.userSignUpMutation({
                variables: {
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password,
                }
                //refetchQueries: [{ query: getBooksQuery }]
            }).then((response) => {
                console.log(response)
                if (response.data.userSignUp._id == null) {
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
                    cookie.save("id", response.data.userSignUp._id, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    cookie.save("name", response.data.userSignUp.name, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    cookie.save("email", response.data.userSignUp.email, {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    cookie.save("type", "users", {
                        path: '/',
                        httpOnly: false,
                        maxAge: 90000
                    })
                    window.location.assign('/users/dashboard');
                }
            }).catch(error => {
                console.log(error)
                this.setState(
                    {
                        error: true,
                        errorMessage: "EmailID already exists"
                    }
                )
            })
        }

    }
    render() {
        let renderError = null
        let emailError = null;
        let redirectVar = null
        if (this.props.auth) {
            redirectVar = <Redirect to="/dashboard" />
        }
        if (this.props.error) {
            emailError = <div style={{ 'color': 'red' }}>User already exists</div>
        }
        if (this.state.error) {
            renderError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        return (
            <div>
                {redirectVar}
                <div className="row" style={{ height: "100vh", "padding": "10%" }}>
                    <div className="col-5">
                        <img src={splitwiselogo} style={{ marginLeft: "360px", marginTop: "-50px" }} width="220" height="250" alt="" />
                    </div>
                    <div className="col-5" style={{ "paddingLeft": "10%" }}>
                        <div className='row' style={{ "height": "90%" }}>
                            <div className="col-12">
                                <h4 >Please Introduce Yourself</h4>
                                <form onSubmit={this.handleSubmit} style={{ "margin": "10px" }} id="Signup">
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="name" autoFocus required
                                            placeholder="Enter Name" onChange={this.handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <input type="email" className="form-control" name="email" required
                                            placeholder="Enter Email" onChange={this.handleEmailChange} />
                                        {emailError}
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" name="password" required
                                            placeholder="Enter Password" onChange={this.handlePasswordChange} />
                                    </div>
                                    <div className="form-group">
                                        {this.state.type === 'restaurants' ? <input type="text" className="form-control" name="address" required
                                            placeholder="Enter location" onChange={this.handleInputChange} /> : undefined}
                                    </div>
                                    <button type="submit" style={{ "marginLeft": "80px", "backgroundColor": "#FF8C00" }} className="btn btn-success" onSubmit={this.handleSubmit}>Sign Up</button>
                                </form>
                                {renderError}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(
    graphql(userSignUpMutation, { name: "userSignUpMutation" }),

)(signup);

