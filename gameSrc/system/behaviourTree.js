'use strict';

var assert = require("./functions").assert;

function createNodeType(nodeRunner) {
	return function(node) {
		return new exports.Node(nodeRunner, node);
	}
}

function createCompositeType(nodeRunner) {
	return function(nodes) {
		return new exports.Composite(nodeRunner, nodes);
	}
}

function runningHandler(object) {
	var result = this.fn(object);

	if (result === exports.Node.RUNNING) {
		this.running = true;
	} else {
		this.running = false;
	}
}

exports.BehaviorTree = function (rootNode) {
	this.rootNode = rootNode;
};

exports.BehaviorTree.prototype.step = function (object) {
	this.rootNode(object);
};

exports.Node.FAILURE = 0;
exports.Node.SUCCESS = 1;
exports.Node.RUNNING = 2;

function constructBaseNode(fn) {
	assert(typeof fn === "function");
	this.run = runningHandler;
	this.fn = fn;
	this.running = false;
}

exports.Node = function(fn, subNode) {
	constructBaseNode(fn);

	assert(subNode === null || subNode instanceof exports.Node || subNode instanceof exports.Composite);
	this.node = subNode;
};

exports.Composite = function(fn, nodeList) {
	constructBaseNode(fn);

	for (var x = 0; x < nodes.length; x++) assert(nodes[i] instanceof exports.Node || nodes[i] instanceof exports.Composite);
	this.nodeList = nodeList;
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
	return (this.node.run(object) === exports.Node.RUNNING ? exports.Node.SUCCESS : exports.Node.SUCCESS);
});

exports.Repeater = createNodeType(function(object) {
	var times = this.times;

	// run until times goes to zero (if times not given, then it runs endless)
	do {
		this.node.run(object);
		times--;
	} while (times != null);

	return exports.Node.SUCCESS;
});

exports.RepeatUntilFail = createNodeType(function(object) {
	var result;

	do {
		result = this.node.run(object);
	} while (result === exports.Node.SUCCESS);
	
	return (result === exports.Node.RUNNING? exports.Node.RUNNING : exports.Node.SUCCESS);
});

exports.Sequence = createCompositeType(function(object) {
	var i = 0;

	if (this.running) {
		// search already running node
		for (;i < this.nodes.length; i++) {
			if (this.nodes[i].running) {
				break;
			}
		}
	}

	for (; i < this.nodes.length; i++) {
		var result = this.nodes[i].run(object);

		// break sequence when one node returns fail
		if (result === exports.Node.FAIL) return result;
	}

	return exports.Node.SUCCESS;
});

exports.Selector = createCompositeType(function(object) {
	var i = 0;

	if (this.running) {
		// search already running node
		for (;i < this.nodes.length; i++) {
			if (this.nodes[i].running) {
				break;
			}
		}
	}

	for (; i < this.nodes.length; i++) {
		var result = this.nodes[i].run(object);

		// break sequence when one node returns success
		if (result === exports.Node.SUCCESS) return result;
	}

	return exports.Node.FAIL;
});

exports.Random = createCompositeType(function(object) {
	var index = 0;

	if (this.running) {

		// use already runnin node
		for (;index < this.nodes.length; index++) {
			if (this.nodes[index].running) {
				break;
			}
		}
	} else {

		// take random node
		index = parseInt(Math.random() * this.nodes.length, 10);
	}

	return this.nodes[index].run(object);
});