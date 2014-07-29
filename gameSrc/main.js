// This is the main entry point of CustomWars:Tactics. Everything necessary for the game will be loaded
// from this place.
//

require("../modifications/cwt/mod");

// loading
require("./loading/0_checkSystem");
require("./loading/1_language");
require("./loading/2_startParameters");
require("./loading/3_inputInit");
require("./loading/4_audioInit");
require("./loading/5_audioLoad");
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
