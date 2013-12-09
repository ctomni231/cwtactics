//
// This package contains all logic that reacts on engine events. Basically this package will be used to setup
// animations and recalculate visible game information on the screen.
//
// Animations will be registered by `view.registerAnimationHook( impl )` (?) and client data model updating listeners
// by `controller.event_on( evName, evCallback )`. Remember that every event accepts only one listener. If you need
// more listeners for one event, then you have to build an observer, as main listener which indicates the event
// to the sub listeners, on your own.
//
