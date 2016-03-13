cwt.stress_simulate_a_lot_of_it = function(modifier) {
  var iterations;

  iterations = 100000 * modifier;
  while (iterations > 0) {
    var n = Math.sqrt(Math.random()) * Math.sqrt(Math.random());
    iterations -= 1;
  }
};