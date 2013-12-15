// Timer data.
//
model.dayTick_dataTime  = util.list( 50, INACTIVE_ID );

// Holds the event names that will be invoked then.
//
model.dayTick_dataEvent = util.list( 50, null );

// Holds two arguments. They will be pushed with the
// event invocation as the first two arguments.
//
model.dayTick_dataArgs  = util.list( 100, INACTIVE_ID );
