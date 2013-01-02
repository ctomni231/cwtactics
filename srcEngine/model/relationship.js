/**
 * Two objects which have the same owner.
 *
 * @constant
 */
model.RELATIONSHIP_SAME_OWNER = 0;

/**
 * Two objects which have differnt of the same team.
 *
 * @constant
 */
model.RELATIONSHIP_ALLIED = 1;

/**
 * Two objects which have differnt owners of different teams.
 *
 * @constant
 */
model.RELATIONSHIP_ENEMY = 2;

/**
 * Two objects which have no relationship because one or both of them
 * hasn't an owner.
 *
 * @constant
 */
model.RELATIONSHIP_NONE = 3;

/**
 * @constant
 */
model.RELATIONSHIP_SAME_OBJECT = 4;


/**
 * Returns the relationship between two player identicals.
 *
 * @param pidA player id or ownable object
 * @param pidB player id or ownable object
 */
model.relationshipBetween = function( pidA, pidB ){
  if( pidA === null || pidB === null ){
    return model.RELATIONSHIP_NONE;
  }

  if( typeof pidA !== 'number' &&  typeof pidB !== 'number'
    && pidA === pidB ) return model.RELATIONSHIP_SAME_OBJECT;

  if( typeof pidA !== 'number' ) pidA = pidA.owner;
  if( typeof pidB !== 'number' ) pidB = pidB.owner;

  if( pidA === pidB ) return model.RELATIONSHIP_SAME_OWNER;
  else {
    var tidA = model.players[ pidA ];
    var tidB = model.players[ pidB ];
    if( tidA === tidB ){
      return model.RELATIONSHIP_ALLIED;
    }
    else return model.RELATIONSHIP_ENEMY;
  }
};
