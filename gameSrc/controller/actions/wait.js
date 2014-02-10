new cwt.Action("wait")
  .unitAction()
  .noAutoWait() // wait is already the wait action :P
  .relation([
    "S", "T",
    cwt.Player.RELATION_NONE,
    cwt.Player.RELATION_SAMETHING
  ])  
  .condition(function (data) {
    return cwt.Gameround.canAct(data.source.unitId);
  })
  .action(function (data) {
    controller.commandStack_sharedInvokement(
      "wait_invoked",
      data.source.unitId
    );
  });
