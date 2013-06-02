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
	
use CGI;

sub rnd_str
{
	my $length=shift;

	my @chars=('a'..'z','A'..'Z','0'..'9');
	my $output;
	foreach (1..$length) 
	{
		$output.=$chars[rand @chars];
	}
	return $output;
}

$cgi = new CGI;

for $key ( $cgi->param() ) {
    $input{$key} = $cgi->param($key);
}


print $cgi->header('text/html');

for $key ( keys %input ) {
    print $key, ' = ', $input{$key}, "<br>\n";
}
