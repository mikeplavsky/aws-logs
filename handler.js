'use strict';

// Your first function handler
module.exports.hello = (event, context, cb) => {

  var cfg = require('dotenv').config();

  cb(null, { 
      message: 'Go Serverless v1.0!', 
      event,
      context,
      cfg
    });

};

// You can add more handlers here, and reference them in serverless.yml
