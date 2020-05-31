$("button[id=post-form]").click(function (e) {
  e.preventDefault();
  const voice = $("input[name=voice]:checked").attr("id");
  const text = $("textarea[id=text]").val();

  var settings = {
    url: "/",
    method: "POST",
    timeout: 0,
    dataType: "json",
    async: false,
    headers: {
      api_key: "D1RO9qGql9wiOObgj7r39FqKfP1RP43e",
      voice: voice,
    },
    data: { text: text },
  };

  var audio_source,
    html = "";
  $.ajax(settings)
    .done(function (response) {
      audio_source = response.async;
    })
    .fail(function (err) {
      console.log(err);
    });

  if (audio_source) {
    var obj = document.createElement("audio");
    obj.src = audio_source;
    obj.play();
  }
});
