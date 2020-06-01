// Record
var recorder, gumStream, _url, _blob;
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
          _url = URL.createObjectURL(e.data);
          var preview = document.createElement("audio");
          preview.controls = true;
          preview.src = _url;
          document.getElementById("audio-play").innerHTML = "";
          document.getElementById("audio-play").appendChild(preview);
          _blob = e.data;
        };
        recorder.start();
      });
  }
}

var submitVoice = document.getElementById("submitVoice");
submitVoice.addEventListener("click", postAudioPath);
var html;
var text_result = document.getElementById("text_result");

async function postAudioPath() {
  const buffer = JSON.stringify(
    Array.from(new Uint8Array(await _blob.arrayBuffer()))
  );

  var setting = {
    method: "POST",
    url: "/speech-to-text",
    dataType: "json",
    async: false,
    data: {
      // url: _url,
      buffer: buffer,
    },
  };

  // if (setting.data) {
  $.ajax(setting)
    .done(function (params) {
      const { hypotheses } = params;
      html = hypotheses[0].utterance;
      console.log(params);
    })
    .fail(function (err) {
      html = err.message;
      console.log(err);
    });
  // }

  console.log(html);
  text_result.innerHTML = html;
}
