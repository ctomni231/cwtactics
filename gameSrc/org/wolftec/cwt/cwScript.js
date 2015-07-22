/**
 * cwScript is a simple script engine which allows to code events in the modification file
 * without shipping real javaScript code. This is safer and we can control the event flow.
 * The performance overall will be slower,  but normally the events should not be very heavy.
 * So this can be ignored.
 *
 * @module
 */

"use strict";

function parseExpression(program) {
  program = skipSpace(program);
  var match, expr;
  if (match = /^"([^"]*)"/.exec(program))
    expr = {type: "value", value: match[1]};
  else if (match = /^\d+\b/.exec(program))
    expr = {type: "value", value: Number(match[0])};
  else if (match = /^[^\s(),"]+/.exec(program))
    expr = {type: "word", name: match[0]};
  else
    throw new SyntaxError("Unexpected syntax: " + program);

  return parseApply(expr, program.slice(match[0].length));
}

function parseApply(expr, program) {
  program = skipSpace(program);
  if (program[0] != "(")
    return {expr: expr, rest: program};

  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] != ")") {
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",")
      program = skipSpace(program.slice(1));
    else if (program[0] != ")")
      throw new SyntaxError("Expected ',' or ')'");
  }
  return parseApply(expr, program.slice(1));
}

function skipSpace(string) {
  var first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}

function parse(program) {
  var result = parseExpression(program);
  if (skipSpace(result.rest).length > 0)
    throw new SyntaxError("Unexpected text after program");
  return result.expr;
}

function evaluate(expr, env) {
  switch(expr.type) {
    case "value":
      return expr.value;

    case "word":
      if (expr.name in env)
        return env[expr.name];
      else
        throw new ReferenceError("Undefined variable: " + expr.name);
		
    case "apply":
      if (expr.operator.type == "word" &&
          expr.operator.name in specialForms)
        return specialForms[expr.operator.name](expr.args,
                                                env);
      var op = evaluate(expr.operator, env);
      if (typeof op != "function")
        throw new TypeError("Applying a non-function.");
      return op.apply(null, expr.args.map(function(arg) {
        return evaluate(arg, env);
      }));
  }
}

var specialForms = Object.create(null);
var topEnv = Object.create(null);

specialForms["if"] = function(args, env) {
  if (args.length != 3)
    throw new SyntaxError("Bad number of args to if");

  if (evaluate(args[0], env) !== false)
    return evaluate(args[1], env);
  else
    return evaluate(args[2], env);
};

specialForms["while"] = function(args, env) {
  if (args.length != 2)
    throw new SyntaxError("Bad number of args to while");

  while (evaluate(args[0], env) !== false) {
    evaluate(args[1], env);
  }

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};

specialForms["for"] = function(args, env) {
  if (args.length != 4) throw new SyntaxError("Bad number of args to while");
	
  var inc = parseInt(evaluate(args[2], env),10);
  for( var i = evaluate(args[0], env), e = evaluate(args[1], env); i<e; i += inc ) {
    evaluate(args[3], env);
  }
  
  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};

specialForms["do"] = function(args, env) {
  var value = false;
  for( var i = 0, e = args.length; i<e; i++ ){
	value = evaluate(args[i], env);
  }
  return value;
};

// ------------------------------------------------------------------------

specialForms["+="] = function(arg, env) {
  env[arg[0].name] += arg[1].value;
  return env[arg[0].name];
};

specialForms["-="] = function(arg, env) {
  env[arg[0].name] -= arg[1].value;
  return env[arg[0].name];
};

specialForms["*="] = function(arg, env) {
  env[arg[0].name] *= arg[1].value;
  return env[arg[0].name];
};

specialForms["/="] = function(arg, env) {
  env[arg[0].name] /= arg[1].value;
  return env[arg[0].name];
};

["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

// ------------------------------------------------------------------------

specialForms["define"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word") {
    throw new SyntaxError("Bad use of define");
  }
  
  var value = evaluate(args[1], env);
  env[args[0].name] = value;
  return value;
};

specialForms["fun"] = function(args, env) {
  if (!args.length)
    throw new SyntaxError("Functions need a body");
  function name(expr) {
    if (expr.type != "word")
      throw new SyntaxError("Arg names must be words");
    return expr.name;
  }
  var argNames = args.slice(0, args.length - 1).map(name);
  var body = args[args.length - 1];

  return function() {
    if (arguments.length != argNames.length)
      throw new TypeError("Wrong number of arguments");
    var localEnv = Object.create(env);
    for (var i = 0; i < arguments.length; i++)
      localEnv[argNames[i]] = arguments[i];
    return evaluate(body, localEnv);
  };
};

specialForms["set"] = function(args, env) {
  // Your code here.
};

topEnv["print"] = function(value) {
  console.log(value);
  return value;
};

topEnv["true"] = true;
topEnv["false"] = false;

function run() {
  var env = Object.create(topEnv);
  var program = Array.prototype.slice.call(arguments, 0).join("\n");
  return evaluate(parse(program), env);
}

// ------------------------------------------------------------------------

// This is cwScript's public API

/**
 *
 * @param code
 */
exports.parse = function (code) {

};

/**
 *
 * @param ast
 */
exports.run = function (ast) {

};

/**
 *
 * @param code
 * @return {boolean}
 */
exports.evaluate = function (code) {
  return exports.run(exports.parse(code));
};