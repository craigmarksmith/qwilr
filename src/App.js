import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <PageComponent/>
    </div>
  );
}

class PageComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = { balance: localStorage.getItem('balance')}
    this.addMoney = this.addMoney.bind(this)
    this.getBalance = this.getBalance.bind(this)
}

  addMoney(qty) {
    let currentBalance = this.state['balance']
    let newBalance = currentBalance + qty
    this.setState({balance: newBalance})
    localStorage.setItem('balance', this.state['balance'])
  }
  
  getBalance() {
    let balanceInCent = this.state['balance']
    let balanceInDollars = balanceInCent / 100
    balanceInDollars = balanceInDollars.toLocaleString("en-AU", {style:"currency", currency:"AUD"});
    return balanceInDollars
  }

  render() {
    return(
      <div>
        <div>
          <h2>Current balance: {this.getBalance()}</h2>
          <p>Add money: <button onClick={() => this.addMoney(1000)}>Add $10</button></p>
        </div>
        <div>
          <h2>Portfolio:</h2>
          <p>You have no stocks</p>
        </div>
        <div>
          <h2>Buy stocks</h2>
          <p>Stock Name:</p>
          <p>Qty:</p>
          <button>Buy!</button>
        </div>
      </div>
    )
  }
}

export default App;
