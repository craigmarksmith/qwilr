# Qwirl Interview

Web application for recording stock market trades.

## Run locally

Install Docker: https://hub.docker.com/?overlay=onboarding

git clone https://github.com/craigmarksmith/qwilr.git
cd /qwirl
docker build -t qwirl .
docker run -it --rm -v "$PWD":/usr/src/qwirl -p 3000:3000 --name qwirl-running qwirl sh

npm start


## Todo
put api key in config
deal with api key running out of requests
style success message
show if you're making a profit or loss
display the current stocks by stock code
show current stock value and profit or loss
make alphavantage calls from api (as so not to expose the key)

## Challenges
- Stocks can be sold at a fraction of a cent.
- this.setState sometimes takes time to respond, so sometimes setting the localstorage from the state in addToBalance didn't work
- it's already getting too big and complex. I'd like to more to redux next (or apollo if I add an graphql api)
