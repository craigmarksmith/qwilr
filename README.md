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

## Report

The shares tracker site is implemented using React on the frontend and Node.js as the API. It is implemented without tests and has been deployed using Heroku. 

### No Tests
The first decision I made whilst implementing the site was to code without testing. The brief states that "This is not meant to be a production quality system". With that in mind and the time restraint, I decided to tackle this as a prototype, code that would be discarded immediately after demonstration, so I decided that tests were not necessary.

### Docker
I understood during implementation that this project was going to be read and run by developers other than myself. With that in mind I wanted to make it as quick and easy as possible for them to clone and run the project in a predictable way. Docker was the ideal tool for that job.

### Using React
Choosing React was an easy decision. Not only is it my understanding that Qwilr is using React heavily in their current project, it's also incredibly easy to get coding quickly with `create-react-app`.

### Local Storage
On my initial pass of implementing the brief, I decided only to implemented the balance. At this early stage I didn't see any need to save the balance to a server, as there was no requirement to have the balance stored over multiple machines, so the simplest storage solution that would persist over multiple requests was localstorage. 
This solution worked great until I added the ability to purchase stock. That included getting the current stock price from alphavantage using their API. Localstorage itself caused no problems but including the alphavantage API key in the react code, that would be uploaded to the clients browser and so would be easily accessible, didn't sit well with me so I decided to move the alphavantage API call behind a local API to keep the key safe. Since I was doing that I also decided to move any storage I needed to the API as well.

### Using cent (and why is caused problems)
In my experience, it's always easier to store money as a whole number rather than as a fractions, then converting that whole number cent value to dollars and cent for display. That worked great when implementing the balance but I didn't realised stocks can be bought for fractions of a cent. Having already implemented the balance and the majority of the stock calculations as whole numbers, changing the implementation to accommodate fractions made the code particularly messy, adding parseFloat(x).toFixed(4) in a number of places. This was especially difficult since es6 is dynamically typed, meaning I had to parse the input to functions much more than in a statically typed language.  

### implementing the api
As mentioned in localstorage, I implemented the API primarily to secure the alphavantage API key, but I also did it because of this requirement in the specification: "That is, you don’t need to implement a database, however, you will need to Setup an application server"
When implementing the backend I wanted to keep things simple. I wanted to keep everything running in one application to avoid any CORS issues and I felt having a two separate applications would be over the top, so I opted for a Node.js, Express backend that would also serve the frontend and compile it using webpack. Even though I've found webpack tricky to configure in the past it felt like the simplest thing that would work.

### the ledger (portfolio)
You may have noticed when viewing the site that the "Portfolio" section doesn't actually show the value of the stocks you hold, but simply shows a list of all the stocks you've bought or sold and their values at that time.
I decided to implement the portfolio in this way so that, as stocks are bought and sold, it will always be possible to calculate the users current stocks value for each stock and any profit or loss they've made during trading. However, the display of the portfolio does not communicate this well. I decided to display the details in the way that they're stored simply because of time constraints. If I were to do more work on this project the first thing I'd tackle would be to extend the portfolio component to display the information by stock, with a total value for each, a current profit or loss for each and a total value and profit/loss.  

## Todo
- group portfolio by stock
- show value per stock
- show profit/loss per stock
- show total value
- show total profit/loss
- deal with api key running out of requests (this is implicitly dealt with but doesn't return a good error)
- style success message
- display errors next to appropriate field
- add validation to the API.

## Challenges
- Design. The UI is very very simple. I felt that making a function system was more important than a pretty one (for the first pass) and so that is why it's so simple.
- Stocks can be sold at a fraction of a cent. (Which is why toFixed(4) is in a few places.)
- this.setState sometimes takes time to respond, so sometimes setting the localstorage from the state in addToBalance didn't work. This happened with setting messages too.
- it's already getting too big and complex. I'd like to move to redux next (or apollo if I add a graphql api)
- getting node and react working together with webpack
- If I was to start over I'd use TypeScript (I missed having the predictable types that Golang give you), a framework like Redux (the code is already becoming spaghetti, and a framework would help) and I'd write tests. 
