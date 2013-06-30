var sys = require('sys')
var exec = require('child_process').exec;

exec("docker -o dist/nightly/docs -i srcEngine -u -n -c tango --extras fileSearch");