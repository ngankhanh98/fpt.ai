// Record
var recorder, gumStream, url;
var recordButton = document.getElementById("recordButton");
recordButton.addEventListener("click", toggleRecording);

function toggleRecording() {
  if (recorder && recorder.state == "recording") {
    recorder.stop();
    gumStream.getAudioTracks()[0].stop();
  } else {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(function (stream) {
        gumStream = stream;
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = function (e) {
          url = URL.createObjectURL(e.data);
          var preview = document.createElement("audio");
          preview.controls = true;
          preview.src = url;
          document.getElementById("audio-play").appendChild(preview);
        };
        recorder.start();
      });
  }
}

var submitVoice = document.getElementById("submitVoice");
submitVoice.addEventListener("click", postAudioPath);

function postAudioPath() {
  var setting = {
    method: "POST",
    url: "/speech-to-text",
    dataType: "json",
    async: false,
    data: {
      url: url,
    },
  };

  $.ajax(setting).done(function (params) {
      console.log(params)
  }).fail(function (err) {
      console.log(err)
  });
}
