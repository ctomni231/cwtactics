Array.prototype.rotate = function(n) {
    return this.slice(n, this.length).concat(this.slice(0, n));
};

Array.prototype.flatMap = function(lambda) { 
    return Array.prototype.concat.apply([], this.map(lambda)); 
};