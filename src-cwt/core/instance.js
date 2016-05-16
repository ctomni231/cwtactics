cwt.produceInstance = function(prototype, dependencies) {
  return Object.assign(Object.create(prototype), dependencies);
};