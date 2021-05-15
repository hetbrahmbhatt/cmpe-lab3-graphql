import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import splitwiselogo from '../../images/splitwise-logo.png'
import splitwiseLogo from '../../images/splitwiseLogo.png'

export class Navbar extends Component {
    render() {
        if (cookie.load('auth')) {
            var name = cookie.load('name')
            return (
                <div>
                    <nav class="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#20BF9F' }}>
                        <img style={{ "marginLeft": "100px" }} src={splitwiseLogo} width="40" height="40" alt="" />
                        <h2 style={{ "color": "black", "marginTop": "5px", "marginLeft": "5px", "color": "white" }}><strong>Splitwise</strong></h2>
                        <li class="nav-item dropdown" style={{ "margin-left": '950px', "margin-top": "-20px", "color": "#20BF9F" }}>

                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ "color": "white" }}>
                                <strong>{name}</strong>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="/dashboard">Dashboard</a>
                                <a class="dropdown-item" href="/profile">Profile</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/new-group">Create a New Group</a>
                                <a class="dropdown-item" href="/all-group">Groups / Invitations</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/recent-activity">Recent Activities</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="/logout">
                                    Logout
                                </a>
                            </div>
                        </li>
                    </nav>

                </div>
            )
        }
        else {
            return (
                <div>
                    <nav class="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: 'white' }}>
                        <a class="navbar-brand" href="">
                            <img style={{ "marginLeft": "170px" }}
                                src={splitwiselogo} width="150" height="50" alt="" />
                        </a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav ml-auto" >
                                <li class="nav-item" >
                                    <Link to="/login">
                                        <button type="button" class="btn btn-outline-success" style={{ marginRight: "50px" }}>Login</button>
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link to="/signup">
                                        <button type="button" class="btn btn-outline-success" style={{ backgroundColor: "#20BF9F", color: "white", marginRight: "20px" }}>Sign-up</button>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                </div>
            )
        }
    }
}

export default Navbar
