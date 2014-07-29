// This is the main entry point of CustomWars:Tactics. Everything necessary for the game will be loaded
// from this place.
//

// loading
require("./loading/0_checkSystem");
require("./loading/1_language");

// states
require("./states/error");
require("./states/portrait");
require("./states/start_load");
require("./states/start_none");
require("./states/start_tooltip");
require("./states/menu_main");
require("./states/menu_parameterSetup");
require("./states/menu_playerSetup");
require("./states/menu_versus");
require("./states/options_confirmWipeOut");
require("./states/options_main");
require("./states/options_remap");
require("./states/ingame_showAttackRange");
require("./states/ingame_anim_ballistic");
require("./states/ingame_submenu");
require("./states/ingame_anim_captureProperty");
require("./states/ingame_targetselection_a");
require("./states/ingame_anim_changeWeather");
require("./states/ingame_targetselection_b");
require("./states/ingame_anim_destroyUnit");
require("./states/ingame_anim_move");
require("./states/ingame_anim_nextTurn");
require("./states/ingame_anim_trapWait");
require("./states/ingame_enter");
require("./states/ingame_flush");
require("./states/ingame_idle");
require("./states/ingame_leave");
require("./states/ingame_menu");
require("./states/ingame_movepath");
require("./states/ingame_multistep");
require("./states/ingame_selecttile");

/*
require("../modifications/cwt/mod");

require("./loading/2_startParameters");
require("./loading/3_inputInit");
require("./loading/4_audioInit");
require("./loading/6_imageLoad");
require("./loading/7_portraitCheck");
require("./loading/8_loadMaps");

require("./input/gamepad");
require("./input/mouse");
require("./input/keyboard");
require("./input/touch");

// units
require("././AAIR");
require("././ARTY");
require("././BKBT");
require("././CRUS");
require("././LNDR");
require("././MISS");
require("././RCKT");
require("././SUBM");
require("././WRTK");
require("././ACAR");
require("././BCTR");
require("././BMBR");
require("././FGTR");
require("././MDTK");
require("././NTNK");
require("././RECN");
require("././TCTR");
require("././APCR");
require("././BKBM");
require("././BSHP");
require("././INFT");
require("././MECH");
require("././OOZM");
require("././STLH");
require("././TNTK");

 */