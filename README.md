<!-- docker build -t qwirl . -->
<!-- docker run -it --rm -v "$PWD":/usr/src/qwirl/interview -p 3000:3000 --name qwirl-running qwirl sh -->


Todo:
Validation
 - we have enough money to buy
 - qty is a number
 - the stock exists
get api key - DONE
can't increase bank value
pass in real stock code - DONE
deal with api key running out of requests
give success message - DONE
style success message
show if you're making a profit or loss
error after refresh - DONE
display the current stocks by stock code
show current stock value
make alphavantage calls from api (as so not to expose the key)
put api key in config


Challenges:
Stocks can be sold at a fraction of a cent.
