var serialExecutor = function(jobList, cbDone, cbFail) {
  var jobs = jobList.slice(0);

  function executionIterator(index) {
    try {
      jobs[index](function() {
        setTimeout(index + 1 === jobs.length ? cbDone : () => executionIterator(index + 1), 10);
      }, cbFail);
    } catch (err) {
      cbFail(err);
    }
  }

  executionIterator(0);
};

cwt.executeJobs = serialExecutor;
