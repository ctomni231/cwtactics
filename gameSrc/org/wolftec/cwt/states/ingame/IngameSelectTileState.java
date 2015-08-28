package org.wolftec.cwt.states.ingame;

import org.wolftec.cwt.states.AbstractState;

public class IngameSelectTileState extends AbstractState {
  //
  // enter: function () {
  // stateData.targetselection.clean();
  //
  // /*
  // var prepareSelection = this.data.action.object.prepareSelection;
  // if (prepareSelection) prepareSelection(this.data);
  // else this.data.selectionRange = 1;
  // */
  // },
  //
  // ACTION: function () {
  // if (stateData.action.object.isTargetValid(stateData.cursorX,
  // stateData.cursorY)) {
  // gameData.targetselection.set(stateData.cursorX, stateData.cursorY);
  // this.changeState("INGAME_FLUSH_ACTIONS");
  // }
  // },
  //
  // CANCEL: function () {
  // this.changeState("INGAME_MENU");
  // }

  // enter: function () {
  // stateData.targetselection.clean();
  // stateData.focusMode = image.Sprite.FOCUS_MOVE;
  // renderer.renderFocusOnScreen();
  // },
  //
  // exit: function () {
  // renderer.layerEffects.clear();
  // renderer.layerFocus.clearAll();
  // stateData.selection.clear();
  // },
  //
  // ACTION: function (gameData) {
  // if (stateData.selection.getValue(stateData.cursorX, stateData.cursorY) >=
  // 0) {
  // stateData.targetselection.set(stateData.cursorX, stateData.cursorY);
  // this.changeState("INGAME_FLUSH_ACTIONS");
  // }
  // },
  //
  // CANCEL: function (gameData) {
  // this.changeState("INGAME_MENU");
  // }
}
