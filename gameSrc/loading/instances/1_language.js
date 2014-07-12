cwt.Loading.create(function(next) {
  if (cwt.DEBUG) {
    console.log("language selection");
  }

  // todo: recognize custom user selected language

  var language = window.navigator.userLanguage || window.navigator.language;

  switch (language) {

    // german
    case "de":
    case "de-de":
    case "de-De":
    case "german":
    case "Deutsch":
      cwt.Localization.selectLanguage("de");

    // fallback case: use english
    default:
      cwt.Localization.selectLanguage("en");
  }
});
