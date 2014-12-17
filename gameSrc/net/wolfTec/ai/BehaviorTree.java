package net.wolfTec.ai;

public class BehaviorTree {

    function createNodeType(nodeRunner) {
        return function(node) {
            return new behaviorTree.Node(nodeRunner, node);
        };
    }

    function createCompositeType(nodeRunner) {
        return function(nodes) {
            return new behaviorTree.Composite(nodeRunner, nodes);
        };
    }

    function repeaterHandler(object) {
        var times = this.times;

        // run until times goes to zero (if times not given, then it runs endless)
        do {
            this.node.run(object);
            times--;
        } while (times != 0);

        return behaviorTree.Node.SUCCESS;
    }

    function constructBaseNode(fn) {
        assert(typeof fn === "function");
        this.run = fn;
    }

    behaviorTree.Node = function(fn, subNode) {
        assert(subNode === null || subNode instanceof behaviorTree.Node);

        constructBaseNode(fn);
        this.node = subNode;
    };

/**
 * Marks a failure execution of a node.
 *
 * @type {number}
 */
    behaviorTree.Node.FAILURE = 0;

/**
 * Marks a successful execution of a node.
 *
 * @type {number}
 */
    behaviorTree.Node.SUCCESS = 1;

    behaviorTree.TimerNode = function(fn, subNode, times) {
        behaviorTree.Node.call(this, fn, subNode);
        this.times = times;
    };

    behaviorTree.TimerNode.prototype = Object.create(behaviorTree.Node.prototype);

    behaviorTree.Composite = function(fn, nodeList) {
        for (var x = 0; x < nodeList.length; x++) assert(nodeList[i] instanceof behaviorTree.Node);

        constructBaseNode(fn);
        this.nodeList = nodeList;
    };

    behaviorTree.Composite.prototype = Object.create(behaviorTree.Node.prototype);

    behaviorTree.BehaviorTree = function(rootNode) {
        this.rootNode = rootNode;
    };

    behaviorTree.BehaviorTree.prototype = {
        step: function(object) {
            this.rootNode(object);
        }
    };

    behaviorTree.Task = function(taskFunction) {
        return new behaviorTree.Node(taskFunction, null);
    };

    behaviorTree.Inverter = createNodeType(function(object) {
        var result = this.node.run(object);

        if (result === behaviorTree.Node.SUCCESS) result = behaviorTree.Node.FAILURE;
        else if (result === behaviorTree.Node.FAILURE) result = behaviorTree.Node.SUCCESS;

        return result;
    })

    behaviorTree.Succeeder = createNodeType(function(object) {
        this.node.run(object);
        return behaviorTree.Node.SUCCESS;
    });

    behaviorTree.Repeater = function(node, timesToRun) {
        return new behaviorTree.TimerNode(repeaterHandler, node, timesToRun);
    };

    behaviorTree.RepeatUntilFail = createNodeType(function(object) {
        var result;

        do {
            result = this.node.run(object);
        } while (result === behaviorTree.Node.SUCCESS);

        return behaviorTree.Node.SUCCESS;
    });

    behaviorTree.Sequence = createCompositeType(function(object) {
        var i = 0;

        for (; i < this.nodes.length; i++) {
            var result = this.nodes[i].run(object);

            // break sequence when one node returns fail
            if (result === behaviorTree.Node.FAIL) return result;
        }

        return behaviorTree.Node.SUCCESS;
    });

    behaviorTree.Selector = createCompositeType(function(object) {
        var i = 0;

        for (; i < this.nodes.length; i++) {
            var result = this.nodes[i].run(object);

            // break sequence when one node returns success
            if (result === behaviorTree.Node.SUCCESS) return result;
        }

        return behaviorTree.Node.FAILURE;
    });

    behaviorTree.Random = createCompositeType(function(object) {
        return this.nodes[parseInt(Math.random() * this.nodes.length, 10)].run(object);
    });
}
