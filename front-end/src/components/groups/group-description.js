import React, { Component } from 'react'
import { Redirect } from 'react-router'
import cookie from "react-cookies";
import BACKEND_URL from '../../config/config'
// import Modal from 'react-modal';
import _ from 'lodash';
import axios from 'axios';
// import AddExpense from './add-expense'
import moment from 'moment-timezone';
import grocerylogo from '../../images/grocery.png'
import camera from '../../images/camera.png'
import emptyplaceholder from '../../images/empty-placeholder.png'
import profilePhoto from '../../images/profile-icon.png'

const customStyles = {
    content: {
        top: '40%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        height: '460px',
        width: '500px',
        transform: 'translate(-50%, -50%)'
    }
};
export class GroupDescription extends Component {

    constructor(props) {
        super(props)
        console.log(this.props.location.state.groupData)
        if (this.props.location.state) {
            if (this.props.location.state.groupData.image == null) {
                this.state = {
                    groupID: this.props.location.state.groupData.groupID,
                    groupName: this.props.location.state.groupData.groupName,
                    profileImageUpdate: false,
                    newProfileImage: "",
                    groupImagePath: BACKEND_URL + '/images/avatar.png',
                    error: false,
                    errorMessage: "",
                    groupPopUp: false,
                    groupDescription: [],
                    emptyStateFlag: false,
                    individualExpense: [],
                    totalInternalDebt: [],
                }
            }
            else {
                this.state = {
                    groupID: this.props.location.state.groupData.groupID,
                    groupName: this.props.location.state.groupData.groupName,
                    profileImageUpdate: false,
                    newProfileImage: "",
                    groupImagePath: BACKEND_URL + '/images/grouppics/' + this.props.location.state.groupData.groupID + '/' + this.props.location.state.groupData.image,
                    error: false,
                    errorMessage: "",
                    groupPopUp: false,
                    groupDescription: [],
                    emptyStateFlag: false,
                    individualExpense: [],
                    totalInternalDebt: []
                }
            }
        }
    }
    async componentDidMount() {
        const groupID = this.state.groupID;
        const response = await axios.get(BACKEND_URL + "/groups/description/" + groupID);
        const totalinternaldebt = await axios.get(BACKEND_URL + "/expense/totalinternaldebt/" + groupID);
        console.log(totalinternaldebt);
        this.setState({
            totalInternalDebt: totalinternaldebt.data
        })
        console.log(response.data);
        if (response.data.length == 0) {
            if (response.data.length == 0) {
                this.setState({
                    emptyStateFlag: true
                })
            }
        }
        response.data.map((groupDescription) => {
            this.setState({
                groupDescription: [...this.state.groupDescription, groupDescription]
            })
        })
        const individualData = await axios.get(BACKEND_URL + "/groups/individualdata/" + groupID);
        console.log(individualData.data);
        for (let i = 0; i < individualData.data.length; i++) {
            const obj = {
                ref_userid: individualData.data[i].ref_userid
            }
            const individualExpense = await axios.post(BACKEND_URL + "/groups/individualexpense/" + groupID, obj);
            this.setState({
                individualExpense: [...this.state.individualExpense, individualExpense.data]
            })
            // console.log(individualData.data[i].ref_userid);

        }
        // const individualExpense = await axios.post(BACKEND_URL + "/groups/individualexpense/" + groupID, individualData.data);
        // console.log(individualExpense.data);
        console.log(this.state);
    }
    toggleGroupPopUp = (e) => {
        this.setState({
            groupPopUp: !this.state.groupPopUp
        })
    }

    render() {
        let individualExpenseDetails = (<div>
            {Object.keys(this.state.individualExpense).map((key) => {
                return (
                    <div key={key}>
                        {this.state.individualExpense[key].map((dataItem) => {
                            if (dataItem.currency == null || dataItem.balance == 0) {
                                return (
                                    <span></span>
                                )
                            }
                            else {
                                if (dataItem.balance < 0) {
                                    return (
                                        <div className="row" style={{ padding: "30px" }}>
                                            <div className="col-6">
                                                <span style={{ width: "100px" }}>
                                                    <img
                                                        src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                                                </span>
                                            </div>
                                            <div className="col-6">
                                                <strong>{dataItem.name}</strong> is owed <span style={{ color: "#FF7F50" }}><strong>{dataItem.currency}{-1 * dataItem.balance}</strong></span>
                                                <br></br>
                                            </div>
                                        </div>
                                    )

                                }
                                else {
                                    if (dataItem.image == null) {
                                        return (
                                            <div className="row" style={{ padding: "30px" }}>
                                                <div className="col-6">
                                                    <span style={{ width: "100px" }}>
                                                        <img
                                                            src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                                                    </span>
                                                </div>
                                                <div className="col-6">
                                                    <strong>{dataItem.name}</strong> owes <span style={{ color: "green" }}>{dataItem.currency}{dataItem.balance}</span>
                                                    <br></br>
                                                </div>
                                            </div>

                                        )
                                    }
                                    else {
                                        return (
                                            <div className="row" style={{ padding: "30px" }}>
                                                <div className="col-6">
                                                    <span style={{ width: "100px" }}>
                                                        <img
                                                            src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                                                    </span>
                                                </div>
                                                <div className="col-6">
                                                    <strong>{dataItem.name}</strong> owes <span style={{ color: "green" }}>{dataItem.currency}{dataItem.balance}</span>
                                                    <br></br>
                                                </div>
                                            </div>
                                        )
                                    }

                                }
                            }
                        })}
                    </div>
                )
            })}
        </div>
        )
        let totalInternalDebt = this.state.totalInternalDebt.map((exp, index) => {
            if (exp.amount > 0) {
                return (
                    <div className="row" style={{ padding: "30px" }}>
                        <div className="col-6">
                            <span style={{ width: "100px" }}>
                                <img
                                    src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                            </span>
                        </div>
                        <div className="col-6">
                            <span><strong>{exp.lendername}</strong> owes <strong>{exp.lendeename}</strong> {exp.currency}{exp.amount} </span>
                            <br></br>
                        </div>
                    </div>

                )

            }
            else {
                return (
                    <div className="row" style={{ padding: "30px" }}>
                        <div className="col-6">
                            <span style={{ width: "100px" }}>
                                <img
                                    src={profilePhoto} width="60px" height="60px" alt="" style={{ borderRadius: "50px" }} />
                            </span>
                        </div>
                        <div className="col-6">
                            <span><strong>{exp.lendeename}</strong> owes <strong>{exp.lendername}</strong> {exp.currency}{-1 * exp.amount} </span>
                            <br></br>
                        </div>
                    </div>
                )
            }

        });
        console.log(this.state);
        let groupDescriptionDetails = null;
        let redirectVar = null
        if (!cookie.load("auth")) {
            redirectVar = <Redirect to="/login" />
        }

        if (this.state.emptyStateFlag) {
            groupDescriptionDetails = (
                <div style={{ margin: "200px" }}>
                    <img src={emptyplaceholder} width="300px" height="200px" alt="" />
                    <h4 style={{ font: "Bookman" }}>Sorry, no activities yet to display!!</h4>
                </div>
            )
        }
        else {
            groupDescriptionDetails = this.state.groupDescription.map((group, index) => {
                if (group.settleFlag == 0) {
                    return (
                        <div className="row" style={{ height: "100px", borderBottom: "0.01px solid lightgrey", borderLeft: "0.01px solid lightgrey", borderRight: "0.01px solid lightgrey", borderWidth: "thin", marginBottom: "1px" }}>
                            <div className="col-1" style={{ margin: "20px", color: "grey" }}>
                                <div className="row">
                                    {moment(group.createdat).tz(cookie.load("timezone")).format("MMM")}

                                </div>
                                <div className="row" style={{ fontSize: "30px", marginTop: "-10px" }}>
                                    {moment(group.createdat).tz(cookie.load("timezone")).format("D")}

                                </div>
                            </div>
                            <div className="col-2">
                                <img src={grocerylogo} style={{ "paddingLeft": "0%", marginLeft: "-20px", marginTop: "20px" }} width="60%" height="60%" alt="" />
                            </div>
                            <div className="col-6" style={{ marginLeft: "-60px", marginTop: "30px" }}>
                                <div className="row">
                                    <h3>{group.description}</h3>
                                    <img src={camera} style={{ margin: "8px" }} width="20px" height="20px" alt="" />
                                </div>
                                <div className="row">
                                    {moment(group.createdat).tz(cookie.load("timezone")).format("hh:mm a")}

                                </div>
                            </div>
                            <div className="col-3" style={{ marginLeft: "60px", marginTop: "15px", marginRight: "-40px" }}>
                                <div className="row" style={{ color: "grey" }}>
                                    {group.name}

                                </div>
                                <div className="row">
                                    <h3><b>{group.currency}{group.amount}</b></h3>
                                </div>
                            </div>
                        </div>
                    )
                }
                else {
                    return (
                        <div className="row" style={{ height: "100px", borderBottom: "0.01px solid lightgrey", borderLeft: "0.01px solid lightgrey", borderRight: "0.01px solid lightgrey", borderWidth: "thin", marginBottom: "1px", height: "120px" }}>
                            <div className="col-1" style={{ margin: "20px", color: "grey" }}>
                                <div className="row">
                                    {moment(group.createdat).tz(cookie.load("timezone")).format("MMM")}
                                </div>
                                <div className="row" style={{ fontSize: "30px", marginTop: "-10px" }}>
                                    {moment(group.createdat).tz(cookie.load("timezone")).format("D")}
                                </div>
                            </div>
                            <div className="col-2">
                                <img src={grocerylogo} style={{ "paddingLeft": "0%", marginLeft: "-20px", marginTop: "20px" }} width="60%" height="60%" alt="" />
                            </div>
                            <div className="col-6" style={{ marginLeft: "-60px", marginTop: "30px" }}>
                                <div className="row">
                                    <h4><b>"{group.name}"</b> and <b>"{group.settlename}"</b>settled up.</h4>
                                    {moment(group.createdat).tz(cookie.load("timezone")).format("hh:mm a")}
                                </div>
                            </div>
                            <div className="col-3" style={{ marginLeft: "60px", marginTop: "15px", marginRight: "-40px" }}>
                                <div className="row" style={{ color: "grey", maxWidth: "20" }}>
                                    <h6>dues cleared worth </h6>
                                </div>
                                <div className="row" >
                                    <h3><b>{group.currency}{group.amount}</b></h3>
                                </div>
                            </div>
                        </div>
                    )
                }
            })
        }
        return (

            <div>
                <script src="moment.js"></script>
                <script src="moment-timezone-with-data.js"></script>
                {redirectVar}
                <div class="container">
                    <div class="row">
                        <div class="col-2" style={{ marginLeft: "-100px" }}>
                            {totalInternalDebt}
                        </div>
                        <div class="col-1">
                        </div>
                        <div class="col-8">
                            <div style={{ backgroundColor: "whitesmoke", "height": "10vh" }} className="row">
                                <img style={{ margin: "20px", borderRadius: "200px" }} src={this.state.groupImagePath} width="40px" height="40px" alt="" />
                                <h1 style={{ marginTop: "20px" }}>{this.state.groupName}</h1>
                                <button type="submit" className="btn btn-amber" onClick={this.toggleGroupPopUp} style={{ marginLeft: "70px", marginTop: "25px", height: "40px", width: "250px", backgroundColor: "#FF7F50", color: "white" }} >Add an Expense</button>
                                <div style={{ height: "200px" }}>
                                    {/* <Modal style={customStyles} isOpen={this.state.groupPopUp} ariaHideApp={false}>
                                        <AddExpense groupData={this.state} closePopUp={this.toggleGroupPopUp} />
                                    </Modal> */}
                                </div>

                            </div>
                            {groupDescriptionDetails}

                        </div>
                        <div class="col-2">
                            {individualExpenseDetails}
                        </div>
                    </div>
                </div>

            </div>

        )
    }
}

export default GroupDescription
