const express = require('express');
const axios = require('axios');

// const bodyParser = require('body-parser')
const path = require('path');
var expressLayouts = require('express-ejs-layouts');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/stock/:code', async function (req, res) {
  const apiKey = process.env.API_KEY
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${req.params.code}&interval=1min&apikey=${apiKey}`
  response = await axios.get(url)
  res.send(response.data)
})
app.use('/', function (req, res) {
  res.render('index');
});

app.listen(process.env.PORT || 3000);