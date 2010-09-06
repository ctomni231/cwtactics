#!/usr/bin/perl
opendir(TEMPDIR, './') || die "Can't open directory";
@cool = readdir TEMPDIR;
@items = grep /log/, @cool;
print "Delete all .log files [Y/N]?";
$input = <STDIN>;
chomp $input;
if(uc($input) eq "Y"){
	unlink @items;
	print "Files deleted!!!"
}else{
	print "Deletion aborted!!!"
}