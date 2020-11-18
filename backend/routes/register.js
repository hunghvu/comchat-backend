//express is the framework we're going to use to handle requests
const express = require('express')

//We use this create the SHA256 hash
const crypto = require("crypto")

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

let getHash = require('../utilities/utils').getHash

let sendEmail = require('../utilities/utils').sendEmail

let checkPassword = require('../utilities/utils').checkPassword

var router = express.Router()

const bodyParser = require("body-parser")
const { response } = require('express')
const { Console } = require('console')
//This allows parsing of the body of POST requests, that are encoded in JSON
router.use(bodyParser.json())

var mailOptions,host,link;

/**
 * @api {post} /register Request to resgister a user
 * @apiName PostRegister
 * @apiGroup Register
 * 
 * @apiParam {String} first a users first name
 * @apiParam {String} last a users last name
 * @apiParam {String} email a users email *required unique
 * @apiParam {String} password a users password
 * 
 * @apiSuccess (Success 200) {boolean} success true when the name is inserted
 * @apiSuccess (Success 200) {String} email the email of the user inserted 
 * 
 * @apiError (400: Invalid password) {String} message "Invalid password, password must has at least 6 characters and 1 uppercase letter!"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: Username exists) {String} message "Username exists"
 * 
 * @apiError (400: Email exists) {String} message "Email exists"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 */ 
router.post('/', (req, res, next) => {
    res.type("application/json")

    //Retrieve data from query params
    var first = req.body.first
    var last = req.body.last
    var username = req.body.email //username not required for lab. Use email
    var email = req.body.email
    var password = req.body.password

    //Verify that the caller supplied all the parameters
    //In js, empty strings or null values evaluate to false
    if(first && last && username && email && password) {   
        //Check if password >= 6 char, has at least 1 uppercase letter A-Z
        if (!checkPassword(password)) {
            res.status(400).send({
                message: "Invalid password, password must has at least 6 characters and 1 uppercase letter!"
            })
        }
        
        //We're storing salted hashes to make our application more secure
        //If you're interested as to what that is, and why we should use it
        //watch this youtube video: https://www.youtube.com/watch?v=8ZtInClXe1Q
        let salt = crypto.randomBytes(32).toString("hex")
        let salted_hash = getHash(password, salt)
        
        //We're using placeholders ($1, $2, $3) in the SQL query string to avoid SQL Injection
        //If you want to read more: https://stackoverflow.com/a/8265319
        let theQuery = "INSERT INTO MEMBERS(FirstName, LastName, Username, Email, Password, Salt, Code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING Email"
        let rand = Math.floor((Math.random() * 100) + 54)
        let values = [first, last, username.toLowerCase(), email.toLowerCase(), salted_hash, salt, rand]
        pool.query(theQuery, values)
            .then(result => {
                //We successfully added the user, let the user know
                res.status(200).send({
                    success: true,
                    email: result.rows[0].email
                })
                next()
            })
            .catch((err) => {
                //log the error
                //console.log(err)
                if (err.constraint == "members_username_key") {
                    res.status(400).send({
                        message: "Username exists"
                    })
                } else if (err.constraint == "members_email_key") {
                    res.status(400).send({
                        message: "Email exists"
                    })
                } else {
                    res.status(400).send({
                        message: err.detail
                    })
                }
            })
    } else {
        response.status(400).send({
            message: "Missing required information"
        })
    }
}, (req, res) => {
    let theQuery = "SELECT Code FROM Members WHERE Email=$1"
    let values = [(req.body.email).toLowerCase()]
    pool.query(theQuery, values)
        .then(result => {
            host=req.get('host');
            link="http://"+req.get('host')+"/register/verify?id="+result.rows[0].code;
            console.log(req)
            mailOptions={
                to : (req.body.email).toLowerCase(),
                subject : "Please confirm your Com Chat Email account",
                html : "Hello,<br> Please Click on the link to verify your Com Chat email.<br><a href="+link+">Click here to verify</a>" 
            }   
            sendEmail(mailOptions);
        })
})


router.get('/verify',function(req,res){
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email")
        let theQuery = "UPDATE Members SET Verification=1 WHERE Email=$1 RETURNING Code"
        let values = [mailOptions.to]

        //Change verification value in Members of the email to 1
        pool.query(theQuery, values)
            .then(result =>{
                if(result.rows[0].code==req.query.id) {
                    console.log("email is verified")
                    res.end("<h1>Email "+mailOptions.to+" has been successfully verified")
                    
                    //Delete the email verification code
                    let theQuery = "UPDATE Members SET Code=0 WHERE Email=$1"
                    pool.query(theQuery, values)
                }
                else
                {
                    console.log("email is not verified")
                    res.end("<h1>Bad Request</h1>")
                }
        })
        
    }
    else
    {
        res.end("<h1>Request is from unknown source")
    }
    })

module.exports = router