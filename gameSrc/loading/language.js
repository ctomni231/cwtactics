require('../loading').addHandler(function(next) {
  if (require("../constants").DEBUG) {
    console.log("language selection");
  }

  // todo: recognize custom user selected language

  var language = window.navigator.userLanguage || window.navigator.language;
  var key;

  switch (language) {

    // german ?
    case "de":
    case "de-de":
    case "de-De":
    case "german":
    case "Deutsch":
      key = "de";

    // fallback: english
    default:
      key = "en";
  }

  // select language
  require("../localization").selectLanguage(key);
});
