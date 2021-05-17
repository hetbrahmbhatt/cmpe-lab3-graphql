import React, { Component } from 'react'
import cookie from "react-cookies";
import profilePhoto from '../../images/profile-icon.png'
import axios from 'axios';
import BACKEND_URL from '../../config/config'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
export class TotalGiving extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groupName: this.props.totalGiveData.name,
            userid1: this.props.totalGiveData.userid1,
            userid2: this.props.totalGiveData.userid2,
            ref_groupid: this.props.totalGiveData.ref_groupid,
            amount: this.props.totalGiveData.amount,
            data: this.props.totalGiveData.totalOwe,
            tamount: this.props.totalGiveData.tamount,
            sessionID : cookie.load('id'),
            currency : this.props.totalGiveData.currency,

        }
    };
    handleSubmit = e => {
        e.preventDefault();
        axios.post(BACKEND_URL + "/expense/givingsettleup", this.state).then(response => {
            if (response) {
                toast.success("You are all settled up.Please reload the page to update the status.");

            }
            else {

            }
        });

        console.log(this.state);
    }
    render() {
        console.log(this.state);
        return (
            <form onSubmit={this.handleSubmit} id="totalOwe">

                <div style={{ margin: "50px" }} >
                    <div className="row" style={{ backgroundColor: "#fafafa" }}>
                        <div className="col-2">                            <img
                            src={profilePhoto} width="70px" height="70px" alt="" style={{ borderRadius: "50px" }} />
                        </div>
                        <div className="col-3">
                            <div style={{ marginTop: "20px" }}><strong>{this.state.data}</strong></div>

                        </div>
                        <div className="col-3">
                            <div style={{ marginLeft: "10px", marginTop: "20px", color: "#FF8C00" }}><strong>{this.state.tamount}</strong></div>

                        </div>
                        <span style={{ marginTop: "20px" }} >IN</span>
                        <div className="col-3">

                            <div style={{ marginLeft: "10px", marginTop: "20px" }}><strong>{this.state.groupName}</strong></div>
                        </div>
                    </div>
                    <div className="row" style={{ marginLeft: "200px", marginTop: "30px" }}>
                        <button type="submit" style={{ backgroundColor: "#FF8C00" }} class="btn btn-primary btn-sm" onSubmit={this.handleSubmit}>Settle-Up</button>
                        <ToastContainer />

                    </div>
                </div>
            </form>
        )
    }
}

export default TotalGiving
