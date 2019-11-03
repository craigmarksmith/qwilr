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

  addMoney(e) {
    e.preventDefault();
    localStorage.setItem('balance', 200)
    this.setState({balance: 200})
  }
  
  getBalance() {
    var balanceInCent = this.state['balance']
    var balanceInDollars = balanceInCent / 100
    balanceInDollars = balanceInDollars.toLocaleString("en-AU", {style:"currency", currency:"AUD"});
    return balanceInDollars
  }

  render() {
    return(
      <div>
        <div>
          <h2>Current balance: {this.getBalance()}</h2>
          <p>Add money: <button onClick={this.addMoney}>Add Money</button></p>
        </div>
        <div>
          <h2>Portfolio:</h2>
          <p>You have no stocks</p>
        </div>
        <div>
          <h2>Buy stocks</h2>
          <p>Stock Name:</p>
          <p>Qty:</p>
          <p>Submit button</p>
        </div>
      </div>
    )
  }
}

export default App;
