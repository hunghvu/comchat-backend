//express is the framework we're going to use to handle requests
const express = require('express')

//We use this create the SHA256 hash
const crypto = require("crypto")

const genPin = require('crypto-random-string')

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

//Pull in the JWT module along with out asecret key
let jwt = require('jsonwebtoken')
let config = {
    secret: process.env.JSON_WEB_TOKEN
}


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
    //Change email to lower case
    req.body.email = (req.body.email).toLowerCase()

    if (!req.body.first || !req.body.last || !req.body.username || !req.body.email || !req.body.password) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        next()
    }
}, (req, res, next) => {
    //Check if password >= 6 char, has at least 1 uppercase letter A-Z
    if (checkPassword(password) == false) {
        res.status(400).send({
            message: "Invalid password, password must has at least 6 characters!"
        })
    } else {
        next()
    }
}, (req, res, next) => {
    //Retrieve data from query params
    let first = req.body.first
    let last = req.body.last
    let username = req.body.username 
    let email = req.body.email
    let password = req.body.password
        
    //We're storing salted hashes to make our application more secure
        //If you're interested as to what that is, and why we should use it
        //watch this youtube video: https://www.youtube.com/watch?v=8ZtInClXe1Q
        let salt = crypto.randomBytes(32).toString("hex")
        let salted_hash = getHash(password, salt)
        
        //We're using placeholders ($1, $2, $3) in the SQL query string to avoid SQL Injection
        //If you want to read more: https://stackoverflow.com/a/8265319
        let theQuery = "INSERT INTO MEMBERS(FirstName, LastName, Username, Email, Password, Salt, Code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING Email"
        let rand = genPin({length: 4, type: 'numeric'})
        let values = [first, last, username, email, salted_hash, salt, rand]
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
}, (req, res) => {
    let theQuery = "SELECT Code FROM Members WHERE Email=$1"
    let values = [req.body.email]
    pool.query(theQuery, values)
        .then(result => {
            host=req.get('host');
            let token = jwt.sign(
                {
                    "email": req.body.email,
                    "pin": result.rows[0].code
                },
                config.secret,
                { 
                    expiresIn: "24h" // expires in 24 hours
                }
            )
            let link="http://"+req.get('host')+"/register/verify?token="+token;
            mailOptions={
                to : (req.body.email).toLowerCase(),
                subject : "Please confirm your Com Chat Email account",
                html : "Hello,<br> Please Click on the link to verify your Com Chat email.<br><a href="+link+">Click here to verify</a>" 
            }   
            sendEmail(mailOptions);
        })
})



/**
 * @api {get} /register/verify Request to verify a user
 * @apiName GetRegister
 * @apiGroup Register
 * 
 * @apiParam {String} email a users email *required unique
 * @apiParam {Integer} pin a pin number
 * 
 * @apiSuccess (Success 200) {boolean} success true when the name is verified
 * @apiSuccess (Success 200) {String} email the email of the user verified 
 * 
 * @apiError (404: Pin number does not match) {String} message "Bad request"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * @apiError (400: Email not found) {String} message "Email not found"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 */
router.get('/verify', (request, response, next) => {
    //validate token
    if (!request.query.token) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        jwt.verify(request.query.token, config.secret, (err, decoded) => {
            if (err) {
                if (err.name == 'TokenExpiredError') {
                    const payload = jwt.verify(request.query.token, config.secret, {ignoreExpiration: true} );
                    //Delete email when expired
                    let query = 'DELETE FROM Members WHERE Email=$1'
                    let values = [payload.email]
                    pool.query(query, values)
                        .then(result => {
                            console.log("Expired email has been deleted")
                        }).catch(error => {
                            response.status(400).send({
                                message: "SQL Error",
                                error: error
                            })
                        })     
                } 

                response.status(403).json({
                    success: false,
                    message: err
                  })
            } else {  
              request.query.email = decoded.email;
              request.query.pin = decoded.pin;
              next();
            }
          })
    }
}, (request, response, next) => {
    //validate on missing or invalid (type) parameters
    if (!request.query.email || !request.query.pin) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        request.query.email = (request.query.email).toLowerCase()
        next()
    }
}, (request, response, next) => {
        //validate email exists 
        let query = 'SELECT MemberID FROM Members WHERE Email=$1'
        let values = [request.query.email]
        pool.query(query, values)
            .then(result => {
                if (result.rowCount == 0) {
                    response.status(400).send({
                        message: "email not found"
                    })
                } else {
                    //user found
                    request.memberid = result.rows[0].memberid
                    next()
                }
            }).catch(error => {
                response.status(400).send({
                    message: "SQL Error",
                    error: error
                })
            })
    }, (request, response, next) => {
        //Check PIN number
        let query = 'SELECT Code FROM Members WHERE Email=$1'
        let values = [request.query.email]
        pool.query(query, values)
            .then(result => {
                if (result.rows[0].code != request.query.pin) {
                    response.status(404).send({
                        message: "Bad request"
                    })
                } else {
                    next()
                }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
    }, (request, response) => {
        let query = 'UPDATE Members SET Code=$1,Verification=$2 WHERE MemberID=$3 RETURNING Email'
        let values = [genPin({length: 6, type: 'url-safe'}) , 1, request.memberid]
    
        pool.query(query, values)
            .then(result => {
                response.send(result.rows[0].email+" has been successfully verified for Com Chat!</h1>")
            }).catch(error => {
                response.status(400).send({
                    message: "SQL Error",
                    error: error
                })
            })
    })

module.exports = router