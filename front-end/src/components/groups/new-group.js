import React, { Component } from 'react'
import axios from 'axios';
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import AsyncSelect from 'react-select/async'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from 'react-router'
import { addGroupMutation } from '../../mutations/mutation'
import { flowRight as compose } from 'lodash';
import { graphql, withApollo } from 'react-apollo';
import splitwiseLogo from '../../images/splitwiseLogo.png'

export class NewGroup extends Component {
    state = {
        userID: cookie.load('id'),
        groupName: "",
        selectedUsers: [],
        groupError: false,
        emailRadioButton: false,
        nameRadioButton: false,
        error: false,
        errorMessage: "",
        profileImageUpdate: false,
        updatedProfileImage: "",
        profileImagePath: BACKEND_URL + '/images/avatar.png',

    }
    loadOptionsForName = async (inp, callback) => {
        const response = await axios.get(BACKEND_URL + "/users/searchbyname?name_like=" + inp);
        console.log(response.data)
        callback(response.data.map(i => ({
            label: i.name,
            value: i._id
        })));
    }
    loadOptionsForEmail = async (inp, callback) => {
        const response = await axios.get(BACKEND_URL + "/users/searchbyemail?email_like=" + inp);
        console.log(response.data);
        callback(response.data.map(i => ({
            label: i.email,
            value: i._id
        })));
    }

    handleImageChange = e => {
        this.setState({
            updatedProfileImage: e.target.files[0],
            profileImageUpdate: true
        })
    }
    handleRadioButtonChange = (event) => {
        console.log(event.target.value);
        if (event.target.value == "email") {
            this.setState({
                emailRadioButton: true,
                nameRadioButton: false
            })
        }
        else {
            this.setState({
                nameRadioButton: true,
                emailRadioButton: false
            })
        }
    }
    handleInputChange = inp => {
        {
            this.setState({
                [inp.target.name]: inp.target.value
            })
        }
    }
    handleSelectChange = (selectedUsers) => {
        this.setState({
            selectedUsers: selectedUsers

        })
    }
    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state);
        if (this.state.groupName == "") {
            toast.error("Please enter group name");
            return;
        }
        if (this.state.selectedUsers.length == 0) {
            toast.error("Please enter group members");
            return;
        }
        if (!this.state.error) {
            console.log(this.props)
            var membersValue = [];
            console.log(this.state.selectedUsers)
            var membersLabel = [];

            for (let i = 0; i < this.state.selectedUsers.length; i++) {
                membersValue.push(this.state.selectedUsers[i].value)
            }
            for (let i = 0; i < this.state.selectedUsers.length; i++) {
                membersLabel.push(this.state.selectedUsers[i].label)
            }
            this.props.addGroupMutation({
                variables: {
                    userID: cookie.load('id'),
                    userName: cookie.load('name'),
                    groupName: this.state.groupName,
                    membersValue: membersValue,
                    membersLabel: membersLabel
                }
                //refetchQueries: [{ query: getBooksQuery }]
            }).then((response) => {
                console.log(response)
            })
            // console.log(this.state);
            // axios
            //     .post(BACKEND_URL + "/groups/new", this.state).then(response => {
            //         if (response.status === 200) {
            //             toast.success("Group Created Successfully");
            //             window.location.assign("/all-group");
            //             const formData = new FormData();
            //             formData.append('profileImage', this.state.updatedProfileImage, this.state.updatedProfileImage.name + "," + response.data.groupID)
            //             const config = {
            //                 headers: {
            //                     'content-type': 'multipart/form-data'
            //                 }
            //             }
            //             axios
            //                 .post(BACKEND_URL + '/groups/uploadprofileimage', formData, config).then((response) => {
            //                     this.setState({
            //                         profileImagePath: BACKEND_URL + '/images/grouppics/' + response.data.groupID + '/' + response.data.fileName

            //                     })

            //                 }).catch(err => {
            //                     toast.error("Error in image upload")
            //                 })
            //         }

            //     }).catch(err => {
            //         if (err.response == null) {

            //         }
            //         else
            //             toast.error(err.response.data);
            //     })
        }
    }

    render() {
        let redirectTo = null;
        if (!(cookie.load("auth"))) {
            redirectTo = <Redirect to="/" />
        }
        let gError = null
        let emailDivision = null
        let nameDivision = null
        if (this.state.groupError) {
            gError = <div style={{ 'color': 'red' }}>{this.state.groupErrorMessage}</div>
        }
        if (this.state.name) {
            gError = <div style={{ 'color': 'red' }}>""</div>
        }
        if (this.state.nameRadioButton) {
            nameDivision = <AsyncSelect
                isMulti
                value={this.state.selectedUsers}
                onChange={this.handleSelectChange}
                placeholder={'Type group members...'}
                loadOptions={this.loadOptionsForName}
            />
        }
        if (this.state.emailRadioButton) {
            emailDivision = <AsyncSelect
                isMulti
                value={this.state.selectedUsers}
                onChange={this.handleSelectChange}
                placeholder={'Type group members...'}
                loadOptions={this.loadOptionsForEmail}
            />
        }
        return (
            <div>
                { redirectTo}
                <div className="row" style={{ "height": "10vh" }}>
                </div>
                <div className="row" style={{ "height": "100vh" }}>
                    <div className="col-3"></div>
                    <div className="col-2">
                        <img src={splitwiseLogo} width="200" height="200" alt="" />
                        <div className="row p-1 m-3">
                            <input style={{ "marginLeft": '20px' }} accept="image/x-png,image/gif,image/jpeg" type="file" name="profileImage" onChange={this.handleImageChange} />
                        </div>
                    </div>
                    <div className="col-6">
                        <h5>Start a new group</h5>
                        <h3>My group shall be called...</h3>
                        <form onSubmit={this.handleSubmit} id="Login">
                            <input placeholder={this.state.groupName} type="text" id="groupName" name="groupName" style={{ "width": "300px", "marginBottom": "40px" }} onChange={this.handleInputChange} ></input>
                            <div onChange={this.handleRadioButtonChange}>
                                <input type="radio" value="email" name="search" /> Search by email
                                <input style={{ marginLeft: "20px" }} type="radio" value="name" name="search" /> Search by name
                            </div>
                            {nameDivision}
                            {emailDivision}
                            {gError}
                            <ToastContainer />
                            <button type="submit" className="btn btn-success" style={{ "backgroundColor": "#FF8C00", "marginTop": "100px", "marginLeft": "0px" }} onSubmit={this.handleSubmit}>Save</button>
                        </form>
                    </div>
                </div >
            </div >
        )
    }
}
export default compose(
    withApollo,
    graphql(addGroupMutation, { name: "addGroupMutation" }),


)(NewGroup);