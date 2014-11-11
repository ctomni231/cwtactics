'use strict';

var assert = require("./functions").assert;

function createNodeType(nodeRunner) {
	return function(node) {
		return new exports.Node(nodeRunner, node);
	};
}

function createCompositeType(nodeRunner) {
	return function(nodes) {
		return new exports.Composite(nodeRunner, nodes);
	};
}

function repeaterHandler(object) {
  var times = this.times;

  // run until times goes to zero (if times not given, then it runs endless)
  do {
    this.node.run(object);
    times--;
  } while (times != 0);

  return exports.Node.SUCCESS;
}

function constructBaseNode(fn) {
	assert(typeof fn === "function");
	this.run = fn;
}

exports.Node = function(fn, subNode) {
	assert(subNode === null || subNode instanceof exports.Node);

	constructBaseNode(fn);
	this.node = subNode;
};

/**
 * Marks a failure execution of a node.
 *
 * @type {number}
 */
exports.Node.FAILURE = 0;

/**
 * Marks a successful execution of a node.
 *
 * @type {number}
 */
exports.Node.SUCCESS = 1;

exports.TimerNode = function(fn, subNode, times) {
	exports.Node.call(this, fn, subNode);
	this.times = times;
};

exports.TimerNode.prototype = Object.create(exports.Node.prototype);

exports.Composite = function(fn, nodeList) {
	for (var x = 0; x < nodes.length; x++) assert(nodes[i] instanceof exports.Node);

	constructBaseNode(fn);
	this.nodeList = nodeList;
};

exports.Composite.prototype = Object.create(exports.Node.prototype);

exports.BehaviorTree = function(rootNode) {
	this.rootNode = rootNode;
};

exports.BehaviorTree.prototype = {
	step: function(object) {
		this.rootNode(object);
	}
};

exports.Task = function(taskFunction) {
	return new exports.Node(taskFunction, null);
};

exports.Inverter = createNodeType(function(object) {
	var result = this.node.run(object);

	if (result === exports.Node.SUCCESS) result = exports.Node.FAILURE;
	else if (result === exports.Node.FAILURE) result = exports.Node.SUCCESS;

	return result;
})

exports.Succeeder = createNodeType(function(object) {
	this.node.run(object);
	return exports.Node.SUCCESS;
});

exports.Repeater = function(node, timesToRun) {
	return new exports.TimerNode(repeaterHandler, node, timesToRun);
};

exports.RepeatUntilFail = createNodeType(function(object) {
	var result;

	do {
		result = this.node.run(object);
	} while (result === exports.Node.SUCCESS);

	return exports.Node.SUCCESS;
});

exports.Sequence = createCompositeType(function(object) {
	var i = 0;

	for (; i < this.nodes.length; i++) {
		var result = this.nodes[i].run(object);

		// break sequence when one node returns fail
		if (result === exports.Node.FAIL) return result;
	}

	return exports.Node.SUCCESS;
});

exports.Selector = createCompositeType(function(object) {
	var i = 0;

	for (; i < this.nodes.length; i++) {
		var result = this.nodes[i].run(object);

		// break sequence when one node returns success
		if (result === exports.Node.SUCCESS) return result;
	}

	return exports.Node.FAILURE;
});

exports.Random = createCompositeType(function(object) {
	return this.nodes[parseInt(Math.random() * this.nodes.length, 10)].run(object);
});