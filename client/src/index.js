
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
      name: '',
      signedIn: false,
      balance: 0,
      transactions: [],
      viewMode: 'month',
      lineLen: '153px',
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
    return accounts.reduce((acc, account) => {
      let avail = account.balances.available;
      return acc + (avail ? avail : 0);
    }, 0);
  }
  getBalanceAt = (date) => {
    let bal = this.state.balance;
    for(let trans of this.state.transactions) {
      if(new Date(date).getTime() < new Date(trans.date).getTime()) {
        bal = trans.balance;
      } else {
        break;
      }
    }
    return bal;
  }
  getPoints = () => {
    if (this.state.transactions.length < 1) {
      return "2,90 20,85 40,60 60,70 80,50 95,45";
    }
    let max = this.state.balance;
    let min = this.state.balance;
    let startDate = new Date();
    if(this.state.viewMode === 'year') {
      startDate = startDate.setMonth(startDate.getMonth() - 12);
    } else if (this.state.viewMode === 'month') {
      startDate = startDate.setDate(startDate.getDate() - 30);
    }
    for(let trans of this.state.transactions) {
      if(new Date(trans.date).getTime() > new Date(startDate).getTime())
      max = Math.max(trans.balance + 1000, max);
      min = Math.min(min, Math.max(trans.balance - 1000, 0));
    }
    // console.log(`Min is ${min} and max is ${max}`);
    const range = max - min;
    let points = '';
    const timeIter = this.state.viewMode === 'year' ? 11 : 30;
    for(let time = timeIter; time >= 0; time--) {
      let d = new Date();
      if(this.state.viewMode === 'year') {
        d = new Date(d.setMonth(d.getMonth() - time));
      } else if (this.state.viewMode === 'month') {
        d = new Date(d.setDate(d.getDate() - time));
      }
      let bal = this.getBalanceAt(d);
      // console.log(`Balance was ${bal}, ${month} months ago`);
      const yVal = 100 - (((bal - min) / range) * 100);
      const xVal = 100 - ((100/timeIter) * time);
      points += (` ${xVal},${yVal}`);
    }
    return points;
  }

  switchViewMode = (viewMode) => {
    this.setState({
      viewMode: viewMode,
      lineLen: document.querySelector('.graph-line').getTotalLength() + 'px',
    });
    document.documentElement.style.setProperty('--line-len', document.querySelector('.graph-line').getTotalLength() + 'px');
  }
  handleOnSuccess = async (token, metadata) => {
    // handoff of public token for access token
    console.log(token, metadata);
    const handoff_req = await axios.post('/api/public_handoff', {
      public_token: token,
    });
    console.log(handoff_req);
    // request for Identity
    const identity_req = await axios.post('/api/identity/get');
    console.log(identity_req);
    this.setState({
      name: identity_req.data.identity.names[0],
      balance: this.getBalances(identity_req.data.accounts),
      signedIn: true,
    });
    // request for transactions
    const trans_req = await axios.post('/api/transactions/get');
    console.log(trans_req);
    let curBalance = this.state.balance;
    const newTrans = trans_req.data.transactions.map(trans => {
      return {
        id: trans.transaction_id,
        amount: trans.amount,
        date: new Date(trans.date),
        balance: curBalance += trans.amount,
      };
    });
    console.log(newTrans);
    this.setState({
      transactions: newTrans,
    });
  };
  
  render() {
    return (
      <div>
        <style>{`:root {--line-len: ${this.state.lineLen}}`}</style>
        <header className="flex-c">
          <div className="action-div">
            <i className="fas fa-bars" />
          </div>
          <h1>{this.state.name ? `Welcome ${this.state.name}` : 'Tap Invest to begin...'}</h1>
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
                  <polyline className="graph-line" points={this.getPoints()}></polyline>
                </svg>
              </div>
              <div className="graphic-totals flex-r">
                <button className={`graphic-label ${this.state.viewMode==='month' ? 'label-active' : ''}`} onClick={() => this.switchViewMode('month')}>1 Month</button>
                <button className={`graphic-label ${this.state.viewMode==='year' ? 'label-active' : ''}`} onClick={() => this.switchViewMode('year')}>1 Year</button>
                <button className={`graphic-label ${this.state.viewMode==='all' ? 'label-active' : ''}`} onClick={() => this.switchViewMode('all')}>All Time</button>
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
