#!/usr/bin/perl
# create - creates a game session
# delete - eliminates a game session
# append - appends an action to a game session
# retrieve - get the list of actions for a game session
	
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

sub create
{

}

sub delete
{

}

sub append
{

}

sub retrieve
{

}

$cgi = new CGI;

for $key ( $cgi->param() ) {
    $input{$key} = $cgi->param($key);
}

print $cgi->header('text/html');

action;
param;
token;

for $key ( keys %input ) {
    if ( $key == "action" )
    {
        $action =  $input{$key};
    }
    else if ( $key == "param")
    {
        $param =  $input{$key};
    }
    else if ( $key == "token")
    {
        $token =  $input{$key};
    }
}

if ( $action == "create" )
{
    
} 
else if ( $action == "delete" )
{ 

} 
else if ( $action == "append" )
{ 

}
else if ( $action == "retrive" )
{ 

}
