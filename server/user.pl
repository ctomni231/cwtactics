#!"C:\xampp\perl\bin\perl.exe"

# Alright, I'm going to write a tiny replica of my server program
# to test out the features before putting them in the major
# program. It'll be on the fly testing, which is awesome.

# ------------------
# Features Completed
# ------------------

# Ability to log in multiple users based on a time stamp
# Self- aware server (will log out users based on inactivity without the browser notification)
# Ability to create a new game (with team presets)
# Ability to add users to a game
# Ability to remove users from a game (in a game, and within lobby)
# Self aware game of turn order and teams

# -----------
# Working on
# -----------

# Fetching (like getting the actions from a list)
# Chatting (already did this two million times)
# Game deletion (When the game has been on the server for a while)

# Kicking can be achieved with remove user if necessary

# --------
# Commands
# --------

# This will be rewritten for the major server, but the basic commands will all be listed here.

# status
#   This shows all the logged users in the system (optional: and all games in the system)

# login USERNAME
#   This creates a new user in the database, or updates a user token in the database
#   USERNAME: The user to update

# ping USERNAME
#   This updates a user token in the database, useful for keeping a user logged in

# logout USERNAME
#   This logs a user out of the system

# creategame USERNAME:POSITION:GAMENAME:PLAYERLIMIT:TEAMLAYOUT
#   This creates a game in the system and creates the host player for the game.
#   POSITION: The player army faction position in the game (the player order)
#   GAMENAME: The title of this game
#   PLAYERLIMIT: The total amount of players that can be in this game
#   TEAMLAYOUT: The layout of the teams {"AB" would mean p1 is A team and p2 is B team.}

# joingame USERNAME:POSITION:GAMENAME
#   This allows a player to join into an already created game

# addaction USERNAME:GAMENAME:P(0):P(1):...:P(n)
#   This allows to player to push actions into the action list. An empty list will change to the next player turn.
#   P(n): A section of a string, int, or float array. Can extend to as many as needed. 

# leavegame USERNAME:GAMENAME
#   In an inactive game, it'll remove the player from the list of players
#   In an active game, it'll change the player to inactive making them unable to take any turns.

# -----
# Notes
# -----

# Actually, I should do the player order as players are accepted into the lobby.

# Currently, I need a start game function that starts the game when the lobby is full
# If the architecture allows, I'll have a second method of starting when host says so
 
# Okay, going to start the game architecture.
# I think I'll just do all the user handling first
# There is player groups and user groups
# Joining game, Full Game which allows actions, and Kicking people
# Turn order will be important
# Player and SPectator Limit. Need for Host saving. Turn Start... you know, the whole doc...

# We need this for file handling...
use Cwd;

# The limit of how long a user can stay idle in a server (in seconds)
$LIMIT = 60;

chomp($input = <>);

# Holds the paths to the system
@dirhistory = getcwd();

# Splits the input so commands can be read in.
@inputSplit = split(' ', $input);

# Checks the validity of the input
if(scalar(@inputSplit) != '2'){
	
	if($inputSplit[0] =~ m/creategame/){
		print "UserName:Position:GameName:UserLimit:TeamLayout\n";
	}elsif($inputSplit[0] =~ m/joingame/){
		print "UserName:Position:GameName\n";
	}elsif(!($inputSplit[0] =~ m/status/)){
		print "Input is: <Command> <Text>\n";
	}
	
	if(!(defined($inputSplit[0]))){
		exit 0;
	}
}

# Deals with the login process
if($inputSplit[0] =~ m/login/i){
	userLogin($inputSplit[1]);
}elsif($inputSplit[0] =~ m/ping/i){
	pingUser($inputSplit[1]);
}elsif($inputSplit[0] =~ m/logout/i){
	deleteUser($inputSplit[1]);
}elsif($inputSplit[0] =~ m/creategame/i){
	createGame($inputSplit[1]);
}elsif($inputSplit[0] =~ m/joingame/i){
	joinGame($inputSplit[1]);
}elsif($inputSplit[0] =~ m/addaction/i){
	addAction($inputSplit[1]);
}elsif($inputSplit[0] =~ m/leavegame/i){
	leaveGame($inputSplit[1]);
}

timeoutUser();
printUser();

printGame();

# -------------------------------
# Game Handling
# -------------------------------

# This is only going to cover game actions, and not the fluff that goes along with it.
# Luckily, it makes the process a bit easier as I only need to properly handle join and
# kicking procedures well

# Positive for game players can spectate (Clear games)
# Negative for games players can't spectate (FOW)

# This allows users to create a game
# Syntax: creategame UserName:Position:GameName:UserLimit:TeamLayout
sub createGame(){
	if(defined($_[0])){
	
		@gameSplit = split(':', $_[0]);
		
		if(scalar(@gameSplit) > '4'){
		
			# Check first to see if the User Exists
			if(userExists($gameSplit[0])){
				
				# Minimal error handling
				$gameSplit[2] =~ s/[.]/_/g;
				
				# Then check to see if the Game doesn't Exist
				if(!gameExists($gameSplit[2])){
					
					# This is probably the best time for the game configuration...
					$game = $gameSplit[2];
					$stat = 0;
					$plim = $gameSplit[3];
					$team = $gameSplit[4];	
					$pos = 1;
					
					$time = time();
					$local = localtime($time);
					
					# If the file doesn't exist
					open(USER, ">>game.txt") || catch("Can't open file for writing");
					flock(USER, 2) || catch("Missed file lock");
					print USER "$game,$stat,$plim,$team,$time,$local\n";
					close(USER) || catch("Can't close file");
					
					# Configures the user files 
					createDirectory($gameSplit[2]);
					$user = $gameSplit[0];
					$type = 'H';
					if($gameSplit[1] > $pos){
						$pos = $gameSplit[1];
					}
					
					# If the file doesn't exist
					open(USER, ">>user.txt") || catch("Can't open file for writing");
					flock(USER, 2) || catch("Missed file lock");
					print USER "$user,$type,$pos,$time,$local\n";
					close(USER) || catch("Can't close file");
					
					reverseDirectory();
				}
			}	
		}
	}
}

# This allows users to join a game, if it isn't filled
# Also starts a game when it is filled up
# Syntax: joingame UserName:Position:GameName
sub joinGame(){
	
	if(defined($_[0])){
	
		@gameSplit = split(':', $_[0]);
		
		if(scalar(@gameSplit) > '2'){
		
			# Check first to see if the User Exists
			if(userExists($gameSplit[0])){
				
				# Minimal error handling
				$gameSplit[2] =~ s/[.]/_/g;
				
				# Then check to see if the Game doesn't Exist
				if(-e "game.txt"){
				
					$plim = 1;
					$pos = 1;
				
					# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
					open(GAME, "<game.txt") || catch("Can't open file");
					flock(GAME, 1) || catch("Missed file lock");
					@temp = <GAME>;
					close(GAME) || catch("Can't close file");
			
					@gameData;
					foreach $sdata (@temp){
						@gsplit = split(",", $sdata);
						if($gsplit[0] eq $gameSplit[2]){
							
							if($gsplit[2] < 0){
								$gsplit[2] *= -1;
							}
							if($gsplit[2] > $plim){
								$plim = $gsplit[2];
							}
							
							createDirectory($gameSplit[2]);
							if(!userExistsInGame($gameSplit[0]) && !userLimit($plim)){
								$user = $gameSplit[0];
								$type = 'P';
								if($gameSplit[1] > $pos){
									$pos = $gameSplit[1];
								}
								
								$time = time();
								$local = localtime($time);
								
								if(-e "user.txt"){

									# The < symbol reads from a file : (2 for writing access, 1 for shared reading access)
									open(USER, "<user.txt") || catch("Can't open file");
									flock(USER, 1) || catch("Missed file lock");
									@data = <USER>;
									close(USER) || catch("Can't close file");
									
									# Holds the new data for file...
									@joinData;
									$insert = 0;
									foreach $ndata (@data){
										@dsplit = split(",", $ndata);
										
										if($insert == 0 && $pos <= $dsplit[2]){
											if($pos < $dsplit[2]){
												push(@joinData, "$user,$type,$pos,$time,$local\n");
											}else{
												print "Player Position Taken";
											}
											$insert = 1;
										}
										push(@joinData, $ndata);
										
										if(@data == @joinData && $insert == 0){
											push(@joinData, "$user,$type,$pos,$time,$local\n");
										}
									}
								
									# Irrelevant debug banter - tracks how many users
									#print @delData."_".@data;
									
									if(@joinData != @data){
										# Writes to a new file
										open(USER, ">user.txt") || catch("Can't open file for writing");
										flock(USER, 2) || catch("Missed file lock");
										foreach $ndata (@joinData){
											print USER $ndata;
										}
										close(USER) || catch("Can't close file");
									}
								}
							}
							
							# Starts the game if the user limit is filled up
							if(userLimit($plim)){
								
								if($gsplit[2] > 0){
									$gsplit[1] = "1_1";
								}elsif($gsplit[2] < 0){
									$gsplit[1] = "-1_1";
								}
								
								$sdata = join(",", @gsplit);
							}
							reverseDirectory();
						}
						
						push(@gameData, $sdata);
					}
					
					# Writes to a new file
					open(GAME, ">game.txt") || catch("Can't open file for writing");
					flock(GAME, 2) || catch("Missed file lock");
					foreach $sdata (@gameData){
						print GAME $sdata;
					}
					close(GAME) || catch("Can't close file");
				}
			}
		}
	}
}

# This only allows the player whose turn it is to enter commands
# addAction username:gamename:p1:p2:p3:<pn...>
sub addAction(){

	if(defined($_[0])){
	
		@actionSplit = split(':', $_[0]);
		
		if(scalar(@actionSplit) > '1'){
			
			# Check first to see if the User Exists
			if(userExists($actionSplit[0])){
				
				# Minimal error handling
				$actionSplit[1] =~ s/[.]/_/g;
				
				# Then check to see if the Game doesn't Exist
				if(-e "game.txt"){

					$pos = 1;
					$plim = 1;
					$nextturn = -1;
				
					# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
					open(GAME, "<game.txt") || catch("Can't open file");
					flock(GAME, 1) || catch("Missed file lock");
					@temp = <GAME>;
					close(GAME) || catch("Can't close file");
					
					@gameData;
					foreach $sdata (@temp){
						@gsplit = split(",", $sdata);
						if($gsplit[0] eq $actionSplit[1]){
							
							if($gsplit[2] < 0){
								$gsplit[2] *= -1;
							}
							if($gsplit[2] > $plim){
								$plim = $gsplit[2];
							}
							@pos = split("_", $gsplit[1]);
							
							#GAME,#STAT,#PLIM,#TEAM
							#USER,#TYPE,#POS
							@team = split("\l", $gsplit[3]);
							$teamcheck = 0;
							
							print join(",", @team)."\n";
							createDirectory($actionSplit[1]);
							
							# Game has to be in active phase
							if(userLimit($plim)){
								# If the file exists...
								if(-e "user.txt"){
									
									# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
									open(USER, "<user.txt") || catch("Can't open file");
									flock(USER, 1) || catch("Missed file lock");
									@data = <USER>;
									close(USER) || catch("Can't close file");
									
									$counter = 0;
									foreach $ndata (@data){
										$counter++;
										@usplit = split(",", $ndata);
										
										# This checks the team status
										if($teamcheck eq "0" && $usplit[2] ne "0"){
											$teamcheck = $team[$counter-1];
										}elsif($teamcheck ne "0" && $usplit[2] ne "0" && $teamcheck ne $team[$counter-1]){
											$teamcheck = 1;
										}
										
										# This checks which player is next on the list
										if($nextturn == -1 && $counter < $pos[1] && $usplit[2] ne "0"){
											$nextturn = $counter;
										}elsif($nextturn < $pos[1] && $counter > $pos[1] && $usplit[2] ne "0"){
											$nextturn = $counter;
										}
										
										# Player has to be active player; Then the player can write an action in
										if($usplit[0] eq $actionSplit[0] && $counter == $pos[1]){
											print "User Actions are allowed!!\n";
											
											# Make sure we add an action marker, just to make sure only the active player can switch the turn
										}elsif($usplit[0] eq $actionSplit[0] && $counter != $pos[1]){
											print "User Actions are not allowed!!\n";
										}
										
										
									}
								}
							}
							reverseDirectory();
							
							# This section changes the players turn if it is valid
							if($nextturn > 0 && scalar(@actionSplit) == '2'){
								@pos[1] = $nextturn;
								$gsplit[1] = join("_", @pos);
								$sdata = join(",", @gsplit);
								#If the next turn is less than the player, then increase the day counter :)
							}
						}
					
						push(@gameData, $sdata);
					}
					
					print "Next Players Turn: $nextturn\n";
					if($teamcheck eq "1"){
						print "$teamcheck: There is more than one team present\n"
					}else{
						print "$teamcheck: The game should be over :)\n"
					}
					# Might also have to check if the only players in one team are left
					# Have to check if all the team names are the same
					
					# Writes to a new file
					open(GAME, ">game.txt") || catch("Can't open file for writing");
					flock(GAME, 2) || catch("Missed file lock");
					foreach $sdata (@gameData){
						print GAME $sdata;
					}
					close(GAME) || catch("Can't close file");
				}
			}
		}
	}
	
	#Check user, game, then the actions
}

# This function disables a user within an active game, and removes them in an inactive game
# leavegame Username:Gamename
sub leaveGame(){

	if(defined($_[0])){
	
		@actionSplit = split(':', $_[0]);
		
		if(scalar(@actionSplit) > '1'){
			
			# Check first to see if the User Exists
			if(userExists($actionSplit[0])){
				
				# Minimal error handling
				$actionSplit[1] =~ s/[.]/_/g;
				
				# Then check to see if the Game doesn't Exist
				if(-e "game.txt"){
				
					# We definitely need to see if the game is in an active state.
					$plim = 1;
					
					# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
					open(GAME, "<game.txt") || catch("Can't open file");
					flock(GAME, 1) || catch("Missed file lock");
					@temp = <GAME>;
					close(GAME) || catch("Can't close file");
					
					@gameData;
					foreach $sdata (@temp){
						@gsplit = split(",", $sdata);
						if($gsplit[0] eq $actionSplit[1]){
							
							if($gsplit[2] < 0){
								$gsplit[2] *= -1;
							}
							if($gsplit[2] > $plim){
								$plim = $gsplit[2];
							}
							
							createDirectory($actionSplit[1]);
							# If the file exists...
							if(-e "user.txt"){
							
								# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
								open(USER, "<user.txt") || catch("Can't open file");
								flock(USER, 1) || catch("Missed file lock");
								@data = <USER>;
								close(USER) || catch("Can't close file");
								
								@userData;
								foreach $ndata (@data){
									@usplit = split(",", $ndata);
									
									# If the player is a player in the list
									# Game has to be in active phase
									if($usplit[0] eq $actionSplit[0] && userLimit($plim)){
										$usplit[2] = 0;
										$ndata = join(",", @usplit);
									}

									# Inputs data every time except one little instance
									if(userLimit($plim) || !userLimit($plim) && $usplit[0] ne $actionSplit[0]){
										push(@userData, $ndata);
									}
								}
								
								# Writes to a new file
								open(USER, ">user.txt") || catch("Can't open file for writing");
								flock(USER, 2) || catch("Missed file lock");
								foreach $ndata (@userData){
									print USER $ndata;
								}
								close(USER) || catch("Can't close file");
							}
							reverseDirectory();
						}
						
						push(@gameData, $sdata);
					}
					
					# Writes to a new file
					open(GAME, ">game.txt") || catch("Can't open file for writing");
					flock(GAME, 2) || catch("Missed file lock");
					foreach $sdata (@gameData){
						print GAME $sdata;
					}
					close(GAME) || catch("Can't close file");
					
				}
			}
		}
	}
}

# This checks to see if a game exists in the system
sub gameExists(){

	if(defined($_[0])){
	
		# If the file exists...
		if(-e "game.txt"){
			
			# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
			open(USER, "<game.txt") || catch("Can't open file");
			flock(USER, 1) || catch("Missed file lock");
			@data = <USER>;
			close(USER) || catch("Can't close file");
			
			foreach $sdata (@data){
				@gsplit = split(",", $sdata);
				if($gsplit[0] eq $_[0]){
					return 1;
				}
			}
		}
	}
	return 0;
}

sub userLimit(){
	if(defined($_[0])){
	
		# If the file exists...
		if(-e "user.txt"){
			
			# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
			open(USER, "<user.txt") || catch("Can't open file");
			flock(USER, 1) || catch("Missed file lock");
			@data = <USER>;
			close(USER) || catch("Can't close file");
			
			if(scalar(@data) >= $_[0]){
				print "User limit reached!\n";
				return 1;
			}
		}
	}
	return 0;
}

sub userExistsInGame(){

	if(defined($_[0])){
	
		# If the file exists...
		if(-e "user.txt"){
			
			# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
			open(USER, "<user.txt") || catch("Can't open file");
			flock(USER, 1) || catch("Missed file lock");
			@data = <USER>;
			close(USER) || catch("Can't close file");
			
			foreach $sdata (@data){
				@dsplit = split(",", $sdata);
				if($dsplit[0] eq $_[0]){
					print "User exists!\n";
					return 1;
				}
			}
		}
	}
	return 0;
	
}

# Prints all logged in users, if there is any.
sub printGame(){

	if(-e "game.txt"){

		# The < symbol reads from a file : (2 for writing access, 1 for shared reading access)
		open(USER, "<game.txt") || catch("Can't open file");
		flock(USER, 1) || catch("Missed file lock");
		@data = <USER>;
		close(USER) || catch("Can't close file");
		
		if(@data != 0){
			print "Game List: Current time ".localtime()."\n";
		}
		
		foreach $ndata (@data){
			@dsplit = split(',', $ndata);
			print "$dsplit[0] - $dsplit[1] - $dsplit[5]";
		}
	}
}

# -------------------------------
# User Lobby Handling
# -------------------------------

# Logs a user into a system
sub userLogin(){

	if(defined($_[0])){
	
		if(!userExists($_[0])){
			$user = $_[0];
			$time = time();
			$local = localtime($time);
	
			# If the file doesn't exist
			open(USER, ">>test.txt") || catch("Can't open file for writing");
			flock(USER, 2) || catch("Missed file lock");
			print USER "$user,$time,$local\n";
			close(USER) || catch("Can't close file");
		}
	}
}

# Make the user Exists 
sub userExists(){

	if(defined($_[0])){
	
		# If the file exists...
		if(-e "test.txt"){
			
			# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
			open(USER, "<test.txt") || catch("Can't open file");
			flock(USER, 1) || catch("Missed file lock");
			@data = <USER>;
			close(USER) || catch("Can't close file");
			
			foreach $sdata (@data){
				@dsplit = split(",", $sdata);
				if($dsplit[0] eq $_[0]){
					return 1;
				}
			}
		}
	}
	return 0;
	
}

# Makes the user time current
sub pingUser(){
	if(defined($_[0])){
	
		# If the file exists...
		if(-e "test.txt"){
			
			# The < symbol reads from a file (2 for writing access, 1 for shared reading access)
			open(USER, "<test.txt") || catch("Can't open file");
			flock(USER, 1) || catch("Missed file lock");
			@data = <USER>;
			close(USER) || catch("Can't close file");
			
			@pingData;
			foreach $sdata (@data){
				@dsplit = split(",", $sdata);
				
				if($dsplit[0] eq $_[0]){
					$dsplit[1] = time();
					$dsplit[2] = localtime($dsplit[1]);
					
					$sdata = join(",", @dsplit)."\n"; 
				}
					
				push(@pingData, $sdata);
			}
			
			# Writes to a new file
			open(USER, ">test.txt") || catch("Can't open file for writing");
			flock(USER, 2) || catch("Missed file lock");
			foreach $ndata (@pingData){
				print USER $ndata;
			}
			close(USER) || catch("Can't close file");		
		}
	}
}

# A function used to logout a user from the system
sub deleteUser{
	if(defined($_[0])){
	
		if(-e "test.txt"){

			# The < symbol reads from a file : (2 for writing access, 1 for shared reading access)
			open(USER, "<test.txt") || catch("Can't open file");
			flock(USER, 1) || catch("Missed file lock");
			@data = <USER>;
			close(USER) || catch("Can't close file");
			
			# Holds the new data for file...
			@delData;
			foreach $sdata (@data){
				@dsplit = split(",", $sdata);
				if(!($dsplit[0] =~ m/$_[0]/)){
					push(@delData, $sdata);
				}
			}
		
			# Irrelevant debug banter - tracks how many users
			#print @delData."_".@data;
			
			if(@delData != @data){
				# Writes to a new file
				open(USER, ">test.txt") || catch("Can't open file for writing");
				flock(USER, 2) || catch("Missed file lock");
				foreach $ndata (@delData){
					print USER $ndata;
				}
				close(USER) || catch("Can't close file");
			}
		}
	}
}

# A function used to do an automatic log out if the time
# spent is too long in the system.
sub timeoutUser{
	if(-e "test.txt"){

		# The < symbol reads from a file : (2 for writing access, 1 for shared reading access)
		open(USER, "<test.txt") || catch("Can't open file");
		flock(USER, 1) || catch("Missed file lock");
		@data = <USER>;
		close(USER) || catch("Can't close file");
		
		$curtime = time();
		
		# Holds the new data for file...
		@newData;
		foreach $sdata (@data){
			@dsplit = split(",", $sdata);
			
			$timedif = $curtime - $dsplit[1];
			
			if($timedif < $LIMIT){
				push(@newData, $sdata);
			}
		}
	
		#Irrelevant debug banter - tracks how many users
		#print @newData."-".@data;
		
		# If the file size doesn't change, don't waste time rewriting it
		if(@newData != @data){
			# Writes to a new file
			open(USER, ">test.txt") || catch("Can't open file for writing");
			flock(USER, 2) || catch("Missed file lock");
			foreach $ndata (@newData){
				print USER $ndata;
			}
			close(USER) || catch("Can't close file");
		}			
	}
}

# Prints all logged in users, if there is any.
sub printUser(){

	if(-e "test.txt"){

		# The < symbol reads from a file : (2 for writing access, 1 for shared reading access)
		open(USER, "<test.txt") || catch("Can't open file");
		flock(USER, 1) || catch("Missed file lock");
		@data = <USER>;
		close(USER) || catch("Can't close file");
		
		print "User List - Current time ".localtime()."\n";
		foreach $ndata (@data){
			@dsplit = split(',', $ndata);
			print "$dsplit[0] - $dsplit[2]";
		}
	}
}

# ---------------------------------
# Server Handling
# ---------------------------------

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
		push(@dirhistory, getcwd());
		
		# This changes the directory to write in the current one 
		chdir($_[0]) || catch("Can't get into directory");
		return 1;
	}
	return 0;
}

# This function will take you one up from a directory you are in.
sub reverseDirectory(){
	if($dirhistory > 1){
		pop(@dirhistory);
	}
	chdir($dirhistory[-1]);
}

# Used for catching and printing errors
sub catch(){
	if(defined($_[0])){
		print $_[0].": $!";
	}
	exit 0;
}
