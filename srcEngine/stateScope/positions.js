/** @type controller.Position */
controller.stateMachine.data.source = Object.create(controller.TaggedPosition);
  
/** @type controller.Position */
controller.stateMachine.data.target = Object.create(controller.TaggedPosition);
  
/** @type controller.Position */
controller.stateMachine.data.targetselection = Object.create(controller.TaggedPosition);

/**
 * 
 * @param {controller.TaggedPosition} posA
 * @param {controller.TaggedPosition} posB
 * @param expMode
 * @returns {Boolean}
 */
controller.stateMachine.data.thereIsUnitRelationShip = function( posA, posB ){
  if( posA.unit && posA.unit === posB.unit ) return model.MODE_SAME_OBJECT;
  
  return model.relationShipCheck( 
    ( posA.unit !== null )? posA.unit.owner : null, 
    ( posB.unit !== null )? posB.unit.owner : null
  );
};

/**
 * 
 * @param {controller.TaggedPosition} posA
 * @param {controller.TaggedPosition} posB
 * @param expMode
 * @returns {Boolean}
 */
controller.stateMachine.data.thereIsUnitToPropertyRelationShip = function( posA, posB ){
  return model.relationShipCheck( 
    ( posA.unit     !== null )? posA.unit.owner : null, 
    ( posB.property !== null )? posB.property.owner : null
  );
};
