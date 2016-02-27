cwt.sheets_is_valid_type_id = function(id) {
  return id.length === 4;
};

cwt.sheets_register_base_type = function(data, sheet_map) {
  cwt.require_something(sheet_map);

  var sheet = {};

  sheet.id = cwt.require_string(data.id);
  cwt.assert_true(cwt.sheets_is_valid_type_id(data.id));
  cwt.require_nothing(sheet_map[data.id]);

  sheet_map[data.id] = sheet;

  return sheet;
};