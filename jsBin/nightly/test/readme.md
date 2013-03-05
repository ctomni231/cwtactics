# Introduction


# Tests

    test( "a basic test example", function() {
      var value = "hello";
      equal( value, "hello", "We expect value to be hello" );
    });

# Modules

You can use the module() function to separate your tests into logical pieces.

    module( "group a" );
    
    test( "a basic test example", function() {
      ok( true, "this test is fine" );
    });
    
    test( "a basic test example 2", function() {
      ok( true, "this test is fine" );
    });
    
    // -----------------------------------------------
    
    module( "group b" );
    
    test( "a basic test example 3", function() {
      ok( true, "this test is fine" );
    });
    
    test( "a basic test example 4", function() {
      ok( true, "this test is fine" );
    });

If you need setup and tear down functionality then you can use the following schema.

    module( "module", {
      
      setup: function() {
        ok( true, "one extra assert per test" );
      }, 
      
      teardown: function() {
        ok( true, "and one extra assert after each test" );
      }
    });
    
    test( "test with setup and teardown", function() {
      expect( 2 );
    });

# Assertsions

All descriptions in this section are taken from QUnit official documentation.

### Ok

    ok( truthy [, message ] )
    
The most basic one is ok(), which requires just one argument. If the argument evaluates to true, 
the assertion passes; otherwise, it fails. In addition, it accepts a string to display as a 
message in the test results:

    test( "ok test", function() {
      ok( true, "true succeeds" );
      ok( "non-empty", "non-empty string succeeds" );
     
      ok( false, "false fails" );
      ok( 0, "0 fails" );
      ok( NaN, "NaN fails" );
      ok( "", "empty string fails" );
      ok( null, "null fails" );
      ok( undefined, "undefined fails" );
    });
    

### Simple Equal

    equal( actual, expected [, message ] )

The equal assertion uses the simple comparison operator (==) to compare the actual and expected 
arguments. When they are equal, the assertion passes; otherwise, it fails. When it fails, both 
actual and expected values are displayed in the test result, in addition to a given message:

    test( "equal test", function() {
      equal( 0, 0, "Zero; equal succeeds" );
      equal( "", 0, "Empty, Zero; equal succeeds" );
      equal( "", "", "Empty, Empty; equal succeeds" );
      equal( 0, 0, "Zero, Zero; equal succeeds" );
     
      equal( "three", 3, "Three, 3; equal fails" );
      equal( null, false, "null, false; equal fails" );
    });    

Compared to ok(), equal() makes it much easier to debug tests that failed, because it's obvious 
which value caused the test to fail.  

When you need a strict comparison (===), use strictEqual() instead.

### Strict Equal

    deepEqual( actual, expected [, message ] )

The deepEqual() assertion can be used just like equal() and is a better choice in most cases. 
Instead of the simple comparison operator (==), it uses the more accurate comparison 
operator (===). That way, undefined doesn't equal null, 0, or the empty string (""). It also 
compares the content of objects so that {key: value} is equal to {key: value}, even when comparing 
two objects with distinct identities.

deepEqual() also handles NaN, dates, regular expressions, arrays, and functions, while equal() 
would just check the object identity:

    test( "deepEqual test", function() {
      var obj = { foo: "bar" };
     
      deepEqual( obj, { foo: "bar" }, "Two objects can be the same in value" );
    });

In case you want to explicitly not compare the content of two values, equal() can still be used. 
In general, deepEqual() is the better choice.


# Extensions by BlackCat

### Not Null

    notNull( actual [, message] );

### Is Null

    isNull( actual [, message] );

### Is

Actually a shorthand for deepEqual().

    is( actual, expected [, message] );

### Greater Equals

    ge( actual, check [, message] );

### Greater Than

    gt( actual, check [, message] );

### Lower Equals

    le( actual, check [, message] );

### Greater Than

    lt( actual, check [, message] );

### Has Property

    hasKey( actual, property [, message] );
    
### Is Populated

    hasKeys( actual [, message] );
    
### Throws an Error

    throwsError( function [, message] );
