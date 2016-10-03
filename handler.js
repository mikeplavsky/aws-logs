'use strict';

let AWS = require("aws-sdk");

let l = new AWS.Lambda();
let logs = new AWS.CloudWatchLogs();

module.exports.get_streams = (group) => {
    
    let now = new Date();
    now.setHours(now.getHours() - 1);

    logs.describeLogStreams({

        logGroupName: group,
        descending: true,
        orderBy: 'LastEventTime'

    },(err, data)=>{

        if (err != null){
            console.log(err);
            return; 
        }

        let streams = data.logStreams.filter(v => {
            return v.lastEventTimestamp >= now;
        });

        streams.forEach(v => {
            console.log(v.logStreamName);
        });

    });

}

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
