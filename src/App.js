import React from 'react';
import './App.css';
import axios from 'axios';

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
    this.state = { 
      balance: localStorage.getItem('balance'),
      stockForm: {
        stockCode: "",
        qty: ""
      },
      portfolio: [],

    }
    this.addToBalance = this.addToBalance.bind(this)
    this.getBalance = this.getBalance.bind(this)
    this.setStockNameInput = this.setStockNameInput.bind(this)
    this.setQtyInput = this.setQtyInput.bind(this)
    this.buyStock = this.buyStock.bind(this)
}

  addToBalance(amount) {
    const currentBalance = this.state['balance']
    const newBalance = currentBalance + amount
    this.setState({balance: newBalance})
    localStorage.setItem('balance', this.state['balance'])
  }
  
  getBalance() {
    const balanceInCent = this.state['balance']
    let balanceInDollars = balanceInCent / 100
    balanceInDollars = balanceInDollars.toLocaleString("en-AU", {style:"currency", currency:"AUD"});
    return balanceInDollars
  }

  subtractFromBalance(amount) {
    const currentBalance = this.state['balance']
    const newBalance = currentBalance - amount
    this.setState({balance: newBalance})
    localStorage.setItem('balance', this.state['balance'])
  }

  addToPortfolio(stockName, qty, unitPrice) {
    const newStock = {
      name: stockName,
      qty: qty,
      unitPrice: unitPrice
    }
    let portfolio = this.state.portfolio
    portfolio.push(newStock)
    this.setState({
      ...this.state, portfolio: portfolio
    })
  }

  setStockNameInput(e) {
    const newStockForm = { ...this.state.stockForm, stockCode: e.target.value }
    this.setState({ ...this.state, stockForm: newStockForm })
  }

  setQtyInput(e) {
    const newStockForm = { ...this.state.stockForm, qty: e.target.value }
    this.setState({ ...this.state, stockForm: newStockForm })
  }

  async buyStock() {
    //get cost for stock
    let response
    try {
      response = await axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo')
    } catch {
      console.log("Error, something went wrong")
    }
    let timeSeriesData = response.data["Time Series (1min)"]
    let unitPrice = timeSeriesData[Object.keys(timeSeriesData)[0]]["4. close"]

    const priceInCent = unitPrice * 100
    const totalPrice = priceInCent * this.state.stockForm.qty

    //reduce from balance
    this.subtractFromBalance(totalPrice)

    //add to portfolio
    this.addToPortfolio(this.state.stockForm.stockCode, this.state.stockForm.qty, unitPrice)

    //say you did it!
  }

  render() {
    return(
      <div>
        <div>
          <h2>Current balance: {this.getBalance()}</h2>
          <p>Add money: <button onClick={() => this.addToBalance(1000)}>Add $10</button></p>
        </div>
        <div>
          <h2>Portfolio:</h2>
          <Portfolio portfolio={this.state.portfolio}/>
        </div>
        <div>
          <h2>Buy stocks</h2>
          <p>Stock Name: <input type="text" onChange={this.setStockNameInput} /></p>
          <p>Qty: <input type="text" onChange={this.setQtyInput} /></p>
          <button onClick={this.buyStock}>Buy!</button>
        </div>
      </div>
    )
  }
}

class Portfolio extends React.Component {
  render() {
    const portfolioList = this.props.portfolio.map((stock, key) => {
      return(
        <li key={key}>{stock.name}, {stock.qty}, {stock.unitPrice}</li>
      )
    })

    if(portfolioList.length < 1) {
      return(<p>You have no stocks</p>)
    }

    return (
      <ul>
        {portfolioList}
      </ul>
    )
  }
}

export default App;
