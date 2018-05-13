

var fs = require('fs');

var credentials = {
    username: '',
    password: ''
};

var i = 0;
var interval;


var resultMap = {};


var prompt = require('prompt');

  var properties = [
    {
      name: 'username', 
    },
    {
      name: 'password',
      hidden: true
    }
  ];

  prompt.start();

  prompt.get(properties, function (err, result) {
    if (err) { return onErr(err); }
        credentials.username = result.username;
        credentials.password = result.password;
        execute();
  });

  function onErr(err) {
    console.log(err);
    return 1;
  }
  

function execute() {
    fs.readFile('Ticker.txt', 'utf8', function(err, tickerString) {
        if(err){
            console.error(err);
        } else {

            let tickers = tickerString.split("\r\n");
            interval = setInterval(onInterval, 10, tickers)
        }
    });

    var onInterval = function(tickers){

        console.log(i)
        console.log(tickers[i])

        addTickerEarningResults(tickers[i])

        i ++;
        if(i === tickers.length){
            clearInterval(interval);        
            setTimeout(function () {
                const content = JSON.stringify(resultMap);

                filename = (new Date()).toLocaleString() + ".json"
                fs.writeFile(filename, content, 'utf8', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved to " + filename);
                }); 

            }, 10000)
        } 
        if(i%20 === 0){

            console.log("In 60 second timeout... ")

            clearInterval(interval);
            setTimeout(function () {
                const content = JSON.stringify(resultMap);

                filename = (new Date()).toLocaleString() + ".json"
                fs.writeFile(filename, content, 'utf8', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved to " + filename);
                }); 

                interval = setInterval(onInterval, 10, tickers);
            }, 60000)
        } 
        
    }
}

  

function addTickerEarningResults(ticker) {
    let option = { symbol: ticker } // SYMBOL is a plain ol' ticker symbol.

            var Robinhood = require('robinhood')(credentials, function(){
                Robinhood.earnings(option, function(err, response, body){
                    if(err){
                        console.error(option + "   " + err);
                    }else{
                        let beatList = [];
    
                        if(body['results']){
                            body['results'].forEach((item) => {
                                
                                if (item['eps']['estimate'] !== null && item['eps']['actual'] !== null){ 
                                    let estimate = parseFloat(item['eps']['estimate'])
                                    let actual = parseFloat(item['eps']['actual'])
                
                                    if(estimate <= actual){
                                        beatList.push("T");
                                    } else {
                                        beatList.push("F");
                                    }
                                }
                
                                
                            })
                
                            resultMap[ticker] = beatList
                            
                        } else {
                            console.warn("Failed to get earning data for " + ticker);
                        }
                    }
                })
            });

}