const loopManager = require("./loop_manager")
const gameLoopHolder = require("./gameloop")

exports.boot = function () {

  logInfo("booting Custom Wars Tactics")
    
  loopManager.setIntervalTime(1000)
  loopManager.startLoop(gameLoopHolder.loop)
}
