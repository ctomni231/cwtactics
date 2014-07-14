cwt.Loading.create(function (next) {
  function doOnOrientationChange() {
    switch (window.orientation) {
      case -90:
      case 90:
        console.log('landscape');
        break;

      default:
        console.log('portrait');
        break;
    }
  }

  window.addEventListener('orientationchange', doOnOrientationChange);

  // Initial execution if needed
  doOnOrientationChange();

  next();
});