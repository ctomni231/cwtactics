cwt.ButtonFlowState({

  id: "VERSUS",
  last: "MAIN_MENU",

  enter: function () {
    this.selectedMap = null;
    this.selectPage(0);
    this.layout.getButtonByKey("MAP_SELECT_NAME").text = "";
  },

  init: function (layout) {

    var MAP_LIST_SIZE = 7;

    var h = parseInt((cwt.SCREEN_HEIGHT - 22) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 18) / 2, 10);
    var state = this;

    var cPage = 0;

    var buttonList;
    var mapList = [
      null, null, null, null, null, null, null
    ];

    var selectPage = this.selectPage = function (i) {
      if (i < 0 || (i * MAP_LIST_SIZE) >= cwt.Maps.maps.length) {
        return;
      }

      layout.getButtonByKey("MAP_SELECT_PAGE").text = (i + 1).toString();

      i = (i * MAP_LIST_SIZE);
      for (var n = 0; n < MAP_LIST_SIZE; n++) {
        if (i + n >= cwt.Maps.maps.length) {
          buttonList[n].text = "";
          mapList[n] = null;
        } else {
          var map = cwt.Maps.maps[i + n];
          buttonList[n].text = map;
          mapList[n] = map;
        }
      }
    };

    var selectMapCallback_ = function (obj) {
      state.selectedMap = obj.value;
      state.rendered = false;
      layout.getButtonByKey("MAP_SELECT_NAME").text = obj.key;
      cwt.Input.releaseBlock();
    };

    var selectMap = function (index) {
      if (!mapList[index]) {
        return;
      }

      cwt.Input.requestBlock();
      cwt.Storage.mapStorage.get(mapList[index], selectMapCallback_);
    };

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)

      .addButton(2, 2, 0, "MAP_SELECT_PAGE_LEFT", cwt.UIField.STYLE_NW, 8, function () {
      })
      .addButton(3, 2, 0, "MAP_SELECT_PAGE", cwt.UIField.STYLE_N, 8)
      .addButton(2, 2, 0, "MAP_SELECT_PAGE_RIGHT", cwt.UIField.STYLE_NE, 8, function () {
      })

      .addColGap(4)
      .addButton(8, 2, 0, "MAP_SELECT_NAME", cwt.UIField.STYLE_NORMAL, 8)
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_1", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(0);
      })

      .addColGap(1)

      // map preview canvas
      .addCustomField(10, 10, 0, "MAP_SELECT_PREVIEW", function (ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.height);

        if (state.selectedMap) {
          var BASE = (state.selectedMap.mpw >= cwt.MAX_MAP_WIDTH / 2) ? 2 : 4;

          var miniMapImg = cwt.Image.sprites.MINIMAP.getImage(
            BASE === 2 ? cwt.Sprite.MINIMAP_2x2 : cwt.Sprite.MINIMAP_4x4);

          var map = state.selectedMap.map;
          var typeMap = state.selectedMap.typeMap;
          var xe = state.selectedMap.mpw;
          var ye = state.selectedMap.mph;
          var startX = this.x + parseInt(this.width / 2, 10) - parseInt(state.selectedMap.mpw / 2 * BASE, 10);
          var startY = this.y + parseInt(this.height / 2, 10) - parseInt(state.selectedMap.mph / 2 * BASE, 10);

          for (var x = 0; x < xe; x++) {
            for (var y = 0; y < ye; y++) {

              // 3.1. tiles first
              var type = typeMap[ map[x][y] ];
              if (cwt.MiniMapIndexes[type] !== void 0) {

                ctx.drawImage(
                  miniMapImg,
                  cwt.MiniMapIndexes[type] * BASE, 0,
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
      .addButton(7, 2, 0, "MAP_SELECT_2", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(1);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_3", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(2);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_4", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(3);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_5", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(4);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_6", cwt.UIField.STYLE_EW, 8, function () {
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
      .addButton(7, 2, 0, "MAP_SELECT_7", cwt.UIField.STYLE_ESW, 8, function () {
        selectMap(6);
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      .addColGap(w)
      .addButton(5, 2, 0, "MENU_BACK", cwt.UIField.STYLE_NORMAL, 8, function () {
        cwt.Gameflow.changeState("MAIN_MENU");
      })

      .addColGap(5)
      .addButton(8, 2, 0, "MENU_CONFIGURED_MATCH", cwt.UIField.STYLE_NEW, 8, function () {
        cwt.GameSelectionDTO.map = this.selectedMap;
        this.selectedMap = null;
        cwt.Gameflow.changeState("PLAYER_SETUP_SCREEN");
      })
      .breakLine()

      .addColGap(w + 10)
      .addButton(8, 2, 0, "MENU_FAST_MATCH", cwt.UIField.STYLE_ESW, 8, function () {
        // cwt.Gameflow.changeState("PLAYER_SETUP_SCREEN");
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
  }
});