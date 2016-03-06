cwt.list_created_filled_list = function(size, value) {
  return cwt.list_created_filled_list_with_provider(size, function() {
    return value;
  });
};

cwt.list_created_filled_list_with_provider = function(size, value_supplier) {
  var list, i;

  list = [];
  for (i = 0; i < size; i += 1) {
    list[i] = value_supplier(i);
  }

  return list;
};

cwt.list_for_each = function(list, iterator) {
  for (var i = 0; i < list.length; i += 1) {
    iterator(list[i], i, list);
  }
};

cwt.list_filtered_for_each = function(list, handler, filter) {
  var i, e, el;
  for (i = 0, e = list.length; i < e; i += 1) {
    el = list[i];
    if (!filter || filter(el)) {
      handler(el);
    }
  }
};

cwt.list_convert_arguments_to_list = function(args) {
  var result = [];
  for (var i = 0; i < args.length; i += 1) {
    result[i] = args[i];
  }
  return result;
};