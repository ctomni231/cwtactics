#!/usr/bin/perl
# create - creates a game session
# delete - eliminates a game session
# append - appends an action to a game session
# retrieve - get the list of actions for a game session
	
use CGI;
use DBI;

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
print $session;
print " - open - ";
    my $dbh = DBI->connect("dbi:SQLite:dbname=test.db", "", "", { RaiseError => 1}) or die $DBI::errstr;
print " - open - ";
    $dbh->do("INSERT INTO Session VALUES('$session','$2')") || die "Error inserting to DB";
print " - open - ";
    open (MYFILE, ">$session" ) || die "Cannot Open File";
    $dbh->disconnect();
print " - disconnect - ";
    return $session;
}

sub dlete
{
    my $dbh = DBI->connect("dbi:SQLite:dbname=test.db", { RaiseError => 1 }) or die $DBI::errstr;
    my $sth = $dbh->prepare( "SELECT * FROM Session WHERE uuiid=$1 AND token=$2");  
    $sth->execute();
    $sth->fetchrow();
    $dbh->disconnect();
    if ( $sth->rows() == 1 )
    {
        unlink($1);
        return "Success";
    }
    else 
    { 
       return "Fail";
    }
}

sub append
{
    my $dbh = DBI->connect("dbi:SQLite:dbname=test.db", { RaiseError => 1 }) or die $DBI::err;
    my $sth = $dbh->prepare( "SELECT * FROM Session WHERE uuid=$1 AND token=$2");
    $sth->execute();
    $sth->fetchrow();
    $dbh->disconnect();
    if ( $sth->rows() == 1 )
    {
        my $message = $3;
        open(DAT,">>$2") || die("Cannot Open File");
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
    my $dbh = DBI->connect("dbi:SQLite:dbname=test.db", { RaiseError => 1 }) or die $DBI::err;
    my $sth = $dbh->prepare( "SELECT * FROM Session WHERE uuid=$1 AND token=$2");
    $sth->execute();
    $sth->fetchrow();
    $dbh->disconnect();
    if ( $sth->rows() == 1 )
    {
        open (DAT, $2);
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

action;
param;
token;
message;

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

$action = $1;
$param = $2;
$token = $3;

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
    my $dbh = DBI->connect("dbi:SQLite:dbname=test.db", "", "", { RaiseError => 1}) or die $DBI::errstr;
    $dbh->do("DROP TABLE IF EXISTS Session");
    $dbh->do("CREATE TABLE Session(uuid TEXT, password TEXT)");
    $dbh->disconnect();   
    print "Default action";
}
