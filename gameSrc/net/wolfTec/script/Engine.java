package net.wolfTec.script;

import net.wolfTec.utility.Debug;
import org.stjs.javascript.*;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function1;
import org.stjs.javascript.functions.Function2;

public class Engine {

    private Map<String, Function2<Array<Program>, Map, Object>> specialForms;
    private Map<String, Object> topEnvironment;

    public Engine () {
        specialForms = JSCollections.$map();
        topEnvironment = JSCollections.$map();

        addDefaultForms();
        addDefaultVariables();
    }

    public Object evaluate(Program expr, Map<String, Object> env) {
        switch(expr.type) {

            case VALUE:
                return expr.value;

            case WORD:
                if (JSObjectAdapter.hasOwnProperty(env, expr.name)) return env.$get(expr.name);
                JSGlobal.stjs.exception("ReferenceError: Undefined variable: " + expr.name);
                break;

            case APPLY:
                if (expr.operator.type == "word" &&
                        expr.operator.name in specialForms) {
                return specialForms[expr.operator.name](expr.args,
                        env);
            }

                var op = evaluate(expr.operator, env);
                    if (typeof op != "function")
                    throw new TypeError("Applying a non-function.");
                    return op.apply(null, expr.args.map(function(arg) {
                        return evaluate(arg, env);
                }));
            break;

            default:
                JSGlobal.stjs.exception("IllegalProgramType");
        }
    }
    public Object run() {
        // TODO object must extend topEnv
        //var env = Object.create(topEnv);
        Map env = JSCollections.$map();
        var program = Array.prototype.slice.call(arguments, 0).join("\n");
        return evaluate(parse(program), env);
    }

    private void addDefaultVariables () {
        topEnvironment.$put("print", new Function1<Object, Object>() {
            @Override public Object $invoke(Object value) {
                Debug.logInfo((String) value);
                return value;
            }
        });

        topEnvironment.$put("true", true);
        topEnvironment.$put("false", false);
    }

    private void addDefaultForms () {
        addSpecialForm("if", new Function2<Array<Program>, Map, Object>() {
            @Override public Object $invoke(Array<Program> args, Map env) {
                if (args.$length() != 3)  JSGlobal.stjs.exception("SyntaxError: Bad number of args to if");

                if ((Boolean) evaluate(args.$get(0), env) != false){
                    return evaluate(args.$get(1), env);
                } else return evaluate(args.$get(2), env);
            }
        });

        addSpecialForm("while", new Function2<Array<Program>, Map, Object>() {
            @Override public Object $invoke(Array<Program> args, Map env) {
                if (args.$length() != 2) JSGlobal.stjs.exception("Bad number of args to while");

                while ((Boolean) evaluate(args.$get(0), env) != false) {
                    evaluate(args.$get(1), env);
                }

                return false;
            }
        });

        addSpecialForm("for", new Function2<Array<Program>, Map, Object>() {
            @Override public Object $invoke(Array<Program> args, Map env) {
                if (args.$length() != 4) JSGlobal.stjs.exception("Bad number of args to for loop");

                var inc = parseInt(evaluate(args[2], env),10);
                for( var i = evaluate(args[0], env), e = evaluate(args[1], env); i<e; i += inc ) {
                    evaluate(args[3], env);
                }
                return false;
            }
        });

        addSpecialForm("do", new Function2<Array<Program>, Map, Object>() {
            @Override public Object $invoke(Array<Program> args, Map env) {
                Object value = false;
                for(int i = 0, e = args.$length(); i<e; i++ ) value = evaluate(args.$get(i), env);
                return value;
            }
        });

        addSpecialForm("+=", new Function2<Array<Program>, Map, Object>() {
            @Override public Object $invoke(Array<Program> args, Map env) {
                env.$put(args.$get(0).name, ((Integer) env.$get(args.$get(0).name)) += args.$get(1).value);
                return env.$get(args.$get(0).name);
            }
        });

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
    }

    private void addSpecialForm (String name, Function2<Array<Program>, Map, Object> impl) {
        if (!JSObjectAdapter.hasOwnProperty(specialForms, name)) {
            specialForms.$put(name, impl);
        }
    }
}
