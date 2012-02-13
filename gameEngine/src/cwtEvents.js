/**
 * cwt event service, usable to connect to events and firing events.
 *
 * @deprecated
 * @todo will be replaced by nekoScript
 */
var cwtEvent = {}

// make it event able :P
EventEmitter.call( cwtEvent );

// simple softlink allows cwtEvent.fire("myEvent",x,y,z);
cwtEvent.fire = cwtEvent.emit;
