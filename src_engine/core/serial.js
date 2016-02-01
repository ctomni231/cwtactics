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
