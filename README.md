# Qwirl Interview

Web application for recording stock market trades.

## Prerequisite

The service requires an alphavantage API key. Register for one here: https://www.alphavantage.co/support/#api-key

## Test on Heroku

Try the website: ```https://rocky-lowlands-50182.herokuapp.com/```

## Run locally

Install Docker: https://hub.docker.com/?overlay=onboarding

Once docker is installed, clone the repo, build the image, run the container then start the server.

```
git clone https://github.com/craigmarksmith/qwilr.git
cd qwirl
docker build -t qwirl .
docker run -it -e "API_KEY=YOUR_API_KEY" --rm -v "$PWD":/usr/src/qwirl -p 3000:3000 --name qwirl-running qwirl sh

npm run dev
```

## Todo
- move storage to server
- deal with api key running out of requests
- style success message
- show if you're making a profit or loss
- display the current stocks by stock code
- show current stock value and profit or loss
- display errors next to appropriate field

## Challenges
- Stocks can be sold at a fraction of a cent.
- this.setState sometimes takes time to respond, so sometimes setting the localstorage from the state in addToBalance didn't work. This happened with setting messages too.
- it's already getting too big and complex. I'd like to move to redux next (or apollo if I add a graphql api)
- getting node and react working together with webpack
