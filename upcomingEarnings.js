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



function execute(){
    var option = { range: 21 }

    var Robinhood = require('robinhood')(credentials, function(){
        Robinhood.earnings(option, function(err, response, body){
            if(err){
                console.error(option + "   " + err);
            }else{
                
                    
                console.log(body['results'])

                d = {}
                l = []
                for(let result of body['results']){
                    l.push(result['symbol'])
                }
                d['symbols'] = l;

                fs.writeFile('upcoming_earnings.txt', l, 'utf8', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved.");
                }); 
                console.log( d)
            }
        })
    });
}