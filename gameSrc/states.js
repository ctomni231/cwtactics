"use strict";

var constants = require("./constants");
var stateMachine = require("./statemachine");
var renderer = require("./renderer");
var widgets = require("./gui");
var debug = require("./debug");
var image = require("./image");
var input = require("./input");
var audio = require("./audio");
var i18n = require("./localization");

// ------------------------------------------------------------------------------------------------

exports.setErrorData = function (errorMessage, errorWhere) {
    var stateData;

    stateData.message = errorMessage;
    stateData.where = errorWhere;
    stateData.rendered = false;
};

// TODO use button group here instead of this direct hacky stuff

exports.state = {
    id: "ERROR_SCREEN",

    enter: function () {
        var data = this.data;

        data.rendered = false;
        data.activeCmd = 0;
        data.message = null;
        data.where = null;
    },

    update: function (delta, lastInput) {
        switch (lastInput) {

            case this.input.TYPE_LEFT:
                if (data.activeCmd > 0) data.activeCmd--;
                break;

            case this.input.TYPE_RIGHT:
                if (data.activeCmd < 2) data.activeCmd++;
                break;

            case this.input.TYPE_ACTION :
                switch (data.activeCmd) {

                    /* Restart */
                    case 0: debug.logCritical("Not implemented yet"); break;

                    /* Wipe-Out Content and restart*/
                    case 1: debug.logCritical("Not implemented yet"); break;

                    /* Send report and restart */
                    case 2: debug.logCritical("Not implemented yet"); break;
                }
                break;
        }
    },

    render: function () {
        if (!data.rendered) {
            var ctxUI = renderer.layerUI.getContext();

            data.rendered = true;
        }
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "PORTRAIT_SCREEN",

    init: function () {
        this.data.lastStateId = null;
    },

    enter: function (lastState) {
        this.data.rendered = false;
    },

    update: function (delta, lastInput) {
        var isLandscape = false;2

        // go back to the last state when the device is back in landscape mode
        //  --> don't fire enter event when changing back to the last state
        if (isLandscape) {
            this.data.lastStateId = null;
            this.setState(this.lastStateId,false);
        }
    },

    render: function (delta) {
        if (!this.data.rendered) {
            var ctxUI = renderer.layerUI.getContext();

            renderer.layerUI.clear();

            this.data.rendered = true;
        }
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id:"NONE",

    enter: function () {
        this.data.backgroundDrawn = false;
    },

    update: function () {
        if (this.data.backgroundDrawn) {
            this.changeState("LOADING_SCREEN");
        }
    },

    render: function () {
        if (!this.data.backgroundDrawn) {
            var ctx = renderer.layerBG.getContext(constants.INACTIVE);

            ctx.fillStyle = "gray";
            ctx.fillRect(0, 0, renderer.screenWidth, renderer.screenHeight);

            this.data.backgroundDrawn = true;
        }
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "START_SCREEN",

    init: function () {
        var data = this.data;
        exports.tooltips = null;

        data.TOOLTIP_TIME = 5000;

        data.background = null;

        data.tooltip = new widgets.UIField(
            parseInt(renderer.screenWidth * 0.1, 10),
            parseInt(renderer.screenHeight * 0.2, 10),
            parseInt(renderer.screenWidth * 0.8, 10),
            120,
            "",
            10,
            widgets.UIField.STYLE_NORMAL
        );

        data.button = new widgets.UIField(
            parseInt(renderer.screenWidth * 0.5 - 150, 10),
            parseInt(renderer.screenHeight * 0.8, 10) - 20,
            300,
            40,
            "START",
            20,
            widgets.UIField.STYLE_NORMAL
        );
    },

    enter: function () {
        var data = this.data;

        data.tooltip_time = data.TOOLTIP_TIME;

        renderer.layerUI.clear(constants.INACTIVE);

        // select a random background image
        var numBackgrounds = image.sprites["BACKGROUNDS"].getNumberOfImages();
        var randBGIndex = parseInt(Math.random() * numBackgrounds, 10);
        data.background = image.sprites["BACKGROUNDS"].getImage(randBGIndex);
    },

    update: function (delta, lastInput) {
        var data = this.data;

        // action leads into main menu
        if (lastInput && lastInput.key === input.TYPE_ACTION) {
            audio.playNullSound();
            this.changeState("MAIN_MENU");

        } else {
            data.tooltip_time += delta;
            if (data.tooltip_time >= data.TOOLTIP_TIME) {

                if (exports.tooltips) {

                    // update random tooltip
                    var randEl = exports.tooltips[parseInt(Math.random() * exports.tooltips.length, 10)];
                    data.tooltip.text = i18n.forKey(randEl);

                    if (data.tooltip.text.search(/\n/) !== -1) {
                        data.tooltip.text = this.tooltip.text.split("\n");
                    }
                }

                data.tooltip_time = 0;
            }
        }
    },

    render: function () {
        var data = this.data;

        if (data.background) {
            renderer.layerBG.getContext(constants.INACTIVE).drawImage(
                data.background,
                0, 0,
                renderer.screenWidth,
                renderer.screenHeight);

            data.background = null;
        }

        var uiCtx = renderer.layerUI.getContext(constants.INACTIVE);
        data.button.draw(uiCtx);
        data.tooltip.draw(uiCtx);
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "LOADING_SCREEN",

    init: function () {
        var data = this.data;

        data.x = 10;
        data.y = parseInt(renderer.screenHeight / 2, 10) - 10;
        data.height = 20;
        data.width = renderer.screenWidth - 20;
        data.process = 0;
        data.done = false;
    },

    enter: function () {
        var data = this.data;

        require("./loading").startProcess(
            function (p) { data.process = p; },
            function () { data.process = 100; }
        );
    },

    update: function () {
        var data = this.data;

        if (data.done) {
            this.changeState("START_SCREEN");
        } else if (data.process === 100) {
            data.done = true;
        }
    },

    render: function () {
        var data = this.data;

        var ctx = renderer.layerUI.getContext(constants.INACTIVE);

        ctx.fillStyle = "white";
        ctx.fillRect(data.x, data.y, data.width, data.height);

        ctx.fillStyle = "blue";
        ctx.fillRect(data.x, data.y, (parseInt(data.width * (data.process / 100), 10)), data.height);
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {

    id: "MAIN_MENU",

    last: "START_SCREEN",

    doLayout: function (layout) {
        var h = parseInt((constants.SCREEN_HEIGHT - 22) / 2, 10);
        var w = parseInt((constants.SCREEN_WIDTH - 16) / 2, 10);

        layout

            .addRowGap(h)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(16, 4, 0, "MAIN_MENU_SKIRMISH", widgets.UIField.STYLE_NORMAL, 20, function () {
                this.changeState("VERSUS");
            })
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(2)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(16, 4, 0, "MAIN_MENU_NETWORK", widgets.UIField.STYLE_NORMAL, 20 )
            .breakLine()

            //--------------------------------------------------------

            .addRowGap(1)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(16, 3, 0, "MAIN_MENU_TEST_WEATHER", widgets.UIField.STYLE_NEW, 20, function () {
                this.changeState("WEATHER");
            })
            .breakLine()
            .addColGap(w)
            .addButton(16, 3, 0, "MAIN_MENU_TEST_WEATHER", widgets.UIField.STYLE_ESW, 20, function () {
                this.changeState("RAIN");
            })
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(1)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(16, 4, 0, "MAIN_MENU_OPTIONS", widgets.UIField.STYLE_NORMAL, 20, function () {
                this.changeState("OPTIONS");
            });
    }
};

// ------------------------------------------------------------------------------------------------

var ENTRIES_PARAMETERS = 6;

var names;
var values;
var pageButton;

var configAttrPage = new renderer.Pagination(config.gameConfigNames, ENTRIES_PARAMETERS, function () {
    for (var i = 0, e = this.entries.length; i < e; i++) {
        names[i].text = (this.entries[i]) ? i18n.forKey(this.entries[i]) : "";
        values[i].text = (this.entries[i]) ? config.getValue(this.entries[i]).toString() : "";
    }

    pageButton.text = this.page.toString();
});


var changeConfigValue = function (index, left) {
    if (configAttrPage.entries[index]) {
        var name = configAttrPage.entries[index];
        var cfg = config.getConfig(name);

        if (left) {
            cfg.decreaseValue();
        } else {
            cfg.increaseValue();
        }

        values[index].text = config.getValue(name).toString();
    }
};

exports.state = {

    id: "PARAMETER_SETUP_SCREEN",

    enter: function () {
        configAttrPage.selectPage(0);
    },

    doLayout: function (layout) {
        var ENTRIES_PARAMETERS = 6;

        var h = parseInt((constants.SCREEN_HEIGHT - (8 + (ENTRIES_PARAMETERS * 2))) / 2, 10);
        var w = parseInt((constants.SCREEN_WIDTH - 18) / 2, 10);

        layout
            .addRowGap(h)

            // -------------------------------------------------------

            .repeat(ENTRIES_PARAMETERS, function (i) {
                var style1, style2, style3;

                if (i === 0) {
                    style1 = widgets.UIField.STYLE_NEW;
                    style2 = widgets.UIField.STYLE_NW;
                    style3 = widgets.UIField.STYLE_NE;
                } else if (i === ENTRIES_PARAMETERS - 1) {
                    style1 = widgets.UIField.STYLE_ESW;
                    style2 = widgets.UIField.STYLE_SW;
                    style3 = widgets.UIField.STYLE_ES;
                } else {
                    style1 = widgets.UIField.STYLE_EW;
                    style2 = widgets.UIField.STYLE_W;
                    style3 = widgets.UIField.STYLE_E;
                }

                this
                    .addColGap(w)
                    .addButton(2, 2, 0, "MENU_LEFT", style1, 8, function () {
                        changeConfigValue(i, true);
                    })
                    .addColGap(1)
                    .addButton(8, 2, 0, "PARAMETER_CONFIG_" + i, style2, 8)
                    .addButton(4, 2, 0, "PARAMETER_CONFIG_" + i + "_VALUE", style3, 8)
                    .addColGap(1)
                    .addButton(2, 2, 0, "MENU_RIGHT", style1, 8, function () {
                        changeConfigValue(i, false);
                    })
                    .breakLine()
            })

            // -------------------------------------------------------

            .addRowGap(1)

            // -------------------------------------------------------

            .addColGap(w + 6)
            .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_NSW, 8, function () {
                configAttrPage.selectPage(configAttrPage.page - 1);
            })
            .addButton(2, 2, 0, "PARAMETER_CONFIG_PAGE", widgets.UIField.STYLE_NS, 8)
            .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_NES, 8, function () {
                configAttrPage.selectPage(configAttrPage.page + 1);
            })
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(3)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(5, 2, 0, "MENU_BACK", widgets.UIField.STYLE_NORMAL, 8, function () {
                this.changeState("PLAYER_SETUP_SCREEN");
            })
            .addColGap(8)
            .addButton(5, 2, 0, "MENU_NEXT", widgets.UIField.STYLE_NORMAL, 8, function () {
                this.changeState("INGAME_ENTER");
            })
            .breakLine();


        names = layout.getButtonsByReg(/(PARAMETER_CONFIG_)(\d+)$/);
        values = layout.getButtonsByReg(/(PARAMETER_CONFIG_)(\d+)(_VALUE)$/);
        pageButton = layout.getButtonByKey("PARAMETER_CONFIG_PAGE");
    }
};

// ------------------------------------------------------------------------------------------------


var TEAM_IDENTIFIERS = [
    "A", "B", "C", "D"
];

var selectedSlot = 0;
var gameModeBtn;
var playerNameBtn;
var playerTeamBtn;
var playerTypeBtn;
var playerCo_A_Btn;

var updateGameModeBtn = function () {
    gameModeBtn.text = (model.gameMode === model.GAME_MODE_AW1) ? "Advance Wars 1" : "Advance Wars 2";
};

var selectSlot = function (i) {
    selectedSlot = i;
    updateSlotButtons();
};

var updateSlotButtons = function () {
    var i = selectedSlot;

    if (roundDTO.type[i] === constants.INACTIVE) {
        playerTypeBtn.text = "config.player.off";
    } else if (roundDTO.type[i] === constants.DESELECT_ID) {
        playerTypeBtn.text = "config.player.disabled";
    } else if (roundDTO.type[i] === 0) {
        playerTypeBtn.text = "config.player.human";
    } else {
        playerTypeBtn.text = "config.player.AI";
    }
    playerTypeBtn.text = i18n.forKey(playerTypeBtn.text);

    if (roundDTO.type[i] === constants.DESELECT_ID) {
        playerNameBtn.text = "Slot " + (i + 1);
        playerTeamBtn.text = "";
        playerCo_A_Btn.text = "";

    } else {
        playerNameBtn.text = "Player " + (i + 1);
        playerTeamBtn.text = TEAM_IDENTIFIERS[roundDTO.team[i]];

        if (roundDTO.co[i] === constants.INACTIVE) {
            playerCo_A_Btn.text = i18n.forKey("config.player.commanders.none");
        } else {
            playerCo_A_Btn.text = sheets.commanders.types[roundDTO.co[i]];
        }
    }

};

var changeValue = function (type, isPrev) {
    roundDTO.changeParameter(selectedSlot, type, isPrev);
    updateSlotButtons();
};

exports.state = {

    id: "PLAYER_SETUP_SCREEN",

    enter: function () {
        roundDTO.preProcess();
        selectSlot(0);
        updateGameModeBtn();
    },

    init: function (layout) {
        var h = parseInt((constants.SCREEN_HEIGHT - 20) / 2, 10);
        var w = parseInt((constants.SCREEN_WIDTH - 18) / 2, 10);

        layout

            .addRowGap(h)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_NSW, 8, function () {
                changeValue(roundDTO.CHANGE_TYPE.GAME_TYPE, false);
                updateGameModeBtn();

            })
            .addButton(7, 2, 0, "PLAYER_CONFIG_GAMEMODE", widgets.UIField.STYLE_NS, 8)
            .addButton(7, 2, 0, "PLAYER_CONFIG_GAMEMODE_VALUE", widgets.UIField.STYLE_NS, 8)
            .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_NES, 8, function () {
                changeValue(roundDTO.CHANGE_TYPE.GAME_TYPE, true);
                updateGameModeBtn();
            })
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(2)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(1, 2, 0, "", widgets.UIField.STYLE_NSW, 8)
            .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT1", widgets.UIField.STYLE_NS, 8, function () {
                selectSlot(0);
            })
            .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT2", widgets.UIField.STYLE_NS, 8, function () {
                selectSlot(1);
            })
            .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT3", widgets.UIField.STYLE_NS, 8, function () {
                selectSlot(2);
            })
            .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT4", widgets.UIField.STYLE_NS, 8, function () {
                selectSlot(3);
            })
            .addButton(1, 2, 0, "", widgets.UIField.STYLE_NES, 8)
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(2)
            // -------------------------------------------------------

            .addColGap(w+3)
            .addButton(6, 2, 0, "PLAYER_CONFIG_NAME", widgets.UIField.STYLE_NW, 8)
            .addButton(6, 2, 0, "PLAYER_CONFIG_NAME_VALUE", widgets.UIField.STYLE_NE, 8)
            //.addColGap(2)
            //.addButton(2, 2, 0, "MENU_LEFT", cwt.UIField.STYLE_NSW, 8, function () {})
            //.addButton(2, 2, 0, "MENU_RIGHT", cwt.UIField.STYLE_NES, 8, function () {})
            .breakLine()

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_NEW, 8, function () {
                changeValue(roundDTO.CHANGE_TYPE.PLAYER_TYPE, false);
            })
            .addColGap(1)
            .addButton(6, 2, 0, "PLAYER_CONFIG_TYPE", widgets.UIField.STYLE_W, 8)
            .addButton(6, 2, 0, "PLAYER_CONFIG_TYPE_VALUE", widgets.UIField.STYLE_E, 8)
            .addColGap(1)
            .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_NEW, 8, function () {
                changeValue(roundDTO.CHANGE_TYPE.PLAYER_TYPE, true);
            })
            .breakLine()

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_EW, 8, function () {
                changeValue(roundDTO.CHANGE_TYPE.TEAM, false);
            })
            .addColGap(1)
            .addButton(6, 2, 0, "PLAYER_CONFIG_TEAM", widgets.UIField.STYLE_W, 8)
            .addButton(6, 2, 0, "PLAYER_CONFIG_TEAM_VALUE", widgets.UIField.STYLE_E, 8)
            .addColGap(1)
            .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_EW, 8, function () {
                changeValue(roundDTO.CHANGE_TYPE.TEAM, true);
            })
            .breakLine()

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_ESW, 8, function () {
                changeValue(roundDTO.CHANGE_TYPE.CO_MAIN, true);
            })
            .addColGap(1)
            .addButton(6, 2, 0, "PLAYER_CONFIG_CO_A", widgets.UIField.STYLE_SW, 8)
            .addButton(6, 2, 0, "PLAYER_CONFIG_CO_A_VALUE", widgets.UIField.STYLE_ES, 8)
            .addColGap(1)
            .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_ESW, 8, function () {
                changeValue(roundDTO.CHANGE_TYPE.CO_MAIN, false);
            })
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(2)

            .addColGap(w)
            .addButton(5, 2, 0, "MENU_BACK", widgets.UIField.STYLE_NORMAL, 8, function () {
                this.changeState("VERSUS");
            })

            .addColGap(8)
            .addButton(5, 2, 0, "MENU_NEXT", widgets.UIField.STYLE_NORMAL, 8, function () {
                this.changeState("PARAMETER_SETUP_SCREEN");
            })
            .breakLine();


        gameModeBtn = layout.getButtonByKey("PLAYER_CONFIG_GAMEMODE_VALUE");
        playerNameBtn = layout.getButtonByKey("PLAYER_CONFIG_NAME_VALUE");
        playerTeamBtn = layout.getButtonByKey("PLAYER_CONFIG_TEAM_VALUE");
        playerTypeBtn = layout.getButtonByKey("PLAYER_CONFIG_TYPE_VALUE");
        playerCo_A_Btn = layout.getButtonByKey("PLAYER_CONFIG_CO_A_VALUE");
    }
};

// ------------------------------------------------------------------------------------------------

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

// ------------------------------------------------------------------------------------------------

exports.state = {

    id: "CONFIRM_WIPE_OUT_SCREEN",

    last: "OPTIONS",

    doLayout: function (layout) {

        var h = parseInt((constants.SCREEN_HEIGHT - 18) / 2, 10);
        var w = parseInt((constants.SCREEN_WIDTH - 16) / 2, 10);

        layout

            .addRowGap(h)

            // -------------------------------------------------------

            .addColGap(w).addButton(16, 8, 0, "OPTIONS_WIPE_OUT_TEXT", widgets.UIField.STYLE_NORMAL, 8)
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(2)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(6, 2, 0, "OPTIONS_WIPE_OUT_NO", widgets.UIField.STYLE_NORMAL, function () {
                this.changeState("OPTIONS");
            })
            .addColGap(4)
            .addButton(6, 2, 0, "OPTIONS_WIPE_OUT_YES", widgets.UIField.STYLE_NORMAL, function () {
                storage.clear(function() {
                    document.location.reload();
                });
            });
    }
};

// ------------------------------------------------------------------------------------------------


var audioDto = require("../dataTransfer/audio");
var configDto = require("../dataTransfer/config");

var h = parseInt((constants.SCREEN_HEIGHT - 18) / 2, 10);
var w = parseInt((constants.SCREEN_WIDTH - 16) / 2, 10);

var sfxButton;
var musicButton;

var saveStep1 = function () {
    audioDto.saveVolumeConfigs(saveStep2);
};

var saveStep2 = function () {
    statemachine.changeState("MAIN_MENU");
};

var updateSound = function (isSFX,change,state) {
    var vol = ((isSFX)? audio.getSfxVolume() : audio.getMusicVolume()) + change;
    (isSFX)? audio.setSfxVolume(vol) : audio.setMusicVolume(vol);
    ((isSFX)? sfxButton : musicButton).text = Math.round(vol * 100).toString();
    state.rendered = false;
};

exports.state = {

    id: "OPTIONS",
    last: "MAIN_MENU",

    enter: function (layout) {
        layout.getButtonByKey("OPTIONS_CHECKBOX_FORCE_TOUCH").checked =  config.getConfig("forceTouch").value;
        layout.getButtonByKey("OPTIONS_CHECKBOX_ANIMATED_TILES").checked =  config.getConfig("animatedTiles").value;
        layout.getButtonByKey("OPTIONS_SFX_VOL").text = Math.round(audio.getSfxVolume() * 100).toString();
        layout.getButtonByKey("OPTIONS_MUSIC_VOL").text = Math.round(audio.getMusicVolume() * 100).toString();
    },

    doLayout: function (layout) {

        layout

            .addRowGap(h)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(4, 2, 0, "OPTIONS_SFX_VOL_DOWN", widgets.UIField.STYLE_NW, function () {
                updateSound(true,-0.05,this);
            })
            .addButton(8, 2, 0, "OPTIONS_SFX_VOL", widgets.UIField.STYLE_N, 8)
            .addButton(4, 2, 0, "OPTIONS_SFX_VOL_UP", widgets.UIField.STYLE_NE, function () {
                updateSound(true,+0.05,this);
            })
            .breakLine()

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_DOWN", widgets.UIField.STYLE_SW, function () {
                updateSound(false,-0.05,this);
            })
            .addButton(8, 2, 0, "OPTIONS_MUSIC_VOL", widgets.UIField.STYLE_S, 8)
            .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_UP", widgets.UIField.STYLE_ES, function () {
                updateSound(false,+0.05,this);
            })
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(1)

            // -------------------------------------------------------

            .addColGap(w)
            .addCheckbox(2, 2, 0, "OPTIONS_CHECKBOX_ANIMATED_TILES", widgets.UIField.STYLE_NW)
            .addButton(14, 2, 0, "OPTIONS_CHECKBOX_ANIMATED_TILES_TEXT", widgets.UIField.STYLE_NE, 8)
            .breakLine()

            .addColGap(w)
            .addCheckbox(2, 2, 0, "OPTIONS_CHECKBOX_FORCE_TOUCH", widgets.UIField.STYLE_SW)
            .addButton(14, 2, 0, "OPTIONS_CHECKBOX_FORCE_TOUCH_TEXT", widgets.UIField.STYLE_ES, 8)
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(1)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(8, 2, 0, "OPTIONS_MENU_CHANGE_KEYBOARD_LAYOUT", widgets.UIField.STYLE_NSW, 8, function () {
                statemachine.changeState("REMAP_KEY_MAPPING");
                statemachine.activeState.mode = 0;
            })
            .addButton(8, 2, 0, "OPTIONS_MENU_CHANGE_GAMEPAD_LAYOUT", widgets.UIField.STYLE_NES, 8, function () {
                statemachine.changeState("REMAP_KEY_MAPPING");
                statemachine.activeState.mode = 1;
            })
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(1)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(16, 2, 0, "OPTIONS_MENU_WIPE_OUT", widgets.UIField.STYLE_NORMAL, 8, function () {
                statemachine.changeState("CONFIRM_WIPE_OUT_SCREEN");
            })
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(1)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(6, 2, 0, "OPTIONS_MENU_GO_BACK", widgets.UIField.STYLE_NORMAL, 8, function () {

                // update options
                config.getConfig("forceTouch").value = (layout.getButtonByKey(
                    "OPTIONS_CHECKBOX_FORCE_TOUCH").checked === true);

                config.getConfig("animatedTiles").value = (layout.getButtonByKey(
                    "OPTIONS_CHECKBOX_ANIMATED_TILES").checked === true);

                // saveGameConfig options
                configDto.saveGameConfig(saveStep1);
            });

        sfxButton = layout.getButtonByKey("OPTIONS_SFX_VOL");
        musicButton = layout.getButtonByKey("OPTIONS_MUSIC_VOL");
    }
};

// ------------------------------------------------------------------------------------------------


var keyboard = require("../input/keyboard").backend;
var gamepad = require("../input/gamepad").backend;

var input = require("../input");
var inputDto = require("../dataTransfer/keyMapping");

var mappingKeys;
var index = 0;

exports.mode = 0;

exports.state = {

    id: "REMAP_KEY_MAPPING",
    last: "OPTIONS",

    enter: function () {
        // TODO handling for gamePad mode ?
        var map = keyboard.mapping;
        mappingKeys[0].text = input.codeToChar(map.RIGHT);
        mappingKeys[1].text = input.codeToChar(map.LEFT);
        mappingKeys[2].text = input.codeToChar(map.DOWN);
        mappingKeys[3].text = input.codeToChar(map.UP);
        mappingKeys[4].text = input.codeToChar(map.ACTION);
        mappingKeys[5].text = input.codeToChar(map.CANCEL);
    },

    genericInput: function (keyCode) {

        var code = null;
        switch (index) {
            case 0: code = "RIGHT"; break;
            case 1: code = "LEFT"; break;
            case 2: code = "DOWN"; break;
            case 3: code = "UP"; break;
            case 4: code = "ACTION"; break;
            case 5: code = "CANCEL"; break;
        }

        assert(code);

        // set string conversion of code into the field
        mappingKeys[index].text = (exports.mode === 0)? input.codeToChar(keyCode) : keyCode;
        ((exports.mode === 0)? keyboard.MAPPING : gamepad.MAPPING)[code] = keyCode;

        this.doRender();

        // increase index
        index++;
        if (index >= mappingKeys.length) {

            // release generic input request
            input.genericInput = false;
        }
    },

    init: function (layout) {
        exports.mode = 0;

        mappingKeys = [
            layout.getButtonByKey("VALUE_R"),
            layout.getButtonByKey("VALUE_L"),
            layout.getButtonByKey("VALUE_D"),
            layout.getButtonByKey("VALUE_U"),
            layout.getButtonByKey("VALUE_A"),
            layout.getButtonByKey("VALUE_C")
        ];
    },

    doLayout: function (layout) {
        var h = parseInt((constants.SCREEN_HEIGHT - 16) / 2, 10);
        var w = parseInt((constants.SCREEN_WIDTH - 12) / 2, 10);

        layout

            .addRowGap(h)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(4, 2, 0, "OPTIONS_KEYMAP_RIGHT", widgets.UIField.STYLE_NW, 8)
            .addButton(8, 2, 0, "VALUE_R", widgets.UIField.STYLE_NE, 8)
            .breakLine()

            .addColGap(w)
            .addButton(4, 2, 0, "OPTIONS_KEYMAP_LEFT", widgets.UIField.STYLE_W, 8)
            .addButton(8, 2, 0, "VALUE_L", widgets.UIField.STYLE_E, 8)
            .breakLine()

            .addColGap(w)
            .addButton(4, 2, 0, "OPTIONS_KEYMAP_DOWN", widgets.UIField.STYLE_W, 8)
            .addButton(8, 2, 0, "VALUE_D", widgets.UIField.STYLE_E, 8)
            .breakLine()

            .addColGap(w)
            .addButton(4, 2, 0, "OPTIONS_KEYMAP_UP", widgets.UIField.STYLE_W, 8)
            .addButton(8, 2, 0, "VALUE_U", widgets.UIField.STYLE_E, 8)
            .breakLine()

            .addColGap(w)
            .addButton(4, 2, 0, "OPTIONS_KEYMAP_ACTION", widgets.UIField.STYLE_W, 8)
            .addButton(8, 2, 0, "VALUE_A", widgets.UIField.STYLE_E, 8)
            .breakLine()

            .addColGap(w)
            .addButton(4, 2, 0, "OPTIONS_KEYMAP_CANCEL", widgets.UIField.STYLE_SW, 8)
            .addButton(8, 2, 0, "VALUE_C", widgets.UIField.STYLE_ES, 8)
            .breakLine()

            // -------------------------------------------------------

            .addRowGap(2)

            // -------------------------------------------------------

            .addColGap(w)
            .addButton(5, 2, 0, "OPTIONS_KEYMAP_GOBACK", widgets.UIField.STYLE_NORMAL, 8, function () {
                inputDto.saveGameConfig();
                this.changeState("OPTIONS");
            })
            .addColGap(2)
            .addButton(5, 2, 0, "OPTIONS_KEYMAP_SET", widgets.UIField.STYLE_NORMAL, 8, function () {

                // setup generic input request
                input.genericInput = true;
                index = (exports.mode === 0)? 0 : 4;
            });
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "INGAME_ENTER",

    enter: function () {
        stateData.inGameRound = true;
        renderer.hideNativeCursor();

        if (constants.DEBUG) console.log("entering game round");

        var that = this;

        // 1. loadGameConfig map
        gamePers.initMap(roundDTO.getSelectMap(),false, function () {
            roundDTO.selectMap(null);

            // 2. change game data by the given configuration
            roundDTO.postProcess();
            fog.fullRecalculation();
            turn.startsTurn(model.turnOwner);

            // 3. update screen
            renderer.layerUI.clear();
            tileVariants.updateTileSprites();

            // 4. render screen
            renderer.renderScreen();
            renderer.renderCursor();

            actions.localAction("nextTurn", 1);
        });

        /*
         controller.commandStack_resetData();

         // start first turn
         if (model.round_turnOwner === -1) {
         model.events.gameround_start();
         controller.commandStack_localInvokement("nextTurn_invoked");
         if (controller.network_isHost()) model.events.weather_calculateNext();
         }
         */
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "INGAME_LEAVE",

    enter: function () {
        stateData.inGameRound = false;
        renderer.showNativeCursor();

        if (constants.DEBUG) console.log("exiting game round");
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "INGAME_FLUSH_ACTION",

    enter: function () {
        var trapped = stateData.buildFromData();
        var next = null;

        if (!trapped && stateData.action.object.multiStepAction) {
            stateData.multiStepActive = true;

            /*
             if( !controller.stateMachine.data.breakMultiStep ){
             controller.stateMachine.event("nextStep");
             } else {
             controller.stateMachine.event("nextStepBreak");
             }
             */

            next = "INGAME_MULTISTEP_IDLE";
        } else {
            next = "INGAME_IDLE";
        }

        this.changeState(next);
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "INGAME_IDLE",

    enter: function () {
        stateData.source.clean();
        stateData.target.clean();
        stateData.targetselection.clean();
    },

    ACTION: function () {
        var x = stateData.cursorX;
        var y = stateData.cursorY;

        stateData.source.set(x, y);
        stateData.target.set(x, y);

        this.changeState("INGAME_MOVEPATH");
    },

    CANCEL: function () {
        var x = stateData.cursorX;
        var y = stateData.cursorY;
        stateData.source.set(x, y);

        // go into attack range when a battle unit is selected
        var unit = stateData.source.unit;
        if (unit && (attack.hasMainWeapon(unit) || attack.hasSecondaryWeapon(unit) )) {
            this.changeState("INGAME_SHOW_ATTACK_RANGE");

        } else {
            stateData.source.clean();
        }
    }
};

// ------------------------------------------------------------------------------------------------


var updateMenuData = function () {
    stateData.menu.selectedIndex = renderer.getMenuIndex();
    renderer.renderMenu();
    renderer.layerUI.renderLayer(0);
};

exports.state = {
    id: "INGAME_MENU",

    enter: function () {
        renderer.showNativeCursor();

        stateData.menu.clean();
        stateData.menu.generate();

        // go back when no entries exists
        if (stateData.menu.getSize() === 0) {
            this.changeState("INGAME_IDLE");

        } else {
            renderer.resetMenuShift();
            renderer.layerUI.clear(0);
            renderer.prepareMenu(stateData.menu);
            renderer.layerUI.renderLayer(0);
        }
    },

    exit: function () {
        renderer.hideNativeCursor();
        renderer.layerUI.clear(0);
        renderer.layerUI.clear();
        // FIXME: renderer can use stateData to grab cursor pos
        renderer.renderCursor(stateData.cursorX, stateData.cursorY);
    },

    inputMove: function (x, y) {
        renderer.updateMenuIndex(x, y);
        updateMenuData();
    },

    UP: function () {
        var res = renderer.handleMenuInput(input.TYPE_UP);
        if (res === 2) renderer.prepareMenu();
        if (res >= 1) updateMenuData();
    },

    DOWN: function () {
        var res = renderer.handleMenuInput(input.TYPE_DOWN);
        if (res === 2) renderer.prepareMenu();
        if (res >= 1) updateMenuData();
    },

    ACTION: function () {
        var actName = stateData.menu.getContent();
        var actObj = action.getAction(actName);

        // select action in data
        stateData.action.selectedEntry = actName;
        stateData.action.object = actObj;

        // calculate next state from the given action object
        var next = null;
        if (actObj.prepareMenu !== null) {
            next = "INGAME_SUBMENU";
        } else if (actObj.isTargetValid !== null) {
            next = "INGAME_SELECT_TILE";
        } else if (actObj.prepareTargets !== null && actObj.targetSelectionType === "A") {
            next = "INGAME_SELECT_TILE_TYPE_A";
        } else {
            next = "INGAME_FLUSH_ACTION";
        }

        if (constants.DEBUG) assert(next);
        this.changeState(next);
    },

    CANCEL: function () {
        var unit = stateData.source.unit;
        var next = null;

        if (unit && unit.owner.activeClientPlayer) {
            // unit was selected and it is controlled by the active player, so it means that this unit is the acting unit
            // -> go back to *INGAME_MOVEPATH* state without erasing the existing move data

            stateData.preventMovePathGeneration = true;
            next = "INGAME_MOVEPATH";

        } else {
            next = "INGAME_IDLE";
        }

        if (constants.DEBUG) assert(next);
        this.changeState(next);
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "INGAME_MULTISTEP_IDLE",

    enter: function () {
        stateData.inMultiStep = false;
    }
};

// ------------------------------------------------------------------------------------------------

var setMovePathTarget = function () {
    var x = stateData.cursorX;
    var y = stateData.cursorY;

    // selected tile is not in the selection -> ignore action
    if (stateData.selection.getValue(x, y) < 0) {
        return;
    }

    var ox = stateData.target.x;
    var oy = stateData.target.y;
    var dis = model.getDistance(ox, oy, x, y);

    stateData.target.set(x, y);

    if (dis === 1) {

        // Try to add the cursor move as code to the move path
        move.addCodeToMovePath(
            move.codeFromAtoB(ox, oy, x, y),
            stateData.movePath,
            stateData.selection,
            stateData.source.x,
            stateData.source.y
        );

    } else {

        // Generate a complete new path because between the old tile and the new tile is at least another one tile
        move.generateMovePath(
            stateData.source.x,
            stateData.source.y,
            x,
            y,
            stateData.selection,
            stateData.movePath
        );
    }

    // TODO render new path
    renderer.layerEffects.clearAll();
    renderer.renderMovePath();
    renderer.layerEffects.renderLayer(0);
};

exports.state = {
    id: "INGAME_MOVEPATH",

    enter: function () {
        stateData.focusMode = image.Sprite.FOCUS_MOVE;

        // when we do back steps in the game flow then we don't want to recreate an already created move way
        if (stateData.preventMovePathGeneration) {
            stateData.preventMovePathGeneration = false;
            return;
        }

        var breakMove = false;

        if (model.isTurnOwnerObject(stateData.source.unit) && stateData.source.unit.canAct) {

            // prepare move map and clean way
            stateData.movePath.clear();

            move.fillMoveMap(
                stateData.source,
                stateData.selection,
                stateData.source.x,
                stateData.source.y,
                stateData.source.unit
            );

            // go directly into action menu when the unit cannot move
            if (!stateData.selection.hasActiveNeighbour(stateData.source.x, stateData.source.y)) {
                breakMove = true;
            }
        } else {
            breakMove = true;
        }

        if (breakMove) {
            this.changeState("INGAME_MENU");
        } else {
            renderer.renderFocusOnScreen();
        }
    },

    exit: function () {
        stateData.focusMode = constants.INACTIVE;

        renderer.layerEffects.clear();
        renderer.layerFocus.clearAll();
        stateData.selection.clear();
    },

    inputMove: function (x, y) {
        var ox = stateData.cursorX;
        var oy = stateData.cursorY;

        stateData.setCursorPosition( renderer.convertToTilePos(x), renderer.convertToTilePos(y), true);

        var nx = stateData.cursorX;
        var ny = stateData.cursorY;
        if (ox != nx || oy || ny) setMovePathTarget();
    },

    UP: function () {
        stateData.moveCursor(move.MOVE_CODES_UP);
        setMovePathTarget();
    },

    DOWN: function () {
        stateData.moveCursor(move.MOVE_CODES_DOWN);
        setMovePathTarget();
    },

    LEFT: function () {
        stateData.moveCursor(move.MOVE_CODES_LEFT);
        setMovePathTarget();
    },

    RIGHT: function () {
        stateData.moveCursor(move.MOVE_CODES_RIGHT);
        setMovePathTarget();
    },

    ACTION: function () {
        var x = stateData.cursorX;
        var y = stateData.cursorY;
        var ox = stateData.target.x;
        var oy = stateData.target.y;
        var dis = model.getDistance(ox, oy, x, y);

        if (dis === 0 || cfgFastClick.value === 1) {
            this.changeState("INGAME_MENU");
        }
    },

    CANCEL: function () {
        this.changeState("INGAME_IDLE");
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "INGAME_SELECT_TILE",

    enter: function () {
        stateData.targetselection.clean();

        /*
         var prepareSelection = this.data.action.object.prepareSelection;
         if (prepareSelection) prepareSelection(this.data);
         else this.data.selectionRange = 1;
         */
    },

    ACTION: function () {
        if (stateData.action.object.isTargetValid(stateData.cursorX, stateData.cursorY)) {
            gameData.targetselection.set(stateData.cursorX, stateData.cursorY);
            this.changeState("INGAME_FLUSH_ACTIONS");
        }
    },

    CANCEL: function () {
        this.changeState("INGAME_MENU");
    }
};

// ------------------------------------------------------------------------------------------------

// State that shows the attack range of an unit object. If the unit is a direct attacking unit, then the
// attack range is moving range + attack range together, to show every field that will be attack able. Otherwise
// only the attack range will be shown.
//
exports.state = {
    id: "INGAME_SHOW_ATTACK_RANGE",

    enter: function () {
        stateData.focusMode = image.Sprite.FOCUS_ATTACK;
        attack.fillRangeMap(stateData.source.unit, stateData.source.x, stateData.source.y, stateData.selection);
        renderer.renderFocusOnScreen();
    },

    exit: function () {
        renderer.layerEffects.clear();
        renderer.layerFocus.clearAll();
        stateData.selection.clear();
    },

    CANCEL: function () {
        stateData.focusMode = constants.INACTIVE;
        this.changeState("INGAME_IDLE");
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "INGAME_SUBMENU",

    enter: function () {
        renderer.showNativeCursor();

        stateData.menu.clean();
        stateData.menu.generateSubMenu();

        // go back when no entries exists
        if (stateData.menu.getSize() === 0) {
            throw Error("sub menu cannot be empty");
        }

        renderer.resetMenuShift();
        renderer.layerUI.clear(0);
        renderer.prepareMenu(stateData.menu);
        renderer.layerUI.renderLayer(0);
    },

    inputMove: menuState.state.inputMove,

    UP: menuState.state.UP,

    DOWN: menuState.state.DOWN,

    exit: function () {
        renderer.hideNativeCursor();
        renderer.layerUI.clear(0);
        renderer.layerUI.clear();
        // FIXME: renderer can use stateData to grab cursor pos
        renderer.renderCursor(stateData.cursorX, stateData.cursorY);
    },

    ACTION: function () {
        if (!stateData.menu.isEnabled()) {
            return;
        }

        var actName = stateData.menu.getContent();

        if (actName === "done") {
            this.changeState("INGAME_IDLE");
            return;
        }

        stateData.action.selectedSubEntry = actName;
        var actObj = action.getAction(stateData.action.selectedEntry);

        var next = null;
        if (actObj.prepareTargets && actObj.targetSelectionType === "B") {
            stateData.generateTargetSelectionFocus();
            next = "INGAME_SELECT_TILE_TYPE_B";
        } else {
            next = "INGAME_FLUSH_ACTION";
        }

        if (constants.DEBUG) assert(next);
        this.changeState(next);
    },

    CANCEL: function () {
        this.changeState("INGAME_MENU");
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "INGAME_SELECT_TILE_TYPE_A",

    enter: function () {
        stateData.targetselection.clean();
        stateData.focusMode = image.Sprite.FOCUS_MOVE;
        renderer.renderFocusOnScreen();
    },

    exit: function () {
        renderer.layerEffects.clear();
        renderer.layerFocus.clearAll();
        stateData.selection.clear();
    },

    ACTION: function (gameData) {
        if (stateData.selection.getValue(stateData.cursorX, stateData.cursorY) >= 0) {
            stateData.targetselection.set(stateData.cursorX, stateData.cursorY);
            this.changeState("INGAME_FLUSH_ACTIONS");
        }
    },

    CANCEL: function (gameData) {
        this.changeState("INGAME_MENU");
    }
}

// ------------------------------------------------------------------------------------------------

exports.state = Object.create(targetSelectA.state);
exports.state.id = "INGAME_SELECT_TILE_TYPE_B";

// ------------------------------------------------------------------------------------------------


var COOL_DOWN_PER_TICK = 100;

var BAR_HEIGHT = 20;
var BAR_WIDTH = 80;
var BAR_PADDDING = 5;

var BOX_WIDTH = 20 + BAR_WIDTH;
var BOX_HEIGHT = 20 * BOX_HEIGHT + 19 * BAR_PADDDING + 20;

var constants = require("../constants");

var coolDown;
var curP;
var targetP;
var screenX;
var screenY;

exports.state = {

    id: "ANIMATION_CAPTURE_PROPERTY",

    nextState: "INGAME_IDLE",

    states: 1,

    enter: function(x, y, curPoints, nextPoints) {
        // TODO: move start position if the capture box would go out of bounds

        screenX = x - renderer.screenOffsetX;
        screenY = y - renderer.screenOffsetY;
        curP = curPoints;
        targetP = nextPoints;
    },

    update: function(delta, lastInput, state) {
        coolDown -= delta;
        if (coolDown <= 0) {
            coolDown = COOL_DOWN_PER_TICK;
            curP += 1;
        }

        return (curP === targetP+1);
    },

    render: function(delta) {
        renderer.layerUI.clear();
        var ctx = renderer.layerUI.getContext();
        var oldStyle = ctx.fillStyle;

        // render
        ctx.fillStyle = "black";
        ctx.fillRect(
            screenX * constants.TILE_BASE,
            screenY * constants.TILE_BASE,
            BAR_WIDTH,
            BOX_HEIGHT
        );

        // render bars
        ctx.fillStyle = "red";
        for (var i = 0; i < curP; i++) {
            ctx.fillRect(
                screenX * constants.TILE_BASE,
                (screenY * constants.TILE_BASE) + BOX_HEIGHT - 10 - (i * (BAR_HEIGHT + BAR_PADDDING)),
                BAR_WIDTH,
                BAR_HEIGHT
            );
        }

        ctx.fillStyle = oldStyle;
    }
};

// ------------------------------------------------------------------------------------------------

var FADE_TIME = 250;

var renderer = require("../renderer");

var fadeLevel;

exports.state = {

    id: "ANIMATION_CHANGE_WEATHER",

    nextState: "INGAME_IDLE",

    states: 2,

    enter: function() {
        fadeLevel = 0;
    },

    update: function(delta, lastInput, state) {
        switch (state) {

            // fade in
            case 0:
                fadeLevel += (delta / FADE_TIME);
                if (fadeLevel > 1) fadeLevel = 1;
                return (fadeLevel === 1);

            // fade out
            case 1:
                fadeLevel -= (delta / FADE_TIME);
                if (fadeLevel < 0) fadeLevel = 0;
                return (fadeLevel === 0);

        }
    },

    render: function(delta) {
        renderer.layerUI.clear();
        var ctx = renderer.layerUI.getContext();

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, renderer.screenWidth, renderer.screenHeight);
    }
};

// ------------------------------------------------------------------------------------------------

var EXPLODE_SOUND = "EXPLODE";
var EXPLODE_SPRITE = "EXPLOSION_GROUND";
var FRAMES = 9;

var TIME_PER_FRAME = 64;

var tx;
var ty;
var currentFrame;
var currentTime;

var explosionImg;

exports.state = {

    id: "ANIMATION_DESTROY_UNIT",
    nextState: "INGAME_IDLE",

    states: 2,

    enter: function(x, y) {
        tx = x - renderer.screenOffsetX;
        ty = y - renderer.screenOffsetY;

        currentTime = 0;
        currentFrame = 0;

        // lazy loadGameConfig explosion image
        if (!explosionImg) {
            explosionImg = images.sprites[EXPLODE_SPRITE];
            debug.assertTrue(explosionImg, "expected an explosion image after lazy loading [destroy unit animation]");
        }
    },

    exit: function() {
        renderer.layerUI.clear();
    },

    update: function(delta, lastInput, state) {
        switch (state) {

            // play destroy sound
            case 0:
                audio.playSound(EXPLODE_SOUND);
                return true;

            // render explosion
            case 1:
                currentTime += delta;
                if (currentTime >= TIME_PER_FRAME) {
                    currentFrame += 1;
                }
                return (currentFrame >= FRAMES);
        }
    },

    render: function(delta, state) {
        renderer.layerUI.clear();
        var ctx = renderer.layerUI.getContext();

        ctx.drawImage(explosionImg, tx * constants.TILE_BASE, ty * constants.TILE_BASE);
    }
};

// ------------------------------------------------------------------------------------------------



var SPRITE_BOX_LENGTH = constants.TILE_BASE + constants.TILE_BASE;
var HALF_SPRITE_BOX_LENGTH = constants.TILE_BASE / 2;
var TILES_PER_MS = (8 * constants.TILE_BASE / 1000);

var removeUnitFromLayer;

var unitStartX;
var unitStartY;
var unitPosX;
var unitPosY;
var dustPostX;
var dustPostY;
var unitId;

var movePathIndex;
var moveCode;
var movePath = new circBuff.CircularBuffer(constants.MAX_SELECTION_RANGE);

var isClientVisible;

var animationShift;
var unitSprite;
var unitImage;
var dustSprite;
var dustImage;
var dustAnimTime;
var dustAnimStep;
var imageColorState;
var dustImageDirectionState;
var unitImageDirectionState;

var dustTimerTime = 0;
var dustTimerStep = 0;
var dustTimer = new Timer(3, 30);

var assertIsInIdle = function() {
    assert(unitId === constants.INACTIVE);
    assert(unitPosX === constants.INACTIVE);
    assert(unitPosY === constants.INACTIVE);
    assert(movePath.size === 0);
};

var updateImageStates = function() {
    moveCode = movePath.get(movePathIndex);
    switch (moveCode) {
        case move.MOVE_CODES_UP:
            dustImageDirectionState = image.Sprite.DIRECTION_UP;
            unitImageDirectionState = image.Sprite.UNIT_STATE_UP;
            break;

        case move.MOVE_CODES_RIGHT:
            dustImageDirectionState = image.Sprite.DIRECTION_RIGHT;
            unitImageDirectionState = image.Sprite.UNIT_STATE_RIGHT;
            break;

        case move.MOVE_CODES_DOWN:
            dustImageDirectionState = image.Sprite.DIRECTION_DOWN;
            unitImageDirectionState = image.Sprite.UNIT_STATE_DOWN;
            break;

        case move.MOVE_CODES_LEFT:
            dustImageDirectionState = image.Sprite.DIRECTION_LEFT;
            unitImageDirectionState = image.Sprite.UNIT_STATE_LEFT;
            break;
    }

    unitImage = unitSprite.getImage(imageColorState + unitImageDirectionState);
    dustImage = dustSprite.getImage(dustImageDirectionState);
};

var updateAnimation = function(delta) {
    // if (delta > 16) console.log("tooo slooooow " + delta);

    var next = delta * TILES_PER_MS;
    if (next < 1) next = 1;
    animationShift += next;

    // update move animation timer
    // dustTimer.evalTime(delta);
    dustTimerTime += delta;
    if (dustTimerTime > 30) {
        dustTimerStep += 1;
        dustTimerTime = 0;

        if (dustTimerStep === 3) {
            dustTimerStep = 0;
        }
    }

    // shift reached next tile
    if (animationShift > constants.TILE_BASE) {
        dustPostX = unitPosX;
        dustPostY = unitPosY;
        dustTimerStep = 0;
        dustTimerTime = 0;

        var oldMoveCode = moveCode;

        // update animation position
        switch (moveCode) {
            case move.MOVE_CODES_UP:
                unitPosY--;
                break;
            case move.MOVE_CODES_DOWN:
                unitPosY++;
                break;
            case move.MOVE_CODES_RIGHT:
                unitPosX++;
                break;
            case move.MOVE_CODES_LEFT:
                unitPosX--;
                break;
        }

        movePathIndex++;
        if (movePathIndex >= movePath.size) {
            return true;
        }

        updateImageStates();

        animationShift = (oldMoveCode != moveCode) ? 0 : (animationShift - constants.TILE_BASE);
    }

    return false;
};

// This function cleans the unit from the unit layer.
//
var eraseUnitFromUnitLayer = function() {
    renderer.setHiddenUnitId(unitId);
    renderer.renderUnitsOnScreen();
};

// This function cleans the last animation step picture from the effects layer.
//
var eraseLastPicture = function(ctx) {
    var x = (unitPosX - 2 - renderer.screenOffsetX);
    var y = (unitPosY - 2 - renderer.screenOffsetY);
    var w = (unitPosX + 2 - renderer.screenOffsetX);
    var h = (unitPosY + 2 - renderer.screenOffsetY);

    // check boundaries
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (w === model.mapWidth) w -= 1;
    if (h === model.mapHeight) h -= 1;

    ctx.clearRect(
        x * constants.TILE_BASE,
        y * constants.TILE_BASE, (w - x) * constants.TILE_BASE, (h - y) * constants.TILE_BASE
    );
};

// This function renders the current animation step picture to the effects layer.
//
var renderNewPicture = function(ctx) {

    // check client visibility for the unit and the given tile
    if (!isClientVisible && !model.mapData[unitPosX][unitPosY].visionClient <= 0) {
        return;
    }

    var tx = ((unitPosX - renderer.screenOffsetX) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH;
    var ty = ((unitPosY - renderer.screenOffsetY) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH;

    // ADD SHIFT
    switch (moveCode) {
        case move.MOVE_CODES_UP:
            ty -= animationShift;
            break;
        case move.MOVE_CODES_DOWN:
            ty += animationShift;
            break;
        case move.MOVE_CODES_LEFT:
            tx -= animationShift;
            break;
        case move.MOVE_CODES_RIGHT:
            tx += animationShift;
            break;
    }

    // drawing unit
    ctx.drawImage(
        unitImage,
        SPRITE_BOX_LENGTH * animation.indexUnitAnimation, 0,
        SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH,
        tx, ty,
        SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH
    );

    // drawing dust
    if (dustPostX !== constants.INACTIVE) {
        ctx.drawImage(
            dustImage,
            SPRITE_BOX_LENGTH * dustAnimStep, 0,
            SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH, ((dustPostX - renderer.screenOffsetX) * constants.TILE_BASE) -
            HALF_SPRITE_BOX_LENGTH, ((dustPostY - renderer.screenOffsetY) * constants.TILE_BASE) - HALF_SPRITE_BOX_LENGTH,
            SPRITE_BOX_LENGTH, SPRITE_BOX_LENGTH
        );
    }
};

exports.prepareMove = function(uid, x, y, unitMovePath) {
    var unit = model.units[uid];

    // grab unit color state
    switch (unit.owner.id) {
        case 0:
            imageColorState = image.Sprite.UNIT_RED;
            break;

        case 1:
            imageColorState = image.Sprite.UNIT_BLUE;
            break;

        case 2:
            imageColorState = image.Sprite.UNIT_GREEN;
            break;

        case 3:
            imageColorState = image.Sprite.UNIT_YELLOW;
            break;
    }

    unitPosX = x;
    unitPosY = y;
    unitStartX = x;
    unitStartY = y;
    unitId = uid;
    isClientVisible = unit.owner.clientVisible;
    unitSprite = image.sprites[unit.type.ID];

    dustTimerStep = 0;
    dustTimerTime = 0;

    circBuff.copyBuffer(unitMovePath, movePath);

    movePathIndex = 0;
    updateImageStates();
};

exports.state = {
    id: "ANIMATION_MOVE",
    nextState: "INGAME_IDLE",

    states: 1,

    enter: function() {
        assertIsInIdle();

        renderer.layerEffects.clearAll();

        // grab dust image lazy
        if (!dustSprite) dustSprite = image.sprites["DUST"];

        removeUnitFromLayer = true;
    },

    exit: function() {
        renderer.layerEffects.clear();

        isClientVisible = constants.INACTIVE;
        unitId = constants.INACTIVE;
        unitPosX = constants.INACTIVE;
        unitPosY = constants.INACTIVE;
        unitStartX = constants.INACTIVE;
        unitStartY = constants.INACTIVE;
        dustPostX = -1;
        dustPostY = -1;
        movePathIndex = 0;
        animationShift = 0;
        dustAnimTime = -1;
        dustAnimStep = -1;
        unitSprite = null;
        movePath.clear();

        renderer.setHiddenUnitId(constants.INACTIVE);
        renderer.renderUnitsOnScreen();
    },

    update: function(delta) {
        if (updateAnimation(delta)) {
            var vision = model.units[unitId].type.vision;

            renderer.renderFogCircle(unitStartX, unitStartY, vision);
            renderer.renderFogCircle(unitPosX, unitPosY, vision);

            renderer.renderFogBackgroundLayer();

            return true;
        }
        return false;
    },

    render: function(delta) {
        var ctx = renderer.layerEffects.getContext(0);

        // the unit has to be removed from the unit layer during the animation
        if (removeUnitFromLayer) {
            eraseUnitFromUnitLayer();
            removeUnitFromLayer = false;
        }

        eraseLastPicture(ctx);
        renderNewPicture(ctx);

        renderer.layerEffects.renderLayer(0);
    }
};

// reset data
exports.state.exit();

// ------------------------------------------------------------------------------------------------

var MIDDLE_WAIT_TIME = 500;
var MOVE_PER_MS = parseInt((1 * constants.TILE_BASE) / 1000, 10);
if (MOVE_PER_MS === 0) MOVE_PER_MS = 1;

var BAR_MOVE_PER_MS = MOVE_PER_MS * 4;

var text;
var curX;
var curY;
var curBarX;
var middleX;
var waited;
var inMiddle;

exports.state = {
    id: "ANIMATION_NEXT_TURN",
    nextState: "INGAME_IDLE",

    states: 5,

    enter: function() {
        text = "Day " + model.day;
        curY = 0;
        curBarX = 0;
        curX = 1;
        waited = 0;
        inMiddle = false;

        var ctx = renderer.layerUI.getContext();

        ctx.font = "64pt " + constants.GAME_FONT;

        middleX = parseInt(renderer.screenWidth / 2, 10) - parseInt(ctx.measureText(text).width / 2, 10);
        curY = parseInt(renderer.screenHeight / 2, 10) + 32;

        // TODO play music
        //if (controller.features_client.audioMusic) {
        //	var commanders = model.co_data[model.round_turnOwner].coA;
        //	controller.coMusic_playCoMusic((commanders) ? commanders.music : null);
        //}
    },

    exit: function () {
        renderer.layerUI.clear();
    },

    update: function(delta, lastInput, state) {
        switch(state) {

            // FLY IN BAR
            case 0:
                var factor = curBarX/renderer.screenWidth;
                var move = parseInt(BAR_MOVE_PER_MS * delta * factor, 10);
                if (move <= 0) move = 1;

                curBarX += move;

                return (curBarX > renderer.screenWidth);

            // FLY IN TEXT
            case 1:
                var factor = 1 - (curX/middleX);

                console.log("factor: "+factor);

                var move = parseInt(MOVE_PER_MS * delta * factor, 10);
                if (move <= 0) move = 1;

                curX += move;

                return (curX >= middleX);

            // WAIT IN THE MIDDLE
            case 2:
                waited += delta;

                // go further when you waited a but in the middle of the screen
                return (waited >= MIDDLE_WAIT_TIME);

            // FLY OUT TEXT
            case 3:
                var factor = (curX-middleX)/middleX;
                var move = parseInt(MOVE_PER_MS * delta * factor, 10);
                if (move <= 0) move = 1;

                curX += move;

                return (curX > renderer.screenWidth + 10);

            // FLY OUT BAR
            case 4:
                var factor = curBarX/renderer.screenWidth;
                var move = parseInt(BAR_MOVE_PER_MS * delta * factor, 10);
                if (move <= 0) move = 1;

                curBarX -= move;

                if (curBarX <= 0) {
                    curBarX = 0;
                    return true;
                }
                return false;
        }
    },

    render: function() {
        renderer.layerUI.clear();
        var ctx = renderer.layerUI.getContext();

        ctx.lineWidth = 4;

        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, curY+5, curBarX, 2);

        ctx.fillStyle = "rgb(100,100,100)";
        ctx.fillRect(0, curY+7, curBarX, 1);

        ctx.fillStyle = "rgb(200,200,200)";
        ctx.fillRect(0, curY+8, curBarX, 1);

        if (curX > 1){
            ctx.font = "64pt " + constants.GAME_FONT;

            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fillText(text, curX, curY);

            ctx.fillStyle = "rgb(0,0,0)";
            ctx.strokeText(text, curX, curY);
        }

        ctx.lineWidth = 1;
    }
};

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "ANIMATION_BALLISTIC",

    init: function () {

    },

    enter: function () {

    },

    update: function (delta, lastInput) {

    },

    render: function (delta) {

    }
};

/*
 util.scoped(function(){

 var expl_img;
 var rocket_img;
 var rocket_img_inv;

 function renderSmoke( x,y, step, distance ){
 step -= (distance-1);
 if( step < 0 || step > 9 ) return;

 var tileSize = TILE_LENGTH;
 var scx = 48*step;
 var scy = 0;
 var scw = 48;
 var sch = 48;
 var tcx = (x)*tileSize;
 var tcy = (y)*tileSize;
 var tcw = tileSize;
 var tch = tileSize;

 view.canvasCtx.drawImage(
 expl_img,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos(x,y);
 }

 function checkStatus( x,y ){
 if( model.map_isValidPosition(x,y) ){
 var unit = model.unit_posData[x][y];
 if( unit !== null ){
 controller.updateUnitStatus( model.unit_extractId(unit) );
 }
 }
 }

 view.registerAnimationHook({
 key: "rocketFly",

 prepare: function( x,y, tx,ty,siloId ){
 if( !rocket_img ) rocket_img = view.getInfoImageForType("FLYING_ROCKET");
 if( !rocket_img_inv ) rocket_img_inv = view.getInfoImageForType("FLYING_ROCKET_INV");

 this.siloX   = controller.getCanvasPosX(x);
 this.siloY   = controller.getCanvasPosY(y);
 this.targetX = controller.getCanvasPosX(tx);
 this.targetY = controller.getCanvasPosY(ty);
 this.curX    = this.siloX;
 this.curY    = this.siloY;
 this.phase = 0;
 },

 render: function(){
 var tileSize = TILE_LENGTH;
 var scx = 0;
 var scy = 0;
 var scw = 24;
 var sch = 24;
 var tcx = this.curX;
 var tcy = this.curY;
 var tcw = tileSize +8;
 var tch = tileSize +8;

 if( tcy < 0 ){
 scw += tcy;
 scy -= tcy;
 tcy = 0;
 }

 view.canvasCtx.drawImage(
 (this.phase===0)? rocket_img : rocket_img_inv,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPosWithNeighboursRing(
 parseInt(this.curX/TILE_LENGTH, 10),
 parseInt(this.curY/TILE_LENGTH, 10)
 );
 },

 update: function( delta ){
 var shift = ( delta/1000 ) * ( TILE_LENGTH*14);

 if( this.phase === 0 ){

 // rocket flies up
 this.curY -= shift;

 if( this.curY <= 0 ){
 // controller.setScreenPosition( this.targetX, this.targetY, true );

 this.curX = this.targetX;
 this.curY = 0;
 this.phase = 1;
 }
 }
 else {

 // rocket flies down
 this.curY += shift;

 if( this.curY >= this.targetY ){
 this.phase = 2;
 }
 }
 },

 isDone: function(){
 return (this.phase === 2);
 }
 });

 view.registerAnimationHook({

 key: "explode_invoked",

 prepare: function( tx,ty, range, damage, owner ){
 if( !expl_img ) expl_img = view.getInfoImageForType("EXPLOSION_GROUND");
 controller.audio_playSound("ROCKET_IMPACT");

 this.x = tx;
 this.y = ty;
 this.range = range;
 this.maxStep = 10+range+1;
 this.step = 0;
 this.time = 0;
 },

 render: function(){
 model.map_doInRange( this.x, this.y, this.range, renderSmoke, this.step );
 },

 update: function( delta ){
 this.time += delta;
 if( this.time > 75 ){
 this.step++;
 this.time = 0;
 }
 },

 isDone: function(){
 var done = this.step === this.maxStep;

 // RENDER HP LOST
 if( done ) model.map_doInRange( this.x, this.y, this.range, checkStatus );

 return done;
 }

 });

 view.registerAnimationHook({

 key: "bombs_fireCannon",

 prepare: function( ox,oy,x,y,tp ){
 var type = model.data_tileSheets[tp];

 var fireAnim = type.assets.fireAnimation;
 cwt.assert( fireAnim.length === 5 );

 this.pic     = view.getInfoImageForType(fireAnim[0]);
 this.sizeX   = fireAnim[1];
 this.sizeY   = fireAnim[2];
 this.offsetX = fireAnim[3];
 this.offsetY = fireAnim[4];

 this.curX    = ox;
 this.curY    = oy;

 this.step    = 0;
 this.time    = 0;

 controller.audio_playSound( type.assets.fireSound);
 },

 render: function(){
 var tileSize = TILE_LENGTH;
 var scx = this.sizeX*this.step;
 var scy = 0;
 var scw = this.sizeX;
 var sch = this.sizeY;
 var tcx = (this.curX)*tileSize + this.offsetX;
 var tcy = (this.curY)*tileSize + this.offsetY;
 var tcw = this.sizeX;
 var tch = this.sizeY;

 view.canvasCtx.drawImage(
 this.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 },

 update: function( delta ){
 this.time += delta;
 if( this.time > 100 ){
 this.step++;
 this.time = 0;
 }
 },

 isDone: function(){
 return this.step === 6;
 }

 });

 view.registerAnimationHook({

 key: "bombs_fireLaser",

 prepare: function( ox,oy ){
 // var type = model.data_tileSheets[tp];
 var type = model.property_posMap[ox][oy].type;

 var fireAnimA = type.assets.chargeAnimation;
 var fireAnimB = type.assets.fireAnimation;
 var fireAnimC = type.assets.streamAnimation;
 cwt.assert( fireAnimA.length === 5 );
 cwt.assert( fireAnimB.length === 5 );
 cwt.assert( fireAnimC.length === 5 );
 this.a      = {
 pic     : view.getInfoImageForType(fireAnimA[0]),
 sizeX   : fireAnimB[1],
 sizeY   : fireAnimB[2],
 offsetX : fireAnimB[3],
 offsetY : fireAnimB[4]
 };

 this.b      = {
 pic     : view.getInfoImageForType(fireAnimB[0]),
 sizeX   : fireAnimA[1],
 sizeY   : fireAnimA[2],
 offsetX : fireAnimA[3],
 offsetY : fireAnimA[4]
 };

 this.c      = {
 pic     : view.getInfoImageForType(fireAnimC[0]),
 sizeX   : fireAnimC[1],
 sizeY   : fireAnimC[2],
 offsetX : fireAnimC[3],
 offsetY : fireAnimC[4]
 };

 //W
 fireAnimA = type.assets.chargeAnimation3;
 fireAnimB = type.assets.fireAnimation3;
 fireAnimC = type.assets.streamAnimation3;
 cwt.assert( fireAnimA.length === 5 );
 cwt.assert( fireAnimB.length === 5 );
 cwt.assert( fireAnimC.length === 5 );

 this.a2      = {
 pic     : view.getInfoImageForType(fireAnimA[0]),
 sizeX   : fireAnimB[1],
 sizeY   : fireAnimB[2],
 offsetX : fireAnimB[3],
 offsetY : fireAnimB[4]
 };

 this.b2      = {
 pic     : view.getInfoImageForType(fireAnimB[0]),
 sizeX   : fireAnimA[1],
 sizeY   : fireAnimA[2],
 offsetX : fireAnimA[3],
 offsetY : fireAnimA[4]
 };

 this.c2      = {
 pic     : view.getInfoImageForType(fireAnimC[0]),
 sizeX   : fireAnimC[1],
 sizeY   : fireAnimC[2],
 offsetX : fireAnimC[3],
 offsetY : fireAnimC[4]
 };

 //S
 fireAnimA = type.assets.chargeAnimation2;
 fireAnimB = type.assets.fireAnimation2;
 fireAnimC = type.assets.streamAnimation2;
 cwt.assert( fireAnimA.length === 5 );
 cwt.assert( fireAnimB.length === 5 );
 cwt.assert( fireAnimC.length === 5 );

 this.a3      = {
 pic     : view.getInfoImageForType(fireAnimA[0]),
 sizeX   : fireAnimB[1],
 sizeY   : fireAnimB[2],
 offsetX : fireAnimB[3],
 offsetY : fireAnimB[4]
 };

 this.b3      = {
 pic     : view.getInfoImageForType(fireAnimB[0]),
 sizeX   : fireAnimA[1],
 sizeY   : fireAnimA[2],
 offsetX : fireAnimA[3],
 offsetY : fireAnimA[4]
 };

 this.c3      = {
 pic     : view.getInfoImageForType(fireAnimC[0]),
 sizeX   : fireAnimC[1],
 sizeY   : fireAnimC[2],
 offsetX : fireAnimC[3],
 offsetY : fireAnimC[4]
 };

 //N
 fireAnimA = type.assets.chargeAnimation4;
 fireAnimB = type.assets.fireAnimation4;
 fireAnimC = type.assets.streamAnimation4;
 cwt.assert( fireAnimA.length === 5 );
 cwt.assert( fireAnimB.length === 5 );
 cwt.assert( fireAnimC.length === 5 );

 this.a4      = {
 pic     : view.getInfoImageForType(fireAnimA[0]),
 sizeX   : fireAnimB[1],
 sizeY   : fireAnimB[2],
 offsetX : fireAnimB[3],
 offsetY : fireAnimB[4]
 };

 this.b4      = {
 pic     : view.getInfoImageForType(fireAnimB[0]),
 sizeX   : fireAnimA[1],
 sizeY   : fireAnimA[2],
 offsetX : fireAnimA[3],
 offsetY : fireAnimA[4]
 };

 this.c4      = {
 pic     : view.getInfoImageForType(fireAnimC[0]),
 sizeX   : fireAnimC[1],
 sizeY   : fireAnimC[2],
 offsetX : fireAnimC[3],
 offsetY : fireAnimC[4]
 };

 this.curX    = ox;
 this.curY    = oy;

 this.phase   = 0;
 this.step    = 0;
 this.time    = 0;

 controller.audio_playSound( type.assets.fireSound );
 },

 render: function(){
 var data = (this.phase === 0)? this.a : this.b;
 var data2 = (this.phase === 0)? this.a2 : this.b2;
 var data3 = (this.phase === 0)? this.a3 : this.b3;
 var data4 = (this.phase === 0)? this.a4 : this.b4;

 // E
 var tileSize = TILE_LENGTH;
 var scx = data.sizeX*this.step;
 var scy = 0;
 var scw = data.sizeX;
 var sch = data.sizeY;
 var tcx = (this.curX)*tileSize + data.offsetX;
 var tcy = (this.curY)*tileSize + data.offsetY;
 var tcw = data.sizeX;
 var tch = data.sizeY;
 view.canvasCtx.drawImage(
 data.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 //W
 tileSize = TILE_LENGTH;
 scx = data2.sizeX*this.step;
 scy = 0;
 scw = data2.sizeX;
 sch = data2.sizeY;
 tcx = (this.curX)*tileSize + data2.offsetX;
 tcy = (this.curY)*tileSize + data2.offsetY;
 tcw = data2.sizeX;
 tch = data2.sizeY;
 view.canvasCtx.drawImage(
 data2.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 //S
 tileSize = TILE_LENGTH;
 scx = data3.sizeX*this.step;
 scy = 0;
 scw = data3.sizeX;
 sch = data3.sizeY;
 tcx = (this.curX)*tileSize + data3.offsetX;
 tcy = (this.curY)*tileSize + data3.offsetY;
 tcw = data3.sizeX;
 tch = data3.sizeY;
 view.canvasCtx.drawImage(
 data3.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 //N
 tileSize = TILE_LENGTH;
 scx = data4.sizeX*this.step;
 scy = 0;
 scw = data4.sizeX;
 sch = data4.sizeY;
 tcx = (this.curX)*tileSize + data4.offsetX;
 tcy = (this.curY)*tileSize + data4.offsetY;
 tcw = data4.sizeX;
 tch = data4.sizeY;
 view.canvasCtx.drawImage(
 data4.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );


 // redraw
 view.redraw_markPosWithNeighboursRing(this.curX, this.curY);

 // TODO: streched over all tiles in the cross
 if( data === this.b ){
 data = this.c;
 data2 = this.c2;
 data3 = this.c3;
 data4 = this.c4;

 // E
 scx = data.sizeX*this.step;
 scy = 0;
 scw = data.sizeX;
 sch = data.sizeY;
 for( var ci = this.curX+1, ce=model.map_width; ci < ce; ci++ ){
 tcx = (ci)*tileSize + data.offsetX;
 tcy = (this.curY)*tileSize + data.offsetY;
 tcw = data.sizeX;
 tch = data.sizeY;

 view.canvasCtx.drawImage(
 data.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos( ci, this.curY-1 );
 view.redraw_markPos( ci, this.curY );
 view.redraw_markPos( ci, this.curY+1 );
 }

 // W
 scx = data2.sizeX*this.step;
 scy = 0;
 scw = data2.sizeX;
 sch = data2.sizeY;
 for( var ci = this.curX-1, ce=0; ci >= ce; ci-- ){
 tcx = (ci)*tileSize + data2.offsetX;
 tcy = (this.curY)*tileSize + data2.offsetY;
 tcw = data2.sizeX;
 tch = data2.sizeY;

 view.canvasCtx.drawImage(
 data2.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos( ci, this.curY-1 );
 view.redraw_markPos( ci, this.curY );
 view.redraw_markPos( ci, this.curY+1 );
 }

 // S
 scx = data3.sizeX*this.step;
 scy = 0;
 scw = data3.sizeX;
 sch = data3.sizeY;
 for( var ci = this.curY+1, ce=model.map_height; ci < ce; ci++ ){
 tcx = (this.curX)*tileSize + data3.offsetX;
 tcy = (ci)*tileSize + data3.offsetY;
 tcw = data3.sizeX;
 tch = data3.sizeY;

 view.canvasCtx.drawImage(
 data3.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos( this.curX+1,ci );
 view.redraw_markPos( this.curX,ci );
 view.redraw_markPos( this.curX-1,ci);
 }

 // N
 scx = data4.sizeX*this.step;
 scy = 0;
 scw = data4.sizeX;
 sch = data4.sizeY;
 for( var ci = this.curY-1, ce=0; ci >= 0; ci-- ){
 tcx = (this.curX)*tileSize + data4.offsetX;
 tcy = (ci)*tileSize + data4.offsetY;
 tcw = data4.sizeX;
 tch = data4.sizeY;

 view.canvasCtx.drawImage(
 data4.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos( this.curX+1,ci );
 view.redraw_markPos( this.curX,ci );
 view.redraw_markPos( this.curX-1,ci );
 }
 }
 },

 update: function( delta ){
 this.time += delta;
 if( this.time > 100 ){
 this.step++;
 this.time = 0;

 switch( this.phase ){

 // charge phase
 case 0:
 if( this.step === 10 ){
 this.step = 0;
 this.phase++;
 }

 // fire phase
 case 1:
 if( this.step === 12 ){
 this.step = 0;
 this.phase++;
 }
 }
 }
 },

 isDone: function(){
 return this.phase === 2;
 }

 });

 });
 */

// ------------------------------------------------------------------------------------------------

exports.state = {
    id: "ANIMATION_TRAPPED",

    init: function () {

    },

    enter: function () {

    },

    update: function (delta, lastInput) {

    },

    render: function (delta) {

    }
};

/*
 view.registerAnimationHook({

 key:"trapwait_invoked",

 prepare: function( uid ){
 var unit = model.unit_data[ uid ];
 this.time = 0;
 this.xp = unit.x+1;
 this.yp = unit.y;
 this.x = (unit.x+1) * TILE_LENGTH;
 this.y = unit.y * TILE_LENGTH;
 },

 render: function(){
 var pic = view.getInfoImageForType("TRAPPED");
 view.canvasCtx.drawImage( pic, this.x, this.y );
 },

 update: function( delta ){
 this.time += delta;
 },

 isDone: function(){
 var res = this.time > 1000;
 if( res ){
 var pic = view.getInfoImageForType("TRAPPED");
 var y = this.yp;
 for( var i=this.xp,e=i+( parseInt(pic.width/TILE_LENGTH,10) ); i<=e; i++ ){
 view.redraw_markPos( i , y );
 }
 }
 return res;
 }

 });
 */