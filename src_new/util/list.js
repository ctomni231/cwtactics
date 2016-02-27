cwt.list_created_filled_list = function(size, value) {
  var list, i;

  list = [];
  for (i = 0; i < size; i++) {
    list[i] = value;
  }

  return list;
};

cwt.list_for_each = function(list, iterator) {
  for (var i = 0; i < list.length; i++) {
    iterator(list[i], i, list);
  }
};

cwt.list_filtered_for_each = function(list, handler, filter) {
  var i, e, el;
  for (i = 0, e = list.length; i < e; i++) {
    el = list[i];
    if (!filter || filter(el)) {
      handler(el);
    }
  }
};