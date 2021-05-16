import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import landingPage from './landing-page/landing-page';
import signup from './sign-up/sign-up';
import login from './login/login'
import logout from './login/logout';
import Navbar from './landing-page/navbar';
import Profile from './user/profile';
import NewGroup from './groups/new-group';

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
                <Route path='/new-group' component={NewGroup} />

            </div>
        )
    }
}

export default Routing
