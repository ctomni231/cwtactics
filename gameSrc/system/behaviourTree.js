'use strict';

var assert = function (expr,msg) {
    if (!expr) {
        throw Error((msg? msg : "assertion failed"));
    }
};

exports.BehaviorTree = function() {
    this.rootNode = null;
};

exports.BehaviorTree.prototype = {
    step: function (object) {
       this.rootNode.run(object);
    }
};

exports.Leaf = function(fn) {
    assert(typeof fn === "function");
    this.run = fn;
};

exports.Leaf.FAIL = 0;

exports.Leaf.SUCCESS = 1;

exports.Leaf.RUNNING = 2;

exports.Composite = null;

// A composite node is a node that can have one or more children. They will process one or more of these 
// children in either a first to last sequence or random order depending on the particular composite node in 
// question, and at some stage will consider their processing complete and pass either success or failure to 
// their parent, often determined by the success or failure of the child nodes. During the time they are processing 
// children, they will continue to return Running to the parent.

exports.Sequence = function() {
};

// The simplest composite node found within behaviour trees, their name says it all. A sequence will visit each child in order, 
// starting with the first, and when that succeeds will call the second, and so on down the list of children. If any child 
// fails it will immediately return failure to the parent. If the last child in the sequence succeeds, then the sequence 
// will return success to its parent.

exports.Selector = function() {
};

// Selectors are the yin to the sequence's yang. Where a sequence is an AND, requiring all children to succeed 
// to return a success, a selector will return a success if any of its children succeed and not process any further 
// children. It will process the first child, and if it fails will process the second, and if that fails will process the third, 
// until a success is reached, at which point it will instantly return success. It will fail if all children fail. This means a 
// selector is analagous with an OR gate, and as a conditional statement can be used to check multiple conditions to see if any one of them is true.
// Their main power comes from their ability to represent multiple different courses of action, in order of priority from 
// most favorable to least favorable, and to return success if it managed to succeed at any course of action. The 
// implications of this are huge, and you can very quickly develop pretty sophisticated AI behaviours through the use of selectors.

exports.Random = function() {
};

// I’m not going to dwell on these, as their behaviour will be obvious given the previous sections. Random 
// sequences/selectors work identically to their namesakes, except the actual order the child nodes are processed is 
// determined randomly. These can be used to add more unpredictability to an AI character in cases where there 
// isn’t a clear preferable order of execution of possible courses of action.

exports.Decorator = function() {
};

// A decorator node, like a composite node, can have a child node. Unlike a composite node, they can specifically 
// only have a single child. Their function is either to transform the result they receive from their child node's status, 
// to terminate the child, or repeat processing of the child, depending on the type of decorator node.

exports.Inverter = function() {
};

// We’ve already covered this one. Simply put they will invert or negate the result of their child node. Success 
// becomes failure, and failure becomes success. They are most often used in conditional tests.

exports.Succeeder = function() {
};

// A succeeder will always return success, irrespective of what the child node actually returned. These are useful in cases 
// where you want to process a branch of a tree where a failure is expected or anticipated, but you don’t want to abandon 
// processing of a sequence that branch sits on. The opposite of this type of node is not required, as an inverter will turn 
// a succeeder into a ‘failer’ if a failure is required for the parent.

exports.Repeater = function() {
};

// A repeater will reprocess its child node each time its child returns a result. These are often used at the very base of the 
// tree, to make the tree to run continuously. Repeaters may optionally run their children a set number of times before returning 
// to their parent.

exports.RepeatUntilFail = function() {
};

// Like a repeater, these decorators will continue to reprocess their child. That is until the child finally returns a failure, 
// at which point the repeater will return success to its parent.