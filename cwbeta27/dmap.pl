#!/usr/bin/perl
# dmap
# downloads the mapfile for a specified game

print "content-type: text/plain\n\n";

$_ = <>;
chomp($_);
open(IN, "./games/$_/map");
print <IN>;
close (IN);

exit 0;
