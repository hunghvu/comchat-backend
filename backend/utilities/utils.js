const email_pass = process.env.BURNER_EMAIL_PASS;

//Get the connection to Heroku Database
let pool = require('./sql_conn.js')

var nodemailer = require('nodemailer');

//We use this create the SHA256 hash
const crypto = require("crypto");

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'phongfly123@gmail.com',
    pass: email_pass
  }
});

// A function to check whether the password is valid
function checkPassword(password) {
    var result = false;
    for (i = 0; i < password.length; i++) {
        result = (password.charAt(i)==password.charAt(i).toUpperCase());
        if (result) break;
    }
    return (password.length >= 6) && result;
}

// A function to return date object with unix timestamp
function getDate(unix) {
  let date = new Date(unix)  
  var hour = date.getHours();
  var minute = date.getMinutes();
  var ampm = hour >= 12 ? 'pm' : 'am';
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'
  minute = minute < 10 ? '0'+minute : minute;
  return JSON.parse(JSON.stringify({days: date.getDay(), dates: date.getDate(), months: date.getMonth()+1, years: date.getFullYear(), hours: hour, minutes: minute, ampms: ampm}))

}

function sendEmail(mailOptions) {
 //research nodemailer for sending email from node.
 // https://nodemailer.com/about/
 // https://www.w3schools.com/nodejs/nodejs_email.asp
 //create a burner gmail account
 //make sure you add the password to the environmental variables
 //similar to the DATABASE_URL and PHISH_DOT_NET_KEY (later section of the lab)
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

/**
 * Method to get a salted hash.
 * We put this in its own method to keep consistency
 * @param {string} pw the password to hash
 * @param {string} salt the salt to use when hashing
 */
function getHash(pw, salt) {
 return crypto.createHash("sha256").update(pw + salt).digest("hex");
}

let messaging = require('./pushy_utilities.js')

module.exports = {
 pool, getHash, sendEmail, checkPassword, getDate, messaging
}; 