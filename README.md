# Qwilr Interview

Web application for recording stock market trades.

## Prerequisite

The service requires an alphavantage API key. Register for one here: https://www.alphavantage.co/support/#api-key

## Test on Heroku

Try the website: https://rocky-lowlands-50182.herokuapp.com/

## Run locally

Install Docker: https://hub.docker.com/?overlay=onboarding

Once docker is installed, clone the repo, build the image, run the container then start the server.

```
git clone https://github.com/craigmarksmith/qwilr.git
cd qwilr
docker build -t qwilr .
docker run -it -e "API_KEY=YOUR_API_KEY" --rm -v "$PWD":/usr/src/qwilr -p 3000:3000 --name qwilr-running qwilr sh
npm i
npm run dev
```

## Todo
- deal with api key running out of requests
- style success message
- show if you're making a profit or loss
- display the current stocks by stock code
- show current stock value and profit or loss
- display errors next to appropriate field
- add validation to the API.

## Challenges
- Design. The UI is very very simple. I felt that making a function system was more important than a pretty one (for the first pass) and so that is why it's so simple.
- Stocks can be sold at a fraction of a cent. (Which is why toFixed(4) is in a few places.)
- this.setState sometimes takes time to respond, so sometimes setting the localstorage from the state in addToBalance didn't work. This happened with setting messages too.
- it's already getting too big and complex. I'd like to move to redux next (or apollo if I add a graphql api)
- getting node and react working together with webpack
- If I was to start over I'd use TypeScript (I missed having the predictable types that Golang give you), a framework like Redux (the code is already becoming spagetti, and a framework would help) and I'd write tests. 
