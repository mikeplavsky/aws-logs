'use strict';

let AWS = require("aws-sdk");
let l = new AWS.Lambda();

module.exports.groups = (event, context, cb) => {
    
    //var cfg = require('dotenv').config();

    l.invoke({

        FunctionName: "aws-logs-prod-streams",
        InvocationType:'Event',
        Payload: `{"group":"test 1"}`

    },(err,data) => {

        console.log(err);
        console.log(data);

    });
    
    console.log("called it.")

};

module.exports.streams = (event, context, cb) => {

    console.log("got it.")
    console.log(event);
    console.log("done");

}
