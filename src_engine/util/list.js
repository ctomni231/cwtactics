/**
 * 
 * @param   {number} size  size of the list
 * @param   {object} value value that will be placed in every slot
 *                       of the list
 * @returns {Array}  created list
 */
cwt.createFilledList = function (size, value) {
  var list, i;

  list = [];
  for (i = 0; i < size; i++) {
    list[i] = value;
  }

  return list;
};

/**
 * 
 * @param {Array}                     list    list that will be iterated
 * @param {function(element)}         handler handler which does something with the list element
 * @param {function(element):boolean} filter  filter which prevents the evaluating of the handler for the
 *                                            checked element when return false
 */
cwt.listFilteredForEach = function (list, handler, filter) {
  var i, e, el;
  for (i = 0, e = list.length; i < e; i++) {
    el = list[i];
    if (!filter || filter(el)) {
      handler(el);
    }
  }
};


(function () {

  var fill = function () {
    var defValue = this.__defValue__;
    var len = this.__length__;
    var isFN = typeof defValue === 'function';

    // SIMPLE ARRAY OBJECT
    for (var i = 0, e = len; i < e; i++) {
      if (isFN) this[i] = defValue(i, this[i]);
      else this[i] = defValue;
    }
  };

  var clone = function (list) {
    var lenA = this.__length__;
    var lenB = list.__length__;
    if (typeof lenB) lenB = list.length;

    if (lenB !== lenA) throw Error("source and target list have different lengths");

    for (var i = 0, e = lenA; i < e; i++) {
      list[i] = this[i];
    }
  };

  var grab = function (list) {
    var lenA = this.__length__;
    var lenB = list.__length__;
    if (typeof lenB) lenB = list.length;

    if (lenB !== lenA) throw Error("source and target list have different lengths");

    for (var i = 0, e = lenA; i < e; i++) {
      this[i] = list[i];
    }
  };

  // Creates a list with a given length and fills it with a
  // default value.
  //
  util.list = function (len, defaultValue) {
    if (defaultValue === undefined) {
      defaultValue = null;
    }

    var warr = [];
    warr.__defValue__ = defaultValue;
    warr.__length__ = len;
    warr.resetValues = fill;
    warr.cloneValues = clone;
    warr.grabValues = grab;

    warr.resetValues();

    return warr;
  };


})();
