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
    my $session = rnd_str(24);
    my $dbh = DBI->connect("dbi:SQLite:dbname=test.db", "", "", { RaiseError => 1}) or die $DBI::errstr;
    $dbh->do("INSERT INTO Session VALUES('$session','$2')");
    open (MYFILE, ">$session") || die "Cannot Open File";
    $dbh->disconnect();
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
    if ( $key == "action" )
    {
        $action =  $input{$key};
    }
    elsif ( $key == "param")
    {
        $param =  $input{$key};
    }
    elsif ( $key == "token")
    {
        $token =  $input{$key};
    }
    elsif ( $key == "message")
    {
        $message =  $input{$key};
    }
}

if ( $action == "create" )
{
    return create($token);
} 
elsif ( $action == "delete" )
{ 
    return dlete($param, $token);
} 
elsif ( $action == "append" )
{ 
    return append($param, $token, $message);
}
elsif ( $action == "retrive" )
{ 
    return retrieve($param, $token);
}
else
{
    my $dbh = DBI->connect("dbi:SQLite:dbname=test.db", "", "", { RaiseError => 1}) or die $DBI::errstr;
    $dbh->do("CREATE TABLE Session(uuid TEXT, password TEXT)");
    $dbh->disconnect();   
}
