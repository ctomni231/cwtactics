#!/usr/bin/perl
# usave.pl
# uploads a save
use File::Copy;

#begin
print "content-type: text/plain\n\n";
@cont = <>;
chomp($cont[0]);

#backup old save file
copy("./games/$cont[0]/save","./games/$cont[0]/backup");

#get file and write to save
open(OUT, "> ./games/$cont[0]/save");
$f = 1;
foreach $i (@cont){
	if($f == 1){
		$f = 0;
	}else{
		print OUT $i;
	}
}
close (OUT);
	
open(SYS, ">> ./games/$cont[0]/syslog");
$ctime = gmtime();
print SYS "\nGame Saved:$ctime";
close(SYS);

print "File Recieved";
exit 0;
