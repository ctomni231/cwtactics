package org.wolftec.cwt;

import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.core.JsUtil;

public class NetworkManager implements Injectable {

  /**
   * Id of the game in the connected network session.
   */
  private String gameId;

  /**
   * Id of the client in the connected network session.
   */
  private int    clientId;

  @Override
  public void onConstruction() {
    gameId = null;
    clientId = Constants.INACTIVE;
  }

  /**
   * @return {Boolean}
   */
  public boolean isActive() {
    return gameId != null;
  }

  /**
   * @return {Boolean}
   */
  public boolean isHost() {
    return gameId == null || clientId != Constants.INACTIVE;
  }

  /**
   * Parses a message and invokes commands if necessary.
   */
  public void parseMessage(String msg) {
    JsUtil.throwError("NotImplementedYetException");
  }

  /**
   * Sends a given action data object into data object and sends it to the game
   * server.
   */
  public void sendMessage(String actionData) {
    JsUtil.throwError("NotImplementedYetException");
  };

  // var targetURL = null;
  // var urlBuilderHelper = [ null, "?cmd=", null, "&gameId=", null, "&userId=",
  // null ];
  // var parserHelper = function () {
  // if (this.readyState === 4) {
  // var res = this.responseText;
  // if (res !== "") {
  // var data = res.split("_&_");
  // for (var i = 0, e = data.length; i < e; i++) {
  //
  // if (data[i] !== undefined && data[i].length > 0) {
  // parseMessage(data[i]);
  // }
  // }
  // }
  // }
  // };
  // var createRequest = function () {
  // var xmlHttp = new XMLHttpRequest();
  //
  // // generate URL
  // urlBuilderHelper[0] = this.targetURL;
  // urlBuilderHelper[2] = "GRABCMD";
  // urlBuilderHelper[4] = this.gameId;
  // urlBuilderHelper[6] = this.clientId;
  //
  // xmlHttp.open('GET', urlBuilderHelper.join(""), true);
  // xmlHttp.onreadystatechange = parserHelper;
  // xmlHttp.send(null);
  // };
}
