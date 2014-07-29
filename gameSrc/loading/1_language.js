require('../loading').addHandler(function(next) {
  if (require("../constants").DEBUG) {
    console.log("language selection");
  }

  // todo: recognize custom user selected language

  var language = window.navigator.userLanguage || window.navigator.language;

  var key;
  switch (language) {

    // german
    case "de":
    case "de-de":
    case "de-De":
    case "german":
    case "Deutsch":
      key = "de";

    // fallback case: use english
    default:
      key = "en";
  }

  require("../localization").selectLanguage(key);
});
