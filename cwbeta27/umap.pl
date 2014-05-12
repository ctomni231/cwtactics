#!/usr/bin/perl
# umap.pl
# uploads a map

print "content-type: text/plain\n\n";

@cont = <>;
chomp($cont[0]);
open(OUT, "> ./games/$cont[0]/map");
$f = 1;
foreach $i (@cont){
	if($f == 1){
		$f = 0;
	}else{
		print OUT $i;
	}
}
close (OUT);

print "File Recieved";
exit 0;
