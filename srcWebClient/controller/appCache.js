// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
  
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);
  
}, false);

// The manifest returns 404 or 410, the download failed,
// or the manifest changed while the download was in progress.
window.applicationCache.addEventListener('error', function(){
  alert("could not download the game data into the offline storage");
}, false);