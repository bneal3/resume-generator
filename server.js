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
  var path = 'resumes/${contents.name}.pdf';

  generatePDF(contents, path);

  res.send('<h1>Generating resume!</h1>');
});

app.get('/generate_test', function(req, res){
  var pdf = new pdfkit();

  var contents = {
    name: 'Ben Neal',
    email: 'mayjorx@gmail.com'
  };
  var path = 'test_material/resume.pdf';

  pdf.pipe(fs.createWriteStream(path));

  pdf.font('Helvetica')
    .fontSize(20)
    .text('${contents.name} has this email address: ${contents.email} wants to make a pdf with this text: text', 100, 100);

  pdf.end();

  mailPDF(contents, path);

  res.send('<h1>Generating test resume!</h1>');
});

app.listen(PORT, function (){
  console.log('Server started...');
});

//Helper Functions
function generatePDF(contents, path){
  var pdf = new pdfkit();

  console.log(contents.name);
  console.log(contents.example);
  console.log(contents.email);

  //todo: randomize file name
  pdf.pipe(fs.createWriteStream(path));

  pdf.font('Helvetica')
    .fontSize(20)
    .text('${contents.name} has this email address: ${contents.email} wants to make a pdf with this text: ${contents.example}', 100, 100);

  pdf.end();

  mailPDF(contents, path);
}

function mailPDF(contents, path){
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      host: 'smtp.1and1.com',
      port: 587,
      secure: false, // secure:true for port 465, secure:false for port 587
      auth: {
          user: 'resumegenerator@bankingandconsulting.com',
          pass: 'Consultants8!'
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Resume Generator" <resumegenerator@bankingandconsulting.com>', // sender address
      to: contents.email, // list of receivers
      subject: 'Resume', // Subject line
      text: 'Your new resume from Banking and Consulting', // plain text body
      html: '', // html body
      attachments: [
        {
          path: path
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
