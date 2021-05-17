import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { toast } from "react-toastify";
import cookie from 'react-cookies';
import axios from 'axios';
import BACKEND_URL from '../../config/config'
import Select from 'react-select'
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import splitwiseLogo from '../../images/splitwiseLogo.png'

import { Query } from "react-apollo";
import { getUserProfile } from '../../queries/queries'
import { updateUserProfileMutation } from '../../mutations/mutation'

export class Profile extends Component {
    state = {
        userID: cookie.load('id'),
        name: "",
        email: "",
        phoneno: "",
        defaultcurrency: "",
        timezone: "",
        language: "",
        profileImageUpdate: false,
        updatedProfileImage: "",
        profileImagePath: "",
        emailError: false,
        error: false
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
        if (inp.target.value == "") {
            this.setState({
                error: true,
                errorMessage: "Please enter a username",
                [inp.target.name]: ""
            })
        }
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
    handleCurrencyChange = e => {
        this.setState({
            defaultcurrency: e.value
        })
    }
    handleTimezoneChange = e => {
        this.setState({
            timezone: e.value
        })
    }
    handleLanguageChange = e => {
        this.setState({
            language: e.value
        })
    }
    handleImageChange = e => {
        this.setState({
            updatedProfileImage: e.target.files[0],
            profileImageUpdate: true
        })
    }

    handleNumberChange = inp => {
        this.setState({
            error: false,
            [inp.target.name]: inp.target.value,
            errorMessage: " "
        })
    }
    handleOnSubmit = e => {
        e.preventDefault();
        if (this.state.name == "") {
            this.setState({
                error: true,
                errorMessage: "Please enter a username",
            })
        }
        else if (this.state.email == "") {
            this.setState({
                error: true,
                errorMessage: "Please enter email",
            })
        }
        else if (!this.state.error) {
            this.props.updateUserProfileMutation({
                variables: {
                    name: this.state.name,
                    email: this.state.email,
                    phoneno: this.state.phoneno,
                    defaultcurrency: this.state.defaultcurrency,
                    language: this.state.language,
                    timezone: this.state.timezone,
                }
            }).then((response) => {
                console.log(response)
                if (response.data.updateUserProfile.email !== null) {
                    if (cookie.load('email') !== this.state.email) {
                        cookie.remove("email", {
                            path: '/'
                        });
                        cookie.save("email", this.state.email, {
                            path: '/',
                            httpOnly: false,
                            maxAge: 90000
                        })
                    }
                    if (cookie.load('name') !== this.state.name) {
                        cookie.remove("name", {
                            path: '/'
                        });
                        cookie.save("name", this.state.name, {
                            path: '/',
                            httpOnly: false,
                            maxAge: 90000
                        })
                    }
                    alert("User update succesfully")
                    // window.location.assign("/users/about");

                } else {
                    console.log("error")
                }
            });
        }
    }
    async componentDidMount() {
        try {
            let email = cookie.load("email")

            this.props.client.query({
                query: getUserProfile,

                variables: {
                    email: email
                }
            }).then(response => {
                this.setState({
                    userID: response.data.getUserProfile._id,
                    name: response.data.getUserProfile.name,
                    email: response.data.getUserProfile.email,
                    language: response.data.getUserProfile.language,
                    phoneno: response.data.getUserProfile.phoneno,
                    timezone: response.data.getUserProfile.timezone,
                    defaultcurrency: response.data.getUserProfile.defaultcurrency,

                    // profileImagePath: profile_picture
                })

            }).catch(e => {
                console.log("error", e);

            })
        }
        catch (err) {
            console.log(err)
        }

    }

    render() {
        console.log(this.state);
        var redirectTo = null;
        var emailError = null;
        const currency = [
            { value: '$', label: 'USD($)' },
            { value: 'KWD', label: 'KWD(KWD)' },
            { value: 'BHD', label: 'BHD(BD)' },
            { value: '£', label: 'GBP(£)' },
            { value: '€', label: 'EUR(€)' },
            { value: 'CAD', label: 'CAD($)' }
        ]
        const timezone = [
            { value: 'Pacific/Niue', label: '(GMT -11:00) Midway Island, Samoa' },
            { value: 'Pacific/Rarotonga', label: '(GMT -10:00) Hawaii' },
            { value: 'Asia/Pyongyang', label: '(GMT -9:00) Alaska' },
            { value: 'America/Halifax', label: '(GMT -8:00) Pacific Time (US &amp; Canada)' },
            { value: 'America/Halifax', label: '(GMT -7:00) Mountain Time (US &amp; Canada)' },
            { value: 'America/Winnipeg', label: '(GMT -6:00) Central Time (US &amp; Canada), Mexico City' },
            { value: 'America/Toronto', label: '(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima' },
            { value: 'America/Dominica', label: '(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz' },
            { value: 'Chile/Continental', label: '(GMT -3:00) Brazil, Buenos Aires, Georgetown' },
            { value: 'Atlantic/South_Georgia', label: '(GMT -2:00) Mid-Atlantic' },
            { value: 'Africa/Banjul', label: '(GMT) Western Europe Time, London, Lisbon, Casablanca' },
            { value: 'Europe/Gibraltar', label: '(GMT +1:00) Brussels, Copenhagen, Madrid, Paris' },
            { value: 'Europe/Athens', label: '(GMT +2:00) Kaliningrad, South Africa' },
            { value: 'America/New_York', label: '(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg' },
            { value: 'Asia/Baku', label: '(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi' },
            { value: 'Asia/Kabul', label: '(GMT +4:30) Kabul' },
            { value: 'America/California', label: '(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent' },
            { value: 'America/New_York', label: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi' },
            { value: 'America/Austin', label: '(GMT +5:45) Kathmandu, Pokhara' },
            { value: 'Asia/Thimphu', label: '(GMT +6:00) Almaty, Dhaka, Colombo' },
            { value: 'Asia/Dhaka', label: '(GMT +7:00) Bangkok, Hanoi, Jakarta' },
            { value: 'Australia/West', label: '(GMT +8:00) Beijing, Perth, Singapore, Hong Kong' },
            { value: 'Australia/North', label: '(GMT +9:30) Adelaide, Darwin' },
            { value: 'Australia/Queensland', label: '(GMT +10:00) Eastern Australia, Guam, Vladivostok' },
            { value: 'Australia/Canberra', label: '(GMT +11:00) Magadan, Solomon Islands, New Caledonia' },

        ]
        const language = [
            { value: 'English', label: 'English' },
            { value: 'Spanish', label: 'Spanish' },
            { value: 'Chinese', label: 'Chinese' },
            { value: 'Mandarin', label: 'Mandarin' },
            { value: 'French', label: 'French' },

        ]
        if (!(cookie.load("auth"))) {
            redirectTo = <Redirect to="/" />
        }
        if (this.state.emailError) {
            emailError = <div style={{ 'color': 'red' }}>{this.state.errorMessage}</div>
        }
        let renderError = null
        if (this.state.error) {
            renderError = <div style={{ 'color': 'red', 'marginLeft': '-200px' }}>{this.state.errorMessage}</div>
        }
        return (
            <div>
                { redirectTo}
                <div class="container" style={{ "marginLeft": '250px', "marginTop": '20px' }}>
                    <div class="row">
                        <div class="col-sm" style={{ marginTop: "50px" }}>
                            <div className="row"><h2 style={{ "marginLeft": '20px' }}>
                                Your Account</h2></div>
                            {/* <img src={splitwiseLogo} style={{ paddingRight: "500px" }} width="200" height="200" alt="" /> */}
                            <img  src={splitwiseLogo} width="200" height="200" alt="" />

                            <div className="row"><p style={{ "margin-left": '20px' }}>Change your Avatar</p></div>
                            <div className="row">
                                <input style={{ "marginLeft": '20px' }} accept="image/x-png,image/gif,image/jpeg" type="file" name="profileImage" onChange={this.handleImageChange} />
                            </div>
                        </div>
                        <div class="col-sm">
                            <form onSubmit={this.handleOnSubmit}>
                                <div className="row" style={{ "marginLeft": '-300px', "marginTop": '30px' }}>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <label>Your Name:</label>
                                        <input type="text" className="form-control" name="name"
                                            placeholder={this.state.name} onChange={this.handleInputChange} />
                                    </div>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <label>Currency</label>

                                        <Select
                                            options={currency}
                                            placeholder={this.state.defaultcurrency}
                                            onChange={this.handleCurrencyChange} />
                                    </div>
                                </div>
                                <div className="row" style={{ "marginLeft": '-300px', "marginTop": '30px' }}>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <label>Your Email:</label>
                                        <input type="text" className="form-control" name="email"
                                            placeholder={this.state.email} onChange={this.handleEmailChange} />
                                        {emailError}
                                    </div>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <label>Timezone</label>

                                        <Select
                                            options={timezone}
                                            placeholder={this.state.timezone}
                                            onChange={this.handleTimezoneChange} />
                                    </div>
                                </div>
                                <div className="row" style={{ "marginLeft": '-300px', "marginTop": '30px' }}>
                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <label>Your Phone No:</label>
                                        <input type="number" className="form-control" name="phoneno"
                                            placeholder={this.state.phoneno} onChange={this.handleNumberChange} />
                                    </div>

                                    <div className="col-3" style={{ "marginTop": "30px" }}>
                                        <label>Language</label>

                                        <Select
                                            options={language}
                                            placeholder={this.state.language}
                                            onChange={this.handleLanguageChange} />
                                    </div>
                                </div>
                                {renderError}

                                <button type="submit" className="btn btn-success" style={{ "backgroundColor": "#FF8C00", "marginTop": "100px", "marginLeft": "-300px" }} onSubmit={this.handleSubmit}>Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default compose(
    withApollo,
    graphql(getUserProfile, { name: "getUserProfile" }),
    graphql(updateUserProfileMutation, { name: "updateUserProfileMutation" }),


)(Profile);