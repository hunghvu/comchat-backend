//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()

router.get("/:email?", (request, response, next) => {
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
    //validate email does not already exist in the contact
    let query = 'SELECT * FROM Contacts WHERE MemberID_A=$1'
    let values = [request.memberid]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(400).send({
                    message: "user has no contact"
                })
            } else {
                response.send({
                    contactCount : result.rowCount,
                    contacts: result.rows
                })
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
})

router.post("/", (request, response, next) => {
    if (!request.body.email_A || !request.body.email_B) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        request.body.email_A = (request.body.email_A).toLowerCase()
        request.body.email_B = (request.body.email_B).toLowerCase()
        next()
    }
}, (request, response, next) => {
    //validate first email exists 
    let query = 'SELECT MemberID, Verification FROM Members WHERE Email=$1'
    let values = [request.body.email_A]
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
                request.memberId_A = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate second email exists 
    let query = 'SELECT MemberID, Verification FROM Members WHERE Email=$1'
    let values = [request.body.email_B]

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
                request.memberId_B = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate contact does not already exist 
    let query = 'SELECT * FROM Contacts WHERE MemberID_A=$1 AND MemberID_B=$2'
    let values = [request.memberId_A, request.memberId_B]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount > 0) {
                response.status(400).send({
                    message: "contact already exist"
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
    //Insert the memberId into the chat
    let insert = `INSERT INTO Contacts(MemberID_A, MemberID_B)
                  VALUES ($1, $2)
                  RETURNING *`
    let values = [request.memberId_A, request.memberId_B]
    pool.query(insert, values)
        .then(result => {
            response.send({
                sucess: true
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
})

router.delete("/", (request, response, next) => {
    if (!request.body.email_A || !request.body.email_B) {
        response.status(400).send({
            message: "Missing required information"
        })
    } else {
        request.body.email_A = (request.body.email_A).toLowerCase()
        request.body.email_B = (request.body.email_B).toLowerCase()
        next()
    }
}, (request, response, next) => {
    //validate first email exists 
    let query = 'SELECT MemberID, Verification FROM Members WHERE Email=$1'
    let values = [request.body.email_A]
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
                request.memberId_A = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate second email exists 
    let query = 'SELECT MemberID, Verification FROM Members WHERE Email=$1'
    let values = [request.body.email_B]

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
                request.memberId_B = result.rows[0].memberid
                next()
            }
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    //validate contact does not already exist 
    let query = 'SELECT * FROM Contacts WHERE MemberID_A=$1 AND MemberID_B=$2'
    let values = [request.memberId_A, request.memberId_B]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount == 0) {
                response.status(400).send({
                    message: "contact does not exist"
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
    //Insert the memberId into the chat
    let insert = `DELETE FROM Contacts 
                  WHERE MemberID_A=$1 
                  AND MemberID_B=$2
                  RETURNING *`
    let values = [request.memberId_A, request.memberId_B]
    pool.query(insert, values)
        .then(result => {
            response.send({
                sucess: true
            })
        }).catch(err => {
            response.status(400).send({
                message: "SQL Error",
                error: err
            })
        })
})





module.exports = router