var sys = require('sys')
var exec = require('child_process').exec;

exec("docker -o ../docs -i ../srcEngine -c tango");

