/**
 * If this value is true, then the state machine is in a 
 * multi step action that does some actions while holding
 * the source object even after flush some sub actions.
 */
cwt.gameFlowData.inMultiStep = false;

/**
 * If true, then the game flow will break out of the multi 
 * step action back into the idle state. E.g. when a unit
 * will be trapped during a multi step action.
 */
cwt.gameFlowData.breakMultiStep = false;