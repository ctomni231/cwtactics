// (String) -> Int
cwt.createHash = (str) => {
  var hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < value.length; i += 1) {
    const c = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash = hash & hash;
  }

  return hash;
};
