controller.unitAction({key:"explode",relation:["S","T",model.relationModes.NONE,model.relationModes.SAME_OBJECT],condition:function(e){return model.isSuicideUnit(e.source.unitId)},invoke:function(e){controller.sharedInvokement("destroyUnit_silent",[e.source.unitId]),controller.sharedInvokement("doExplosionAt",[e.target.x,e.target.y,e.source.unit.type.suicide.range,model.ptToHp(e.source.unit.type.suicide.damage),e.source.unit.owner])}});