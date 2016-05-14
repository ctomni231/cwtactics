cwt.loading_localize_frontend = function (when_done, error_receiver) {
  cwt.list_forEach(document.querySelectorAll("[key]"), function (element) {
    element.innerHTML = model.data_localized(element.attributes.key.value);
  });

  when_done();
};
