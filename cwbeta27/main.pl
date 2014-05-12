#!/usr/bin/perl
# The main script for snail mode games in Custom Wars
# Deals with everything except file saves/loads
# available commands:
# test     - Test connection, return "success"
# qname    - Tests if a certain game exists, returns "yes" or "no"
# newgame  - Creates a new game by reserving the game name
# mpass    - Tests a master password
# join     - Registers a player with a particular game
# validup  - Checks if a player's user/pass is correct in general
# canplay  - Checks if a player's user/pass is the current player's
# getturn  - Returns the day and turn
# nextturn - informs the server that the next turn has started
# sendchat - puts a chat message in the game's .chat file
# getsys   - returns the contents of the system log
# getchat  - returns the contents of the chat log
# dplay    - eliminates a specified player

print "content-type: text/plain\n\n";

@input = <>;
$com = $input[0];
chomp($com);
if($com eq "test"){
	print "success";
}elsif($com eq "qname"){
	chomp($input[1]);
	exit_if_game_does_exist($input[1]);
	print "yes";
}elsif($com eq "newgame"){
	#check if name already taken
	chomp($input[1]);
	exit_if_game_does_exist($input[1]);

	#register game name
	$games[scalar @games] = $input[1];
	open(OUT, "> gamelist");
	$f = 1;
	foreach $i (sort(@games)){
		chomp($i);
		if($f == 1){
			print OUT "$i";
			$f = 0;
		}else{
			print OUT "\n$i";
		}
	}
	close(OUT);

	#create file structure
	mkdir "./games/$input[1]";
	open(MAIN, "> ./games/$input[1]/info");
	chomp($input[3]);
	chomp($input[2]);
	chomp($input[4]);
	chomp($input[5]);
	chomp($input[6]);
	chomp($input[7]);
	print MAIN "$input[3]\n";
	print MAIN "$input[2]\n";
	print MAIN "$input[4]\n";
	print MAIN "$input[5]\n";
	print MAIN "$input[6]\n";
	print MAIN "CO Bans List\n";
	print MAIN "$input[7]\n";
	print MAIN "active\n";
	print MAIN "reserved"; #reserved for future use
	for($x = 0; $x < $input[3]; $x+=1){
		print MAIN "\nempty\nempty\nempty\nempty\nempty\nempty\nempty";
	}
	close(MAIN);

	open(TURN, "> ./games/$input[1]/turn");
	print TURN "1\n1";
	for($x = 0; $x < $input[3]; $x+=1){
		print TURN "\nactive";
	}
	close(TURN);

	open(SYS, "> ./games/$input[1]/syslog");
	$ctime = gmtime();
	print SYS "Game started:$ctime";
	close(SYS);
	open(CHAT, "> ./games/$input[1]/chat");
	$ctime = gmtime();
	print CHAT "CHAT LOG";
	close(CHAT);

	print "game created";
}elsif($com eq "mpass"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#check master password
	chomp($input[2]);
	check_master_password($input[1],$input[2]);

	print "correct password";
}elsif($com eq "join"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#check master password
	chomp($input[2]);
	check_master_password($input[1],$input[2]);

	#check versions
	chomp($input[6]);
	chomp($main[2]);
	if($input[6] ne $main[2]){
		print "version mismatch";
		exit 0;
	}

	#ensure that slot exists and is open
	chomp($input[5]);
	chomp($main[0]);
	if($input[5] > $main[0] || $input[5] < 1){
		print "out of range";
		exit 0;
	}
	$pos = 9 + 7*($input[5]-1);
	chomp($main[$pos]);
	if($main[$pos] ne "empty"){
		print "slot taken";
		exit 0;
	}

	#add player to game
	$main[$pos] = $input[3];
	$main[$pos+1] = $input[4];

	open(MAINOUT, "> ./games/$input[1]/info");
	$f = 1;
	foreach $i (@main){
		chomp($i);
		if($f == 1){
			print MAINOUT "$i";
			$f = 0;
		}else{
			print MAINOUT "\n$i";
		}
	}
	close(MAINOUT);
	
	open(SYS, ">> ./games/$input[1]/syslog");
	$ctime = gmtime();
	chomp($input[3]);
	print SYS "\n$input[3] joined army $input[5]:$ctime";
	close(SYS);

	print "join successful";
}elsif($com eq "validup"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#check versions
	chomp($input[4]);
	chomp($main[2]);
	if($input[4] ne $main[2]){
		print "version mismatch";
		exit 0;
	}

	#check if user/pass exists
	open(MAIN, "./games/$input[1]/info");
	@main = <MAIN>;
	close(MAIN);
	chomp($main[0]);
	chomp($input[2]);
	chomp($input[3]);
	for($i = 0; $i < $main[0]; $i+=1){
		$pos = 9 + 7*$i;
		chomp($main[$pos]);
		if($main[$pos] eq $input[2]){
			chomp($main[$pos+1]);
			if($main[$pos+1] eq $input[3]){
				print "login successful";
				exit 0;
			}
		}
	}

	print "username or password incorrect";
}elsif($com eq "canplay"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#check if user/pass and matches the current turn
	open(MAIN, "./games/$input[1]/info");
	@main = <MAIN>;
	close(MAIN);
	open(TURN, "./games/$input[1]/turn");
	@turn = <TURN>;
	close(TURN);
	chomp($main[0]);
	chomp($input[2]);
	chomp($input[3]);
	chomp($turn[1]);
	$pos = 9 + 7*($turn[1]-1);
	chomp($main[$pos]);
	if($main[$pos] eq $input[2]){
		chomp($main[$pos+1]);
		if($main[$pos+1] eq $input[3]){
			print "permission granted";
			exit 0;
		}
	}

	print "not your turn";
}elsif($com eq "getturn"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#get information
	open(TURN, "./games/$input[1]/turn");
	@turn = <TURN>;
	close(TURN);
	chomp($turn[0]);
	chomp($turn[1]);
	print "$turn[0]\n";
	print "$turn[1]\n";
	
	#get more info
	open(MAIN, "./games/$input[1]/info");
	@main = <MAIN>;
	close(MAIN);

	chomp($main[0]);
	print "$main[0]";
	for($i = 0; $i < $main[0]; $i+=1){
		$pos = 9 + 7*$i;
		chomp($main[$pos]);
		print "\n$main[$pos]";
	}
}elsif($com eq "nextturn"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#check if user/pass and matches the current turn
	open(MAIN, "./games/$input[1]/info");
	@main = <MAIN>;
	close(MAIN);
	open(TURN, "./games/$input[1]/turn");
	@turn = <TURN>;
	close(TURN);
	chomp($main[0]);
	chomp($input[2]);
	chomp($input[3]);
	chomp($turn[1]);
	$pos = 9 + 7*($turn[1]-1);
	chomp($main[$pos]);
	$allow = 0;
	if($main[$pos] eq $input[2]){
		chomp($main[$pos+1]);
		if($main[$pos+1] eq $input[3]){
			$allow = 1;
		}
	}

	#update turn
	if($allow == 1){
		#determine new turn number
		chomp($turn[0]);
		$oturn = $turn[1];
		$oday = $turn[0];
		$turn[1]+=1;
		if($turn[1]>$main[0]){
			$turn[0]+=1;
			$turn[1]=1;
		}
		chomp($turn[2+$turn[1]-1]);
		while($turn[2+$turn[1]-1] ne "active"){
			$turn[1]+=1;
			if($turn[1]>$main[0]){
				$turn[0]+=1;
				$turn[1]=1;
			}
			chomp($turn[2+$turn[1]-1]);
		}
		#write to file
		open(MAINOUT, "> ./games/$input[1]/turn");
		$f = 1;
		foreach $i (@turn){
			chomp($i);
			if($f == 1){
				print MAINOUT "$i";
				$f = 0;
			}else{
				print MAINOUT "\n$i";
			}
		}
		close(MAINOUT);
	
		open(SYS, ">> ./games/$input[1]/syslog");
		$ctime = gmtime();
		print SYS "\n$input[2] finished turn $oday/$oturn:$ctime";
		close(SYS);

		print "update successful";
		exit 0;
	}
	print "could not update";
}elsif($com eq "sendchat"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);
	
	open(CHAT, ">> ./games/$input[1]/chat");
	chomp($input[2]);
	chomp($input[3]);
	print CHAT "\n<$input[2]> $input[3]";
	close(CHAT);
	print "message recieved"
}elsif($com eq "getsys"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#return syslog
	open(LOG, "./games/$input[1]/syslog");
	@log = <LOG>;
	close(LOG);
	print @log;
}elsif($com eq "getchat"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#return syslog
	open(LOG, "./games/$input[1]/chat");
	@log = <LOG>;
	close(LOG);
	print @log;
}elsif($com eq "dplay"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#check if user/pass and matches the current turn
	open(MAIN, "./games/$input[1]/info");
	@main = <MAIN>;
	close(MAIN);
	open(TURN, "./games/$input[1]/turn");
	@turn = <TURN>;
	close(TURN);
	chomp($main[0]);
	chomp($input[2]);
	chomp($input[3]);
	chomp($turn[1]);
	$pos = 9 + 7*($turn[1]-1);
	chomp($main[$pos]);
	$allow = 0;
	if($main[$pos] eq $input[2]){
		chomp($main[$pos+1]);
		if($main[$pos+1] eq $input[3]){
			$allow = 1;
		}
	}

	#eliminate player
	if($allow == 1){
		chomp($input[4]);
		$pos = 2 + $input[4];
		$turn[$pos] = "eliminated";
		open(MAINOUT, "> ./games/$input[1]/turn");
		$f = 1;
		foreach $i (@turn){
			chomp($i);
			if($f == 1){
				print MAINOUT "$i";
				$f = 0;
			}else{
				print MAINOUT "\n$i";
			}
		}
		close(MAINOUT);
	
		open(SYS, ">> ./games/$input[1]/syslog");
		$ctime = gmtime();
		$playernum = $input[4] + 1;
		print SYS "\nPlayer $playernum was eliminated:$ctime";
		close(SYS);

		print "update successful";
		exit 0;
	}
	print "could not update";
}elsif($com eq "endgame"){
	#check existance
	chomp($input[1]);
	exit_if_game_does_not_exist($input[1]);

	#check if user/pass is a valid player
	open(MAIN, "./games/$input[1]/info");
	@main = <MAIN>;
	close(MAIN);
	#open(TURN, "./games/$input[1]/turn");
	#@turn = <TURN>;
	#close(TURN);
	chomp($main[0]);
	chomp($input[2]);
	chomp($input[3]);
	#chomp($turn[1]);
	#$pos = 9 + 7*($turn[1]-1);
	#chomp($main[$pos]);
	#$allow = 0;
	#if($main[$pos] eq $input[2]){
	#	chomp($main[$pos+1]);
	#	if($main[$pos+1] eq $input[3]){
	#		$allow = 1;
	#	}
	#}
	$allow = 0;
	for($i = 0; $i < $main[0]; $i+=1){
		$pos = 9 + 7*$i;
		chomp($main[$pos]);
		if($main[$pos] eq $input[2]){
			chomp($main[$pos+1]);
			if($main[$pos+1] eq $input[3]){
				$allow = 1;
			}
		}
	}

	#end the game
	if($allow == 1){
		$main[7] = "ended";
		open(MAINOUT, "> ./games/$input[1]/info");
		$f = 1;
		foreach $i (@main){
			chomp($i);
			if($f == 1){
				print MAINOUT "$i";
				$f = 0;
			}else{
				print MAINOUT "\n$i";
			}
		}
		close(MAINOUT);
	
		open(SYS, ">> ./games/$input[1]/syslog");
		$ctime = gmtime();
		print SYS "\nGame Ended:$ctime";
		close(SYS);

		print "update successful";
		exit 0;
	}
	print "could not update";
}else{
	print "command not recognized\n";
	print "$com";
}

exit 0;

sub exit_if_game_does_not_exist($){
	#check existance
	open(LIST, "gamelist");
	@games = <LIST>;
	close(LIST);
	$exist = 0;
	foreach $i (@games){
		chomp($i);
		if($_[0] eq $i){
			$exist = 1;
			break;
		}
	}
	if($exist == 0){
		print "no";
		exit 0;
	}
	#check for ended state
	open(MAIN, "./games/$_[0]/info");
	@main = <MAIN>;
	close(MAIN);
	chomp($main[7]);
	if($main[7] eq "ended"){
		print "no";
		exit 0;
	}
}

sub exit_if_game_does_exist($){
	#check if name already taken
	open(LIST, "gamelist");
	@games = <LIST>;
	close(LIST);
	foreach $i (@games){
		chomp($i);
		if($_[0] eq $i){
			print "no";
			exit 0;
		}
	}
}

# args - game name, given password
sub check_master_password($$){
	#check master password
	open(MAIN, "./games/$_[0]/info");
	@main = <MAIN>;
	close(MAIN);
	chomp($main[1]);
	if($main[1] ne $_[1]){
		print "wrong password";
		exit 0;
	}
}
