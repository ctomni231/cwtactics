// ([a], Int) -> [a]
cwt.rotate = function(arr, count) {
  arr = arr.map(el => el);
  count = count % arr.length;
  if (count < 0) {
    arr.unshift.apply(arr, arr.splice(count))
  } else {
    arr.push.apply(arr, arr.splice(0, count))
  }
  return arr;
};
