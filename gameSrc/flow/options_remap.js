cwt.ButtonFlowState({

  id: "REMAP_KEY_MAPPING",
  last: "OPTIONS",

  enter: function () {
    var map = cwt.Input.types.keyboard.MAPPING;

    this.mappingKeys[0].text = cwt.Input.codeToChar(map.RIGHT);
    this.mappingKeys[1].text = cwt.Input.codeToChar(map.LEFT);
    this.mappingKeys[2].text = cwt.Input.codeToChar(map.DOWN);
    this.mappingKeys[3].text = cwt.Input.codeToChar(map.UP);
    this.mappingKeys[4].text = cwt.Input.codeToChar(map.ACTION);
    this.mappingKeys[5].text = cwt.Input.codeToChar(map.CANCEL);
  },

  genericInput: function (keyCode) {

    // set string conversion of code into the field
    this.mappingKeys[this.index].text = cwt.Input.codeToChar(keyCode);

    // increase index
    this.index++;
    if (this.index >= this.mappingKeys.length) {

      // release generic input request
      cwt.Input.genericInput = false;
    }
  },

  init: function (layout) {

    var h = parseInt((cwt.SCREEN_HEIGHT - 18) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 12) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w).addButton(10, 2, 0, "OPTIONS_KEYMAP_RIGHT").addButton(2, 2, 0, "VALUE_R").breakLine()
      .addColGap(w).addButton(10, 2, 0, "OPTIONS_KEYMAP_LEFT").addButton(2, 2, 0, "VALUE_L").breakLine()
      .addColGap(w).addButton(10, 2, 0, "OPTIONS_KEYMAP_DOWN").addButton(2, 2, 0, "VALUE_D").breakLine()
      .addColGap(w).addButton(10, 2, 0, "OPTIONS_KEYMAP_UP").addButton(2, 2, 0, "VALUE_U").breakLine()
      .addColGap(w).addButton(10, 2, 0, "OPTIONS_KEYMAP_ACTION").addButton(2, 2, 0, "VALUE_A").breakLine()
      .addColGap(w).addButton(10, 2, 0, "OPTIONS_KEYMAP_CANCEL").addButton(2, 2, 0, "VALUE_C").breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(5, 4, 0, "OPTIONS_KEYMAP_GOBACK", function () {
        cwt.Gameflow.changeState("OPTIONS");
      })
      .addColGap(2)
      .addButton(5, 4, 0, "OPTIONS_KEYMAP_SET", function () {

        // setup generic input request
        cwt.Input.genericInput = true;
        this.index = 0;
      });

    this.mappingKeys = [
      layout.getButtonByKey("VALUE_R"),
      layout.getButtonByKey("VALUE_L"),
      layout.getButtonByKey("VALUE_D"),
      layout.getButtonByKey("VALUE_U"),
      layout.getButtonByKey("VALUE_A"),
      layout.getButtonByKey("VALUE_C")
    ];
  }
});