// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

// Read the file and parse its contents.
var fs = require('fs')
  , filename = process.argv[2];
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;

  var output = parseHMS(data);
  console.log(output);

  fs.appendFile(filename+'_PARSED.txt', output, (err) => {
    if (err) throw err;
  });

});


function parseHMS(input) {
    // var input_no_lines = input.replace(/\n/ig, "");
    var delayMap = {};
    var timeStampPairsList = input.split('---');
    for (var i=0; i<timeStampPairsList.length; i++) {
        var timeStampPair = timeStampPairsList[i];
        var pairList = timeStampPair.split(" ").filter(function(stamp) { return /^\s*\d\d:\d\d:\d\d[\n\s]*$/ig.test(stamp); });
        if (pairList.length !== 2) {
            continue;
        }
        var startTime = pairList[0].match(/^\s*\d\d:\d\d:\d\d[\n\s]*$/ig)[0].replace(/[\n\s]/ig, "");
        var endTime = pairList[1].match(/^\s*\d\d:\d\d:\d\d[\n\s]*$/ig)[0].replace(/[\n\s]/ig, "");
        delayMap[startTime] = endTime;
    }
    return JSON.stringify(getDelayList(cleanUpHours(delayMap)));
}
// Finds most common hour and replaces all hours with that
// This means we might not be able to run this at end of hour
function cleanUpHours(delayMap) {
    var hourFrequency = {};
    Object.keys(delayMap).forEach(function(startTime) {
        var hour_tmp = startTime.match(/^\d\d:/ig);
        if (hour_tmp.length > 0) {
            var hour = hour_tmp[0];
            if (hourFrequency.hasOwnProperty(hour)) {
                var hourCount = hourFrequency[hour];
                hourFrequency[hour] = hourCount + 1;
            } else {
                hourFrequency[hour] = 1;
            }
        } 
    });
    var hours = Object.keys(hourFrequency);
    var maxFreqHour = { hour: hours[0], frequency: hourFrequency[hours[0]] };
    for (var i=1; i<hours.length; i++) {
        if (hourFrequency[hours[i]] > maxFreqHour.frequency) {
            maxFreqHour.frequency = hourFrequency[hours[i]];
            maxFreqHour.hour = hours[i];
        }
    }
    var newDelayMap = {};
    Object.keys(delayMap).forEach(function(startTime) {
        var endTime = delayMap[startTime];
        var newStartTime = startTime.replace(/^\d\d:/ig, maxFreqHour.hour);
        var newEndTime = endTime.replace(/^\d\d:/ig, maxFreqHour.hour);
        newDelayMap[newStartTime] = newEndTime;
    });
    return newDelayMap;
}


function getDelayList(delayMap) {
    var delayList = [];
    var viewerStartTime = delayMap[Object.keys(delayMap)[0]]; // time when stream started playing on viewer's end
    var videoStart = Object.keys(delayMap)[0];
    Object.keys(delayMap).forEach(function(startTime) {
        var endTime = delayMap[startTime];
        var delay = getDelay(startTime, endTime);
        // viewerPlayTime is diff between when viewer started watching video and when current frame was played
        var viewerPlayTime = getDelay(viewerStartTime, endTime);
        var originalPlayTime = getDelay(videoStart, startTime); // playback time in original video
        delayList.push({
            uploaded: startTime, 
            downloaded: endTime, 
            delay: delay, 
            originalPlayTime: originalPlayTime, 
            viewerPlayTime: viewerPlayTime,
            bufferTime: viewerPlayTime - originalPlayTime,
        });
    });
    return delayList;
}

// in Seconds
function getDelay(startTime, endTime) {
    return (getTime(endTime) - getTime(startTime))/1000.0 ;
}

function getTime(timeStr) {
    var d = new Date();
    var start_HMSarray = timeStr.split(":");
    if (start_HMSarray.length !== 3) {
        return d;
    }
    var hour = parseInt(start_HMSarray[0]);
    var min = parseInt(start_HMSarray[1]);
    var sec = parseInt(start_HMSarray[2]);
    d.setHours(hour); d.setMinutes(min); d.setSeconds(sec);
    return d;
}


/*
Sample output:



*/
