//SERVER DEPENDENCIES
var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

//PDF DEPENDENCIES
var pdfkit = require('pdfkit');
var fs = require('fs');

//MAIL DEPENDENCIES
var nodemailer = require('nodemailer');

app.use(bodyParser.urlencoded({extended: false}));
//app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res){
  console.log('Root route hit...');

  res.send('<h1>This is a server!</h1>');
});

app.post('/generate', function (req, res){
  console.log('Generate route hit...');

  var contents = req.body;
  generatePDF(contents);
  mailPDF('resume.pdf');

  res.send('<h1>Generating resume!</h1>');
});

app.get('/generate_test', function(req, res){
  var pdf = new pdfkit();

  pdf.pipe(fs.createWriteStream('resume.pdf'));

  pdf.font('Helvetica')
    .fontSize(20)
    .text('Ben has this email address: email@address.com wants to make a pdf with this text: text', 100, 100);

  pdf.end();

  res.send('<h1>Generating test resume!</h1>');
});

app.listen(PORT, function (){
  console.log('Server started...');
});

//Helper Functions
function generatePDF(contents){
  var pdf = new pdfkit();

  console.log(req.body.name);
  console.log(req.body.example);
  console.log(req.body.email);

  //todo: randomize file name
  pdf.pipe(fs.createWriteStream('resume.pdf'));

  pdf.font('Helvetica')
    .fontSize(20)
    .text('${req.body.name} has this email address: ${req.body.email} wants to make a pdf with this text: ${req.body.example}', 100, 100);

  pdf.end();
}

function mailPDF(path){
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      host: 'smtp.1and1.com',
      port: 587,
      secure: true, // secure:true for port 465, secure:false for port 587
      auth: {
          user: 'resumegenerator@bankingandconsulting.com',
          pass: 'Consultants8!'
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Resume Generator" <resumegenerator@bankingandconsulting.com>', // sender address
      to: 'ramankooner9@gmail.com', // list of receivers
      subject: 'Hey Ram', // Subject line
      text: 'Hello world ?', // plain text body
      html: '<b>Hello world ?</b>', // html body
      attachments: [
        {
          filename: 'resume.pdf',
          path: 'resume.pdf'
        }
      ]
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
}
