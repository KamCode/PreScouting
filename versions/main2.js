// Working get all teams and sort them by team number

'use strict';
var events = [];
var teams = [];
var request = require('request');
var fs = require('fs');

const team_number = 2771;

var url = "http://thebluealliance.com/api/v3/team/frc"+team_number+"/events/2019"

request.get({
    url: url,
    json: true,
    headers: {
        'User-Agent': 'request',
        'X-TBA-Auth-Key': 'K0lrHjn8eZ4XUwLZQlRMDun8NmvnFogbv1w1ZRQFpDvy4iu27pgYiIif5wMbXyYX'
    }
}, (err, res, data) => {
    if(err){
        console.log('Error:', err)
    } else if(res.statusCode !== 200){
        console.log('Status:', res.statusCode)
    } else {
        data.forEach((element) => {
            // Add teams
            events.push(element.key)
        })
    }
    console.log(events)
    events.forEach((e) => {
        let u = "https://www.thebluealliance.com/api/v3/event/" + e + "/teams"
        request.get({
            url: u,
            json: true,
            headers: {
                'User-Agent': 'request',
                'X-TBA-Auth-Key': 'K0lrHjn8eZ4XUwLZQlRMDun8NmvnFogbv1w1ZRQFpDvy4iu27pgYiIif5wMbXyYX'
            }
        }, (err, res, data) => {
            if(err){
                console.log('Error:', err)
            } else if(res.statusCode !== 200){
                console.log('Status:', res.statusCode)
            } else {
                data.forEach((e) => {
                    // add team data
                    teams.push({team: e.team_number})
                })
            }
            teams = removeDuplicates(uniq(teams)).sort((a, b) => a - b)
            console.log(teams)
            var json = JSON.stringify(teams)
            fs.writeFile('teams.json', json, 'utf8', function cb(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("Success!")
                }
            })
        })
    })
})


function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}
