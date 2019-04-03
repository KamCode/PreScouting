"use strict";
var teams = [];
var events = [];
var currentEvent = '';
var request = require('request');
var config = require('./const.js');
// var fs = require('fs'); - Dont think I'll need this; Dont plan on saving to a local file
var baUrl = "http://thebluealliance.com/api/v3/team/frc"+config.team+"/events/"+config.year;

request.get({
    url: baUrl,
    json: true,
    headers: {
        'User-Agent': 'request',
        'X-TBA-Auth-Key': config.tba
    }
}, (err, res, data) => {
    if(err){
        console.log('Error:', err)
    } else if(res.statusCode !== 200){
        console.log('Status:', res.statusCode)
    } else {
        // console.log(data)
        data.forEach((e) => {
            events.push(e.key)
            request.get({
                url: "https://www.thebluealliance.com/api/v3/event/" + e.key + "/teams",
                json: true,
                headers: {
                    'User-Agent': 'request',
                    'X-TBA-Auth-Key': config.tba
                }
            }, (err, res, data) => {
                if(err){
                    console.log('Error:', err)
                } else if(res.statusCode !== 200){
                    console.log('Status:', res.statusCode)
                } else {
                    data.forEach((e) => {
                        // Add teams
                        Object.assign(teams, {Event:[e.short_name]})
                    })
                }
            })
            console.log(teams);
        });
    }
    // console.log(config.team + " events: ", events);
    // events.forEach((e) => {
    //     let u = "https://www.thebluealliance.com/api/v3/event/" + e + "/teams";
    //     request.get({
    //         url: u,
    //         json: true,
    //         headers: {
    //             'User-Agent': 'request',
    //             'X-TBA-Auth-Key': config.tba
    //         }
    //     }, (err, res, data) => {
    //         if(err){
    //             console.log('Error:', err)
    //         } else if(res.statusCode !== 200){
    //             console.log('Status:', res.statusCode)
    //         } else {
    //             // console.log(data)
    //             data.forEach((e) => {
    //             //   console.log(e.team_number)  
    //             })
    //         }
    //     })
    // });
});