package net.wolfTec.game;

import org.wolfTec.cwt.game.input.InputBean;
import org.wolfTec.cwt.game.input.InputTypeKey;
import org.wolfTec.cwt.game.statemachine.ActionMenu;

public class FactsProvider extends FactsProviderBase {

  private ActionMenu menu;
  private InputBean input;

  public void setupFacts() {
    generateGivenSentences();
    generateWhenSentences();
    generateThenSentences();
  }

  private void generateGivenSentences() {

    addGiven1("/^an unit that can act$/", (callback) -> {

    });

    addGiven1("/^an unit that cannot act$/", (callback) -> {

    });
  }

  private void generateWhenSentences() {

    addWhen1("/^click on it$/", (callback) -> {
      input.pushAction(InputTypeKey.A, -1, -1);
      fine(callback);
    });

    addWhen1("/^move it to an empty tile$/", (callback) -> {
      fail(callback);
    });
  }

  private void generateThenSentences() {

    addThen2("/^$action action is not visible$/", (actionName, callback) -> {
      for (int i = 0; i < menu.getSize(); i++) {
        if (menu.getSelectedContent() == actionName) fail(callback);
      }
      fine(callback);
    });

    addThen2("/^$action action is visible$/", (actionName, callback) -> {
      for (int i = 0; i < menu.getSize(); i++) {
        if (menu.getSelectedContent() == actionName) fine(callback);
      }
      fail(callback);
    });
  }
}
