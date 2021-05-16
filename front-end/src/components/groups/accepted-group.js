import React, { Component } from 'react'
import { Redirect } from 'react-router'
import BACKEND_URL from '../../config/config'
import axios from 'axios';
import cookie from "react-cookies";
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export class AcceptedGroup extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            groupID: this.props.acceptedGroupData.groupID,
            image: this.props.acceptedGroupData.image,
            groupName: this.props.acceptedGroupData.groupName,
            invitedByy: this.props.acceptedGroupData.invitedBy,
            groupPopUp: false,
            editGroupPopUp: false,
        }
    }
    async componentDidMount() {
        console.log(this.state.groupID);
    }
    toggleGroupPopUp = (e) => {
        this.setState({
            groupPopUp: !this.state.groupPopUp
        })
    }
    leaveGroup = (e) => {
        console.log(this.state);
        var obj = {
            userID: cookie.load('id'),
            groupID: this.state.groupID
        }

        axios
            .post(BACKEND_URL + "/groups/leavegroup", obj).then(response => {
                if (response.status == 200) {
                    toast.success("Hope you have a great time after leaving the group :)")
                    window.location.reload();
                }
            }).catch(err => {
                toast.error("Please clear all the dues before leaving the group.")
            })
    }
    displayPicture = (name, groupID) => {
        if (name == null) {
            var groupImagePath = BACKEND_URL + "/images/avatar.png"

        }
        else {
            var groupImagePath = BACKEND_URL + "/images/grouppics/" + groupID + '/' + name
        }
        return (

            <img src={groupImagePath} width="80px" height="80px" alt="" />

        )
    }
    render() {
        console.log(this.state);
        let invitedDivision = null
        if (!(cookie.load("auth"))) {
            return <Redirect to='/login' />
        }
        if (this.props.acceptedGroupData.invitedBy == "You") {
            invitedDivision =
                <div className='col-2'>
                    <div className="row p-1 m-3" ><h6>Created By</h6></div>
                    <div className="row p-1 m-3"><h3>You</h3></div>
                </div>
        }
        else {
            invitedDivision =
                <div className='col-2'>
                    <div className="row p-1 m-3" ><h6>Invited By</h6></div>
                    <div className="row p-1 m-3"><h3>{this.state.invitedByy}</h3></div>
                </div>
        }

        let groupDescriptionOption =
            <div>
                <div className="profile-edit" style={{ height: "20%" }}>
                    <Link className="btn btn-primary" to={{
                        pathname: "/group-description", state: {
                            groupData: this.state
                        }
                    }}>Group Description</Link>
                </div>
            </div>
        return (
            <div>
                <div className="row" style={{ "width": "80%", "height": "200px", "background": "whitesmoke", "marginLeft": "50px" }}>
                    <div className="col-2 " style={{ marginTop: "10px" }}>
                        <div className="row p-1 m-2"><h4></h4></div>
                        <div className="row p-1 m-2"><h4></h4></div>
                        {this.displayPicture(this.state.image, this.state.groupID)}
                    </div>
                    <div className='col-4'>
                        <div className="row p-1 m-3"><h6>Group Name</h6></div>
                        <div className="row p-1 m-3" ></div>
                        <div className="row p-1 m-3"><h2>{this.state.groupName}</h2></div>
                    </div>
                    {invitedDivision}

                </div>
                <div className="row p-4" style={{ marginLeft: "50px" }}>
                    <div className="col-2">
                        {/* <div className="row" ><h6>{editOption}</h6></div> */}
                    </div>

                    <div className="col-2" style={{ marginLeft: "40px" }}>
                        <div className="row" >{groupDescriptionOption}</div>
                    </div>
                    <div className="col-3" style={{ marginLeft: "80px" }}>
                        <button className="btn btn-danger" onClick={this.leaveGroup}>Leave</button>
                    </div>
                </div>
            </div >
        )
    }
}
export default AcceptedGroup

