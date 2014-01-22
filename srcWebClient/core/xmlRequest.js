util.scoped(function () {

  var xmlHttpReq;
  try {
    new XMLHttpRequest();
    xmlHttpReq = true;
  }
  // FALL BACK
  catch (ex) {
    xmlHttpReq = false;
  }

  function reqListener() {
    if (this.readyState == 4) {
      // FINE
      if (this.readyState == 4 && this.status == 200) {
        util.log("grabbed file successfully");

        // JSON OBJECT
        if (this.asJSON) {
          var arg;
          try {
            arg = JSON.parse(this.responseText);
          }
          // FAILED TO CONVERT JSON TEXT
          catch (e) {
            this.failCallback(e);
          }
          this.winCallback(arg);
        }
        // PLAIN TEXT
        else {
          this.winCallback(this.responseText);
        }
      }
      // ERROR
      else {
        util.log("could not grab file");
        this.failCallback(this.statusText);
      }
    }
  }

  util.grabRemoteFile = function (options) {
    var oReq;

    util.log("try to grab file", options.path);

    // GENERATE REQUEST OBJECT
    if (xmlHttpReq) oReq = new XMLHttpRequest();
    else oReq = new ActiveXObject("Microsoft.XMLHTTP");

    // WIN / FAIL CALLBACK
    oReq.asJSON = options.json;
    oReq.winCallback = options.success;
    oReq.failCallback = options.error;

    // META DATA
    oReq.onreadystatechange = reqListener;
    oReq.open("get", options.path+"?_cwtR="+parseInt(10000*Math.random(),10), true);

    // SEND IT
    oReq.send();
  }
});