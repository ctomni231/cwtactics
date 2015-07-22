"use strict";

var constants = require("../constants");
var widgets = require("../uiWidgets");

var input = require("../input");
var image = require("../image");

var roundDTO = require("../dataTransfer/roundSetup");
var mapDTO = require("../dataTransfer/maps");

var MAP_LIST_SIZE = 7;

var selectedMap;
var buttonList;
var selectedMapButton;
var selectedPageButton;

var mapList = [
  null, null, null, null, null, null, null
];

var selectPage = function (i) {
  if (i < 0 || (i * MAP_LIST_SIZE) >= mapDTO.maps.length) {
    return;
  }

  selectedPageButton.text = (i + 1).toString();

  i = (i * MAP_LIST_SIZE);
  for (var n = 0; n < MAP_LIST_SIZE; n++) {
    if (i + n >= mapDTO.maps.length) {
      buttonList[n].text = "";
      mapList[n] = null;
    } else {
      var map = mapDTO.maps[i + n];
      buttonList[n].text = map;
      mapList[n] = map;
    }
  }
};

var stateReRender;

var selectMapCb = function (key, map) {
  selectedMap = map;
  selectedMapButton.text = key;
  stateReRender();
  input.releaseBlock();
};

var selectMap = function (index) {
  if (!mapList[index]) {
    return;
  }

  input.requestBlock();
  mapDTO.transferFromStorage(mapList[index], selectMapCb);
};

exports.state = {

  id: "VERSUS",

  enter: function () {
    selectedMap = null;
    selectedMapButton.text = "";
    selectPage(0);
  },

  init: function () {
    var state = this;
    stateReRender = function () {
      state.doRender();
    };
  },

  doLayout: function (layout) {
    var h = parseInt((constants.SCREEN_HEIGHT - 22) / 2, 10);
    var w = parseInt((constants.SCREEN_WIDTH - 18) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)

      .addButton(2, 2, 0, "MAP_SELECT_PAGE_LEFT", widgets.UIField.STYLE_NW, 8, function () {
      })
      .addButton(3, 2, 0, "MAP_SELECT_PAGE", widgets.UIField.STYLE_N, 8)
      .addButton(2, 2, 0, "MAP_SELECT_PAGE_RIGHT", widgets.UIField.STYLE_NE, 8, function () {
      })

      .addColGap(4)
      .addButton(8, 2, 0, "MAP_SELECT_NAME", widgets.UIField.STYLE_NORMAL, 8)
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_1", widgets.UIField.STYLE_EW, 8, function () {
        selectMap(0);
      })

      .addColGap(1)

      // map preview canvas
      .addCustomField(10, 10, 0, "MAP_SELECT_PREVIEW", function (ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.height);

        if (selectedMap) {
          var BASE = (selectedMap.mpw >= constants.MAX_MAP_WIDTH / 2) ? 2 : 4;

          var miniMapImg = image.sprites["MINIMAP"].getImage(
            BASE === 2 ? image.Sprite.MINIMAP_2x2 : image.Sprite.MINIMAP_4x4);

          var map = selectedMap.map;
          var typeMap = selectedMap.typeMap;
          var xe = selectedMap.mpw;
          var ye = selectedMap.mph;
          var startX = this.x + parseInt(this.width / 2, 10) - parseInt(selectedMap.mpw / 2 * BASE, 10);
          var startY = this.y + parseInt(this.height / 2, 10) - parseInt(selectedMap.mph / 2 * BASE, 10);

          for (var x = 0; x < xe; x++) {
            for (var y = 0; y < ye; y++) {

              // 3.1. tiles first
              var type = typeMap[ map[x][y] ];
              if (image.minimapIndex[type] !== void 0) {

                ctx.drawImage(
                  miniMapImg,
                  image.minimapIndex[type] * BASE, 0,
                  BASE, BASE,
                  startX + (x * BASE),
                  startY + (y * BASE),
                  BASE, BASE
                );

              } else {
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(x * BASE, y * BASE, BASE, BASE);
              }

            }
          }
        }
      }, true)

      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_2", widgets.UIField.STYLE_EW, 8, function () {
        selectMap(1);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_3", widgets.UIField.STYLE_EW, 8, function () {
        selectMap(2);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_4", widgets.UIField.STYLE_EW, 8, function () {
        selectMap(3);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_5", widgets.UIField.STYLE_EW, 8, function () {
        selectMap(4);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_6", widgets.UIField.STYLE_EW, 8, function () {
        selectMap(5);
      })
      .addColGap(1)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_1", function () {
      }, true)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_2", function () {
      }, true)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_3", function () {
      }, true)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_4", function () {
      }, true)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_5", function () {
      }, true)
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_7", widgets.UIField.STYLE_ESW, 8, function () {
        selectMap(6);
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      .addColGap(w)
      .addButton(5, 2, 0, "MENU_BACK", widgets.UIField.STYLE_NORMAL, 8, function () {
        this.changeState("MAIN_MENU");
      })

      .addColGap(5)
      .addButton(8, 2, 0, "MENU_CONFIGURED_MATCH", widgets.UIField.STYLE_NEW, 8, function () {
        roundDTO.selectMap(selectedMap);
        selectedMap = null;
        this.changeState("PLAYER_SETUP_SCREEN");
      })
      .breakLine()

      .addColGap(w + 10)
      .addButton(8, 2, 0, "MENU_FAST_MATCH", widgets.UIField.STYLE_ESW, 8, function () {
        // this.changeState("PLAYER_SETUP_SCREEN");
      });

    buttonList = [
      layout.getButtonByKey("MAP_SELECT_1"),
      layout.getButtonByKey("MAP_SELECT_2"),
      layout.getButtonByKey("MAP_SELECT_3"),
      layout.getButtonByKey("MAP_SELECT_4"),
      layout.getButtonByKey("MAP_SELECT_5"),
      layout.getButtonByKey("MAP_SELECT_6"),
      layout.getButtonByKey("MAP_SELECT_7")
    ];

    selectedMapButton = layout.getButtonByKey("MAP_SELECT_NAME");
    selectedPageButton = layout.getButtonByKey("MAP_SELECT_PAGE");
  }
};