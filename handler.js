'use strict';

// Your first function handler
module.exports.groups = (event, context, cb) => {

  var cfg = require('dotenv').config();

  cb(null, { 
      message: 'Go Serverless v1.0!', 
      event,
      context,
      cfg
    });

};

module.exports.streams = (event, context, cb) => {

  cb(null, {
    message: 'Checking streams'
  });

}

// You can add more handlers here, and reference them in serverless.yml
