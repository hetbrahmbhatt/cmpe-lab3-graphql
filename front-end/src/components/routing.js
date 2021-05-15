import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import landingPage from './landing-page/landing-page';
import signup from './sign-up/sign-up';
import login from './login/login'
import logout from './login/logout';
import Navbar from './landing-page/navbar';
import Profile from './user/profile';

export class Routing extends Component {
    render() {
        return (
            <div>
                <Route path='/' component={Navbar} />
                <Route exact path='/' component={landingPage} />
                <Route path='/signup' component={signup} />
                <Route path='/login' component={login} />
                <Route path='/logout' component={logout} />
                <Route path='/profile' component={Profile} />

            </div>
        )
    }
}

export default Routing
