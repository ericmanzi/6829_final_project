// Records client perceived latency, i.e. the time it takes between when a
// client makes a request and gets a response.
var fs = require('fs');
var Chrome = require('chrome-remote-interface');
var TRACE_CATEGORIES = ["devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.screenshot"];

var rawEvents = [];
var rttLogs = [];
var debugPort = process.argv[2];
// Parse the timeout (in seconds); convert to ms.
var timeLimit = parseInt(process.argv[3]) * 1000;
var rttOutfile = process.argv[4];
var traceOutfile = process.argv[5];
if (!debugPort) {
	debugPort = 9222;
}
console.log(timeLimit);
console.log(debugPort);
console.log(rttOutfile);
console.log(traceOutfile);
Chrome({"port": debugPort}, function (chrome) {
    	with (chrome) {
        var run = function() {
        var tstart = Date.now()
		Page.enable();
		Network.enable();
	    Tracing.start({
            "categories":   TRACE_CATEGORIES.join(','),
            "options":      "sampling-frequency=1"
        });
        Network.responseReceived(function(r) {
			var rt = r.response.timing;
			if (rt && r.type == "XHR") {
				outStr = String(new Date().getTime()) + "," + rt.requestTime + "," + rt.receiveHeadersEnd;
                rttLogs.push(outStr);
                console.log(rttLogs.length);
			}
		});
        Tracing.dataCollected(function(data){
            var events = data.value;
            console.log("Event received");
            rawEvents = rawEvents.concat(events.filter(function(evt) { return evt.name == "Screenshot"; }));
        });
        Tracing.tracingComplete(function() {
            //console.log(rawEvents);
            //console.log(rttLogs.join('\n'));
            fs.writeFileSync(traceOutfile, JSON.stringify(rawEvents, null, 2));
            fs.writeFileSync(rttOutfile, rttLogs.join('\n'));
        });
        setTimeout(function() {
            Tracing.end();
        }, timeLimit);
        }
        run();
/*  Chrome.List(function(err, lst) {
	    	for (var i in lst) {
	    		if (lst[i].type == 'page') {
	    			run();
	    		}
	    	}
	    });*/
	}
}).on('error', function (e) {
    console.error('Cannot connect to Chrome', e);
});


