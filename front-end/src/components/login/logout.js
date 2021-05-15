import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import _ from 'lodash';

export class logout extends Component {
    render() {
        var cookies = null;
        var redirectTo = null
        if (cookie.load("auth")) {
            cookies = cookie.loadAll();
            console.log(cookies);
            _.forEach(cookies, function (value, key) {
                cookie.remove(key, { path: '/' })
            });
            redirectTo = <Redirect to="/" />
        }
        return (
            <div>
                { redirectTo}
            </div>
        )
    }
}

export default logout
