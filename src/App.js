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
      balance: localStorage.getItem('balance') || 0.0,
      stockForm: {
        errors: [],
        stockCode: "",
        qty: ""
      },
      pageMessages: {
        showSuccess: false,
        error: "",
      },
      portfolio: JSON.parse(localStorage.getItem('portfolio')) || [],
    }
}

  async addToBalance(amount) {
    const currentBalance = this.state.balance
    const newBalance = parseFloat(currentBalance) + parseFloat(amount)
    await this.setState((state, props) => {
      return {
        ...this.state,
        balance: newBalance
      }
    })
    localStorage.setItem('balance',  this.state.balance)
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

    localStorage.setItem("portfolio", JSON.stringify(portfolio))
  }

  setStockCodeInput(e) {
    const newStockForm = { ...this.state.stockForm, stockCode: e.target.value }
    this.setState({ ...this.state, stockForm: newStockForm })
  }

  setQtyInput(e) {
    const newStockForm = { ...this.state.stockForm, qty: e.target.value }
    this.setState({ ...this.state, stockForm: newStockForm })
  }

  resetForm() {
    const clearForm = {
      stockCode: "",
      qty: ""
    }
    this.setState({
      ...this.state,
      stockForm: clearForm
    })
  }

  showSuccess() {
    const pageMessages = {...this.state.pageMessages, showSuccess: true}
    this.setState({
      ...this.state,
      pageMessages: pageMessages
    })
  }
  
  validTrade(tradePrice, availableBalance) {
    if(tradePrice > availableBalance) {
      return false
    }
    return true
  }

  clearMessages() {
    this.setState({
      ...this.state,
      pageMessages: {
        error: "",
        showSuccess: false
      }
    })
  }

  setPageError(error) {
    const pageMessages = { ...this.state.pageMessages, error: error}
    this.setState({
      ...this.state,
      pageMessages: pageMessages
    })

  }

  async buyStock() {
  
    this.clearMessages()

    let response
    try {
      const apiKey = "6KTCGLZL4OVJAE8U"
      response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.state.stockForm.stockCode}&interval=1min&apikey=${apiKey}`)
    } catch {
      console.log("Error, something went wrong")
    }
    let timeSeriesData = response.data["Time Series (1min)"]
    let unitPrice = timeSeriesData[Object.keys(timeSeriesData)[0]]["4. close"]

    const priceInCent = unitPrice * 100
    const totalPrice = priceInCent * this.state.stockForm.qty

    if(!this.validTrade(totalPrice, this.state.balance)) {
      this.setPageError("Insufficient funds to make trade.")
      return
    }

    this.subtractFromBalance(totalPrice)
    this.addToPortfolio(this.state.stockForm.stockCode, this.state.stockForm.qty, unitPrice)
    this.resetForm()
    this.showSuccess()
  }

  render() {
    return(
      <div>
        <SuccessMessage show={this.state.pageMessages.showSuccess}/>
        <ErrorMessage error={this.state.pageMessages.error}/>
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
          <p>Stock Name: <input type="text" placeholder="AAPL" value={this.state.stockForm.stockCode} onChange={this.setStockCodeInput} /></p>
          <p>Qty: <input type="text" value={this.state.stockForm.qty} onChange={this.setQtyInput} /></p>
          <button onClick={this.buyStock}>Buy!</button>
        </div>
      </div>
    )
  }
}

class SuccessMessage extends React.Component {
  render() {
    if (!this.props.show) {
      return ""
    }
    return (
      <div>Did it</div>
    )
  }
}

class ErrorMessage extends React.Component {
  render() {
    if (this.props.error === "") {
      return ""
    }
    return (
      <div>{this.props.error}</div>
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
