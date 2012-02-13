// most things could be described as rules
UNIT_HP_BECKEND_TEST = "WHEN unit.hp > 99 THEN unit.hp = 99";
UNIT_HP_BECKEND_NEG_TEST = "WHEN unit.hp < 0 THEN unit.hp = 0";

/* also ingame logic
 *
 * some ideas about CWT programmed in a rule based way
 * in my opinion much more readable as algorithm style and far easier configurable and(!) extendable
 *

// MAP MENU
WHEN
  state IS state.IDLE
  user.clicked
  NOT EXISTS user.clickedTile.unit
  NOT EXISTS user.clickedTile.property
THEN
  menu.commands += i18n.END_TURN;
END

 // PROPERTY MENU
WHEN
  user.clicked
  user.clickedTile.property EXISTS
  user.clickedTile.property.canBuild HAS ITEMS
  user.clickedTile.unit NOT EXISTS
THEN
  menu.commands += i18N.BUILD_OBJECT
END

// FACTORY MENU
WHEN
  menu.clicked IS i18N.BUILD_OBJECT
THEN
  FOR item IN user.clickedTile.property.sheet.canBuild DO
    menu.commands += {
      key: item,
      value: i18N[item],
      footerValue: ("{0}$", user.clickedTile.property.sheet.canBuild[item])
    }
END

// UNIT MENU
WHEN
  user.clicked
  user.clickedTile.unit EXISTS
THEN
  menu.commands += i18n.MOVE_UNIT;
END

// IDLE --> MENU
WHEN
  state IS state.IDLE
  user.clicked
THEN
  state = state.SHOW_MENU
END

WHEN
  unit.transport
  unit.transport.loads HAS ITEMS
THEN
  menu.commands += COMMAND.UNLOAD;
END

RULE buildUnloadMenu
ON menuEntryClicked
WHEN
  menu.clicked == COMMAND.UNLOAD
THEN
  FOR EACH item IN unit.transport.loads DO
    menu.commands += menu.entry(COMMAND.UNLOAD_UNIT,format("{0} {1}",i18n.unload,item.id))
  END
END

RULE selectUnloadTargetField
ON menuEntryClicked
WHEN
  menu.clicked == COMMAND.UNLOAD_UNIT
THEN
  SET state TO state.SELECT_UNLOAD_TARGET
  response.showTileSelection( map.neighborsOf(user.clickedTile,1) )
END

RULE unloadUnit
ON userRequest
WHEN
  state IS state.SELECT_UNLOAD_TARGET
THEN
  unit.transport.loads -= unload.unit;
  map[user.request.selected.x][user.response.selected.y] = unload.unit;
  response.anim('unitTransition',unload.transporter.tile.x,unload.transporter.tile.y,
                                 user.request.selected.x  ,user.response.selected.y);
END

RULE sysLog
  togglerName: DEBUG
WHEN
  sys.devmode
  sys.ruleFired
THEN
  sys.log("{0} was invoked at {1|time:HH.MM.SS}", firedRule.name, firedRule.time)
END
*/