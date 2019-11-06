import React from 'react';
import './App.css';
import axios from 'axios';
import { throwStatement } from '@babel/types';

const centToDollars = (cents) => {
  const dollars = cents / 100
  return dollars.toLocaleString("en-AU", {style:"currency", currency:"AUD"});
}

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
      balance: 0.0,
      stockForm: {
        errors: [],
        stockCode: "",
        qty: ""
      },
      pageMessages: {
        showSuccess: false,
        error: "",
      },
      portfolio: [],
    }
  }

  async componentDidMount() {
    const balance = await this.getBalanceFromApi()
    let portfolio = await axios.get("/api/portfolio")
    portfolio = portfolio.data.portfolio
    this.setState({
      ...this.state,
      portfolio,
      balance
    })
  }

  async getBalanceFromApi() {
    const response = await axios.get('/api/balance')
    return parseFloat(response.data.balance).toFixed(4)
  }

  async setApiBalance(newBalance) {
    axios.put('/api/balance', {
      newBalance
    })
  }

  addToBalance(amount) {
    const currentBalance = this.state.balance
    const newBalance = parseFloat(parseFloat(currentBalance).toFixed(4)) + parseFloat(parseFloat(amount).toFixed(4))
    this.setApiBalance(newBalance)
    this.setState({
      ...this.state,
      balance: newBalance
    })
  }

  canWithdraw(amount) {
    console.log(amount)
    console.log(this.state.balance)
    if(amount > this.state.balance) {
      return false
    }
    return true
  }
  
  getBalance() {
    const balanceInCent = this.state['balance']
    return centToDollars(balanceInCent)
  }

  async subtractFromBalance(amount) {
    if (!this.canWithdraw(amount)) {
      await this.clearMessages()
      this.setPageError("You have insufficient funds to withdraw that amount.")
      return
    }
    const currentBalance = this.state['balance']
    const newBalance = currentBalance - amount
    this.setState({balance: newBalance})
    this.setApiBalance(newBalance)
  }

  addToPortfolio(stockName, qty, unitPrice) {
    const newStock = {
      name: stockName,
      qty: qty,
      unitPrice: parseFloat(unitPrice*100).toFixed(4)
    }
    let portfolio = this.state.portfolio
    portfolio.push(newStock)
    this.setState({
      ...this.state, portfolio: portfolio
    })

    axios.put('/api/portfolio', {
      portfolio
    })
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

  async clearMessages() {
    await this.setState({
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

  validInputQty() {
    if(isNaN(parseInt(this.state.stockForm.qty))) {
      return false
    }
    return true
  }

  stockQuantity(code) {
    let qty = 0;
    this.state.portfolio.forEach((trade, idx) => {
      if(trade.name == code) {
        qty = parseInt(qty) + parseInt(trade.qty)
      }
    })

    return qty
  }

  async tradeStock(transationType) {
    await this.clearMessages()

    if(!this.validInputQty()){
      this.setPageError("The trade qty is invalid")
      return
    }
  
    let response = await axios.get(`/api/stock/${this.state.stockForm.stockCode}`)

    if(response.data["Error Message"]) {
      this.setPageError("Failed to make your trade. Please check the stock name is correct and try again.")
      return
    }

    if(transationType == "BUY") {
      this.buyStock(response)
      return
    }
    this.sellStock(response)
  }
  
  async sellStock(response) {
    const qty = this.stockQuantity(this.state.stockForm.stockCode)
    if (parseInt(this.state.stockForm.qty) > parseInt(qty)) {
      this.setPageError("You don't have enough stock to make this trade.")
      return
    }

    let timeSeriesData = response.data["Time Series (1min)"]
    let unitPrice = timeSeriesData[Object.keys(timeSeriesData)[0]]["4. close"]

    const priceInCent = unitPrice * 100
    const totalPrice = priceInCent * this.state.stockForm.qty

    this.addToPortfolio(this.state.stockForm.stockCode, -Math.abs(this.state.stockForm.qty), unitPrice)
    this.addToBalance(totalPrice)
    this.resetForm()
    this.showSuccess()
  }

  async buyStock(response) {
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

    const setQtyInput = (e) => {
      const newStockForm = { ...this.state.stockForm, qty: e.target.value }
      this.setState({ ...this.state, stockForm: newStockForm })
    }
  
    const setStockCodeInput = (e) => {
      const newStockForm = { ...this.state.stockForm, stockCode: e.target.value }
      this.setState({ ...this.state, stockForm: newStockForm })
    }

    const buyStock = () => {
      this.tradeStock("BUY")
    }

    const sellStock = () => {
      this.tradeStock("SELL")
    }

    return(
      <div>
        <SuccessMessage show={this.state.pageMessages.showSuccess}/>
        <ErrorMessage error={this.state.pageMessages.error}/>
        <div>
          <h2>Current balance: {this.getBalance()}</h2>
          <p>Deposit money: <button onClick={() => this.addToBalance(1000)}>Deposit $10</button></p>
          <p>Withdraw money: <button onClick={() => this.subtractFromBalance(1000)}>Withdraw $10</button></p>
        </div>
        <div>
          <h2>Portfolio:</h2>
          <Portfolio portfolio={this.state.portfolio}/>
        </div>
        <div>
          <h2>Buy stocks</h2>
          <p>Stock Name: <input type="text" placeholder="AAPL" value={this.state.stockForm.stockCode} onChange={setStockCodeInput} /></p>
          <p>Qty: <input type="text" value={this.state.stockForm.qty} onChange={setQtyInput} /></p>
          <button onClick={buyStock}>Buy!</button>
          <button onClick={sellStock}>Sell!</button>
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
      <div>Trade completed successfully!</div>
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
        <li key={key}>{stock.name}, {stock.qty}, {centToDollars(stock.unitPrice)}</li>
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
