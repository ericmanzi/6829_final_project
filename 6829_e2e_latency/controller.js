document.addEventListener('DOMContentLoaded', function () {

  function p(time) {
    if (time < 10) return "0"+time;
    else return time;
  } 
  function pm(ms) {
    if (time < 10) return "00"+ms;
    else if (time < 100) return "0"+ms;
    else return ms;
  } 

  function printTime() {

    var clock = document.getElementById("time");
    clock.innerHTML = '';
    var time = new Date();
    var current_time = p(time.getHours()) + ":" + p(time.getMinutes()) + ":" + p(time.getSeconds()) + "." + pm(time.getMilliseconds());
    var timespan = '<span>'+current_time+'</span';
    clock.innerHTML = timespan;

    updateTime();
  }

  function updateTime() {
    setTimeout(printTime, 10);
  }
  
  updateTime();


  document.getElementById('watch_url').onclick = function() {
    var url = document.getElementById('input_url').value;
    document.getElementById('video').innerHTML = url;
  }

  // var constraints = window.constraints = {
  //   audio: false,
  //   video: {
  //     width: {
  //       exact: 640
  //     }, 
  //     height: {
  //       exact: 480
  //     },
  //     mandatory: {
  //       chromeMediaSource: 'screen',
  //       maxWidth: 1280,
  //       maxHeight: 720
  //     },
  //   },
  //   mandatory: {
  //     chromeMediaSource: 'screen',
  //     maxWidth: 1280,
  //     maxHeight: 720
  //   },
  //   optional: []
  // };

  // navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia;
  // document.getElementById('share_screen').addEventListener('click', function() {
  //   navigator.getUserMedia({
  //     audio: false,
  //     video: {
  //       mandatory: {
  //         chromeMediaSource: 'screen',
  //         maxWidth: 1280,
  //         maxHeight: 720
  //       },
  //       optional: []
  //     }
  //   }, function(stream) {
  //     document.getElementById('video').src = window.URL.createObjectURL(stream);
  //   }, function() {
  //     alert('Screen stream is not available.');
  //   })
  // });

  // document.getElementById('share_screen').addEventListener('click', function() {
  //   navigator.mediaDevices.getUserMedia(constraints)
  //     .then(function(stream) {
  //       var videoTracks = stream.getVideoTracks();
  //       console.log('Got stream with constraints:', constraints);
  //       console.log('Using video device: ' + videoTracks[0].label);
  //       stream.onended = function() {
  //         console.log('Stream ended');
  //       };
  //       window.stream = stream; // make variable available to browser console
  //       if (window.URL) {
  //         // video.src = window.URL.createObjectURL(stream);
  //         document.getElementById('video').src = window.URL.createObjectURL(stream);
  //       } else {
  //         document.getElementById('video').src = stream;
  //       }
  //       // video.srcObject = stream;
  //     })
  //     .catch(function(error) {
  //       if (error.name === 'ConstraintNotSatisfiedError') {
  //         console.log('The resolution is not supported by your device.');
  //       } else if (error.name === 'PermissionDeniedError') {
  //         console.log('Permissions have not been granted to use your camera and ' +
  //           'microphone, you need to allow the page access to your devices in ' +
  //           'order for the demo to work.');
  //       }
  //       console.log('getUserMedia error: ' + error.name, error);
  //   });
  // });

});