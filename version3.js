"use strict";
var teams = [];
var weeks = [];
var events = [];
var event = [];
var currentEvent = '';
var http = require('http');
// var request = require('request');
var request = require('request-promise');
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
            weeks.push(e.week)
            event.push(e.short_name)
        });
        // console.log(events)
        if(events.length != 0){
            console.log(events.length + ' events found')
            // for(let i = 0; i < events.length; i++){
            console.log(events)
            events.forEach((e, index) => {
                console.log(event[index])
                request.get({
                    url: "https://www.thebluealliance.com/api/v3/event/" + e + "/teams",
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
                        let ev = event[index];
                        (async function main() {
                            try {
                                for(let i = 0; i < data.length; i++){
                                    console.log('Uploading: ', data[i].team_number)
                                    console.log(data[i].team_number)
                                    const res = await request({
                                        url: config.api,
                                        method: 'POST',
                                        form: {
                                            team: data[i].team_number,
                                            event: ev,
                                            week: weeks[index],
                                            ba: '=HYPERLINK("https://www.thebluealliance.com/team/'+ data[i].team_number +'")'
                                        }
                                    })
                                    if(!res){
                                        return
                                    }
                                    // console.log(res)
                                }
                            }
                            catch(e) {
                                console.log(e.message)
                            }
                        
                        })();

                        // (async function main(){
                        //     try {
                        //         data.forEach((d, i) => {
                        //             let body = {
                        //                 team: d.team_number,
                        //                 event: event[index],
                        //                 week: weeks[index],
                        //                 ba: '=HYPERLINK("https://www.thebluealliance.com/team/'+ d.team_number +'")'
                        //             }
                        //             let headers = {
                        //                 'User-Agent':'Super Agent/0.0.1',
                        //                 'Content-Type':'application/x-www-form-urlencoded'
                        //             }
                        //             let options = {
                        //                 url: config.api,
                        //                 method: 'POST',
                        //                 headers: headers,
                        //                 qs: body
                        //             }
                        //             // console.log(body)
                        //             // request(options, (err, res, body) => {
                        //             //     if(!err && res.statusCode == 200){
                        //             //         console.log('Uploaded: ', d.team_number)
                        //             //     }
                        //             // })
                        //             request.post(config.api, {
                        //                 headers: headers,
                        //                 json: body,
                        //             }, (err, res, body) => {
                        //                 if(err){
                        //                     console.log(err);
                        //                 } else {
                        //                     console.log('Uploaded: ', d.team_number)
                        //                 }
                        //             })
                        //         });
                        //     }
                        //     catch(e) {
                        //         console.log(e.message)
                        //     }
                        // })();
                        // setTimeout(function() {
                        //     for(let i = 0; i < data.length; i++){
                        //         request.post(config.api, {
                        //             form: {
                        //                 team: data[i].team_number,
                        //                 week: weeks[i],
                        //                 event: event[i],
                        //                 ba: 'Blue Alliance'
                        //             }
                        //             }, (error, res, body) => {
                        //             if (error) {
                        //                 console.error(error)
                        //                 return
                        //             } else {
                        //                 console.log(data[i].team_number)
                        //             }
                        //             console.log(`statusCode: ${res.statusCode}`)
                        //         })
                        //         // delay(5000)
                        //     }
                        // }, 1000)

                    //     var i = 0;                     //  set your counter to 1
                    //     function myLoop () {           //  create a loop function
                    //         setTimeout(function () {    //  call a 3s setTimeout when the loop is called
                    //             request.post(config.api, {
                    //                 form: {
                    //                     team: data[i].team_number,
                    //                     week: weeks[i],
                    //                     event: event[i],
                    //                     ba: 'Blue Alliance'
                    //                 }
                    //                 }, (error, res, body) => {
                    //                 if (error) {
                    //                     console.error(error)
                    //                     return
                    //                 }
                    //                     console.log(data[i].team_number)
                                    
                    //                 console.log(`statusCode: ${res.statusCode}`)
                    //             })     
                    //             if (i < data.length) {         
                    //                 myLoop();             
                    //             } else {
                    //                 return;
                    //             }
                    //             i++;                        
                    //         }, 1500)
                    //     }
                    //     myLoop(); 
                    // }

                    // } else {
                    //     for(let i = 0; i < data.length; i++){
                    //         // console.log(data[i].team_number)
                    //         (function (i) {
                    //             setTimeout(function() {
                    //                 console.log(data[i].team_number)

                    //                 request.post(config.api, {
                    //                     form: {
                    //                         team: data[i].team_number,
                    //                         week: weeks[i],
                    //                         event: event[i],
                    //                         ba: 'Blue Alliance'
                    //                     }
                    //                 }, (error, res, body) => {
                    //                     if (error) {
                    //                         console.error(error)
                    //                         return
                    //                     }
                    //                     console.log(`statusCode: ${res.statusCode}`)
                    //                     // console.log(body)
                    //                 })

                    //             }, 10000*i)
                    //         })(i)
                    //     }
                    // }
                    }
                })
            })
        }
    }
});


function delay(ms) {
    var cur_d = new Date();
    var cur_ticks = cur_d.getTime();
    var ms_passed = 0;
    while(ms_passed < ms) {
        var d = new Date();  // Possible memory leak?
        var ticks = d.getTime();
        ms_passed = ticks - cur_ticks;
        // d = null;  // Prevent memory leak?
    }
  }