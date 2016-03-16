cwt.jobs_execute = function(job_list, when_done, when_fail) {
  var jobs = cwt.list_clone(job_list);
  var cIndex = 0;

  function executionIterator() {
    if (cIndex == jobs.length) {
      setTimeout(when_done, 10);
      return;
    }

    try {
      jobs[cIndex](cIndex == jobs.length ? null : function() {
        cIndex += 1;
        setTimeout(executionIterator, 10);
      });
    } catch (err) {
      when_fail(err);
    }
  }

  executionIterator();
};