#!/usr/bin/perl
# dsave
# downloads the savefile for a specified game

print "content-type: text/plain\n\n";

$_ = <>;
chomp($_);
open(IN, "./games/$_/save");
print <IN>;
close (IN);

open(SYS, ">> ./games/$_/syslog");
$ctime = gmtime();
print SYS "\nGame Loaded:$ctime";
close(SYS);

exit 0;
