$("button[id=post-form]").click(function () {
  const voice = $("input[name=voice]:checked").attr("id");
  const data = $("textarea[id=text]").val();

  var settings = {
    url: "/",
    method: "POST",
    timeout: 0,
    headers: {
      api_key: "D1RO9qGql9wiOObgj7r39FqKfP1RP43e",
      voice: voice,
    },
    data: data,
  };

  $.ajax(settings)
    .done(function (response) {
      console.log(response);
    })
    .fail(function (err) {
      console.log(err);
    });
});
