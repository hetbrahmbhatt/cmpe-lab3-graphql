import React, { Component } from 'react'
import cookie from "react-cookies";
import profilePhoto from '../../images/profile-icon.png'
import axios from 'axios';
import BACKEND_URL from '../../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

export class TotalOwe extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groupName: this.props.totalOweData.name,
            userid1: this.props.totalOweData.userid1,
            userid2: this.props.totalOweData.userid2,
            ref_groupid: this.props.totalOweData.ref_groupid,
            tamount: this.props.totalOweData.tamount,
            data: this.props.totalOweData.totalOwe,
            currency: this.props.totalOweData.currency,
            sessionID: cookie.load('id'),
            amount: this.props.totalOweData.amount
        }
    };
    handleSubmit = e => {
        e.preventDefault();
        axios.post(BACKEND_URL + "/expense/owingsettleup", this.state).then(response => {
            if (response) {
                toast.success("You are all settled up.Please reload the page to update the status.");

            }
            else {

            }
        });

    }
    render() {
        return (
            <form onSubmit={this.handleSubmit} id="totalOwe">
                <div style={{ margin: "50px" }} >

                    <div className="row" style={{ backgroundColor: "#fafafa" }}>
                        <div className="col-2">
                            <img
                                src={profilePhoto} width="70px" height="70px" alt="" style={{ borderRadius: "50px" }} />
                        </div>

                        <div className="col-3">
                            <div style={{ marginTop: "20px" }}><strong>{this.state.data}</strong></div>

                        </div>
                        <div className="col-3">
                            <div style={{ marginLeft: "10px", marginTop: "20px", color: "#20BF9F" }}><strong>{this.state.tamount}</strong></div>

                        </div>
                        <span style={{ marginTop: "20px" }} >IN</span>
                        <div className="col-3">

                            <div style={{ marginLeft: "10px", marginTop: "20px" }}><strong>{this.state.groupName}</strong></div>
                        </div>
                    </div>
                    <div className="row" style={{ marginLeft: "200px", marginTop: "30px" }}>
                        <button type="submit" style={{ backgroundColor: "#20BF9F" }} class="btn btn-primary btn-sm" onSubmit={this.handleSubmit}>Settle-Up</button>
                    </div>
                </div>
                <ToastContainer />

            </form>

        )
    }
}

export default TotalOwe
