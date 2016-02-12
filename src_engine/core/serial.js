cwt.Queue = function () {
  this.jobs = [];
};

cwt.Queue.prototype.pushSynchronJob = function (job) {
  this.jobs.push(function (next) {
    job();
    next();
  });
};

cwt.Queue.prototype.pushAsynchronJob = function (job) {
  this.jobs.push(job);
};

cwt.Queue.prototype.execute = function (whenDone) {
  var jobs = this.jobs;
  cwt.serialExecution(function (builder) {
    for (var i = 0; i < jobs.length; i++) {
      builder(jobs[i]);
    }
    builder(whenDone);
  });
};

var queue_create_async_caller = function (entry) {
  return function (when_done) {
    entry(entry, when_done);
  };
};

cwt.queue_async_execute_list = function (list, list_iterator, when_done) {
  var i, queue;

  queue = new cwt.Queue;
  for (i = 0; i < list.length; i++) {
    queue.pushAsynchronJob(queue_create_async_caller(list[i]));
  }

  queue.execute(when_done);
};

cwt.serialExecution = function (queueBuilder) {
  var jobs = null;
  var cIndex = 0;
  var _builderList = [];

  function executionIterator() {
    if (cIndex == jobs.length) {
      return;
    }
    var job = jobs[cIndex];
    cIndex++;
    job(cIndex == jobs.length ? null : executionIterator);
  }

  queueBuilder(function (job) {
    if (_builderList == null) {
      throw new Error("IllegalState: jobs already executed or in execution");
    }
    _builderList.push(job);
  });

  jobs = _builderList;
  _builderList = null;

  executionIterator();
};
