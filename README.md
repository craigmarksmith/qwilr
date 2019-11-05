# Qwirl Interview

Web application for recording stock market trades.

## Run locally

Install Docker: https://hub.docker.com/?overlay=onboarding

git clone https://github.com/craigmarksmith/qwilr.git
cd /qwirl
docker build -t qwirl .
docker run -it -e "API_KEY=YOUR_API_KEY" --rm -v "$PWD":/usr/src/qwirl -p 3000:3000 --name qwirl-running qwirl sh

npm run dev


## Todo
deploy
make alphavantage calls from api (as so not to expose the key) - DONE
put api key in config - DONE
make css work
deal with api key running out of requests
style success message
show if you're making a profit or loss
display the current stocks by stock code
show current stock value and profit or loss

## Challenges
- Stocks can be sold at a fraction of a cent.
- this.setState sometimes takes time to respond, so sometimes setting the localstorage from the state in addToBalance didn't work
- it's already getting too big and complex. I'd like to more to redux next (or apollo if I add an graphql api)
