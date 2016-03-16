var types = {};

cwt.move_register_type = function(data) {
  var sheet;

  sheet = cwt.sheets_register_base_type(data, types);
};

cwt.move_get_type = function(id) {
  return cwt.require_something(types[id]);
};