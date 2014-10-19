"use strict";

var aStar = window.astar;
var Graph = window.Graph;

exports.search = function (grid, start, end) {
  aStar.search(grid.nodes, start, end);
};

exports.createDataGrid = function (data) {
  return new Graph(data);
};