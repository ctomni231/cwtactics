
// FROM: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-url-parameter
window.getURLQueryParams = function (qs) {
        qs = qs.split("+").join(" ");

        var params = {};
        var tokens;
        var re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
};