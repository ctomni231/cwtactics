/**
 *
 * @namespace
 */
cwt.Network = {

  /**
   * Id of the game in the connected network session.
   */
  gameId: null,

  /**
   * Id of the client in the connected network session.
   */
  clientId: cwt.INACTIVE,

  /**
   * The target URL of the network server.
   */
  targetURL: null,

  /**
   *
   * @return {Boolean}
   */
  isActive: function () {
    return this.gameId !== null;
  },

  /**
   *
   * @return {Boolean}
   */
  isHost: function () {
    return this.gameId === null || this.clientId !== cwt.INACTIVE;
  },

  /**
   * @private
   */
  urlBuilder_:[null,"?cmd=",null,"&gameId=",null,"&userId=",null],

  /**
   *
   * @private
   */
  parser_: function () {
    if (this.readyState == 4) {
      var res = this.responseText;
      if (res !== "") {
        var data = res.split("_&_");
        for (var i = 0, e = data.length; i < e; i++) {

          if (data[i] !== undefined && data[i].length > 0) network._incomingMessage(data[i]);
        }
      }
    }
  },

  /**
   *
   */
  parseMessage: function () {
    /*
    var xmlHttp = new XMLHttpRequest();

    this.urlBuilder_[0] = this.targetURL;
    this.urlBuilder_[2] = "GRABCMD";
    this.urlBuilder_[4] = this.gameId;
    this.urlBuilder_[6] = this.clientId;

    xmlHttp.open('GET',this.urlBuilder_.join(""),true);
    xmlHttp.onreadystatechange = this.parser_;
    xmlHttp.send(null);
    */
  },

  /**
   *
   * @param obj
   */
  sendMessage: function (obj) {

  }
};