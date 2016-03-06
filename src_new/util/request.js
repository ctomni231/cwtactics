function create_request() {
  try {
    return new XMLHttpRequest();
  } catch (ignore) {
    return new ActiveXObject("Microsoft.XMLHTTP");
  }
}

function parse_text(response, when_done, when_fail) {
  when_done(resonse);
}

function parse_json(response, when_done, when_fail) {
  var data;

  try {
    data = JSON.parse(response);
    when_done(data);
  } catch (err) {
    when_fail(err);
  }
}

function reqListener() {
  var handler;

  if (this.readyState == 4) {
    if (this.readyState == 4 && this.status == 200) {
      switch (this.response_data_type) {

        case "json":
          handler = parse_json;
          break;

        case "text":
          handler = parse_text;
          break;

        default:
          this.when_fail("NoResponseDataType");
      }

      handler(this.responseText, this.when_done, this.when_fail);

    } else {
      this.when_fail(this.statusText);
    }
  }
}

cwt.request_get_json = function(path, when_done, when_failed) {
  var request, token;

  request = create_request();

  request.response_data_type = "json";
  request.when_done = when_done;
  request.when_fail = when_failed;
  request.onreadystatechange = reqListener;

  token = (parseInt(Math.random() * 100000, 10));
  if (path.indexOf("?") === -1) {
    path += "?random_token=" + token;
  } else {
    path += "&random_token=" + token;
  }

  request.open("get", path, true);
  request.send();
};