view.IMAGE_CODE_IDLE="IDLE",view.IMAGE_CODE_IDLE_INVERTED="IDLE_R",view.IMAGE_CODE_RIGHT="RIGHT",view.IMAGE_CODE_LEFT="LEFT",view.IMAGE_CODE_UP="UP",view.IMAGE_CODE_DOWN="DOWN",view.IMAGE_CODE_STATELESS="STATELESS",view.COLOR_RED="RED",view.COLOR_GREEN="GREEN",view.COLOR_BLUE="BLUE",view.COLOR_YELLOW="YELLOW",view.COLOR_BLACK_MASK="BLACK_MASK",view.COLOR_NEUTRAL="GRAY",view.COLOR_NONE="NONE",view.IMG_COLOR_MAP_PROPERTIES_ID="IMG_MAP_PROPERTY",view.IMG_COLOR_MAP_UNITS_ID="IMG_MAP_UNIT",view.CodeStatelessview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{},NONE:{},GRAY:{}},view.overlayImages={},view.animatedTiles={},view.CodeIdleview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeIdleInvertedview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeRightview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeLeftview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeUpview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.CodeDownview={RED:{},BLUE:{},YELLOW:{},GREEN:{},BLACK_MASK:{}},view.setImageForType=function(e,t,o,n){switch(void 0===o&&(o=view.IMAGE_CODE_STATELESS),void 0===n&&(n=view.COLOR_NONE),o){case view.IMAGE_CODE_IDLE:view.CodeIdleview[n][t]=e;break;case view.IMAGE_CODE_STATELESS:view.CodeStatelessview[n][t]=e;break;case view.IMAGE_CODE_IDLE_INVERTED:view.CodeIdleInvertedview[n][t]=e;break;case view.IMAGE_CODE_LEFT:view.CodeLeftview[n][t]=e;break;case view.IMAGE_CODE_RIGHT:view.CodeRightview[n][t]=e;break;case view.IMAGE_CODE_DOWN:view.CodeDownview[n][t]=e;break;case view.IMAGE_CODE_UP:view.CodeUpview[n][t]=e;break;default:util.raiseError("unknown image state code ",o)}},view.setUnitImageForType=view.setImageForType,view.setPropertyImageForType=function(e,t,o){view.setImageForType(e,t,view.IMAGE_CODE_STATELESS,o)},view.setTileImageForType=function(e,t){view.setImageForType(e,t,view.IMAGE_CODE_STATELESS,view.COLOR_NONE)},view.setTileShadowImageForType=function(e,t){view.setImageForType(e,t,view.IMAGE_CODE_STATELESS,view.COLOR_BLACK_MASK)},view.setInfoImageForType=function(e,t){view.setImageForType(e,t,view.IMAGE_CODE_STATELESS,view.COLOR_NONE)},view.getImageForType=function(e,t,o){switch(t){case view.IMAGE_CODE_IDLE:return view.CodeIdleview[o][e];case view.IMAGE_CODE_IDLE_INVERTED:return view.CodeIdleInvertedview[o][e];case view.IMAGE_CODE_LEFT:return view.CodeLeftview[o][e];case view.IMAGE_CODE_RIGHT:return view.CodeRightview[o][e];case view.IMAGE_CODE_DOWN:return view.CodeDownview[o][e];case view.IMAGE_CODE_UP:return view.CodeUpview[o][e];case view.IMAGE_CODE_STATELESS:return view.CodeStatelessview[o][e];default:util.raiseError("unknown image state code ",t)}},view.getUnitImageForType=view.getImageForType,view.getPropertyImageForType=function(e,t){return view.getImageForType(e,view.IMAGE_CODE_STATELESS,t)},view.getTileImageForType=function(e){return view.getImageForType(e,view.IMAGE_CODE_STATELESS,view.COLOR_NONE)},view.getTileShadowImageForType=function(e){return view.getImageForType(e,view.IMAGE_CODE_STATELESS,view.COLOR_BLACK_MASK)},view.getInfoImageForType=function(e){return view.getImageForType(e,view.IMAGE_CODE_STATELESS,view.COLOR_NONE)};