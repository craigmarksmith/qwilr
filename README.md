<!-- docker build -t qwirl . -->
<!-- docker run -it --rm -v "$PWD":/usr/src/qwirl/interview -p 3000:3000 --name qwirl-running qwirl sh -->


Todo:
deal with api key running out of requests
deploy
style success message
show if you're making a profit or loss
display the current stocks by stock code
show current stock value
make alphavantage calls from api (as so not to expose the key)
put api key in config


Challenges:
- Stocks can be sold at a fraction of a cent.
- this.setState sometimes takes time to respond, so sometimes setting the localstorage from the state in addToBalance didn't work
