#!"C:\xampp\perl\bin\perl.exe" 
#!/usr/bin/perl

# server.pl
# This is the server back end for the simple game server

# This is the start of the game server. Each sign in will begin with a timed
# token (don't know the time yet, but it'll be server based.)

# WHERE AM I IN THIS?
# ------------------
# I need to just have the map display (output json only)
# I need to test all the game action stuff
# I need to make sure the host can kick players (maybe)
#
# Working on making the messages able to be handled in folders...
#
# Big Ticket: The game folder (named off the folder itself)
# Need to keep track of..
# Game Name, Player List (Current/Total), Turn (Day/Player),
# Version?, Modification?, Last Action?, Comment(N)
# Server Tracking: Game Host Player, Game Lobby Full, Game Started, Game Ended, Player Tracking Points (for command reading)
# Banned Player, Kick player (3 kicks for auto-ban)
use CGI ':standard';

# Sets the maximum data to accept at one time to 10MB
$CGI::POST_MAX = 1048576 * 10;

print "Cache-Control: no-cache";
print "Content-type: text/plain\n\n";

# The hash table that contains the key value pairs
%inputHash = ('serverInfo' => server_software(),
			   'remote' => remote_addr());
			   
# Holds the paths to the system
@dirhistory = (getcwd());
			   
# URL QUERY
# ---------
# Receives the url input
$query = url( -relative=>1, -query=>1 );
# Then it completely extracts the query part
$queryInput = substr($query, index($query, "?")+1 );
# Get rid of the whitespace
chomp($queryInput);
# Splits the query input by the & symbols
@querySplit = split(';', $queryInput);

# This section deals with cleaning up the text for the URL Query
foreach $split (@querySplit){
 	@esplit = split("=", $split);
		
	# if statements MUST be blocked in order to work
 	if(scalar(@esplit) == '2'){
	
		# Takes a string and replaces all instances of one lateral with another
		# =~ is used to force pattern matching
		# Any section that needs to be checked for integrity, place here...
		if($esplit[0] =~ m/message/){
			$inputHash{$esplit[0]} = flushHTML($esplit[1]);
		}else{
			$inputHash{$esplit[0]} = $esplit[1];
		}
	}
}

# POST QUERY
# ----------
# Gets and chops the post input string
chomp($postInput = <>);
# Splits the post input by the & symbols
@postSplit = split('&', $postInput);
			 
# This section deals with cleaning up the text for the POST Query
foreach $split (@postSplit){
 	@esplit = split("=", $split);
		
	# if statements MUST be blocked in order to work
 	if(scalar(@esplit) == '2'){
	
		# Takes a string and replaces all instances of one lateral with another
		# =~ is used to force pattern matching
		# Any section that needs to be checked for integrity, place here...
		if($esplit[0] =~ m/message/){
			$inputHash{$esplit[0]} = flushHTML($esplit[1]);
		}else{
			$inputHash{$esplit[0]} = $esplit[1];
		}
	}
}

# LOBBY SERVER
# ------------
# This is the main server section for handling requests for both GET and POST

# The huge switch table
if($inputHash{type} =~ m/connect/){
	createToken();
}elsif($inputHash{type} =~ m/add_user/){
	createUser();
}elsif($inputHash{type} =~ m/remove_user/){
	removeUser();
}elsif($inputHash{type} =~ m/send_chat/){
	sendMessage();
}elsif($inputHash{type} =~ m/get_chat/){
	getMessage();
}else{
	catch("Command $inputHash{type} not recognized");
}

# Print the JSON response (End of transmission).
printHash();


# GAME HANDLING
# -------------

# Creates a new game within the folder specified
# (code-int) Token
# (user-Str) User name
# (game-Str) New game name
# (player-int) Player position (by faction)
# (max-int) Maximum joiners for this game
# (map-JSON) The JSON map (limit is 10MB)
sub createGame(){
	
	if(userExists()){
		$game = $inputHash{game};
		$game = flushGame($game);
		
		if(!checkDirectory($game)){
		
			# Makes a game list that stores all the games
			open(USER, ">>gamelist.txt") || catch("Can't open file for writing");
			flock(USER, 2) || catch("Missed file lock");
			print USER "$inputHash{user},$inputHash{game},$inputHash{date}\n";
			close(USER) || catch("Can't close file");
			
			createToken($game);
			createDirectory($game);
			createUserInMain($game);
			
			$inputHash{date} = localtime();
			
			open(USER, ">>config.txt") || catch("Can't open file for writing");
			flock(USER, 2) || catch("Missed file lock");
			print USER "$inputHash{user},$inputHash{player},$inputHash{date},$inputHash{max}\n";
			close(USER) || catch("Can't close file");
			
			open(USER, ">>map.json") || catch("Can't open file for writing");
			flock(USER, 2) || catch("Missed file lock");
			print USER "$inputHash{map}";
			close(USER) || catch("Can't close file");
			
			open(USER, ">>index.html") || catch("Can't open file for writing");
			flock(USER, 2) || catch("Missed file lock");
			print USER "$inputHash{map}";
			close(USER) || catch("Can't close file");
		}else{
			$inputHash{error} = "Game $inputHash{game} already exists";
		}
	}
}

# Creates a new game within the folder specified
# (code-int) Token
# (user-Str) User name
# (game-Str) Game name (Has to exist)
# (player-int) Player position (by faction)
sub joinGame(){
	if(userExists()){
		$game = $inputHash{game};
		
		$game = flushGame($game);
		
		if(checkDirectory($game)){
		
			createDirectory($game);
			
			if(-e "config.txt"){
				open(USER, "<config.txt") || catch("Can't open file");
				# 2 for writing access, 1 for shared reading access
				flock(USER, 1) || catch("Missed file lock");
				@data = <USER>;
				close(USER) || catch("Can't close file");
				
				$max = split(",", $data[0])[-1];
				if($max < 1){
					catch("Max players invalid");
				}
				if($data >= $max){
					catch("Maximum players reached");
				}
				
				createToken($game);
				createUserInMain($game);
				
				$inputHash{date} = localtime();
			
				open(USER, ">>config.txt") || catch("Can't open file for writing");
				flock(USER, 2) || catch("Missed file lock");
				print USER "$inputHash{user},$inputHash{player},$inputHash{date}\n";
				close(USER) || catch("Can't close file");
			}		
		}
	}
}

# Sends a command to the game command
# (code-int) Token
# (user-Str) User name
# (game-Str) Game name (Has to exist)
# (message-Str) Game command
# (returns) An updated list of commands
sub sendAction(){
	if(userExists()){
		$game = $inputHash{game};
		
		$game = flushGame($game);
		
		if(checkDirectory($game)){
			
			if(userExistsInMain($game)){
			
				if(-e "config.txt"){
					open(USER, "<config.txt") || catch("Can't open file");
					# 2 for writing access, 1 for shared reading access
					flock(USER, 1) || catch("Missed file lock");
					@data = <USER>;
					close(USER) || catch("Can't close file");
					
					$max = split(",", $data[0])[-1];
					if($data < $max){
						catch("Not enough players to start game");
					}elsif{$data > $max){
						catch("Start Game Invalid");
					}
				}
			
				open(USER, ">>action.txt") || catch("Can't open file for writing");
				flock(USER, 2) || catch("Missed file lock");
				print USER "<b>&lt;$inputHash{user}:&gt;</b>$inputHash{message}<br />\n";
				close(USER) || catch("Can't close file");
				
				# Sends a full message log
				if(-e "action.txt"){
					open(USER, "<action.txt") || catch("Can't open file");
					# 2 for writing access, 1 for shared reading access
					flock(USER, 1) || catch("Missed file lock");
					@data = <USER>;
					close(USER) || catch("Can't close file");

					@newData;
					foreach $sdata (@data){
						chomp($sdata);
						push(@newData, $sdata);
					}
					
					$inputHash{getAction} = join("", @newData);
				}else{
					$inputHash{getAction} = "";
				}
			}else{
				catch("User does not exist");
			}
		}	
	}
}

# Gets all actions from a particular game in the server
# (code-int) Token
# (user-Str) User name
# (game-Str) Game name (Has to exist)
# (returns) An updated list of commands
sub getAction(){
	if(userExists()){
		$game = $inputHash{game};
		
		$game = flushGame($game);
		
		if(checkDirectory($game)){
		
			# This will prevent spectators from getting the information
			if(userExistsInMain($game)){
			
				# Sends a full message log
				if(-e "action.txt"){
					open(USER, "<action.txt") || catch("Can't open file");
					# 2 for writing access, 1 for shared reading access
					flock(USER, 1) || catch("Missed file lock");
					@data = <USER>;
					close(USER) || catch("Can't close file");

					@newData;
					foreach $sdata (@data){
						chomp($sdata);
						push(@newData, $sdata);
					}
					
					$inputHash{getAction} = join("", @newData);
				}else{
					$inputHash{getAction} = "";
				}
			
			}
		}
	}
}

# This should just display a map as is.
# I'm unsure if just allowing maps willy nilly is good for this server
# Gets a map from the server in JSON format
# (code-int) Token
# (user-Str) User name
# (game-Str) Game name (Has to exist)
# (returns) A JSON map
sub getMap(){
	if(userExists()){
		$game = $inputHash{game};
		
		$game = flushGame($game);
		
		if(checkDirectory($game)){
		
			# This will prevent spectators from getting the information
			if(userExistsInMain($game)){
			
				# Sends a full message log
				if(-e "map.json"){
					open(USER, "<map.json") || catch("Can't open file");
					# 2 for writing access, 1 for shared reading access
					flock(USER, 1) || catch("Missed file lock");
					@data = <USER>;
					close(USER) || catch("Can't close file");
					
					# Prints the map for the user
					foreach $sdata (@data){
						print chomp($sdata);
					}
					
				}else{
					print "";
				}
			
			}
		}
	}
}

# CHAT HANDLING
# -------------

# You can only send a message if you are logged in
sub sendMessage(){

	if(userExists()){
		open(USER, ">>message.txt") || catch("Can't open file for writing");
		flock(USER, 2) || catch("Missed file lock");
		print USER "<b>&lt;$inputHash{user}:&gt;</b>$inputHash{message}<br />\n";
		close(USER) || catch("Can't close file");
	}
	
	# Sends a full message log
	if(-e "message.txt"){
		open(USER, "<message.txt") || catch("Can't open file");
		# 2 for writing access, 1 for shared reading access
		flock(USER, 1) || catch("Missed file lock");
		@data = <USER>;
		close(USER) || catch("Can't close file");

		@newData;
		foreach $sdata (@data){
			chomp($sdata);
			push(@newData, $sdata);
		}
		
		$inputHash{getText} = join("", @newData);
	}else{
		$inputHash{getText} = "";
	}
	
	getUsers();
}

# Sends the full message log
sub getMessage(){

	createDirectory("main");
	
	# Sends a full message log
	if(-e "message.txt"){
		open(USER, "<message.txt") || catch("Can't open file");
		# 2 for writing access, 1 for shared reading access
		flock(USER, 1) || catch("Missed file lock");
		@data = <USER>;
		close(USER) || catch("Can't close file");

		@newData;
		foreach $sdata (@data){
			chomp($sdata);
			push(@newData, $sdata);
		}
		
		$inputHash{getText} = join("", @newData);
	}else{
		$inputHash{getText} = "";
	}
	
	getUsers();
	
}

# It does it via the current directory it is in
sub getUsers(){
	
	if(-e "userlist.txt"){
		# If the file exists...
		# The < symbol reads from a file
		open(USER, "<userlist.txt") || catch("Can't open file");
		# 2 for writing access, 1 for shared reading access
		flock(USER, 1) || catch("Missed file lock");
		@data = <USER>;
		close(USER) || catch("Can't close file");
		
		# Holds the new data for file...
		@newUser;
		foreach $sdata (@data){
			@dsplit = split(",", $sdata);
			push(@newUser, "<b>$dsplit[1]</b><br />");
		}
		
		$inputHash{getUsers} = join("", @newUser);
	}else{
		$inputHash{getUsers} = "";
	}
}

# USER HANDLING
# --------------

# Creates a Token when user first logs into a server
sub createToken(){
	$random = int(rand(1000000000));
	if(defined($_[0])){
		$inputHash{$_[0].'_code'} = $random;
	}else{
		$inputHash{'code'} = $random;
	}
}

# Checks to see if a user exists (currently two layers deep)
sub userExists(){

	createDirectory("main");
	
	if(-e "userlist.txt"){
		# If the file exists...
		# The < symbol reads from a file
		open(USER, "<userlist.txt") || catch("Can't open file");
		# 2 for writing access, 1 for shared reading access
		flock(USER, 1) || catch("Missed file lock");
		@data = <USER>;
		close(USER) || catch("Can't close file");
		
		foreach $sdata (@data){
			@dsplit = split(",", $sdata);
			if(($dsplit[1] =~ m/$inputHash{user}/) && ($dsplit[0] =~ m/$inputHash{code}/)){
				if(defined($_[0])){
					return userExistsInMain($_[0]);
				}else{
					return 1;
				}
			}
		}
	}
	return 0;
}

# Checks to see if a user exists in any of the various sub folders
sub userExistsInMain(){
	
	# Needs a valid file name extension 
	if(defined($_[0])){
		
		# Checks to make sure the directory exists before attempting to go into it
		if(checkDirectory($_[0])){
		
			# This just moves into the next directory
			createDirectory($_[0]);
	
			if(-e "userlist.txt"){
				# If the file exists...
				# The < symbol reads from a file
				open(USER, "<userlist.txt") || catch("Can't open file");
				# 2 for writing access, 1 for shared reading access
				flock(USER, 1) || catch("Missed file lock");
				@data = <USER>;
				close(USER) || catch("Can't close file");
		
				foreach $sdata (@data){
					@dsplit = split(",", $sdata);
					if(($dsplit[1] =~ m/$inputHash{user}/) && ($dsplit[0] =~ m/$inputHash{$_[0].'_code'}/)){
						return 1;
					}
				}
			}
		}
	}
	return 0;
}

# This creates a user for the main directory
sub createUser(){

	# Hopefully creates the main directory
	createDirectory("main");
	
	if(-e "userlist.txt"){
		# If the file exists...
		# The < symbol reads from a file
		open(USER, "<userlist.txt") || catch("Can't open file");
		# 2 for writing access, 1 for shared reading access
		flock(USER, 1) || catch("Missed file lock");
		@data = <USER>;
		close(USER) || catch("Can't close file");
		
		foreach $sdata (@data){
			@split = split(",", $sdata);
			if($split[1] =~ m/$inputHash{user}/){
				if(defined($_[0])){
					createUserInMain($_[0]);
				}else{
					$inputHash{error} = "User $inputHash{user} already exists";
				}
				return 0;
			}
		}
	}
	
	$inputHash{date} = localtime();
	
	# If the file doesn't exist
	open(USER, ">>userlist.txt") || catch("Can't open file for writing");
	flock(USER, 2) || catch("Missed file lock");
	print USER "$inputHash{code},$inputHash{user},$inputHash{remote},$inputHash{date}\n";
	close(USER) || catch("Can't close file");
}

# This creates a user in the sub-folders
sub createUserInMain(){

	# Needs a valid file name extension 
	if(defined($_[0])){
		
		# Hopefully creates the new directory
		createDirectory($_[0]);

		if(-e "userlist.txt"){
			# If the file exists...
			# The < symbol reads from a file
			open(USER, "<userlist.txt") || catch("Can't open file");
			# 2 for writing access, 1 for shared reading access
			flock(USER, 1) || catch("Missed file lock");
			@data = <USER>;
			close(USER) || catch("Can't close file");
	
			foreach $sdata (@data){
				@split = split(",", $sdata);
				if($split[1] =~ m/$inputHash{user}/){
					$inputHash{error} = "User $inputHash{user} already exists";
					return 0;
				}
			}
		}
		
		$inputHash{date} = localtime();

		# If the file doesn't exist
		open(USER, ">>userlist.txt") || catch("Can't open file for writing");
		flock(USER, 2) || catch("Missed file lock");
		print USER "$inputHash{$_[0].'_code'},$inputHash{user},$inputHash{date}\n";
		close(USER) || catch("Can't close file");
		
	}
	return 0;
}

# This removes a user in a folder or sub_folder
sub removeUser(){
	
	if(defined($_[0])){
		if(!(userExistsinMain($_[0]))){
			return 0;
		}
	}else{
		createDirectory("main");
	}
	
	if(-e "userlist.txt"){
		# If the file exists...
		# The < symbol reads from a file
		open(USER, "<userlist.txt") || catch("Can't open file");
		# 2 for writing access, 1 for shared reading access
		flock(USER, 1) || catch("Missed file lock");
		@data = <USER>;
		close(USER) || catch("Can't close file");
		
		# Holds the new data for file...
		@newData;
		foreach $sdata (@data){
			@dsplit = split(",", $sdata);
			if(defined($_[0])){
				if(!($dsplit[1] =~ m/$inputHash{user}/) && !($dsplit[0] =~ m/$inputHash{$_[0].'_code'}/)){
					push(@newData, $sdata);
				}
			}else{
				if(!($dsplit[1] =~ m/$inputHash{user}/) && !($dsplit[0] =~ m/$inputHash{code}/)){
					push(@newData, $sdata);
				}
			}
		}
		
		# If the file size doesn't change, don't waste time rewriting it
		if(!(@newData =~ @data)){
			# Writes to a new file
			open(USER, ">userlist.txt") || catch("Can't open file for writing");
			flock(USER, 2) || catch("Missed file lock");
			foreach $ndata (@newData){
				print USER $ndata;
			}
			close(USER) || catch("Can't close file");
			return 1;
		}
	}
	$inputHash{error} = "User $inputHash{user} can't be deleted";
}

# SERVER HANDLING
# --------------
# This handles the printing and other functions needed for the server end
# like data integrity and error handling

# This function checks to see if a directory exists
sub checkDirectory(){
	if(defined($_[0])){
		if(-e $_[0]){
			return 1;
		}
	}
	return 0;
}

# This function makes a directory
sub createDirectory(){
	if(defined($_[0])){
		# This creates the main directory if it doesn't exist
		if(!(-e $_[0])){
			mkdir($_[0], 0755) || catch("Can't create directory");
		}
		
		# Pushes another directory into the history
		@dirhistory.push(getcwd());
		
		# This changes the directory to write in the current one 
		chdir($_[0]) || catch("Can't get into directory");
		return 1;
	}
	return 0;
}

# This function will take you one up from a directory you are in.
sub reverseDirectory(){
	if($dirhistory > 1){
		chdir(@dirhistory.pop());
	}
}

# Prints the JSON return text
sub printHash(){
	# Just to show the JSON
	print "{\n";
	# A simple counter
	$counter = 0;
	# FOREACH LOOP
	foreach $key (sort keys %inputHash) {
		if($counter > 0){
			print ",\n";
		}
		print "$key : \"$inputHash{$key}\"";
		$counter++;
	}
	# Finishes the JSON file
	print "\n};";
}

# Used for catching and printing errors
sub catch(){
	if(defined($_[0])){
		$inputHash{'error'} = $_[0].": $!";
	}
	printHash();
	exit 0;
}

# Used for general message integrity
sub flushHTML(){
	if(defined($_[0])){
		# This changes URI stuff into readable stuff
		$_[0] =~ s/%20/ /g;
		$_[0] =~ s/%3F/?/g;
		$_[0] =~ s/%27/'/g;
		$_[0] =~ s/%2C/,/g;
		$_[0] =~ s/%21/!/g;
		
		# This changes HTML stuff into non-readable stuff
		$_[0] =~ s/</&lt;/g;
		$_[0] =~ s/>/&gt;/g;
		
		return $_[0];
	}
}

sub flushGame(){
	if(defined($_[0])){
		# This file checks the integrity of game names
		$_[0] =~ s/./_/g;
		$_[0] =~ s/,/_/g;
		$_[0] =~ s/"/_/g;
		
		return $_[0];
	}
}