'use strict';

let AWS = require("aws-sdk");

let l = new AWS.Lambda();
let logs = new AWS.CloudWatchLogs();

let config = require("./config.js").config;
let slack = require("@slack/client");

let channel = new slack.IncomingWebhook(config.slackUrl);

let get_events = (group, stream, filter, nextToken=null) => {
    
    let startTime = new Date();
    startTime.setMinutes(
            startTime.getMinutes() - config.checkInterval);

    console.log(startTime);

    logs.filterLogEvents({

        logGroupName:group,
        filterPattern:filter,
        logStreamNames: [stream],
        startTime: startTime.getTime(),
        nextToken: nextToken

    },(err,data) => {

        if (err != null){
            console.log(err);
            return;
        }

        console.log(data.events.length);

        console.log(
                data.events[0].
                message.
                match(/{(.*)}/)[0]);

    });
    
}

module.exports.get_events = get_events;

let get_streams = (group) => {
    
    let now = new Date();
    now.setMinutes(now.getMinutes() - config.checkInterval);

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
            return v.lastIngestionTime >= now;
        });

        let msg = {
            text: group,
            attachments: []
        }

        streams.forEach(v => {

            console.log(v.logStreamName);

            msg.attachments.push({
                text: v.logStreamName,
                color: "good"
            });

        });

        channel.send(msg);

    });

}

module.exports.get_streams = get_streams;

module.exports.groups = (event, context, cb) => {

    config.logGroups.forEach(v=>{
    
        l.invoke({

            FunctionName: "aws-logs-prod-streams",
            InvocationType:'Event',
            Payload: `{"group":"${v}"}`

        },(err,data) => {

            console.log(err);
            console.log(data);

        });

    });

    console.log("called it.")

};

module.exports.streams = (event, context, cb) => {

    console.log(`working on ${event.group}`)
    get_streams(event.group);

    console.log(`done ${event.group}`);

}
