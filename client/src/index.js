
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import PlaidLink from "react-plaid-link";
import axios from "axios";



class App extends React.Component {
  constructor(props) {
    super(props);
    this.formatter = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    });
    
    this.state = {
      name: 'Nate',
      signedIn: false,
      balance: 0,
    }
  }
  connectToServer = () => {
    fetch('/');
  }

  componentDidMount = () => {
    this.connectToServer();

    // Change number
    setInterval(() => {
      this.setState({balance: this.state.balance + Math.random() });
    }, 1000);
  }

  handleOnExit = () => {console.log('exited')};
  
  getBalances = (accounts) => {
    console.log(accounts);
    let sum = 0;
    for(let account of accounts) {
      console.log(account);
      if(account.balances.available) {
        sum += account.balances.available;
      }
    }
    return sum;
  }
  handleOnSuccess = async (token, metadata) => {
    console.log(token, metadata);
    const handoff_req = await axios.post('/api/public_handoff', {
      public_token: token,
    });
    console.log(handoff_req);
    const identity_req = await axios.post('/api/identity/get');
    console.log(identity_req);
    this.setState({
      name: identity_req.data.identity.names[0],
      balance: this.getBalances(identity_req.data.accounts),
      signedIn: true,
    });
  };
  
  render() {
    return (
      <div>
        <header className="flex-c">
          <div className="action-div">
            <i className="fas fa-bars" />
          </div>
          <h1>Welcome, {this.state.name}</h1>
        </header>
        <main>
          <section className="main-display flex-c">
            <div className="main-totals flex-c flex-center">
              <h2>{this.formatter.format(this.state.balance)}</h2>
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


ReactDOM.render(<App />, document.getElementById("root"));
