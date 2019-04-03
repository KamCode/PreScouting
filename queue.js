var request = require('request')
var config = require('./const')
var fs = require('fs');
var teamFile = require('./teams.json')
var sprintf = require('sprintf-js').sprintf
const readline = require('readline');
var myTeam = '';

var baUrl = "http://thebluealliance.com/api/v3/team/frc"+config.team+"/events/"+config.year;
var weeks = [];
var events = [];
var eName = [];
var teamList = [];

var upload = (body) => {
    request.post(config.api, {
        form: body,
    })
}

var baUrl = "http://thebluealliance.com/api/v3/team/frc"+ config.team +"/events/"+config.year;
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
        data.forEach((e) => {
            events.push(e.key)
            weeks.push(e.week+1)
            eName.push(e.short_name)
        });
    }
    events.forEach((e, i) => {
        request.get({
            url: "https://www.thebluealliance.com/api/v3/event/" + e + "/teams",
            json: true,
            headers: {
                'User-Agent': 'request',
                'X-TBA-Auth-Key': config.tba    
            }
        }, (err, res, data) => {
            if(err){
                console.log(err);
            } else if(res.statusCode !== 200){
                console.log("Status: ", res.statusCode);
            } else {
                data.forEach((d) => {
                    let body = {
                        team: d.team_number,
                        event: eName[i],
                        week: weeks[i],
                        ba: 'WIP'
                    }
                    teamList.push(body);
                    var json = JSON.stringify(teamList)
                    fs.writeFile('teams.json', json, 'utf8', function cb(err){
                        if(err) {
                            console.log(err);
                        }
                    });
                });
            }
        });
    });
});

if(teamFile.length > 1){
    console.log(teamFile.length + " results found");
    var i = 0;
    var queue = () => {
        upload(teamFile[i])
        console.log(i + '/' + teamFile.length)
        i++;
        if( i < teamFile.length ){
            setTimeout(queue, 500);
        }
    }
    queue();
} else {
    makeTeamList(); 
}