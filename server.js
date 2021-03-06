const express = require('express');
const axios = require('axios');
const path = require('path');
var expressLayouts = require('express-ejs-layouts');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/stock/:code', async function (req, res) {
  const apiKey = process.env.API_KEY
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${req.params.code}&interval=1min&apikey=${apiKey}`
  const response = await axios.get(url)
  res.send(response.data)
})

let balance = 50000;
let portfolio = []

app.get('/api/balance', function(req, res) {
  res.send({
    balance: balance
  })
})

app.put('/api/balance', function(req, res) {
  balance = parseFloat(req.body.newBalance).toFixed(4)
  res.send("DONE")
})

app.get('/api/portfolio', function(req, res) {
  res.send({
    portfolio
  })
})

app.put('/api/portfolio', function(req, res) {
  portfolio = req.body.portfolio
  res.send("DONE")
})

app.use('/', function (req, res) {
  res.render('index');
});

app.listen(process.env.PORT || 3000);