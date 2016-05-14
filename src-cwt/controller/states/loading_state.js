var TOOLTIP_TIMEOUT = 5000;

cwt.loadingState = {

  _initTips() {
    this.tips = [];
    this.events.subscribe("game:loadtype:TIPS", data => this.tips = data);
    this.tipTimer = this.generateTimer(TOOLTIP_TIMEOUT, () => this.log.info("TIP: " + this.tips[parseInt(Math.random() * this.tips.length, 10)]));
  },

  enter() {
    this.doneLoading = false;

    var createDataHandler = (type, path) => {
      return (cbDone, cbFail) => {
        this.requestData(path, (data) => {
          this.log.info("grabbed data from path " + path);
          this.events.publish("game:loadtype:" + type, data);
          cbDone();
        }, cbFail);
      };
    };

    this._initTips();

    this.serial([
        createDataHandler("TIPS", cwt.MOD_PATH + "/tips.json"),
        createDataHandler("TILES", cwt.MOD_PATH + "/tiles.json"),
        createDataHandler("UNITS", cwt.MOD_PATH + "/units.json"),
        createDataHandler("MOVETYPES", cwt.MOD_PATH + "/movetypes.json"),
        createDataHandler("WEATHERS", cwt.MOD_PATH + "/weathers.json")
      ],
      () => this.doneLoading = true,
      (error) => this.log.error(error)
    );
  },

  update(delta, input) {
    this.tipTimer.tick(delta);
    if (this.doneLoading && input.isActionPressed("ACTION")) {
      this.log.info("completed data loading");
      return "MAINMENU";
    }
    return;
  },

  render(delta) {

  }
};