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

    var code = null;
    switch (this.index) {
      case 0: code = "RIGHT"; break;
      case 1: code = "LEFT"; break;
      case 2: code = "DOWN"; break;
      case 3: code = "UP"; break;
      case 4: code = "ACTION"; break;
      case 5: code = "CANCEL"; break;
    }

    cwt.assert(code);

    // set string conversion of code into the field
    this.mappingKeys[this.index].text = (this.mode === 0)? cwt.Input.codeToChar(keyCode) : keyCode;
    ((this.mode === 0)? cwt.Input.types.keyboard.MAPPING : cwt.Input.types.gamePad.MAPPING)[code] = keyCode;

    // invoke re-rendering
    this.rendered = false;

    // increase index
    this.index++;
    if (this.index >= this.mappingKeys.length) {

      // release generic input request
      cwt.Input.genericInput = false;
    }
  },

  init: function (layout) {
    this.mode = 0;

    var h = parseInt((cwt.SCREEN_HEIGHT - 16) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 12) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_RIGHT", cwt.UIField.STYLE_NW, 8)
      .addButton(8, 2, 0, "VALUE_R", cwt.UIField.STYLE_NE, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_LEFT", cwt.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_L", cwt.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_DOWN", cwt.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_D", cwt.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_UP", cwt.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_U", cwt.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_ACTION", cwt.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_A", cwt.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_CANCEL", cwt.UIField.STYLE_SW, 8)
      .addButton(8, 2, 0, "VALUE_C", cwt.UIField.STYLE_ES, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(5, 2, 0, "OPTIONS_KEYMAP_GOBACK", cwt.UIField.STYLE_NORMAL, 8, function () {
        cwt.Input.saveKeyMapping();
        cwt.Gameflow.changeState("OPTIONS");
      })
      .addColGap(2)
      .addButton(5, 2, 0, "OPTIONS_KEYMAP_SET", cwt.UIField.STYLE_NORMAL, 8, function () {

        // setup generic input request
        cwt.Input.genericInput = true;
        this.index = (this.mode === 0)? 0 : 4;
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