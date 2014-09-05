var extend = function(obj, extension, override) {
  var prop;

  if (override === false) {
    for (prop in extension) {
      if (!obj.hasOwnProperty(prop)) {
        obj[prop] = extension[prop];
      }
    }

  } else {
    for (prop in extension) {
      obj[prop] = extension[prop];
    }

    if (extension.toString !== Object.prototype.toString) {
      obj.toString = extension.toString;
    }
  }
};

exports.extendClass = function(Class, extension, override) {
  if (extension.STATIC) {
    extend(Class, extension.STATIC, override);
    delete extension.STATIC;
  }
  extend(Class.prototype, extension, override);
};

exports.Class = function(body) {
  var Class;

  if (body.constructor === Object) {
    Class = function() {};
  } else {
    Class = body.constructor;
    delete body.constructor;
  }

  if (body.SUPER) {
    Class.prototype = Object.create(body.SUPER.prototype);
    Class.Super = body.SUPER;
    delete body.SUPER;
  }

  if (body.TRAITS){
    for (var i = 0; i < body.TRAITS.length; i++){
      extend(Class.prototype, body.TRAITS[i].prototype, false);
    }

    delete body.TRAITS;
  }

  exports.extendClass(Class, body);

  return Class;
};