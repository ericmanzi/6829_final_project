// Records client perceived latency, i.e. the time it takes between when a
// client makes a request and gets a response.
var fs = require('fs');
var Chrome = require('chrome-remote-interface');

var rawEvents = [];
var url = process.argv[2];
var debugPort = process.argv[3];
if (!debugPort) {
	debugPort = 9222;
}
console.log(url);
console.log(debugPort);
Chrome({"port": debugPort}, function (chrome) {
    	with (chrome) {
        	var tstart = Date.now()
		Page.enable();
		Network.enable();
		//Input.enable();
		//Runtime.enable();
		//Page.navigate({'url': url});
		//Input.dispatchMouseEvent({"type": "mouse", "x": 500, "y": 250});
		//var res = Runtime.evaluate({"expression": "document.getElementsByTagName('video')[0].click()"});
		Network.responseReceived(function(r) {
			var rt = r.response.timing;
			if (rt && r.type == "XHR") {
				outStr = String(new Date().getTime()) + "," + rt.requestTime + "," + rt.receiveHeadersEnd;
				console.log(outStr);
			}
		});
	}
}).on('error', function (e) {
    console.error('Cannot connect to Chrome', e);
});


