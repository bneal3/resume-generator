//SERVER DEPENDENCIES
var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();

//PDF DEPENDENCIES
var pdfkit = require('pdfkit');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res){
  console.log('Root route hit...');

  res.send('<h1>This is a server!</h1>');
});

app.post('/generate', function (req, res){
  console.log('Generate route hit...');
  console.log(req);
  res.send('<h1>Generating resume!</h1>');
});

app.listen(PORT, function (){
  console.log('Server started...');
});

//Helper Functions
function generatePDF(){
  var pdf = new pdfkit();
}
