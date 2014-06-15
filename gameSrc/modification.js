"use strict";

cwt.ArmySheet.registerSheet({
  "ID": "BLMN",
  "name": "Blue Moon",
  "color": 1,
  "music": cwt.MOD_PATH + "music/BlueMoonTheme.mp3"
});
cwt.ArmySheet.registerSheet({
  "ID": "GRET",
  "name": "Green Earth",
  "color": 2,
  "music": cwt.MOD_PATH + "music/GreenEarthTheme.mp3"
});
cwt.ArmySheet.registerSheet({
  "ID": "ORST",
  "name": "Orange Star",
  "color": 0,
  "music": cwt.MOD_PATH + "music/OrangeStarTheme.mp3"
});
cwt.ArmySheet.registerSheet({
  "ID": "YLCM",
  "name": "Yellow Comet",
  "color": 3,
  "music": cwt.MOD_PATH + "music/YellowCometTheme.mp3"
});

cwt.CoSheet.registerSheet({

  "ID": "ANDY",
  "faction": "ORST",
  "music": cwt.MOD_PATH + "music/Andy.mp3",
  "coStars": 3,
  "scoStars": 3,

  "effectMovepoints": function (value, player) {
    if (player.isPowerActive(cwt.Player.POWER_LEVEL_SCOP)) {
      return value + 1;
    } else {
      return value;
    }
  },

  "effectAttack": function (value, player) {
    if (player.isPowerActive(cwt.Player.POWER_LEVEL_SCOP)) {
      return value + 30;
    } else {
      return value;
    }
  }
});
cwt.CoSheet.registerSheet({

  "ID": "MAX",
  "faction": "BLMN",
  "music": cwt.MOD_PATH + "music/Max.mp3",
  "coStars": 3,
  "scoStars": 3

  /*
   "d2d"      : [
   {
   "$when":[
   "ATTACK_TYPE",["DIRECT"]
   ],
   "att":20
   },

   {
   "$when":[
   "ATTACK_TYPE",["INDIRECT"]
   ],
   "maxrange":-1
   }
   ],
   "cop" : {
   "turn":[
   {
   "$when":[
   "ATTACK_TYPE",["DIRECT"]
   ],
   "att":40
   }
   ],
   "power":{}
   },
   "scop" : {
   "turn":[
   {
   "$when":[
   "ATTACK_TYPE",["DIRECT"]
   ],
   "att":70
   }
   ],
   "power":{}
   }
   */
});
cwt.CoSheet.registerSheet({
  "ID": "SAMI",
  "faction": "ORST",
  "music": cwt.MOD_PATH + "music/sami.mp3",
  "coStars": 3,
  "scoStars": 5
  /*
   "d2d"      : [
   {
   "$when":[
   "ATTACK_TYPE",["DIRECT"]
   ],
   "att":-10
   },
   {
   "$when":[
   "MOVE_TYPE",["MV_INFT","MV_MECH"]
   ],
   "att":30,
   "movepoints":1,
   "captureRate":50
   }
   ],
   "cop" : {
   "turn":[
   {
   "$when":[
   "MOVE_TYPE",["MV_INFT","MV_MECH"]
   ],
   "att":40,
   "movepoints":1
   }
   ],
   "power":{}
   },
   "scop" : {
   "turn":[
   {
   "$when":[
   "MOVE_TYPE",["MV_INFT","MV_MECH"]
   ],
   "att":70,
   "movepoints":2,
   "captureRate":9999
   }
   ],
   "power":{}
   }
   */
});

cwt.Localization.registerLang({
  "INFT": "Infantry",
  "MECH": "Mech. Infantry",
  "TNTK": "Tank",
  "NTNK": "Neotank",
  "MDTK": "Md. Tank",
  "WRTK": "War Tank",
  "ARTY": "Artillery",
  "RCKT": "Rocket Launcher",
  "RECN": "Recon",
  "BIKE": "Bike",
  "AAIR": "Anti-Air",
  "APCR": "APC",
  "MISS": "Missiles",
  "BCTR": "Battle Copter",
  "BMBR": "Bomber",
  "BKBM": "Black Bomb",
  "TCTR": "Transport Copter",
  "FGTR": "Fighter",
  "STLH": "Stealth",
  "SEAP": "Seaplane",
  "SUBM": "Submarine",
  "CRUS": "Cruiser",
  "ACAR": "Aircraft Carrier",
  "LNDR": "Lander",
  "BSHP": "Battleship",

  "PLIN": "Plain",
  "MNTN": "Mountain",
  "FRST": "Forrest",

  "ROAD": "Road",
  "BASE": "Base",
  "HQTR": "Headquarter",
  "BHMCE": "Mini-Cannon (East)",
  "BHMCN": "Mini-Cannon (Nord)",
  "BHMCS": "Mini-Cannon (South)",
  "BHMCW": "Mini-Cannon (West)",
  "PQRT": "SeaPort",
  "APRT": "Airport",

  "CTPR": "Capture Property",
  "UNUN": "Unload Unit",
  "LODU": "Load Unit",
  "NXTR": "End Turn",
  "WTUN": "Wait",
  "JNUN": "Join",
  "subWeapon": "Sub Weapon",
  "mainWeapon": "Main Weapon",
  "SLFR": "Launch Rocket",
  "GMTP": "Send Money to Player",
  "GPTP": "Send Property to Player",
  "GUTP": "Send Unit to Player",
  "SPPL": "Supply",
  "ATUN": "Attack",
  "BDUN": "Build Unit",
  "HIUN": "Hide Unit",
  "UHUN": "Unhide Unit",
  "ANCP": "Activate CO Power",
  "ASCP": "Activate Co Super Power",
  "yes": "Yes",
  "no": "No",
  "ok": "Ok",
  "left": "Left",
  "right": "Right",
  "up": "Up",
  "down": "Down",
  "action": "Action",
  "cancel": "Cancel",
  "done": "Done",
  "day": "Day",
  "propertyCaptured": "The property was captured",
  "propertyPointsLeft": "Property capturing... Left points:",
  "capturePoints": "Property Points",
  "defense": "Tile Defense",
  "health": "Health",
  "ammo": "Ammo",
  "fuel": "Fuel",
  "weatherChange": "Weather changes to",
  "SUN": "Sun",
  "RAIN": "Rain",
  "SNOW": "Snow",
  "gameHasEnded": "The game has ended because only one team is left",

  "activatePower": "Activate Power",
  "cop": "Co Power",
  "scop": "Super Co Power",
  "attack": "Attack",
  "buildUnit": "Build",
  "capture": "Capture",
  "transferMoney": "Transfer Money",
  "transferProperty": "Transfer Property",
  "transferUnit": "Transfer Unit",
  "hideUnit": "Hide",
  "unhideUnit": "Unhide",
  "joinUnits": "Join",
  "loadUnit": "Load",
  "unloadUnit": "Unload",
  "nextTurn": "End Turn",
  "silofire": "Fire Silo",
  "supplyUnit": "Supply",
  "wait": "Wait",
  "doExplosion": "Explode",

  "loading.loadMaps": "Loading Maps",
  "loading.loadImages": "Loading Images",
  "loading.cropImages": "Cropping Images",
  "loading.colorizeImages": "Colorize Images",
  "loading.loadSounds": "Loading Sounds",
  "loading.prepareInput": "Preparing Input Systems",
  "loading.prepareLanguage": "Localize Strings",
  "loading.done": "Complete",

  "menu.header": "Menu",
  "menu.version": "Version",

  "player": "Player",

  "config.type.prev": "<<",
  "config.type.next": ">>",
  "config.co.prev": "<<",
  "config.co.next": ">>",
  "config.team.next": ">>",
  "config.team.prev": "<<",

  "config.playerCo": "CO",
  "config.playerType": "Type",
  "config.playerTeam": "Team",

  "config.next": "Start Game",

  "config.player.off": "Free",
  "config.player.disabled": "-",
  "config.player.co.none": "None",
  "config.player.AI": "AI",
  "config.player.human": "Human",

  "message.panel.header": "Message",

  "versus.playerconfig": "Player Configuration",
  "versus.mapSelection": "Select Map",
  "versus.next": "Game Configuration",
  "versus.prevMap": "Previous Map",
  "versus.nextMap": "Next Map",

  "error.panel.action": "Reset Game-Data?",
  "error.panel.header": "Fatal Error",
  "error.panel.reason": "Reason",
  "error.panel.data": "Data",
  "error.panel.no": "No",
  "error.panel.yes": "Yes",

  "MAIN_MENU_OPTIONS": "Options",
  "MAIN_MENU_NETWORK": "Network Game",
  "MAIN_MENU_SKIRMISH": "Singleplayer",
  "MAIN_MENU_TEST_WEATHER": "Weather-Test",

  "OPTIONS_SFX_VOL_DOWN": "-",
  "OPTIONS_SFX_VOL_UP": "+",
  "OPTIONS_MUSIC_VOL_DOWN": "-",
  "OPTIONS_MUSIC_VOL_UP": "+",
  "OPTIONS_CHECKBOX_ANIMATED_TILES_TEXT": "Animated Tiles",
  "OPTIONS_CHECKBOX_FORCE_TOUCH_TEXT": "Force Touch Controls",
  "OPTIONS_MENU_CHANGE_KEYBOARD_LAYOUT": "Remap Keyboard",
  "OPTIONS_MENU_CHANGE_GAMEPAD_LAYOUT": "Remap Gamepad",
  "OPTIONS_MENU_WIPE_OUT": "Reset Data",
  "OPTIONS_MENU_GO_BACK": "Go Back",

  "OPTIONS_WIPE_OUT_TEXT": "Do you want to erase all game data? The game\ndata will be downloaded during the next start\nof the game.",
  "OPTIONS_WIPE_OUT_NO": "Cancel",
  "OPTIONS_WIPE_OUT_YES": "Do It",

  "OPTIONS_KEYMAP_RIGHT": "Right",
  "OPTIONS_KEYMAP_LEFT": "Left",
  "OPTIONS_KEYMAP_DOWN": "Down",
  "OPTIONS_KEYMAP_UP": "Up",
  "OPTIONS_KEYMAP_ACTION": "Action",
  "OPTIONS_KEYMAP_CANCEL": "Cancel",

  "MAP_SELECT_PAGE_LEFT": "<<",
  "MAP_SELECT_PAGE": "",
  "MAP_SELECT_PAGE_RIGHT": ">>",
  "MENU_BACK": "Back",
  "MENU_RIGHT": ">>",
  "MENU_LEFT": "<<",
  "MENU_NEXT": "Next",
  "MENU_CONFIGURED_MATCH": "Configured Match",
  "MENU_FAST_MATCH": "Fast Match",

  "PLAYER_CONFIG_SLOT1": "Slot 1",
  "PLAYER_CONFIG_SLOT2": "Slot 2",
  "PLAYER_CONFIG_SLOT3": "Slot 3",
  "PLAYER_CONFIG_SLOT4": "Slot 4",

  "PLAYER_CONFIG_NAME": "Name",
  "PLAYER_CONFIG_TYPE": "Type",
  "PLAYER_CONFIG_TEAM": "Team",
  "PLAYER_CONFIG_CO_A": "Main CO",
  "PLAYER_CONFIG_GAMEMODE": "Gamemode",

  "VALUE_R": "",
  "VALUE_L": "",
  "VALUE_U": "",
  "VALUE_D": "",
  "VALUE_A": "",
  "VALUE_C": "",

  "co_getStarCost": "Star Costs",
  "co_getStarCostIncrease": "Star Costs Increase",
  "co_getStarCostIncreaseSteps": "Star C. Incr. Steps",
  "co_enabledCoPower": "Co Powers",
  "fogEnabled": "Fog Mode",
  "daysOfPeace": "Days of Peace",
  "weatherMinDays": "Weather min. duration",
  "weatherRandomDays": "Weather max. duration",
  "noUnitsLeftLoose": "Loose without units",
  "autoSupplyAtTurnStart": "Turn Start Auto-Supply",
  "round_dayLimit": "Day limit",
  "unitLimit": "Unit Limit",
  "captureLimit": "Capture Limit",
  "timer_turnTimeLimit": "Turn Time (Min.)",
  "timer_gameTimeLimit": "Game Time (Min.)",

  "OPTIONS_KEYMAP_GOBACK": "Go Back",
  "OPTIONS_KEYMAP_SET": "Remap Keys",

  "TOOLTIP_1": "Change the keyboard and gamepad settings by selecting\nOptions from the main or in-game menu",
  "TOOLTIP_2": "Activate zooming the map by using the scroll wheel for\nthe mouse, pinching for touch screen, and the in-game menu.",
  "TOOLTIP_3": "Press and hold Cancel over an idle unit to see\nits attack range.",
  "TOOLTIP_4": "Perform Cancel by right-clicking with mouse, or\ndouble-tapping for touch screen.",
  "TOOLTIP_5": "Keyboard and game-pad controls can be changed via\nthe Options Menu.",
  "TOOLTIP_6": "Perform Action by lieft-clicking with the mouse,\nor tapping the touch screen.",
  "TOOLTIP_7": "Reporting bugs to the developers can be done\nthrough the Mailing List or the forum.",
  "TOOLTIP_8": "Custom Wars Tactics concept started in January 2009.\nThe original name for the project was called 'Tactic Wars'.",
  "TOOLTIP_9": "Custom Wars Tactics is playable from PC and also\nfrom mobile devices.",
  "TOOLTIP_10": "Custom Wars Tactics can be played offline in your\nbrowser. (As long you aren't in private browsing mode.)",
  "TOOLTIP_11": "A full desktop counterpart for Custom Wars Tactics\nis being developed. Stay tuned!"
});
cwt.Localization.registerLang({
  "INFT": "Infanterie",
  "MECH": "Mech. Infanterie",
  "TNTK": "Leichter Panzer",
  "MDTK": "Kampfpanzer",
  "WRTK": "Schw. Panzer",
  "NTNK": "Neo Panzer",
  "ARTY": "Artillerie",
  "RCKT": "Raketenwerfer",
  "RECN": "Aufklärer",
  "BIKE": "Mot. Aufklärer",
  "AAIR": "Luftabwehr-Panzer",
  "APCR": "Versorgunsfahrz.",
  "MISS": "Luftabwehr-Raketenw.",
  "BCTR": "Kampfhubschrauber",
  "BMBR": "Bomber",
  "BKBM": "S-Bombe",
  "TCTR": "Transporthubschrauber",
  "FGTR": "Jet",
  "STLH": "Tarnkappenbomber",
  "SEAP": "Kampfjet",
  "SUBM": "U-Boot",
  "CRUS": "Kreuzer",
  "ACAR": "Flugzeugträger",
  "LNDR": "Transportboot",
  "BSHP": "Schlachtschiff",

  "PLIN": "Wiese",
  "MNTN": "Berg",
  "FRST": "Wald",

  "ROAD": "Straße",
  "BASE": "Fabrik",
  "HQTR": "Hauptquartiert",
  "BHMCE": "Mini-Kanone (Ost)",
  "BHMCN": "Mini-Kanone (Nord)",
  "BHMCS": "Mini-Kanone (Süd)",
  "BHMCW": "Mini-Kanone (West)",
  "PQRT": "Hafen",
  "APRT": "Flughafen",

  "CTPR": "Besetze Geb&auml;ude",
  "UNUN": "Einheit ausladen",
  "LODU": "Einheit einladen",
  "NXTR": "Beende Zug",
  "WTUN": "Warten",
  "JNUN": "Einheiten Vereinen",
  "subWeapon": "Zweitwaffe",
  "mainWeapon": "Hauptwaffe",
  "SLFR": "Rakete abfeuern",
  "GMTP": "Geld an Spieler abtreten",
  "GPTP": "Gebäude an Spieler abtreten",
  "GUTP": "Einheit an Spieler abtreten",
  "SPPL": "Einheiten Versorgen",
  "ATUN": "Angreifen",
  "BDUN": "Einheit produzieren",
  "HIUN": "Einheit tarnen",
  "UHUN": "Einheit enttarnen",
  "ANCP": "Co Kraft aktivieren",
  "ASCP": "Co Superkraft aktivieren",
  "CTPR.desc": "Besetzt das angegebene Geb&auml;ude. Wenn die Einheit die Eroberungspunkte dess Geb&auml;udes auf 0 senkt geht der Besitz auf den Eroberer &uuml;ber.",
  "UNUN.desc": "Die Einheit wird in den Transporter ausgeladen. Nach dem Ausladen k&ouml;nnen beide Einheitein keine Aktionen innerhalb des aktiven Zuges ausf&uuml;hren.",
  "LODU.desc": "Die Einheit wird in den Transporter eingeladen.",
  "NXTR.desc": "Beende Zug",
  "WTUN.desc": "Die Einheit beendet ihren Zug und kann danach innerhalb des aktiven Zuges nicht mehr benutzt werden.",
  "JNUN.desc": "Zwei Einheiten werden zu einer vereint und f&uuml;gen ihre vorhandenen Lebenspunkte und Ressourcen zusammen.",
  "subWeapon.desc": "Angriff mit der Zweitwaffe der Einheit.",
  "mainWeapon.desc": "Angriff mit der Hauptwaffe der Einheit.",
  "SLFR.desc": "Feuert eine Rakete auf ein Ziel ab welches mit einer Reichweite von 2 alle feindlichen Einheiten 2 HP Schaden zuf&uuml;gt.",
  "yes": "Ja",
  "no": "Nein",
  "ok": "Ok",
  "left": "Links",
  "right": "Rechts",
  "up": "Oben",
  "down": "Unten",
  "action": "Aktion",
  "cancel": "Abbrechen",
  "done": "Fertig",
  "day": "Tag",
  "propertyCaptured": "Das Gebäude wurde erobert",
  "propertyPointsLeft": "Das Gebäude wird erobert... Punkte übrig:",
  "capturePoints": "Basispunkte",
  "defense": "Feldverteidigung",
  "health": "Leben",
  "ammo": "Munition",
  "fuel": "Treibstoff",
  "weatherChange": "Wetter ändert sich zu",
  "SUN": "Sonnenschein",
  "RAIN": "Regen",
  "SNOW": "Schnee",
  "gameHasEnded": "Das Spiel ist vorbei, es existiert nur noch ein Team",

  "activatePower": "Aktiviere CO Kraft",
  "cop": "CO Power",
  "scop": "Super CO Power",
  "attack": "Angreifen",
  "buildUnit": "Bauen",
  "capture": "Erobern",
  "transferMoney": "Sende Geld",
  "transferProperty": "Sende Gebäude",
  "transferUnit": "Sende Einheit",
  "hideUnit": "Tarnen",
  "unhideUnit": "Enttarnen",
  "joinUnits": "Vereinen",
  "loadUnit": "Einladen",
  "unloadUnit": "Ausladen",
  "nextTurn": "Zug Beenden",
  "silofire": "Silo Abfeuer",
  "supplyUnit": "Versorgen",
  "wait": "Warten",
  "doExplosion": "Explodieren",

  "options": "Optionen",
  "options.sfx": "SFX An/Aus",
  "options.music": "Musik An/Aus",
  "options.yield": "Aufgeben",

  "loading.loadMaps": "Lade Karten",
  "loading.loadImages": "Lade Grafiken",
  "loading.cropImages": "Schneide Grafiken zu",
  "loading.colorizeImages": "Färbe Grafiken ein",
  "loading.loadSounds": "Lade Soundeffekte",
  "loading.prepareInput": "Initialisiere Eingabesysteme",
  "loading.prepareLanguage": "Wechsle Sprache",
  "loading.done": "Fertig",

  "menu.header": "Menü",
  "menu.version": "Version",

  "player": "Spieler",

  "config.type.prev": "<<",
  "config.type.next": ">>",
  "config.co.prev": "<<",
  "config.co.next": ">>",
  "config.team.next": ">>",
  "config.team.prev": "<<",

  "config.playerCo": "CO",
  "config.playerType": "Typ",
  "config.playerTeam": "Team",

  "config.next": "Spiel Starten",

  "config.player.off": "Frei",
  "config.player.disabled": "-",
  "config.player.co.none": "Kein",
  "config.player.AI": "KI",
  "config.player.human": "Spieler",

  "message.panel.header": "Nachricht",

  "versus.playerconfig": "Spielerkonfiguration",
  "versus.next": "Spielerkonfiguration",
  "versus.mapSelection": "Kartenauswahl",
  "versus.prevMap": "Vorherige Karte",
  "versus.nextMap": "Nächste Karte",

  "error.panel.action": "Spieldaten zurücksetzen?",
  "error.panel.header": "Schwerwiegender Fehler",
  "error.panel.reason": "Grund",
  "error.panel.data": "Daten",
  "error.panel.no": "Nein",
  "error.panel.yes": "Ja",

  "MAIN_MENU_OPTIONS": "Optionen",
  "MAIN_MENU_NETWORK": "Netzwerkspiel",
  "MAIN_MENU_SKIRMISH": "Einzelspiel",
  "MAIN_MENU_TEST_WEATHER": "Wetter-Test",

  "OPTIONS_SFX_VOL_DOWN": "-",
  "OPTIONS_SFX_VOL_UP": "+",
  "OPTIONS_MUSIC_VOL_DOWN": "-",
  "OPTIONS_MUSIC_VOL_UP": "+",
  "OPTIONS_CHECKBOX_ANIMATED_TILES_TEXT": "Animierte Felder",
  "OPTIONS_CHECKBOX_FORCE_TOUCH_TEXT": "Erzwinge Touch-Bedienung",
  "OPTIONS_MENU_CHANGE_KEYBOARD_LAYOUT": "Konfiguriere Tastatur",
  "OPTIONS_MENU_CHANGE_GAMEPAD_LAYOUT": "Konfiguriere Gamepad",
  "OPTIONS_MENU_WIPE_OUT": "Daten zurücksetzen",
  "OPTIONS_MENU_GO_BACK": "Zurück",

  "OPTIONS_WIPE_OUT_TEXT": "Löscht alle Spieldaten. Beim nächsten\nSpielstart werden benötigte Daten erneut geladen.",
  "OPTIONS_WIPE_OUT_NO": "Abbrechen",
  "OPTIONS_WIPE_OUT_YES": "Tu es!",

  "OPTIONS_KEYMAP_RIGHT": "Rechts",
  "OPTIONS_KEYMAP_LEFT": "Links",
  "OPTIONS_KEYMAP_DOWN": "Unten",
  "OPTIONS_KEYMAP_UP": "Oben",
  "OPTIONS_KEYMAP_ACTION": "Aktion",
  "OPTIONS_KEYMAP_CANCEL": "Abbrechen",

  "MAP_SELECT_PAGE_LEFT": "<<",
  "MAP_SELECT_PAGE": "",
  "MAP_SELECT_PAGE_RIGHT": ">>",
  "MENU_BACK": "Zurück",
  "MENU_NEXT": "Weiter",
  "MENU_RIGHT": ">>",
  "MENU_LEFT": "<<",
  "MENU_CONFIGURED_MATCH": "Eigenes Spiel",
  "MENU_FAST_MATCH": "Schnelles Spiel",

  "PLAYER_CONFIG_SLOT1": "Slot 1",
  "PLAYER_CONFIG_SLOT2": "Slot 2",
  "PLAYER_CONFIG_SLOT3": "Slot 3",
  "PLAYER_CONFIG_SLOT4": "Slot 4",

  "PLAYER_CONFIG_NAME": "Name",
  "PLAYER_CONFIG_TYPE": "Typ",
  "PLAYER_CONFIG_TEAM": "Team",
  "PLAYER_CONFIG_CO_A": "Haupt-CO",
  "PLAYER_CONFIG_GAMEMODE": "Spielmodus",

  "VALUE_R": "",
  "VALUE_L": "",
  "VALUE_U": "",
  "VALUE_D": "",
  "VALUE_A": "",
  "VALUE_C": "",

  "co_getStarCost": "Star Kosten",
  "co_getStarCostIncrease": "Star K. Erhö.",
  "co_getStarCostIncreaseSteps": "Star K. Erhö. Stufen",
  "co_enabledCoPower": "Co Powers",
  "fogEnabled": "Nebel des Krieges",
  "daysOfPeace": "Tage des Friedens",
  "weatherMinDays": "Wetter min. Dauer",
  "weatherRandomDays": "Wetter max. Dauer",
  "noUnitsLeftLoose": "Verliere ohne Einheiten",
  "autoSupplyAtTurnStart": "Zugstart Auto-Versorg.",
  "round_dayLimit": "Tage-Limit",
  "unitLimit": "Einheiten-Limit",
  "captureLimit": "Gebäude-Limit",
  "timer_turnTimeLimit": "Zugzeit (Min.)",
  "timer_gameTimeLimit": "Spielzeit (Min.)",

  "OPTIONS_KEYMAP_GOBACK": "Zurück",
  "OPTIONS_KEYMAP_SET": "Setze Tasten",

  "TOOLTIP_1": "Change the keyboard and gamepad settings by selecting\nOptions from the main or in-game menu",
  "TOOLTIP_2": "Activate zooming the map by using the scroll wheel for\nthe mouse, pinching for touch screen, and the in-game menu.",
  "TOOLTIP_3": "Press and hold Cancel over an idle unit to\nsee its attack range.",
  "TOOLTIP_4": "Perform Cancel by right-clicking with mouse,\nor double-tapping for touch screen.",
  "TOOLTIP_5": "Keyboard and game-pad controls can be changed\nvia the Options Menu.",
  "TOOLTIP_6": "Perform Action by lieft-clicking with the mouse\n, or tapping the touch screen.",
  "TOOLTIP_7": "Reporting bugs to the developers can be done\nthrough the Mailing List or the forum.",
  "TOOLTIP_8": "Custom Wars Tactics concept started in January 2009.\nThe original name for the project was called 'Tactic Wars'.",
  "TOOLTIP_9": "Custom Wars Tactics is playable from PC and also from\nmobile devices.",
  "TOOLTIP_10": "Custom Wars Tactics can be played offline in your\nbrowser. (As long you aren't in private browsing mode.)",
  "TOOLTIP_11": "A full desktop counterpart for Custom Wars Tactics\nis being developed. Stay tuned!"
});

cwt.Graphics = {

  COLOR_MAP: [
    "image/BuildingBaseColors.png",
    "image/UnitBaseColors.png"
  ],

  UNITS: {
    WRTK: "image/cwt_anim/units/CWT_WRTK.png",
    TNTK: "image/cwt_anim/units/CWT_TANK.png",
    TCTR: "image/cwt_anim/units/CWT_TCTR.png",
    SUBM: "image/cwt_anim/units/CWT_SUBM.png",
    RCKT: "image/cwt_anim/units/CWT_RCKT.png",
    RECN: "image/cwt_anim/units/CWT_RECN.png",
    STLH: "image/cwt_anim/units/CWT_STLH.png",
    INFT: "image/cwt_anim/units/CWT_INFT.png",
    LNDR: "image/cwt_anim/units/CWT_LNDR.png",
    MDTK: "image/cwt_anim/units/CWT_MDTK.png",
    MECH: "image/cwt_anim/units/CWT_MECH.png",
    MISS: "image/cwt_anim/units/CWT_MISS.png",
    NTNK: "image/cwt_anim/units/CWT_NTNK.png",
    FGTR: "image/cwt_anim/units/CWT_FGTR.png",
    CRUS: "image/cwt_anim/units/CWT_CRUS.png",
    BSHP: "image/cwt_anim/units/CWT_BSHP.png",
    BMBR: "image/cwt_anim/units/CWT_BMBR.png",
    BKBT: "image/cwt_anim/units/CWT_BKBT.png",
    BKBM: "image/cwt_anim/units/CWT_BKBM.png",
    BCTR: "image/cwt_anim/units/CWT_BCTR.png",
    ARTY: "image/cwt_anim/units/CWT_ARTY.png",
    ACAR: "image/cwt_anim/units/CWT_ACAR.png"
  },

  TILES: {

    WATER: [
      {
        "ROAD": "L",
        "PLIN": "L",
        "FRST": "L",
        "MNTN": "L",
        "BRDG": "S",
        "REEF": "S",
        "WATER": "S",
        "RIVER": "RV",
        "DEFAULT": ""
      },
      [
        [ 0, "S", "S", "S", "S", "S", "S", "S", "S" ],
        [ 1, "L", "L", "L", "L", "L", "L", "L", "L" ],
        [ 2, "L", "", "S", "", "L", "", "S", "" ],
        [ 3, "S", "", "L", "", "S", "", "L", "" ],
        [ 4, "L", "", "S", "", "L", "", "L", "" ],
        [ 5, "L", "", "L", "", "L", "", "S", "" ],
        [ 6, "L", "", "L", "", "S", "", "L", "" ],
        [ 6, "S", "", "L", "", "L", "", "L", "" ],
        [ 7, "L", "L", "S", "S", "S", "L", "L", "L" ],
        [ 7, "L", "", "S", "S", "S", "", "L", "" ],
        [ 8, "L", "L", "L", "L", "S", "S", "S", "L" ],
        [ 8, "L", "", "L", "", "S", "S", "S", "" ],
        [ 9, "L", "L", "S", "S", "S", "S", "S", "L" ],
        [ 10, "RV", "L", "S", "S", "S", "S", "S", "L" ],
        [ 11, "S", "L", "L", "L", "L", "L", "L", "L" ],
        [ 12, "S", "S", "S", "L", "L", "L", "L", "L" ],
        [ 13, "S", "", "L", "", "L", "", "S", "S" ],
        [ 14, "S", "", "S", "", "L", "", "S", "" ],
        [ 15, "S", "S", "S", "L", "RV", "L", "S", "S" ],
        [ 16, "S", "", "S", "", "S", "", "L", "" ],
        [ 17, "S" , "S", "S", "S", "S", "L", "RV", "L" ],
        [ 18, "S", "", "L", "", "S", "", "", "" ],
        [ 19, "S", "L", "RV", "L", "S", "S", "S", "S" ],
        [ 20, "S", "L", "S", "L", "S", "L", "S", "L" ],
        [ 21, "S", "L", "S", "S", "S", "L", "S", "L" ],
        [ 22, "S", "L", "S", "L", "S", "S", "S", "L" ],
        [ 23, "S", "L", "S", "S", "S", "S", "S", "L" ],
        [ 24, "S", "S", "S", "L", "S", "L", "S", "L" ],
        [ 25, "S", "S", "S", "S", "S", "L", "S", "L" ],
        [ 26, "S", "S", "S", "L", "S", "S", "S", "L" ],
        [ 27, "S", "S", "S", "S", "S", "S", "S", "L" ],
        [ 28, "S", "L", "S", "L", "S", "L", "S", "S" ],
        [ 29, "S", "L", "S", "S", "S", "L", "S", "S" ],
        [ 30, "S", "L", "S", "L", "S", "S", "S", "S" ],
        [ 31, "S", "L", "S", "S", "S", "S", "S", "S" ],
        [ 32, "S", "S", "S", "L", "S", "L", "S", "S" ],
        [ 33, "S", "S", "S", "L", "S", "S", "S", "S" ],
        [ 34, "S", "S", "S", "S", "S", "L", "S", "S" ],
        [ 35, "L", "L", "S", "S", "S", "S", "S", "S" ],
        [ 35, "L", "S", "S", "S", "S", "S", "S", "L" ],
        [ 35, "L", "S", "S", "S", "S", "S", "S", "S" ],
        [ 36, "L", "L", "S", "L", "S", "", "S", "L" ],
        [ 37, "S", "L", "S", "", "", "", "", "" ],
        [ 38, "", "", "S", "L", "S", "", "", "" ],
        [ 39, "", "", "", "", "S", "L", "S", "" ],
        [ 40, "S", "", "", "", "", "", "S", "L" ],
        [ 41, "", "", "", "", "", "", "", "" ]
      ],
      [
        "image/cwt_anim/terrain/CWT_SEAS(S).png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~~~~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~~SS~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SS~~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~~~S~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~~S~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~S~~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~S~S~~~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~SS~~~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~SSS~~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$RSSS~~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$S~~~~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$S~~S~S~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$S~S~S~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$S~SSSS~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SRSSSS~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SS~S~S~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSRS~S~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSS~S~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSRS~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~~~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~S~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~S~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~SS~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~SSS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSS~~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSSS~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSS~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~SSS~~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$~SSS~~S~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSS~SS.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSSS~.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSSSS~S.png",
        "image/cwt_anim/terrain/CWT_SEAS(S)$SSSS~SSS.png",

        "image/cwt_anim/terrain/CWT_SEAS(S).png"
      ],
      true,
      false
    ],

    SHOAL: [ "image/cwt_anim/terrain/CWT_SHOA(BS)$BB~S~S~S.png", true, false ],
    FRST: [ "image/cwt_anim/terrain/CWT_FRST.png", false, true ],
    MNTN: [ "image/cwt_anim/terrain/CWT_MNTN.png", false, true ],
    PLIN: [ "image/cwt_anim/terrain/CWT_PLIN.png", false, false ],
    REEF: [ "image/cwt_anim/terrain/CWT_REEF(S).png" , true, false ],

    ROAD: [
      {
        "ROAD": "R",
        "WATER": "S",
        "RIVER": "RV",
        "PLIN": "L",
        "FRST": "L",
        "MNTN": "L",
        "REEF": "S"
      },
      [
        [0, "R", "R", "R", "R" ],
        [1, "", "R", "R", "R" ],
        [2, "R", "R", "", "R" ],
        [3, "R", "R", "R", "" ],
        [4, "R", "", "R", "R" ],
        [5, "", "R", "", "R" ],
        [6, "", "R", "R", "" ],
        [7, "", "", "R", "R" ],
        [8, "R", "R", "", "" ],
        [9, "R", "", "", "R" ],
        [10, "R", "", "R", "" ],
        [10, "", "", "R", "" ],
        [10, "R", "", "", "" ],
        //["", "", "", "R" ],
        //["", "R", "", "" ],
        [11, "", "", "", "" ]
      ],
      [
        "image/cwt_anim/terrain/CWT_ROAD(O)$OOOO~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~OOO~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$O~OO~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$OO~O~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$OOO~~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~~OO~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~O~O~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~OO~~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$O~~O~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$O~O~~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$OO~~~~~~.png",
        "image/cwt_anim/terrain/CWT_ROAD(O)$~~OO~~~~.png"
      ],
      false,
      false
    ],

    BRDG: [
      {
        "ROAD": "R",
        "BRDG": "R",
        "SEAS": "S"
      },
      [

        [0, "R", "R", "R", "R" ],
        [1, "", "R", "R", "R" ],
        [2, "R", "R", "", "R" ],
        [3, "R", "R", "R", "" ],
        [4, "R", "", "R", "R" ],
        [5, "", "", "R", "R" ],
        [6, "R", "", "", "R" ],
        [7, "R", "R", "", "" ],
        [8, "", "R", "R", "" ],
        [9, "R", "S", "R", "S"],
        [10, "S", "R", "S", "R"],
        [11, "R", "", "R", ""],
        [11, "", "", "R", ""],
        [11, "R", "", "", ""],
        //[12,"", "R", "", "R"],
        //[12,"", "", "", "R"],
        //[12,"", "R", "", ""],
        [12, "", "", "", "" ]
      ],
      [

        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$OOOO~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$~OOO~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$O~OO~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$OO~O~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$OOO~~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$~OO~~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$O~O~~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$O~~O~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSRB)$~O~O~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSB)$OOSS~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(OSB)$SSOO~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(ORB)$OO~~~~~~.png",
        "image/cwt_anim/terrain/CWT_BRDG(ORB)$~~OO~~~~.png"
      ],
      false,
      false
    ],

    RIVER: [
      {
        "RIVER": "R"
      },
      [
        [0, "R", "R", "R", "R" ],
        [1, "", "R", "R", "R" ],
        [2, "R", "R", "", "R" ],
        [3, "R", "R", "R", "" ],
        [4, "R", "", "R", "R" ],
        [5, "", "R", "", "R" ],
        [6, "", "R", "R", "" ],
        [7, "", "", "R", "R" ],
        [8, "R", "R", "", "" ],
        [9, "R", "", "", "R" ],
        [10, "R", "", "R", "" ],
        [11, "", "", "", "" ]
      ],
      [
        "image/cwt_anim/terrain/CWT_RIVR(R)$RRRR~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~RRR~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$R~RR~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$RR~R~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$RRR~~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~~RR~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~R~R~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~RR~~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$R~~R~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$R~R~~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$RR~~~~~~.png",
        "image/cwt_anim/terrain/CWT_RIVR(R)$~~RR~~~~.png"
      ],
      true,
      false
    ]
  },

  PROPERTIES: {
    BASE: "image/cwt_anim/properties/CWT_BASE.png",
    CITY: "image/cwt_anim/properties/CWT_CITY.png",
    PORT: "image/cwt_anim/properties/CWT_PORT(SBR).png",
    RADAR: "image/cwt_anim/properties/CWT_RADR.png",
    RUIB: "image/cwt_anim/inventions/CWT_BRBL-S.png",
    RUIS: "image/cwt_anim/inventions/CWT_SRBL.png",
    SILO: "image/cwt_anim/properties/CWT_SILO.png",
    SILO_EMPTY: "image/cwt_anim/properties/CWT_PLTF.png",
    HQTR: "image/cwt_anim/properties/CWT_HQTR.png"
  },

  ARROW: "image/arrow.png",

  DUST: "image/UnitDust.png",

  ROCKET_FLY: "image/missileup.png",

  OTHERS: {

    CURSOR: "image/cursor.png",

    MINIMAP: [
      "image/map/AWDS(C)-2x2.png",
      "image/map/AWDS(C)-4x4.png"
    ],

    BACKGROUNDS: [
      "image/mobile/background/RedStar.jpg",
      "image/mobile/background/YellowComet.jpg",
      "image/mobile/background/GreenEarth.jpg",
      "image/mobile/background/BlueMoon.jpg"
    ],

    HP: [
      "image/symbol/0.png",
      "image/symbol/1.png",
      "image/symbol/2.png",
      "image/symbol/3.png",
      "image/symbol/4.png",
      "image/symbol/5.png",
      "image/symbol/6.png",
      "image/symbol/7.png",
      "image/symbol/8.png",
      "image/symbol/9.png"
    ],

    SYMBOLS: [
      "image/symbol/hp.png",
      "image/symbol/ammo.png",
      "image/symbol/fuel.png",
      "image/symbol/load.png",
      "image/symbol/capture.png",
      "image/symbol/attack.png",
      "image/symbol/vision.png",
      "image/symbol/goldboot.png",
      "image/symbol/unknown.png",
      "image/symbol/detect.png",
      "image/symbol/yellowstar.png",
      "image/symbol/guard.png",
      "image/symbol/elite.png",
      "image/symbol/veteran.png"
    ],

    SELECTION: [
      "image/cwt_anim/wall/CWT_SILO$W~WW~~~~.png",      // N
      "image/cwt_anim/wall/CWT_SILO$~WWW~~~~.png",      // S
      "image/cwt_anim/wall/CWT_SILO$WWW~~~~~.png",      // W
      "image/cwt_anim/wall/CWT_SILO$WW~W~~~~.png",      // E
      "image/cwt_anim/wall/CWT_SILO$~WW~~~~~.png",      // SW
      "image/cwt_anim/wall/CWT_SILO$~W~W~~~~.png",      // SE
      "image/cwt_anim/wall/CWT_SILO$W~W~~~~~.png",      // NW
      "image/cwt_anim/wall/CWT_SILO$W~~W~~~~.png",      // NE
      "image/cwt_anim/wall/CWT_SILO$WWWW~~~~.png"       // ALL
    ],

    FOCUS: [
      "image/unitmove.png",
      "image/unitatk.png"
    ],

    EXPLOSIONS: [
      "image/object_explode/UNIT_LAND.png",
      "image/object_explode/UNIT_AIR.png",
      "image/object_explode/UNIT_DUST.png",
      "image/object_explode/UNIT_SEA.png"
    ],

    SMOKE: "image/smoked.png",

    TRAPPED: "image/icons/trapsign.png"
  }
};

cwt.mapList = {
  "Minus Hills": "maps/minus-hills-v1.json",
  "Outpost Plus": "maps/outpost-plus-v1.json",
  "Shuriken Valley": "maps/shuriken-valley-v1.json",
  "Stand Off": "maps/stand-off.json",
  "Spann Island": "maps/spann-island.json",
  "TestMap": "maps/testmap.json",
  "Test-MillionMarch": "maps/millionmarch.json"
};

cwt.MiniMapIndexes = {
  PLIN: 0,
  FRST: 1,
  MNTN: 2,
  ROAD: 3,
  RIVER: 5,
  BRDG: 3,
  WATER: 5,
  REEF: 6,
  SHOAL: 7
};

cwt.Musics = {
  MAIN_MENU_BG: "music/Epoch.mp3"
};

cwt.Sounds = {

  CANNON_TANK_BIG: "sound/tnk_cannon_big.wav",
  CANNON_TANK_SMALL: "sound/tnk_cannon_small.wav",

  MACHINE_GUN: "sound/mg.wav",

  ACTION: "sound/ok.wav",
  CANCEL: "sound/cancel.wav",

  ROCKET_IMPACT: "sound/rocketImpact.mp3",

  MENU_TICK: "sound/menutick.wav",
  MAP_TICK: "sound/maptick.wav"

};

cwt.Tooltips = [
  "TOOLTIP_1",
  "TOOLTIP_2",
  "TOOLTIP_3",
  "TOOLTIP_4",
  "TOOLTIP_5",
  "TOOLTIP_6",
  "TOOLTIP_7",
  "TOOLTIP_8",
  "TOOLTIP_9",
  "TOOLTIP_10",
  "TOOLTIP_11"
];

cwt.MovetypeSheet.registerSheet({
  "ID": "AIR",
  "sound": null,
  "costs": {
    "*": 1
  }
});
cwt.MovetypeSheet.registerSheet({
  "ID": "COPTER",
  "sound": null,
  "costs": {
    "*": 1
  }
});
cwt.MovetypeSheet.registerSheet({
  "ID": "MV_INFT",
  "sound": null,
  "costs": {
    "MNTN": 2,
    "WATER": -1,
    "REEF": -1,
    "*": 1
  }
});
cwt.MovetypeSheet.registerSheet({
  "ID": "WATER_TRANSPORT",
  "sound": null,
  "costs": {
    "WATER": 1,
    "PORT": 1,
    "REEF": 2,
    "SHOAL": 1,
    "*": -1
  }
});
cwt.MovetypeSheet.registerSheet({
  "ID": "MV_MECH",
  "sound": null,
  "costs": {
    "WATER": -1,
    "REEF": -1,
    "*": 1
  }
});
cwt.MovetypeSheet.registerSheet({
  "ID": "SHIP",
  "sound": null,
  "costs": {
    "WATER": 1,
    "PORT": 1,
    "REEF": 2,
    "*": -1
  }
});
cwt.MovetypeSheet.registerSheet({
  "ID": "TANK",
  "sound": null,
  "costs": {
    "FRST": 2,
    "MNTN": -1,
    "RIVER": -1,
    "WATER": -1,
    "REEF": -1,
    "*": 1
  }
});
cwt.MovetypeSheet.registerSheet({
  "ID": "TIRE_A",
  "sound": null,
  "costs": {
    "PLIN": 2,
    "FRST": 3,
    "MNTN": -1,
    "RIVER": -1,
    "WATER": -1,
    "REEF": -1,
    "*": 1
  }
});
cwt.PropertySheet.registerSheet({
  "ID": "APRT",
  "vision": 0,
  "defense": 3,
  "capturePoints": 20,
  "funds": 1000,
  "supply": [
    "AIR"
  ],
  "repairs": {
    "AIR": 2
  },
  "builds": [
    "AIR"
  ],
  "assets": {
    "gfx": "cwt_anim/properties/CWT_APRT.png"
  }
});
cwt.PropertySheet.registerSheet({
  "ID": "BASE",
  "vision": 0,
  "defense": 3,
  "capturePoints": 20,
  "funds": 1000,
  "supply": [
    "MV_INFT",
    "MV_MECH",
    "TIRE_A",
    "TIRE_B",
    "TANK"
  ],
  "repairs": {
    "MV_INFT": 2,
    "MV_MECH": 2,
    "TIRE_A": 2,
    "TIRE_B": 2,
    "TANK": 2
  },
  "builds": [
    "MV_INFT",
    "MV_MECH",
    "TIRE_A",
    "TIRE_B",
    "TANK"
  ]
});
cwt.PropertySheet.registerSheet({
  "ID": "CITY",
  "vision": 0,
  "defense": 3,
  "capturePoints": 20,
  "funds": 1000,
  "supply": [
    "INFT",
    "MECH",
    "TIRE_A",
    "TIRE_B",
    "TANK"
  ],
  "repairs": {
    "INFT": 2,
    "MECH": 2,
    "TIRE_A": 2,
    "TIRE_B": 2,
    "TANK": 2
  }
});
cwt.PropertySheet.registerSheet({
  "ID": "HQTR",
  "vision": 0,
  "defense": 4,
  "capturePoints": 20,
  "funds": 1000,
  "looseAfterCaptured": true,
  "changeAfterCaptured": "CITY",
  "notTransferable": true,
  "supply": [
    "INFT",
    "MECH",
    "TIRE_A",
    "TIRE_B",
    "TANK"
  ],
  "repairs": {
    "INFT": 2,
    "MECH": 2,
    "TIRE_A": 2,
    "TIRE_B": 2,
    "TANK": 2
  }
});
cwt.PropertySheet.registerSheet({
  "ID": "PORT",
  "vision": 0,
  "defense": 3,
  "capturePoints": 20,
  "funds": 1000,
  "supply": [
    "SHIP",
    "WATER_TRANSPORT"
  ],
  "repairs": {
    "SHIP": 2,
    "WATER_TRANSPORT": 2
  },
  "builds": [
    "SHIP",
    "WATER_TRANSPORT"
  ]
});
cwt.PropertySheet.registerSheet({
  "ID": "RADAR",
  "vision": 4,
  "defense": 3,
  "points": 20
});
cwt.PropertySheet.registerSheet({
  "ID": "RUIB",
  "defense": 0,
  "vision": 0
});
cwt.PropertySheet.registerSheet({
  "ID": "RUIS",
  "defense": 0,
  "vision": 0
});
cwt.PropertySheet.registerSheet({
  "ID": "SILO",
  "defense": 3,
  "vision": 0,
  "rocketsilo": {
    "fireable": ["INFT", "MECH"],
    "range": 2,
    "damage": 3
  },
  "changeTo": "SILO_EMPTY"
});
cwt.PropertySheet.registerSheet({
  "ID": "SILO_EMPTY",
  "defense": 3,
  "vision": 0,
  "rocketsilo": {}
});

cwt.TileSheet.registerSheet({
  "ID": "BRDG",
  "defense": 0
});
cwt.TileSheet.registerSheet({
  "ID": "FRST",
  "defense": 2,
  "blocksVision": true
});
cwt.TileSheet.registerSheet({
  "ID": "MNTN",
  "defense": 4
});
cwt.TileSheet.registerSheet({
  "ID": "PLIN",
  "defense": 1
});
cwt.TileSheet.registerSheet({
  "ID": "REEF",
  "defense": 1,
  "blocksVision": true
});
cwt.TileSheet.registerSheet({
  "ID": "RIVER",
  "defense": 0
});
cwt.TileSheet.registerSheet({
  "ID": "ROAD",
  "defense": 0
});
cwt.TileSheet.registerSheet({
  "ID": "SHOAL",
  "defense": 0
});
cwt.TileSheet.registerSheet({
  "ID": "WATER",
  "defense": 0
});

cwt.UnitSheet.registerSheet({
  "ID": "AAIR",
  "cost": 8000,
  "range": 6,
  "movetype": "TANK",
  "vision": 2,
  "fuel": 60,
  "ammo": 9,
  "attack": {
    "main_wp": {
      "INFT": 105,
      "MECH": 105,
      "RECN": 60,
      "TNTK": 25,
      "MDTK": 10,
      "NTNK": 5,
      "WRTK": 1,
      "AAIR": 45,
      "ARTY": 50,
      "RCKT": 55,
      "PIPR": 25,
      "MISS": 55,
      "APCR": 50,
      "OOZM": 30,
      "FGTR": 65,
      "BMBR": 75,
      "STLH": 75,
      "BCTR": 105,
      "TCTR": 105,
      "BKBM": 120
    }
  },
  "assets": {
    "gfx": "cwt_anim/units/CWT_AAIR.png",
    "pri_att_sound": "mg.wav",
    "sec_att_sound": "mg.wav"
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "ACAR",
  "cost": 30000,
  "range": 5,
  "movetype": "SHIP",
  "vision": 4,
  "fuel": 99,
  "dailyFuelDrain": 1,
  "ammo": 9,
  "maxloads": 2,
  "suppliesloads": true,
  "canload": [
    "AIR"
  ],
  "attack": {
    "main_wp": {
      "FGTR": 100,
      "BMBR": 100,
      "STLH": 100,
      "BCTR": 115,
      "TCTR": 115,
      "BKBM": 120
    },
    "minrange": 3,
    "maxrange": 8
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "APCR",
  "cost": 5000,
  "range": 6,
  "movetype": "TANK",
  "vision": 1,
  "fuel": 70,
  "ammo": 0,
  "maxloads": 1,
  "canload": [
    "MV_INFT",
    "MV_MECH"
  ],
  "supply": [
    "*"
  ],
  "assets": {
    "gfx": "cwt_anim/units/CWT_APCR.png"
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "ARTY",
  "cost": 6000,
  "range": 5,
  "movetype": "TANK",
  "vision": 1,
  "fuel": 50,
  "ammo": 6,
  "attack": {
    "main_wp": {
      "INFT": 90,
      "MECH": 85,
      "RECN": 80,
      "TNTK": 70,
      "MDTK": 45,
      "NTNK": 40,
      "WRTK": 15,
      "AAIR": 75,
      "ARTY": 75,
      "RCKT": 80,
      "PIPR": 70,
      "MISS": 80,
      "APCR": 70,
      "OOZM": 5,
      "CRUS": 50,
      "SUBM": 60,
      "BSHP": 40,
      "ACAR": 45,
      "LNDR": 55,
      "BLBT": 55
    },
    "minrange": 2,
    "maxrange": 3
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "BCTR",
  "cost": 9000,
  "range": 6,
  "movetype": "COPTER",
  "copter": true,
  "dailyFuelDrain": 2,
  "vision": 3,
  "fuel": 99,
  "ammo": 6,
  "attack": {
    "main_wp": {
      "RECN": 55,
      "TNTK": 55,
      "MDTK": 25,
      "NTNK": 20,
      "WRTK": 10,
      "AAIR": 25,
      "ARTY": 65,
      "RCKT": 65,
      "PIPR": 55,
      "MISS": 65,
      "APCR": 60,
      "OOZM": 25,
      "CRUS": 25,
      "SUBM": 25,
      "BSHP": 25,
      "ACAR": 25,
      "LNDR": 25,
      "BLBT": 25
    },
    "sec_wp": {
      "INFT": 75,
      "MECH": 75,
      "RECN": 30,
      "TNTK": 6,
      "MDTK": 1,
      "NTNK": 1,
      "WRTK": 1,
      "AAIR": 6,
      "ARTY": 25,
      "RCKT": 35,
      "PIPR": 6,
      "MISS": 35,
      "APCR": 20,
      "OOZM": 20,
      "BCTR": 65,
      "TCTR": 95
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "BKBM",
  "cost": 25000,
  "range": 9,
  "movetype": "AIR",
  "dailyFuelDrain": 5,
  "vision": 1,
  "fuel": 45,
  "ammo": 0,
  "suicide": {
    "damage": 5,
    "range": 3,
    "nodamage": [
      "OOZM"
    ]
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "BKBT",
  "cost": 7500,
  "range": 7,
  "movetype": "WATER_TRANSPORT",
  "vision": 1,
  "fuel": 60,
  "ammo": 0,
  "dailyFuelDrain": 1,
  "maxloads": 2,
  "canload": [
    "INFT",
    "MECH"
  ],
  "repairs": {
    "SHIP": 1
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "BMBR",
  "cost": 22000,
  "range": 7,
  "movetype": "AIR",
  "dailyFuelDrain": 5,
  "vision": 3,
  "fuel": 99,
  "ammo": 9,
  "attack": {
    "main_wp": {
      "INFT": 110,
      "MECH": 110,
      "RECN": 105,
      "TNTK": 105,
      "MDTK": 95,
      "NTNK": 90,
      "WRTK": 35,
      "AAIR": 95,
      "ARTY": 105,
      "RCKT": 105,
      "PIPR": 105,
      "MISS": 105,
      "APCR": 105,
      "OOZM": 35,
      "CRUS": 50,
      "SUBM": 95,
      "BSHP": 75,
      "ACAR": 105,
      "LNDR": 95,
      "BLBT": 75
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "BSHP",
  "cost": 28000,
  "range": 5,
  "movetype": "SHIP",
  "vision": 2,
  "fuel": 99,
  "dailyFuelDrain": 1,
  "ammo": 9,
  "attack": {
    "main_wp": {
      "INFT": 95,
      "MECH": 90,
      "RECN": 90,
      "TNTK": 80,
      "MDTK": 55,
      "NTNK": 50,
      "WRTK": 25,
      "AAIR": 85,
      "ARTY": 80,
      "RCKT": 85,
      "PIPR": 80,
      "MISS": 90,
      "APCR": 80,
      "OOZM": 20,
      "CRUS": 95,
      "SUBM": 95,
      "BSHP": 50,
      "ACAR": 60,
      "LNDR": 95,
      "BLBT": 95
    },
    "minrange": 2,
    "maxrange": 6
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "CRUS",
  "cost": 18000,
  "range": 6,
  "movetype": "SHIP",
  "vision": 3,
  "fuel": 99,
  "ammo": 9,
  "dailyFuelDrain": 1,
  "attack": {
    "main_wp": {
      "CRUS": 25,
      "SUBM": 90,
      "BSHP": 5,
      "ACAR": 5,
      "LNDR": 25,
      "BLBT": 25
    },
    "sec_wp": {
      "FGTR": 85,
      "BMBR": 100,
      "STLH": 100,
      "BCTR": 105,
      "TCTR": 105,
      "BKBM": 120
    }
  },
  "maxloads": 2,
  "canload": [
    "AIR"
  ]
});
cwt.UnitSheet.registerSheet({
  "ID": "FGTR",
  "cost": 20000,
  "range": 9,
  "movetype": "AIR",
  "vision": 2,
  "fuel": 99,
  "dailyFuelDrain": 5,
  "ammo": 9,
  "attack": {
    "main_wp": {
      "FGTR": 55,
      "BMBR": 100,
      "STLH": 85,
      "BCTR": 120,
      "TCTR": 120,
      "BKBM": 120
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "INFT",
  "cost": 1000,
  "range": 3,
  "movetype": "MV_INFT",
  "vision": 2,
  "fuel": 99,
  "captures": 10,
  "ammo": 0,
  "attack": {
    "sec_wp": {
      "INFT": 55,
      "MECH": 45,
      "RECN": 12,
      "TNTK": 5,
      "MDTK": 1,
      "NTNK": 1,
      "WRTK": 1,
      "APCR": 14,
      "ARTY": 15,
      "RCKT": 25,
      "AAIR": 5,
      "MISS": 25,
      "PIPR": 5,
      "OOZM": 20,
      "BCTR": 7,
      "TCTR": 30
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "LNDR",
  "cost": 12000,
  "range": 6,
  "movetype": "WATER_TRANSPORT",
  "vision": 1,
  "fuel": 99,
  "dailyFuelDrain": 1,
  "ammo": 0,
  "maxloads": 1,
  "canload": [
    "MV_MECH",
    "MV_INFT",
    "TIRE_A",
    "TIRE_B",
    "TANK"
  ]
});
cwt.UnitSheet.registerSheet({
  "ID": "MDTK",
  "cost": 16000,
  "range": 5,
  "movetype": "TANK",
  "vision": 1,
  "fuel": 50,
  "ammo": 8,
  "attack": {
    "main_wp": {
      "RECN": 105,
      "TNTK": 85,
      "MDTK": 55,
      "NTNK": 45,
      "WRTK": 25,
      "AAIR": 105,
      "ARTY": 105,
      "RCKT": 105,
      "PIPR": 85,
      "MISS": 105,
      "APCR": 105,
      "OOZM": 30,
      "CRUS": 30,
      "SUBM": 10,
      "BSHP": 10,
      "ACAR": 10,
      "LNDR": 35,
      "BLBT": 35
    },
    "sec_wp": {
      "INFT": 105,
      "MECH": 95,
      "RECN": 45,
      "TNTK": 8,
      "MDTK": 1,
      "NTNK": 1,
      "WRTK": 1,
      "AAIR": 7,
      "ARTY": 45,
      "RCKT": 55,
      "PIPR": 8,
      "MISS": 35,
      "APCR": 45,
      "OOZM": 20,
      "BCTR": 12,
      "TCTR": 45
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "MECH",
  "cost": 3000,
  "range": 2,
  "movetype": "MV_MECH",
  "vision": 2,
  "fuel": 70,
  "captures": 10,
  "ammo": 3,
  "attack": {
    "main_wp": {
      "RECN": 85,
      "TNTK": 55,
      "MDTK": 15,
      "NTNK": 15,
      "WRTK": 5,
      "APCR": 75,
      "ARTY": 70,
      "RCKT": 85,
      "AAIR": 65,
      "MISS": 85,
      "PIPR": 55,
      "OOZM": 30
    },
    "sec_wp": {
      "INFT": 65,
      "MECH": 55,
      "RECN": 18,
      "TNTK": 6,
      "MDTK": 1,
      "NTNK": 1,
      "WRTK": 1,
      "APCR": 20,
      "ARTY": 32,
      "RCKT": 35,
      "AAIR": 6,
      "MISS": 35,
      "PIPR": 6,
      "OOZM": 20,
      "BCTR": 9,
      "TCTR": 35
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "MISS",
  "cost": 12000,
  "range": 4,
  "movetype": "TIRE_A",
  "vision": 5,
  "fuel": 50,
  "ammo": 6,
  "attack": {
    "main_wp": {
      "FGTR": 100,
      "BMBR": 100,
      "STLH": 100,
      "BCTR": 115,
      "TCTR": 115,
      "BKBM": 120
    },
    "minrange": 3,
    "maxrange": 5
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "NTNK",
  "cost": 22000,
  "range": 6,
  "movetype": "TANK",
  "vision": 1,
  "fuel": 99,
  "ammo": 9,
  "attack": {
    "main_wp": {
      "RECN": 125,
      "TNTK": 105,
      "MDTK": 75,
      "NTNK": 55,
      "WRTK": 35,
      "AAIR": 115,
      "ARTY": 115,
      "RCKT": 125,
      "PIPR": 105,
      "MISS": 125,
      "APCR": 125,
      "OOZM": 35,
      "CRUS": 30,
      "SUBM": 15,
      "BSHP": 15,
      "ACAR": 15,
      "LNDR": 40,
      "BLBT": 40
    },
    "sec_wp": {
      "INFT": 125,
      "MECH": 115,
      "RECN": 65,
      "TNTK": 10,
      "MDTK": 1,
      "NTNK": 1,
      "WRTK": 1,
      "AAIR": 17,
      "ARTY": 65,
      "RCKT": 75,
      "PIPR": 10,
      "MISS": 55,
      "APCR": 65,
      "OOZM": 20,
      "BCTR": 22,
      "TCTR": 55
    }
  }
});
/*
 cwt.UnitSheet.registerSheet({
 "ID": "OOZM",
 "cost": 0,
 "range": 1,
 "movetype": "SLIME",
 "vision": 1,
 "fuel": 0,
 "ammo": 0,
 "assets": {
 "gfx": "cwt_anim/units/CWT_OOZM.png"
 }
 });
 */
cwt.UnitSheet.registerSheet({
  "ID": "RCKT",
  "cost": 15000,
  "range": 5,
  "movetype": "TIRE_A",
  "vision": 1,
  "fuel": 50,
  "ammo": 6,
  "attack": {
    "main_wp": {
      "INFT": 95,
      "MECH": 90,
      "RECN": 90,
      "TNTK": 80,
      "MDTK": 55,
      "NTNK": 50,
      "WRTK": 25,
      "AAIR": 85,
      "ARTY": 80,
      "RCKT": 85,
      "PIPR": 80,
      "MISS": 90,
      "APCR": 80,
      "OOZM": 15,
      "CRUS": 60,
      "SUBM": 85,
      "BSHP": 55,
      "ACAR": 60,
      "LNDR": 60,
      "BLBT": 60
    },
    "minrange": 3,
    "maxrange": 5
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "RECN",
  "cost": 4000,
  "range": 8,
  "movetype": "TIRE_A",
  "vision": 5,
  "fuel": 80,
  "ammo": 0,
  "attack": {
    "sec_wp": {
      "INFT": 70,
      "MECH": 65,
      "RECN": 35,
      "TNTK": 6,
      "MDTK": 1,
      "NTNK": 1,
      "WRTK": 1,
      "APCR": 45,
      "ARTY": 45,
      "RCKT": 55,
      "AAIR": 4,
      "MISS": 28,
      "PIPR": 6,
      "OOZM": 20,
      "BCTR": 10,
      "TCTR": 35
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "STLH",
  "cost": 24000,
  "range": 6,
  "movetype": "AIR",
  "vision": 4,
  "fuel": 60,
  "ammo": 6,
  "dailyFuelDrain": 5,
  "dailyFuelDrainHidden": 8,
  "stealth": true,
  "attack": {
    "main_wp": {
      "INFT": 90,
      "MECH": 90,
      "RECN": 85,
      "TNTK": 75,
      "MDTK": 70,
      "NTNK": 60,
      "WRTK": 15,
      "AAIR": 50,
      "ARTY": 75,
      "RCKT": 85,
      "PIPR": 80,
      "MISS": 85,
      "APCR": 85,
      "OOZM": 30,
      "FGTR": 45,
      "BMBR": 70,
      "STLH": 55,
      "BCTR": 85,
      "TCTR": 95,
      "BKBM": 120,
      "CRUS": 35,
      "SUBM": 55,
      "BSHP": 45,
      "ACAR": 45,
      "LNDR": 65,
      "BLBT": 65
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "SUBM",
  "cost": 20000,
  "range": 5,
  "movetype": "SHIP",
  "vision": 5,
  "fuel": 60,
  "stealth": true,
  "dailyFuelDrain": 1,
  "dailyFuelDrainHidden": 5,
  "ammo": 6,
  "attack": {
    "main_wp": {
      "CRUS": 25,
      "SUBM": 55,
      "BSHP": 65,
      "ACAR": 75,
      "LNDR": 95,
      "BLBT": 95
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "TCTR",
  "cost": 5000,
  "range": 6,
  "copter": true,
  "movetype": "COPTER",
  "vision": 2,
  "fuel": 99,
  "dailyFuelDrain": 2,
  "ammo": 0,
  "maxloads": 1,
  "canload": [
    "MV_INFT",
    "MV_MECH"
  ]
});
cwt.UnitSheet.registerSheet({
  "ID": "TNTK",
  "cost": 7000,
  "range": 6,
  "movetype": "TANK",
  "vision": 3,
  "fuel": 70,
  "ammo": 9,
  "attack": {
    "main_wp": {
      "RECN": 85,
      "TNTK": 55,
      "MDTK": 15,
      "NTNK": 15,
      "WRTK": 10,
      "APCR": 75,
      "ARTY": 70,
      "RCKT": 85,
      "AAIR": 65,
      "MISS": 85,
      "PIPR": 55,
      "OOZM": 20,
      "CRUS": 5,
      "SUBM": 1,
      "BSHP": 1,
      "ACAR": 1,
      "LNDR": 10,
      "BLBT": 10
    },
    "sec_wp": {
      "INFT": 75,
      "MECH": 70,
      "RECN": 40,
      "TNTK": 6,
      "MDTK": 1,
      "NTNK": 1,
      "WRTK": 1,
      "APCR": 45,
      "ARTY": 45,
      "RCKT": 55,
      "AAIR": 6,
      "MISS": 30,
      "PIPR": 6,
      "OOZM": 20,
      "BCTR": 10,
      "TCTR": 40
    }
  }
});
cwt.UnitSheet.registerSheet({
  "ID": "WRTK",
  "cost": 28000,
  "range": 4,
  "movetype": "TANK",
  "vision": 1,
  "fuel": 70,
  "ammo": 3,
  "attack": {
    "main_wp": {
      "RECN": 195,
      "TNTK": 180,
      "MDTK": 125,
      "NTNK": 115,
      "WRTK": 65,
      "AAIR": 195,
      "ARTY": 195,
      "RCKT": 195,
      "PIPR": 180,
      "MISS": 195,
      "APCR": 195,
      "OOZM": 45,
      "CRUS": 65,
      "SUBM": 45,
      "BSHP": 45,
      "ACAR": 45,
      "LNDR": 75,
      "BLBT": 105
    },
    "sec_wp": {
      "INFT": 135,
      "MECH": 125,
      "RECN": 65,
      "TNTK": 10,
      "MDTK": 1,
      "NTNK": 1,
      "WRTK": 1,
      "AAIR": 17,
      "ARTY": 65,
      "RCKT": 75,
      "PIPR": 10,
      "MISS": 55,
      "APCR": 65,
      "OOZM": 30,
      "BCTR": 22,
      "TCTR": 55
    }
  }
});

cwt.WeatherSheet.registerSheet({
  "ID": "RAIN"
  /*
   "rules":[
   { "vision":-1 },
   { "$when":[ "TILE_TYPE", ["PLIN","FRST"],
   "MOVE_TYPE", ["TANK","TIRE_A"] ],
   "movecost": 1 }
   ]
   */
});
cwt.WeatherSheet.registerSheet({
  "ID": "SNOW"
  /*
   "rules":[

   { "vision":-1 },

   { "$when":[ "MOVE_TYPE", ["TIRE_A","TANK"],
   "TILE_TYPE", ["PLIN","FRST"] ],
   "movecost": 1 },

   { "$when":[ "MOVE_TYPE", ["SHIP","WATER_TRANSPORT"],
   "TILE_TYPE", ["WATER","PORT"] ],
   "movecost": 1 },

   { "$when":[ "MOVE_TYPE", ["MV_MECH"],
   "TILE_TYPE", ["MNTN"] ],
   "movecost": 1 },

   { "$when":[ "MOVE_TYPE", ["MV_INFT"],
   "TILE_TYPE", ["PLIN","RIVER","FRST"] ],
   "movecost": 1 },

   { "$when":[ "MOVE_TYPE", ["MV_INFT"],
   "TILE_TYPE", ["MNTN"] ],
   "movecost": 2 },

   { "$when":[ "MOVE_TYPE", ["AIR"] ],
   "movecost": 1 }
   ]
   */
});
cwt.WeatherSheet.registerSheet({
  "ID": "SUN",
  "rules": [],
  "defaultWeather": true
});