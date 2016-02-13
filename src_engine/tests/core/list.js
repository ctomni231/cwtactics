cwt.test_synchron("util-list", "list_filtered_for_each - no filter given", function () {
  var counter, LIST = [1, 2, 3, 4];

  counter = 0;
  cwt.list_filtered_for_each(LIST, function (number) {
    counter += 1;
  }, null);
  cwt.assert_true(counter == 4, "all elements should be evaluated");
});

cwt.test_synchron("util-list", "list_filtered_for_each - filter given", function () {
  var check_list, LIST = [1, 2, 3, 4];

  check_list = [];
  cwt.list_filtered_for_each(LIST, function (number) {
    check_list.push(number);
  }, function (number) {
    return number % 2 === 0;
  });
  cwt.assert_true(check_list.length == 2 && check_list[0] == 2 && check_list[1] === 4, "filter should only allowed odd numbers");
});
