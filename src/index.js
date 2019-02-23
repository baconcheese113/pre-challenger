
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import PlaidLink from "react-plaid-link";
import axios from "axios";
require('dotenv').config();
process.env.OAN = 'lao';
console.log(process.env);
// const React = require('react');
// const ReactDOM = require('react-dom');
// const express = require('express');
// import './plaid';
const PLAID_ENDPOINT = 'https://sandbox.plaid.com';
(async () => {
  const res = await axios.post('https://sandbox.plaid.com/item/public_token/exchange', {
    secret: "1dfdad6b1c668616514b2178ab8957",
    client_id: "5c6f41010b2dcc0011d1f6e3",
    public_token: "public-sandbox-73061718-6f76-4f1d-99d8-6e876d252808",
  });
  console.log(res);
})();
class App extends React.Component {
  handleOnExit = () => {console.log('exited')};
  
  handleOnSuccess = async (token, metadata) => {
    console.log(token, metadata);
    const res = await axios.post('https://sandbox.plaid.com/item/public_token/exchange', {
      secret: "1dfdad6b1c668616514b2178ab8957",
      client_id: "5c6f41010b2dcc0011d1f6e3",
      public_token: token,
    });
    console.log(res);
    const identity = await axios.post(PLAID_ENDPOINT + '/identity/get', {
      secret: "1dfdad6b1c668616514b2178ab8957",
      client_id: "5c6f41010b2dcc0011d1f6e3",
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
                <svg viewBox="0 0 100 100">
                  <polyline points="2,90 20,85 40,60 60,70 80,50 95,45"></polyline>
                </svg>
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
              clientName="Challenger"
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
