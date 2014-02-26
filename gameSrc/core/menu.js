/**
 *
 * @class
 */
cwt.Menu = my.Class({

  constructor: function (size) {
    this.content = new cwt.List(size, null);
    this.enabled = new cwt.List(size, true);
    this.size = 0;
  },

  // Adds an object to the menu.
  //
  addEntry: function (entry, enabled) {
    assert(this.size < this.data.length);

    this.content.data[this.size] = entry;

    if (typeof enabled === "undefined") enabled = true;
    this.enabled.data[this.size] = (enabled === true);

    this.size++;
  },

  isEntryEnabled: function (index) {
    return (this.enabled.data[index] === true);
  },

  getEntry: function (index) {
    return this.content.data[index];
  },

  /**
   * Cleans the menu.
   */
  clean: function () {
    this.content.resetValues();
    this.enabled.resetValues();
    this.size = 0;
  }
});