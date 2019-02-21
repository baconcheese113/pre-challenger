import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
  render() {
    return ''
  }
}

let runningSum = 11275;
const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

// Change number
setInterval(() => {
  const total = document.querySelector('.main-totals h2');
  runningSum += Math.random();
  
  total.innerText = formatter.format(runningSum);
}, 1000);

ReactDOM.render(<App />, document.getElementById('root'));

