cwt.map_for_each_property = function(map, property_iterator) {
  var keys, i;

  keys = Object.keys(map);
  i = keys.length;
  while (i--) {
    property_iterator(keys[i], map[keys[i]]);
  }
};