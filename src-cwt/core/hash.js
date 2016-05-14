cwt.createHash = function(str) {
  var hash = 0;

  if (value.length === 0) {
    return hash;
  }

  for (var i = 0; i < value.length; i += 1) {
    var c = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash = hash & hash;
  }

  return hash;
};