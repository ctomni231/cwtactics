model.clientInstances=util.list(constants.MAX_PLAYER,!1),model.lastActiveClientPid=-1,controller.persistenceHandler(function(){model.lastActiveClientPid=-1},function(){}),model.registerClientPlayer=function(e){return model.isValidPlayerId(e)?(model.clientInstances[e]=!0,-1===model.lastActiveClientPid&&(model.lastActiveClientPid=e),!0):!1},model.deregisterClientPlayer=function(e){return model.isValidPlayerId(e)?(model.clientInstances[e]=!1,!0):!1},model.isClientPlayer=function(e){return model.clientInstances[e]===!0};