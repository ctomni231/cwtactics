/**
 * @class
 */
cwt.Pagination = my.Class(/** @lends cwt.Pagination.prototype */ {

  constructor: function (list, pageSize, updateFn) {
    this.page = 0;
    this.list = list;
    this.entries = [];
    while (pageSize > 0) {
      this.entries.push(null);
      pageSize--;
    }
    this.updateFn = updateFn;
  },

  /**
   *
   * @param index
   */
  selectPage: function (index) {
    var PAGE_SIZE = this.entries.length;

    if (index < 0 || index * PAGE_SIZE >= this.list.length) {
      return;
    }

    this.page = index;

    index = (index * PAGE_SIZE);
    for (var n = 0; n < PAGE_SIZE; n++) {
      this.entries[n] = (index + n >= this.list.length) ? null : this.list[index + n];
    }

    if (this.updateFn) {
      this.updateFn();
    }
  }

});