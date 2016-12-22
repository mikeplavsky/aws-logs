'use strict';

let AWS = require("aws-sdk");

let l = new AWS.Lambda();
let logs = new AWS.CloudWatchLogs();

let config = require("./config.js").config;
let slack = require("@slack/client");

let channel = new slack.IncomingWebhook(config.slackUrl);

module.exports.events = (event, context, cb) => {

    let res = get_events(event);

    res
        .then(d => {

            let res = [];

            d.forEach(v => {
                res.push(v);
            });

            cb(null, res);

        })
        .catch(err => {
            cb(err);
        });

};

let get_events_page = (resolve,reject,params) => {

    if (params.stats == null) {
        params.stats = new Set();
    }

    let startTime = new Date();
    startTime.setMinutes(
        startTime.getMinutes() - params.checkInterval);

    console.log(startTime);

    logs.filterLogEvents({

        logGroupName: params.group,
        filterPattern: params.filter,
        startTime: startTime.getTime(),
        nextToken: params.nextToken

    }, (err, data) => {

        if (err != null) {

            console.log(err);
            reject(err);

            return;

        }

        console.log(data.events.length);

        data.events.forEach(x => {

            let s = x.
            message.
            match(/{(.*)}/)[0];

            let v = JSON.parse(s);
            params.stats.add(v[params.field]);

        });

        if (data.nextToken != null) {

            params.nextToken = data.nextToken;
            get_events_page(resolve, reject, params);

        } else {
            console.log(params.stats);
            resolve(params.stats);
        }

    });
}

let get_events = (params) => {

    return new Promise((resolve, reject) => {
        get_events_page(resolve, reject, params); 
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

    }, (err, data) => {

        if (err != null) {
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

module.exports.filteredGroups = (event, context, cb) => {

    config.filteredLogGroups.forEach(v => {

        l.invoke({

            FunctionName: "aws-logs-prod-events",
            InvocationType: 'RequestResponse',
            Payload: JSON.stringify(v)

        }, (err, data) => {

            if (err != null) {
                console.log(err);
                cb(err);
                return;
            };

            console.log(v);
            console.log(data.Payload);

            let msg = {
                text: `https://${v.stream}/`,
                attachments: []
            }

            let d = JSON.parse(data.Payload);

            d.forEach(v => {

                msg.attachments.push({
                    text: v,
                    color: "good"
                });

            });

            channel.send(msg);

        });
    });

    console.log("called it.")
    cb(null, "Done");

};

module.exports.groups = (event, context, cb) => {

    config.logGroups.forEach(v => {

        l.invoke({

            FunctionName: "aws-logs-prod-streams",
            InvocationType: 'Event',
            Payload: `{"group":"${v}"}`

        }, (err, data) => {

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
