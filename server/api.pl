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
    my $dbh = DBI->connect("dbi:SQLite:dbname=$database", "", "", { RaiseError => 1}) or die $DBI::errstr;
    $dbh->do("INSERT INTO Session VALUES('$session','$_[0]')") || die "Error inserting to DB";
    open (MYFILE, ">$session_folder/$session" ) || die "Cannot Open File";
    $dbh->disconnect();
    return $session;
}

sub dlete
{
    my $dbh = DBI->connect("dbi:SQLite:dbname=$database", { RaiseError => 1 }) or die $DBI::errstr;
    my $sth = $dbh->prepare( "SELECT * FROM Session WHERE uuid = ? AND token = ?");  
    $sth->execute($_[0], $_[1]);
    $sth->fetchrow();
    if ( $sth->rows() == 1 )
    {
        $sth = $dbh->prepare(" DELETE FROM Session WHERE uuid = ? AND token = ?");
        $sth->execute($_[0], $_[1]);
        $dbh->disconnect();
        unlink("$session_folder/$_[0]");
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
    my $sth = $dbh->prepare( "SELECT * FROM Session WHERE uuid = ? AND token = ?");
    $sth->execute($_[0], $_[1]);
    my($uuid, $token) = $sth->fetchrow();
    $sth->finish();
    if ( $sth->rows() == 1 )
    {
        my $message = $_[2];
        open(DAT,">>$session_folder/$uuid") || die("Cannot Open File");
        print DAT $message;
        close(DAT);
    }
    else
    {
        $dbh->disconnect();
        return "Fail";
    } 
    $dbh->disconnect();
    return "Success";
}

sub retrieve
{
    my $dbh = DBI->connect("dbi:SQLite:dbname=$database", { RaiseError => 1 }) or die $DBI::err;
    my $sth = $dbh->prepare( "SELECT * FROM Session WHERE uuid = ? AND token = ?");
    $sth->execute($_[0], $_[1]);
    $sth->fetchrow();
    $sth->finish();
    my $content;
    if ( $sth->rows() == 1 )
    {
        local $/;
        open (DAT, "$session_folder/$_[0]") or die "Can't read file [$!]\n";
        $content = <DAT>;
        close (DAT);
        $dbh->disconnect();
    }
    else 
    { 
        $dbh->disconnect();
        return "Fail";
    }
    return $content;
}

$cgi = new CGI;

for $key ( $cgi->param() )
{
    $input{$key} = $cgi->param($key);
}

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

if ( $ARGV[0] eq "-d") 
{
    $action = $ARGV[1];
    $param = $ARGV[2];
    $token = $ARGV[3];
    $message = $ARGV[4];

    print "ACTION = $action \n";
    print "PARAMETER = $param \n";
    print "TOKEN = $token \n";
    print "MESSAGE = $message \n";
} 
elsif ( $ARGV[0] eq "--create" ) 
{
    mkdir "$session_folder" or die "Unable to create the folder: $session_folder\n";
    my $dbh = DBI->connect("dbi:SQLite:dbname=$database", "", "", { RaiseError => 1}) or die $DBI::errstr;
    $dbh->do("DROP TABLE IF EXISTS Session");
    $dbh->do("CREATE TABLE Session(uuid TEXT, token TEXT)");
    $dbh->disconnect();   
}

print $cgi->header('text/html');

if ( $action eq "create" )
{
    print create($token);
} 
elsif ( $action eq "delete" )
{ 
    print dlete($param, $token);
} 
elsif ( $action eq "append" )
{ 
    print append($param, $token, $message);
}
elsif ( $action eq "retrieve" )
{ 
    print retrieve($param, $token);
}

