import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
import axios from 'axios';
import IndividualGroup from './individual-group';
import AcceptedGroup from './accepted-group';

import { graphql, withApollo } from 'react-apollo';
import emptyplaceholder from '../../images/empty-placeholder.png'
import { flowRight as compose } from 'lodash';
import { getGroupDetails } from '../../queries/queries'
import { leaveGroupMutation } from '../../mutations/mutation'


export class MyGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groups: [],
            acceptedGroups: [],
            searchInput: "",
            emptygroupsFlag: false,
            emptyAcceptedGroupsFlag: false
        }
    }
    handleSearch = (e) => {
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async componentDidMount() {
        const userID = cookie.load("id")

        this.props.client.query({
            query: getGroupDetails,

            variables: {
                id: userID
            }
        }).then(response => {
            console.log(response.data.getGroupDetails)
            this.setState({
                acceptedGroups: response.data.getGroupDetails.acceptedGroups,
                groups: response.data.getGroupDetails.invitedGroups
            })

        }).catch(e => {
            console.log("error", e);

        })

    }
    render() {
        var redirectVar = null;
        let groupInvitationDetails = null
        let groupAcceptedDetails = null


        if (!cookie.load("auth")) {
            redirectVar = <Redirect to="/login" />
        }


        let searchedGroups = this.state.acceptedGroups.filter((group) => {
            if (group.groupName.toLowerCase().includes(this.state.searchInput.toLowerCase())) {
                return group;
            }
            // console.log(group.groupName.toLowerCase().includes(this.state.searchInput.toLowerCase()))
            // return group.groupName.toLowerCase().includes(this.state.searchInput.toLowerCase())
        })
        if (this.state.emptygroupsFlag) {
            groupInvitationDetails = (
                <div style={{ margin: "200px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman" }}>No invitations yet!!!</h4>
                </div>
            )

        }
        else {
            groupInvitationDetails = this.state.groups.map((group) => {
                return (
                    <div>
                        <IndividualGroup groupData={group} />
                    </div>

                )
            })
        }
        if (this.state.emptyAcceptedGroupsFlag) {
            groupAcceptedDetails = (
                <div style={{ margin: "130px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman" }}>Sorry!! There are no groups</h4>
                </div>
            )

        }
        else {
            groupAcceptedDetails = searchedGroups.map((group) => {
                return (
                    <div>
                        <AcceptedGroup key={group.ref_groupid} acceptedGroupData={group} />
                    </div>

                )
            })
        }
        return (
            <div>
                { redirectVar}

                <div className="row">
                    <div className="col-6">
                        <h1 style={{ marginLeft: "50px", "marginBottom": "40px", "marginLeft": "150px" }}>Group Invitations</h1>
                        {groupInvitationDetails}

                        <div style={{ "borderLeft": "6px solid black", "height": "100%", "position": "absolute", "left": "100%", "marginLeft": "-3px", "top": "0px" }}></div>
                        {/* 
                         */}
                    </div>
                    <div className="col-6">

                        <h1 style={{ marginLeft: "50px", "marginBottom": "40px", "marginLeft": "150px" }}>Your Groups</h1>
                        <div className="col-6 m-4">
                            <input type="text" style={{ "width": "400px", "marginLeft": "10px" }} name="searchInput" onChange={this.handleSearch} placeholder="Search Accepted Groups"></input>
                        </div>
                        {groupAcceptedDetails}

                    </div>
                </div>
            </div>
        )
    }
}

export default compose(
    withApollo,
    graphql(getGroupDetails, { name: "getGroupDetails" }),
    graphql(leaveGroupMutation, { name: "leaveGroupMutation" }),



)(MyGroup);