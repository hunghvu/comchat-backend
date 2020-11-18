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




router.get('/:email', (request, response, next) => {
    //validate on missing or invalid (type) parameters
    if (!request.params.email) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        request.params.email = (request.params.email).toLowerCase()
        next()
    }
}, (request, response, next) => {
        //validate email exists 
        let query = 'SELECT MemberID, Verification FROM Members WHERE Email=$1'
        let values = [request.params.email]
        pool.query(query, values)
            .then(result => {
                if (result.rowCount == 0) {
                    response.status(404).send({
                        message: "email not found"
                    })
                } else if (result.rows[0].verification == 0) {
                    response.status(404).send({
                        message: "email has not been verified"
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
    }, (request, response) => {
        let rand = Math.floor((Math.random() * 100) + 54);
        //Change Code in Members database
        let query = 'UPDATE Members SET Code=$1 WHERE MemberID=$2 RETURNING Code'
        let values = [rand, request.memberid]
    
        pool.query(query, values)
            .then(result => {
                let mailOptions={
                    to : request.params.email,
                    subject : "Com Chat Password Reset",
                    html : "Hello,<br> Please use this PIN number to reset your password: <br><b>"+result.rows[0].code+"</b>" 
                }
                sendEmail(mailOptions)
                //We successfully send an email, let the user know
                response.status(200).send({
                    message: "Email with PIN code has been sent"
                })
            }).catch(error => {
                response.status(400).send({
                    message: "SQL Error",
                    error: error
                })
            })
    })

    

router.put('/', (request, response, next) => {
        //validate on missing or invalid (type) parameters
        if (!request.query.email || !request.query.pin || !request.query.password) {
            response.status(400).send({
                message: "Missing required information"
            })
        } else {
            request.query.email = (request.query.email).toLowerCase()
            next()
        }
    }, (request, response, next) => {
            //validate email exists 
            let query = 'SELECT MemberID, Verification FROM Members WHERE Email=$1'
            let values = [request.query.email]
            pool.query(query, values)
                .then(result => {
                    if (result.rowCount == 0) {
                        response.status(400).send({
                            message: "email not found"
                        })
                    } else if (result.rows[0].verification == 0) {
                        response.status(400).send({
                            message: "email has not been verified"
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
            //check password
            if (!checkPassword(request.query.password)) {
                response.status(400).send({
                    message: "Invalid password, password must has at least 6 characters and 1 uppercase letter!"
                })
            } else {
                next()
            }
        }, (request, response, next) => {
            //Check PIN number
            let query = 'SELECT Code FROM Members WHERE Email=$1'
            let values = [request.query.email]
            pool.query(query, values)
                .then(result => {
                    if (result.rows[0].code != request.query.pin) {
                        response.status(400).send({
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
            let salt = crypto.randomBytes(32).toString("hex")
            let salted_hash = getHash(request.query.password, salt)

            let query = 'UPDATE Members SET Code=$1,Password=$2,SALT=$3 WHERE MemberID=$4 RETURNING Email'
            let values = [0 ,salted_hash, salt, request.memberid]
        
            pool.query(query, values)
                .then(result => {
                    console.log("email is verified")
                    response.send("<h1>Password of "+result.rows[0].email+" has been successfully reset</h1>")
                }).catch(error => {
                    response.status(400).send({
                        message: "SQL Error",
                        error: error
                    })
                })
        })

module.exports = router