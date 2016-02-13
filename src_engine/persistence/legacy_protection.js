model.event_on("prepare_game", function (dom) {
  cwt.persistence_prepare_map_model(model, dom);
});

model.event_on("save_game", function (dom) {
  cwt.persistence_serialize_model(model);
});

model.event_on("load_game", function (dom) {
  cwt.persistence_deserialize_model(dom, model);
});
