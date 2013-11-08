// Success handler.
//
controller.resourceHandler_loadSucc_ = function( data ){
  if( DEBUG ) util.log("load resource","could grab file");
  controller.storage.save( path, data, this.callback );
};

// Failure handler.
//
controller.resourceHandler_loadFail_ = function( data ){
  if( DEBUG ) util.log("load resource","could not grab file");
  this.callback( null );
};

// Grabs the file from remote path. Calls the failure or success handlers after the invocation of
// the xml http request.
//
controller.resourceHandler_loadChache_ = function( path, cb ){
  util.grabRemoteFile({
    path: path,
    json: false,
    callback: cb,
    success: controller.resourceHandler_loadSucc_,
    failure: controller.resourceHandler_loadFail_
  });
};

// Grabs a resource from storage. If the resource is not in the storage, then it will be loaded
// from the given path. `forceReload` will always grab a new file from the given location.
//
controller.resourceHandler_grab = function( path, cb, forceReload ){
  if( forceReload === true ){
    // grab fresh copy
    controller.resourceHandler_loadChache_( path );
  }
  else{
    // try to use a cached version of the resource
    controller.storage.has( path , function( hasIt ){
      if( hasIt ) controller.storage.get( path, cb );
      else        controller.resourceHandler_loadChache_( path, cb );
    });
  }
};