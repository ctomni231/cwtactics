#!/usr/bin/perl
#generates a list of currently available games

#PRINT HEADER
print "content-type: text/html\n\n";
print "<HTML><HEAD><TITLE>Available Games</TITLE></HEAD><BODY>";
print "<H1>List of Available Games</H1>";
print "To play: Go get <A HREF=http://www.customwars.com/>Custom Wars</A> and use it to join a game.<BR>";
print "Open Game means there is no password.<BR>";
print "A player named empty means there is no commander for that army.<P>";

#GET INFORMATION
@open;
@pass;
@full;
open(LIST, "gamelist");
@games = <LIST>;
close(LIST);
foreach $i (@games){
	chomp($i);
	open(MAIN,"./games/$i/info");
	@main = <MAIN>;
	close(MAIN);
	open(TURN,"./games/$i/turn");
	@turn = <TURN>;
	close(TURN);
	open(SYSLOG,"./games/$i/syslog");
	@slog = <SYSLOG>;
	close(SYSLOG);
	$lastdate = $slog[(scalar @slog)-1];
	@date = split(":",$lastdate);
	$lastdate = "$date[1]:$date[2]:$date[3]";
	
	chomp($main[0]);
	chomp($main[1]);
	$open = "no";
	if($main[1] eq ""){
		$open = "yes";
	}
	chomp($main[2]);
	chomp($main[3]);
	chomp($main[4]);
	chomp($main[7]);
	
	chomp($turn[0]);
	$full = "yes";
	$players = "";
	$numplay = $main[0];
	for($j = 0; $j < $main[0]; $j+=1){
		$pos2 = 2 + $j;
		chomp($turn[$pos2]);
		$active = 1;
		if($turn[$pos2] eq "eliminated"){
			$active = 0;
		}
		$pos = 9 + 7*$j;
		chomp($main[$pos]);
		if($main[$pos] eq "empty"){
			$full = "no";
			$numplay -= 1;
		}
		if($j != 0){
			if($active == 0){
				$players = $players.", <font color=red>$main[$pos]</font>";
			}else{
				$players = $players.", $main[$pos]";
			}
		}else{
			if($active == 0){
				$players = $players."<font color=red>$main[$pos]</font>";
			}else{
				$players = $players."$main[$pos]";
			}
		}
	}
	#A game in progress is always full
	if($turn[0] > 1){
		$full = "yes";
	}
	$namecolor = "black";
	if($main[7] eq "ended"){
		$namecolor = red;
	}
	$output = "<TR><TD><font color=$namecolor>$i</font></TD><TD>$numplay/$main[0]</TD><TD>$turn[0]/$turn[1]</TD><TD>$main[4]</TD><TD>$main[2]</TD><TD>$players</TD><TD>$lastdate</TD><TD>$main[3]</TD></TR>";
	if($full eq "yes"){
		push(@full,$output);
	}elsif($open eq "yes"){
		push(@open,$output);
	}else{
		push(@pass,$output);
	}
}
#PRINT TABLES
print "<H2>Open Games</H2>";
print "<TABLE border = 1><TR><TD>Game Name</TD><TD>Players</TD><TD>Turn</TD><TD>Map Name</TD><TD>Version</TD><TD>Player List</TD><TD>Last Action</TD><TD>Comment</TD></TR>";
print @open;
print "</TABLE>";
print "<H2>Password Protected Games</H2>";
print "<TABLE border = 1><TR><TD>Game Name</TD><TD>Players</TD><TD>Turn</TD><TD>Map Name</TD><TD>Version</TD><TD>Player List</TD><TD>Last Action</TD><TD>Comment</TD></TR>";
print @pass;
print "</TABLE>";
print "<H2>Full Games</H2>";
print "<TABLE border = 1><TR><TD>Game Name</TD><TD>Players</TD><TD>Turn</TD><TD>Map Name</TD><TD>Version</TD><TD>Player List</TD><TD>Last Action</TD><TD>Comment</TD></TR>";
print @full;
print "</TABLE>";

#PRINT FOOTER
print "</BODY></HTML>";
