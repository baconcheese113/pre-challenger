import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import PlaidLink from "react-plaid-link";
import axios from "axios";
// const React = require('react');
// const ReactDOM = require('react-dom');
// const express = require('express');
// import './plaid';
const PLAID_ENDPOINT = 'https://sandbox.plaid.com';

class App extends React.Component {
  handleOnExit = () => {console.log('exited')};
  
  handleOnSuccess = async (token, metadata) => {
    console.log(token, metadata);
    const res = await axios.post(PLAID_ENDPOINT + '/item/public_token/exchange', {
      secret: process.env.PLAID_SECRET,
      client_id: process.env.PLAID_CLIENT_ID,
      public_token: token,
    });
    console.log(res);
    const identity = await axios.post(PLAID_ENDPOINT + '/identity/get', {
      secret: process.env.PLAID_SECRET,
      client_id: process.env.PLAID_CLIENT_ID,
      access_token: res.access_token,
    });
    console.log(identity);
  };
  
  render() {
    console.log(process.env.PLAID_CLIENT_ID);
    return (
      <div>
        <header className="flex-c">
          <div className="action-div">
            <i className="fas fa-bars" />
          </div>
          <h1>Welcome, Nate</h1>
        </header>
        <main>
          <section className="main-display flex-c">
            <div className="main-totals flex-c flex-center">
              <h2>$11,275.38</h2>
              <div className="main-summary flex-r flex-center">
                <h4 className="percent rh-text"> </h4>
                <h4 className="increase">+ $5.20 Last Week</h4>
              </div>
            </div>
            <div className="main-graph flex-c flex-center">
              <div className="main-graphic">
                <i className="fas fa-chart-line" />
              </div>
              <div className="graphic-totals flex-r">
                <h5 className="graphic-label">1 Month</h5>
                <h5 className="graphic-label label-active">1 Year</h5>
                <h5 className="graphic-label">All Time</h5>
              </div>
            </div>
          </section>

          <section className="scroll-list">
            <div className="list-item">
              <a href="">Transfer History</a>
            </div>
            <div className="list-item">
              <a href="">My Account</a>
            </div>
            <div className="list-item">
              <a href="">Settings</a>
            </div>
            <div className="list-item">
              <a href="">About</a>
            </div>
            <div className="list-item">
              <a href="">Contact</a>
            </div>
          </section>
        </main>
        <section className="actions flex-r">
          <div className="action-item">
            <i className="fas fa-university" />
            <PlaidLink
              id="plaid-link"
              className="action-text"
              clientName="Your app name"
              env="sandbox"
              product={["auth", "transactions"]}
              publicKey="bb1eb2ac877fd9bedcfc8963d450b8"
              onExit={this.handleOnExit}
              onSuccess={this.handleOnSuccess}
            >
              Invest
            </PlaidLink>
          </div>
          <div className="border" />
          <div className="action-item">
            <i className="fas fa-piggy-bank" />
            <a
              href="https://www.youtube.com/watch?v=oHg5SJYRHA0"
            >
              Deposit
            </a>
          </div>
        </section>
        
      </div>
    );
  }
}

let runningSum = 11275;
const formatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

// Change number
setInterval(() => {
  const total = document.querySelector(".main-totals h2");
  runningSum += Math.random();

  total.innerText = formatter.format(runningSum);
}, 1000);

ReactDOM.render(<App />, document.getElementById("root"));
