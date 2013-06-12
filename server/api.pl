#!/usr/bin/perl
# create - creates a game session
# delete - eliminates a game session
# append - appends an action to a game session
# retrieve - get the list of actions for a game session
	
use CGI;
use DBI;

$database = "test.db";
$session_folder = "sessions";

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

sub create
{
    my $session = rnd_str(12);
print "g\n";
    my $dbh = DBI->connect("dbi:SQLite:dbname=$database", "", "", { RaiseError => 1}) or die $DBI::errstr;
print "g\n";
    $dbh->do("INSERT INTO Session VALUES('$session','$_[0]')") || die "Error inserting to DB";
print "g\n";
    open (MYFILE, ">$session_folder/$session" ) || die "Cannot Open File";
print "g\n";
    $dbh->disconnect();
print "g\n";
    return $session;
}

sub dlete
{
    my $dbh = DBI->connect("dbi:SQLite:dbname=$database", { RaiseError => 1 }) or die $DBI::errstr;
    my $sth = $dbh->prepare( "SELECT * FROM Session WHERE uuid=$_[0] AND token=$_[1]");  
    $sth->execute();
    $sth->fetchrow();
    if ( $sth->rows() == 1 )
    {
        $sth = $dbh->prepare(" DELETE FROM Session WHERE uuid=$_[0] AND token=$_[1]");
        $sth->execute();
        $dbh->disconnect();
        unlink("$session_folder/$_[1]");
        return "Success";
    }
    else 
    { 
        $dbh->disconnect();
        return "Fail";
    }
}

sub append
{
    my $dbh = DBI->connect("dbi:SQLite:dbname=$database", { RaiseError => 1 }) or die $DBI::err;
    my $sth = $dbh->prepare( "SELECT * FROM Session WHERE uuid=$_[0] AND token=$_[1]");
    $sth->execute();
    $sth->fetchrow();
    $dbh->disconnect();
    if ( $sth->rows() == 1 )
    {
        my $message = $_[3];
        open(DAT,">>$session_folder/$_[1]") || die("Cannot Open File");
        print DAT $message;
        return "Success";
    }
    else
    {
       return "Fail";
    } 
}

sub retrieve
{
    my $dbh = DBI->connect("dbi:SQLite:dbname=$database", { RaiseError => 1 }) or die $DBI::err;
    my $sth = $dbh->prepare( "SELECT * FROM Session WHERE uuid=$_[0] AND token=$_[1]");
    $sth->execute();
    $sth->fetchrow();
    $dbh->disconnect();
    if ( $sth->rows() == 1 )
    {
        open (DAT, "$session_folder/$_[1]");
        while (<MYFILE>) {
 	    chomp;
            print "$_\n";
        }
        close (MYFILE);
        return "Success";
    }
    else 
    { 
        return "Fail";
    }
}

$cgi = new CGI;

for $key ( $cgi->param() )
{
    $input{$key} = $cgi->param($key);
}

print $cgi->header('text/html');

for $key ( keys %input )
{
    if ( $key eq "action" )
    {
        $action =  $input{$key};
    }
    elsif ( $key eq "param")
    {
        $param =  $input{$key};
    }
    elsif ( $key eq "token")
    {
        $token =  $input{$key};
    }
    elsif ( $key eq "message")
    {
        $message =  $input{$key};
    }
}
#$action = $ARGV[0];
#$param = $ARGV[1];
#$token = $ARGV[2];

$action = "append";
$param = "vqZF4HCQnNGy";
$token = "adslmode";
$message = "line";

print "$action \n";
print "$param \n";
print "$token \n";
print "$message \n";
if ( $action eq "create" )
{
    print "create: ";
    print create($token);
} 
elsif ( $action eq "delete" )
{ 
    print "delete: ";
    print dlete($param, $token);
} 
elsif ( $action eq "append" )
{ 
    print "append: ";
    print append($param, $token, $message);
}
elsif ( $action eq "retrive" )
{ 
    print "retrieve: ";
    print retrieve($param, $token);
}
else
{
    mkdir "$session_folder" or die "Unable to create the folder: $session_folder\n";
    my $dbh = DBI->connect("dbi:SQLite:dbname=$database", "", "", { RaiseError => 1}) or die $DBI::errstr;
    $dbh->do("DROP TABLE IF EXISTS Session");
    $dbh->do("CREATE TABLE Session(uuid TEXT, password TEXT)");
    $dbh->disconnect();   
    print "Default action";
}
