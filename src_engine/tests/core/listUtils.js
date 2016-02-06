cwt.synchronTest("util/list", "forEachWithFilter - no filter given", function () {
  var counter, LIST = [1, 2, 3, 4];

  counter = 0;
  cwt.listFilteredForEach(LIST, function (number) {
    counter++;
  }, null);
  assert(counter == 4, "all elements should be evaluated");
});

cwt.synchronTest("util/list", "forEachWithFilter - filter given", function () {
  var checkList, LIST = [1, 2, 3, 4];

  checkList = [];
  cwt.listFilteredForEach(LIST, function (number) {
    checkList.push(number);
  }, function (number) {
    return number % 2 == 0;
  });
  assert(checkList.length == 2 && checkList[0] == 2 && checkList[1] == 4, "filter should only allowed odd numbers");
});
