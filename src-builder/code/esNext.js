const log = require("./log").log;

const es6CS = require("es6-class");
const es6AF = require("es6-arrow-function");
const es6OS = require("es6-object-short");
const es6OC = require("es6-object-concise");
const es6DP = require("es6-default-params");

exports.convertToES2015 = function(file, code) {
  try {
    code = es6CS.compile(code).code;
    code = es6AF.compile(code).code;
    code = es6OS.compile(code).code;
    code = es6OC.compile(code).code;
    code = es6DP.compile(code).code;
    return code;

  } catch (e) {
    log("Cannot convert es6 source back to es5 [" + e.message + "]");

    const errorLine = parseInt(e.message.substr(5, e.message.indexOf(":") - 5), 10);
    const lines = code.split("\n");
    const printErrorLine = (line) => log("ERROR: ...[" + line + "] " + lines[line]);

    if (errorLine > 0) printErrorLine(errorLine - 1);
    printErrorLine(errorLine);
    if (lines.length >= errorLine + 1) printErrorLine(errorLine + 1);

    throw e;
  }
};