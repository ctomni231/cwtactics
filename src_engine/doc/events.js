/*

This sheet contains a full list of event that are available in Custom Wars: Tactics.

### Differences to the scripting API

Th event API is designed to hook in new features easily by extending listeners to events.
The listeners cannot work with or alter previous listeners. It's not the way of manipulating
previous data. If your content has to alter specific game data, then you have to use the
scripting API. The event API is primary designed to connect own data to command execution.

A good example of the possibilities is the `manpower` module, which extends the `buildUnit` event.

*/
