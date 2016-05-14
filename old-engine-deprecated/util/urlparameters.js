/**
 * FROM: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
 *
 * @param   {string} qs query stringq
 * @returns {object} map with url parameters
 */
cwt.getQueryParams = function (qs) {
  var params, tokens, re;
  qs = qs.split("+").join(" ");

  params = {};
  re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
};
