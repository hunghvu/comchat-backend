//express is the framework we're going to use to handle requests
const express = require('express')

//Access the connection to Heroku Database
let pool = require('../utilities/utils').pool

var router = express.Router()


/**
 * @api {get} /connections/:email? Request to get contacts of an email
 * @apiName GetConnections
 * @apiGroup Connections
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {String} email to look up contacts. 
 * 
 * @apiSuccess {Number} contactCount the number of contacts returned
 * @apiSuccess {Object[]} members List of contacts of a user
 * @apiSuccess {String} messages.contacts The contact of a user
 * 
 * @apiError (400: Email Not Found) {String} message "Email Not Found"
 * @apiError (400: Email Not Verified) {String} message "Email has not been verified"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
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
}, (request, response, next) => {
    let query = `SELECT Members.Email, Members.FirstName, Members.LastName
                FROM Contacts
                INNER JOIN Members ON Contacts.MemberId_B=Members.MemberId
                WHERE MemberID_A=$1 AND Verified=1`
    let values = [request.memberid]

    pool.query(query, values)
        .then(result => {
            request.connections = result.rows
            next()
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    let query = `SELECT Members.Email, Members.FirstName, Members.LastName
                FROM Contacts
                INNER JOIN Members ON Contacts.MemberId_A=Members.MemberId
                WHERE MemberID_B=$1 AND Verified=1`
    let values = [request.memberid]

    pool.query(query, values)
        .then(result => {
            request.connections = [...request.connections, ...result.rows]
            next()
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response, next) => {
    let query = `SELECT Members.Email, Members.FirstName, Members.LastName
                FROM Contacts
                INNER JOIN Members ON Contacts.MemberId_B=Members.MemberId
                WHERE MemberID_A=$1 AND Verified=0`
    let values = [request.memberid]

    pool.query(query, values)
        .then(result => {
            request.sentRequests = result.rows
            next()
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
}, (request, response) => {
    let query = `SELECT Members.Email, Members.FirstName, Members.LastName
                FROM Contacts
                INNER JOIN Members ON Contacts.MemberId_A=Members.MemberId
                WHERE MemberID_B=$1 AND Verified=0`
    let values = [request.memberid]

    pool.query(query, values)
        .then(result => {
            response.send({
                contacts: request.connections,
                sentRequests: request.sentRequests,
                receivedRequests: result.rows
            })
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
})


/**
 * @api {get} /connections/stranger/:email? Request to get people not in contacts of an email
 * @apiName GetConnections
 * @apiGroup Connections
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * 
 * @apiParam {String} email to look up email not in contacts. 
 * 
 * @apiSuccess {Number} contactCount the number of stranger returned
 * @apiSuccess {Object[]} members List of stranger of a user
 * @apiSuccess {String} messages.contacts The strangers of a user
 * 
 * @apiError (400: Email Not Found) {String} message "Email Not Found"
 * @apiError (400: Email Not Verified) {String} message "Email has not been verified"
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 * 
 * @apiUse JSONError
 */ 
router.get("/stranger/:email?", (request, response, next) => {
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
    let query = `SELECT Email, FirstName, LastName
                FROM Members
                WHERE MemberID<>$1 AND Verification=1 AND MemberID NOT IN (SELECT MemberID_A FROM Contacts WHERE MemberID_B=$1)
                AND MemberID NOT IN (SELECT MemberID_B FROM Contacts WHERE MemberID_A=$1)`
    let values = [request.memberid]

    pool.query(query, values)
        .then(result => {
            response.send({
                strangers: result.rows
            })
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        })
})


/**
 * @api {post} /connections Request to add a contact to an email
 * @apiName PostConnections
 * @apiGroup Connections
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} email_A the email to be added with a contact
 * @apiParam {String} email_B email contact to be added to email_A
 * 
 * @apiSuccess (Success 201) {boolean} success true when the contact is inserted
 * @apiSuccess (Success 201) {boolean} message "Verify connection successfully"
 * 
 * @apiError (400: Email Not Found) {String} message "Email Not Found"
 * @apiError (400: Email Not Verified) {String} message "Email has not been verified"
 * @apiError (400: Contact Existed) {String} message "Contact already exist" 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * @apiError (400: Missing Parameters) {String} message "Request has already been sent"
 * 
 * @apiUse JSONError
 */ 
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
                if (result.rows[0].verified == 1){
                    response.status(400).send({
                        message: "contact already exist"
                    })
                } else {
                    response.status(400).send({
                        message: "Request has already been sent"
                    }) 
                }   
            } else {
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
    let query = 'SELECT * FROM Contacts WHERE MemberID_B=$1 AND MemberID_A=$2'
    let values = [request.memberId_A, request.memberId_B]

    pool.query(query, values)
        .then(result => {
            if (result.rowCount > 0) {
                if (result.rows[0].verified == 1){
                    response.status(400).send({
                        message: "contact already exist"
                    })
                } else {
                    request.verify = true
                }   
            } else {
                request.verify = false
            }
            next()
        }).catch(error => {
            response.status(400).send({
                message: "SQL Error",
                error: error
            })
        }) 
}, (request, response) => {
    if (request.verify) {
        //Verify contact
        let insert = `Update Contacts SET Verified=1 WHERE MemberID_B=$1 AND MemberID_A=$2`
        let values = [request.memberId_A, request.memberId_B]
        pool.query(insert, values)
            .then(result => {
                response.send({
                    message: "Verify connection successfully"
                })
            }).catch(err => {
                response.status(400).send({
                    message: "SQL Error",
                    error: err
                })
            })
    } else {
        //Insert new contact
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
    }
    
})



/**
 * @api {delete} /connections/delete? Request to delete a contact from an email
 * @apiName DeleteConnections
 * @apiGroup Connections
 * 
 * @apiHeader {String} authorization Valid JSON Web Token JWT
 * @apiParam {String} email_A the email to delete a contact from
 * @apiParam {String} email_B email contact associated with email_A to be deleted
 * 
 * @apiSuccess (Success 201) {boolean} success true when the contact is deleted
 * 
 * @apiError (400: Email Not Found) {String} message "Email Not Found"
 * @apiError (400: Email Not Verified) {String} message "Email has not been verified"
 * @apiError (400: Contact Not Found) {String} message "Contact does not exist" 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiUse JSONError
 */ 
router.post("/delete", (request, response, next) => {
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
    let query = 'SELECT * FROM Contacts WHERE (MemberID_A=$1 AND MemberID_B=$2) OR (MemberID_B=$1 AND MemberID_A=$2)'
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
    //Delete the memberId from Connections
    let insert = `DELETE FROM Contacts 
                  WHERE (MemberID_A=$1 
                  AND MemberID_B=$2) OR (MemberID_B=$1 
                    AND MemberID_A=$2)`
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