var genericRequest = function(path, cbDone, cbFail) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      if (request.status == 200) {
        cbDone(request.responseText);
      } else {
        cbFail(request.statusText);
      }
    }
  };
  request.open("get", path + (path.indexOf("?") < 0 ? "?" : "&") + (parseInt(Math.random() * 100000, 10)), true);
  request.send();
};

var jsonRequest = function(path, cbDone, cbFail) {
  genericRequest(path, (data) => {
    try {
      cbDone(JSON.parse(data));
    } catch (error) {
      cbFail("JSONException: " + error);
    }
  }, cbFail);
};

var fileMapping = {
  ".json": jsonRequest
};

cwt.requestResource = function(path, cbDone, cbFail) {
  var fileSuffix = path.substring(path.lastIndexOf("."));

  if (!fileMapping[fileSuffix]) {
    throw new Error("UnsupportedMediaType: " + path);
  }

  fileMapping[fileSuffix](path, cbDone, cbFail);
};
