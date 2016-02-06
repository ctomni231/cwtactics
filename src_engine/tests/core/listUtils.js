gameServices.synchronTest("list-utilities", "forEachWithFilter - no filter given", function () {
  var counter, LIST = [1, 2, 3, 4];

  counter = 0;
  util.forEachWithFilter(LIST, function (number) {
    counter++;
  }, null);
  assert(counter == 4, "all elements should be evaluated");
});

gameServices.synchronTest("list-utilities", "forEachWithFilter - filter given", function () {
  var checkList, LIST = [1, 2, 3, 4];

  checkList = [];
  util.forEachWithFilter(LIST, function (number) {
    checkList.push(number);
  }, function (number) {
    return number % 2 == 0;
  });
  assert(checkList.length == 2 && checkList[0] == 2 && checkList[1] == 4, "filter should only allowed odd numbers");
});
