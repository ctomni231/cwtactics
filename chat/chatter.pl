#!/usr/bin/perl

# chatter.pl
# This is the server back end for the simple chat server

# This is the start of an excellent server system that is fully controlled by
# key-value pairs. I will have full control of what goes in and out of this
# server, and all output will be in JSON format by decree
use CGI ':standard';

print "Cache-Control: no-cache";
print "Content-type: text/plain\n\n";

# Receives the url input
$query = url( -relative=>1, -query=>1 );
# Then it completely extracts the query part
$input = substr($query, index($query, "?")+1 );
# Get rid of the input
chomp($input);
# Splits the input by the & symbols
@split = split(';', $input);

# Holds the server information
$server = server_software();
$addr = remote_addr();

# The hash table that contains the key value pairs
%queryHash = ('serverInfo' => $server,
			   'remote' => $addr);

foreach $split (@split){
 	@esplit = split("=", $split);
		
	# if statements MUST be blocked in order to work
 	if(scalar(@esplit) == '2'){
	
		# Takes a string and replaces all instances of one lateral with another
		# =~ is used to force pattern matching
		if($esplit[0] =~ m/message/){
			$queryHash{$esplit[0]} = flushHTML($esplit[1]);
		}else{
			$queryHash{$esplit[0]} = $esplit[1];
		}
	}
}

# The huge switch table
if($queryHash{type} =~ m/getID/){
	createID();
	# printHash();
}elsif($queryHash{type} =~ m/setUser/){
	createUser();
	# printHash();
}elsif($queryHash{type} =~ m/delUser/){
	removeUser();
	# printHash();
}elsif($queryHash{type} =~ m/sendChat/){
	sendMessage();
	# printHash();
}elsif($queryHash{type} =~ m/getChat/){
	getMessage();
}
#else{
#	printHash();
#}

# I'm printing hash for each instance anyway
printHash();

sub createID(){
	$random = int(rand(1000000000));
	$queryHash{'value'} = $random;
}

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
			if($split[1] =~ m/$queryHash{user}/){
				$queryHash{error} = "User $queryHash{user} already exists";
				return 0;
			}
		}
	}
	
	$queryHash{date} = localtime();
	
	# If the file doesn't exist
	open(USER, ">>userlist.txt") || catch("Can't open file for writing");
	flock(USER, 2) || catch("Missed file lock");
	print USER "$queryHash{code},$queryHash{user},$queryHash{remote},$queryHash{date}\n";
	close(USER) || catch("Can't close file");
	
}

sub removeUser(){
	
	createDirectory("main");
	
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
			if(!($dsplit[1] =~ m/$queryHash{user}/) && !($dsplit[0] =~ m/$queryHash{code}/)){
				push(@newData, $sdata);
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
	$queryHash{error} = "User $queryHash{user} can't be deleted";
}

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
			if(($dsplit[1] =~ m/$queryHash{user}/) && ($dsplit[0] =~ m/$queryHash{code}/)){
				return 1;
			}
		}
	}
	return 0;
}

# You can only send a message if you are logged in
sub sendMessage(){

	if(userExists()){
		open(USER, ">>message.txt") || catch("Can't open file for writing");
		flock(USER, 2) || catch("Missed file lock");
		print USER "<b>&lt;$queryHash{user}:&gt;</b>$queryHash{message}<br />\n";
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
		
		$queryHash{getText} = join("", @newData);
	}else{
		$queryHash{getText} = "";
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
		
		$queryHash{getText} = join("", @newData);
	}else{
		$queryHash{getText} = "";
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
		
		$queryHash{getUsers} = join("", @newUser);
	}else{
		$queryHash{getUsers} = "";
	}
}

# Prints a hash with all the values intact
sub printHash(){
	# Just to show the JSON
	print "{\n";
	
	# A simple counter
	$counter = 0;

	# FOREACH LOOP
	foreach $key (sort keys %queryHash) {
		
		if($counter > 0){
			print ",\n";
		}
		
		print "$key : \"$queryHash{$key}\"";
		$counter++;
	}

	# Finishes the JSON file
	print "\n};";
}

# This function makes a directory
sub createDirectory(){
	if(defined($_[0])){
		# This creates the main directory if it doesn't exist
		if(!(-e $_[0])){
			mkdir($_[0], 0755) || catch("Can't create directory");
		}
	
		# This changes the directory to write in main 
		chdir($_[0]) || catch("Can't get into directory");
		return 1;
	}
	return 0;
}

sub catch(){
	if(defined($_[0])){
		$queryHash{'error'} = $_[0].": $!";
	}
	printHash();
	exit 0;
}

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