const app_id = process.env.WEATHER_APP_ID;
const consumer_key = process.env.WEATHER_CONSUMER_KEY;
const consumer_secret = process.env.WEATHER_SECRET_KEY;


//express is the framework we're going to use to handle requests
const express = require('express')

const OAuth = require('oauth');

//zipcode module is to get long and latitude from zipcode
const zipcodes = require('zipcodes');

//request module is needed to make a request to a web service
//const request = require('request')

var router = express.Router()

/**
 * @api {get} /phish/blog/get Request a list of Phish.net Blogs
 * @apiName GetPhishBlogGet
 * @apiGroup Phish
 * 
 * @apiHeader {String} authorization JWT provided from Auth get
 * 
 * @apiDescription This end point is a pass through to the Phish.net API. 
 * All parameters will pass on to https://api.phish.net/v3/blog/get.
 * See the <a href="https://phishnet.api-docs.io/v3/blog/blog-get">Phish.net documentation</a>
 * for a list of optional paramerters and expected results. You do not need a 
 * Phish.net api key with this endpoint. Enjoy!
 */ 
router.get("/", (req, res) => {
    //validate chatId is not empty or non-number
    if (!req.query.zip) {
      res.status(400).send({
          message: "Missing required information"
      })
    }  else if (isNaN(req.query.zip)) {
      res.status(400).send({
          message: "Malformed parameter. Zip code must be a number"
      })
    }

    // Process the zip code and add lon and lat param to the url
    console.log(req.decoded)
    var url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss'
    var query = {lat: '', lon: '',format: 'json'};
    var param = zipcodes.lookup(req.query.zip)
    query.lat = param.latitude
    query.lon = param.longitude
    console.log(query)

    //Change query into parameters
    var str = [];
      for (var p in query)  
        if (query.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(query[p]));
        }
    str = str.join("&");
    console.log(str)
    url += '?' + str
    console.log(url)

    // Require node-oauth package: npm install oauth
    // Copyright 2019 Oath Inc. Licensed under the terms of the zLib license see https://opensource.org/licenses/Zlib for terms.
    var header = {
        "X-Yahoo-App-Id": app_id
    };
    var request = new OAuth.OAuth(
        null,
        null,
        consumer_key,
        consumer_secret,
        '1.0',
        null,
        'HMAC-SHA1',
        null,
        header
    );

    //When this web service gets a request, make a request to the Yahoo Weather Web service
    request.get(
      url,
      null,
      null,
      function (err, data, result) {
          if (err) {
            res.send(err)
          } else {
            //var n = body.indexOf("{")
            //var nakidBody = body.substring(n - 1)
            res.send(data)
          }
      }
  );

})

module.exports = router