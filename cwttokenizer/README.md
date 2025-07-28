![Custom Wars Tactics](https://i.imgur.com/dfAqrqs.png)

# Custom Wars Tactics - Math Tokenizer
By: JakeSamiRulz

* [Custom Wars Tactics - Math Token Parser](https://ctomni231.github.io/cwtactics/cwttokenizer)

This math tokenizer was built from the ground up for Custom Wars Tactics. It has a few strengths and weaknesses which will be briefly covered below:

### Pros

* Resists syntax errors, instead trying to auto-complete inputted strings
* Accepts floats and integers
* Can calculate tokens on-the-fly

### Cons

* Each token, including parenthesis, MUST be separated by whitespace or it won't work
* Probably has a few issues that haven't been caught yet

# Usage

To use this program, follow [this link](https://ctomni231.github.io/cwtactics/cwttokenizer), then try typing out the following within the value field to see results

* Value: "2 + 2" -> Result: 4
* Value: "10 - ( 20 + 10 )" -> Result: -20
* Value: "2 ** 3" -> Result: 8

# Math Tokens Key

A tokenizer is defined by what it can do, and this one is no exception. Below you will find some functionality of this tokenizer.

## Basic Token Group

This handles the most basic of arithmetic tokens and numbers.

### Non-Token Number

Placing a number by itself will return that number as a value

* Value: "100" -> Result: "100"

### '+' Addition "Plus" Token

This token will add the value left of the token the value right of the token

* Value: "100 + 100" -> Result: "200"

You can also chain tokens (follows PEMDAS)

* * Value: "100 + 100 + 10" -> Result: "210"

### '-' Subtraction "Minus" Token

This token will subtract the value right of the token from the value left of the token

* Value: "100 - 90" -> Result: "10"

You can also chain tokens (follows PEMDAS)

* * Value: "100 - 30 - 2" -> Result: "68"

### '*' Multiplication "Product" Token

This token will multiply the value left of the token with the value right of the token

* Value: "100 * 9" -> Result: "900"

You can also chain tokens (follows PEMDAS)

* * Value: "2 * 2 * 2" -> Result: "8"

### '/' Division "Quotient" Token

This token will divide the value right of the token from the value left of the token

* Value: "100 / 10" -> Result: "10"

You can also chain tokens (follows PEMDAS)

* Value: "10 / 5 / 2" -> Result: "1"

## Parenthesis "()" Token Group

### '(' Parenthesis "Group" Start Token

Like in basic math equations, you can use parenthesis to create groups of token equations. This program will automatically close parenthesis if it reaches the end of the string.

* Value: "10 / ( 5 / 2 )" -> Result: "4"
* Value: "10 - ( 10 + 20 )" -> Result: "-20"

Parenthesis can be nested within each other for greater control over equations.

* Value: "( 10 + ( 10 - 10 ) + 10 )" -> Result: "40"

There is a hard limit of how many of these can be created per equation (limit 52)

### ')' Parenthesis "Group" End Token

These are used to end parenthesis groups. If the program reaches the end of a string, it will close any open parenthesis automatically. However, if you are OCD adjacent, you can use these to close them yourself at any time.

* Value: "10 / ( 5 / 2 )" -> Result: "4"
* Value: "10 - ( 10 + 20 )" -> Result: "-20"
* Value: "( 10 + ( 10 - 10 ) + 10 )" -> Result: "40"

## Advanced Token Group

When basic math and parenthesis grouping just aren't cutting it, you can use these advanced tokens to get a bit more power from your equations.

All of these can be chained like the "Basic Tokens".

### '**' Power Token

This token will send the value on the left side of the token to the power of the right side of the token.

* Value: "10 ^ 2" -> Result: "100"
* Value: "3 ^ 2" -> Result: "9"

### '^' Power Token (alternate)

This Token will send the value on the left side of the token to the power of the right side of the token.

Another way of writing a power token because I couldn't decide on notation :P

* Value: "10 ^ 2" -> Result: "100"
* Value: "3 ^ 2" -> Result: "9"

### '^=' Base Log Token

Using the right side of the token as a base, this token will tell you what power you need to reach the left side of the token.

A little confusing, so maybe a few examples will help:

* Value: "8 ^= 2" Result: "3"
* Translation: 2 ^ "3" = 8

* Value: "100 ^= 10" Result: "2"
* Translation: 10 ^ "2" = 100

* Value: "625 ^= 5" Result: "4"
* Translation: 5 ^ "4" = 625

### '//' Nth Root Token

This token will use the value of the left side of the token and provide the answer for the root provided by right side of the token.

Another confusing one, so here are more examples:

* Value: "25 // 2" Result: "5"
* Code: sqrt(25) = 5
* Translation: " 5 * 5 = 25"
* Text: The Square Root of 25 is 5

* Value: "8 // 3" Result: "2"
* Code: 2^3 = 8
* Translation: "2 * 2 * 2 = 8"
* Text: The Third Root of 8 is 2

* Value: "4096 // 4" Result: "8"
* Code: 8^4 = 4096
* Translation: "8 * 8 * 8 * 8 = 4096"
* Text: The Fourth Root of 4096 is 8

### '%' Remainder "Modulus" Token

This token will divide the value right of the token from the value left of the token, and provide the remainder instead of the answer

* Value: "100 % 9" -> Result: "1"
* Translation: 100 / 9 = 11 Remainder "1"

* Value: "8 % 3" -> Result: "2"
* Translation: 8 / 3 = 2 Remainder "2"

### '^^' Maximum Token

This token compares the numbers on the left and right side of the token, and returns the largest number

* Value: "20 ^^ 10" -> Result: "20"
* Value: "10.2 ^^ 10.1" -> Result: "10.2"
* Value: "-10 ^^ 10" -> Result: "10"

### '__' Minimum Token

This token compares the numbers on the left and right side of the token, and returns the smallest number

* Value: "20 __ 10" -> Result: "10"
* Value: "10.2 __ 10.1" -> Result: "10.1"
* Value: "-10 __ 10" -> Result: "-10"

### '\~\~' Average Token

This token will obtain the average of the values on the left side and right side of the token

* Value: "20 \~\~ 10" -> Result: "15"
* Value: "10.2 \~\~ 10.1" -> Result: "10.15"
* Value: "-10 \~\~ 10" -> Result: "0"

And yes, before you ask, this token, is indeed, average ;)

## Comparator Token Group

These tokens break the typical tokenizer convention, and allow you to perform comparisons of values contained in the equations and groups.

In addition, all of these can be chained like the "Basic Tokens".

The one rule to remember about these is that they will always return one of two values:

* "0": If the comparison is false
* "1": If the comparison is true

Examples of the comparators and both of their results will appear below.

### '=' Equal Comparator Token

This token will equate if the value on the left side and the right side of the token are equal to each other.

* Value: "10 = 10" -> Result: "1"
* Value: "10 = -10" -> Result: "0"

### '==' Equal Comparator Token (alternate)

This token will equate if the value on the left side and the right side of the token are equal to each other.

* Value: "10 == 10" -> Result: "1"
* Value: "10 == -10" -> Result: "0"

This alternate version is for the programmers and coders, whose mind has been forever ruined that a single equal sign within an if statement could cause the breakdown of your entire programmatic masterpiece. So they have been trained to always go with double equals, and double equals they shall type. They will not fall like their previous ancestors, they shall rise triumphant as coded in Turing - Book 1; Chapter 5; Verse 12.

### '!=' Not-Equal Comparator Token

This token will equate if the value on the left side and the right side of the token are NOT equal to each other.

* Value: "10 != 10" -> Result: "0"
* Value: "10 != -10" -> Result: "1"

### '<' Less Than Comparator Token

This token will equate if the value on the left side of the token is less than the value on the right side of the token.

"The alligator eats the bigger number" - Random Teacher from my past

* Value: "4 < 5" -> Result: "1"
* Value: "5 < 4" -> Result: "0"

### '<=' Less Than or Equal To Comparator Token

This token will equate if the value on the left side of the token is less than or equal to the value on the right side of the token.

"The alligator eats the bigger number" - Random Teacher from my past

* Value: "4 <= 5" -> Result: "1"
* Value: "5 <= 4" -> Result: "0"
* Value: "5 <= 5" -> Result: "1"

### '>' Grater Than Comparator Token

This token will equate if the value on the left side of the token is less than the value on the right side of the token.

"The alligator eats the bigger number" - Random Teacher from my past

* Value: "4 > 5" -> Result: "0"
* Value: "5 > 4" -> Result: "1"

### '>=' Greater Than or Equal To Comparator Token

This token will equate if the value on the left side of the token is less than or equal to the value on the right side of the token.

"The alligator eats the bigger number" - Random Teacher from my past

* Value: "4 >= 5" -> Result: "0"
* Value: "5 >= 4" -> Result: "1"
* Value: "5 >= 5" -> Result: "1"

## "|" Ending Token Group

Below you will find a group of ending tokens. All ending tokens will have a '|' at the beginning, and it means the following things:

* These tokens must show up at the END of either an equation or group chain in order to function
* Don't use '|' in a equation, because it isn't a token by itself :P
* These tokens CANNOT be used at the beginning or the middle of chains without using groups
  * It is best to use them in parenthesis groups, because groups allow these to be chained normally

### '|~' Rounding Token

This token takes the value to the left of the token, and rounds it to the nearest whole number just like you remember in grade school.

* Value: "4.3 |~" -> Result: "4"

Parenthesis Grouping Example:

* "( 4.5 |~ ) + 1" -> Result: "6"

### '|_' Floor Token

This token takes the value to the left of the token, and gets rid of all the decimal points leaving you with the base integer.

* Value: "4.3 |_" -> Result: "4"

Parenthesis Grouping Example:

* "( 4.5 |_ ) + 1" -> Result: "5"

### '|^' Ceiling Token

This token takes the value to the left of the token, and if it has any decimal points will set itself to the next whole number greater than this value.

* Value: "4.3 |^" -> Result: "5"

Parenthesis Grouping Example:

* "( 4.5 |^ ) + 1" -> Result: "6"

### '|+' Absolute Value Token

This token takes the absolute value of the value to the left of the token. In other words, it makes sure the value is always positive.

* Value: "-10 |+" -> Result: "10"
* Value: "8 |+" -> Result: "8"

Parenthesis Grouping Example:

* "( -10 |+ ) + 1" -> Result: "11"

### '|-' Negative Value Token

This token takes the absolute value of the value to the left of the token, then turns it negative. In other words, it makes sure the value is always negative.

* Value: "-10 |-" -> Result: "-10"
* Value: "8 |-" -> Result: "-8"

Parenthesis Grouping Example:

* "( -10 |- ) + 1" -> Result: "-9"

### '|=' Logarithmic Token

This token takes the raw logarithmic function of the value on the left of the token.

* Value: "10 |=" -> Result: "2.302585092994046"

Parenthesis Grouping Example:

* "( 1 |= ) + 1" -> Result: "1"

### '|%' Percentage Token

This token takes turns the value on the left of the token into a decimal percentage. In other words, divides the value by 100.

* Value: "10 |%" -> Result: "0.1"

Parenthesis Grouping Example:

* "( 110 |% ) * 20" -> Result: "22"

## Random Token Group

The random token group is experimental, mostly because it doesn't use any seeding to determine random numbers. Because of the nature of these, I would refrain from using these for calculations, but they should be okay to use to prototype things.

### '|?' Random Token

This token takes the value of the left side of the token and multiplies it by a random number between 0 (inclusive) and 1 (exclusive).

* Value: "10 |?" -> Result: "{0 - 10 random}"

Parenthesis Grouping Example:

* Value: "( 10 |? ) + 1" -> Result: "{1 - 11 random}"

### '|?~' Random Rounding Token

This token takes the value to the left of the token, and rounds it to the nearest whole number just like you remember in grade school. It then multiplies that value by a random number between 0 (inclusive) and 1 (exclusive).

* Value: "4.3 |?~" -> Result: "{0 - 4 random}"

Parenthesis Grouping Example:

* "( 4.5 |?~ ) + 1" -> Result: "{0 - 6 random}"

### '|?_' Random Floor Token

This token takes the value to the left of the token, and gets rid of all the decimal points leaving you with the base integer. It then multiplies that value by a random number between 0 (inclusive) and 1 (exclusive).

* Value: "4.3 |?_" -> Result: "{0 - 4 random}"

Parenthesis Grouping Example:

* "( 4.5 |?_ ) + 1" -> Result: "{0 - 5 random}"

### '|?^' Random Ceiling Token

This token takes the value to the left of the token, and if it has any decimal points will set itself to the next whole number greater than this value. It then multiplies that value by a random number between 0 (inclusive) and 1 (exclusive).

* Value: "4.3 |?^" -> Result: "{0 - 5 random}"

Parenthesis Grouping Example:

* "( 4.5 |?^ ) + 1" -> Result: "{0 - 6 random}"

### '|?+' Random Absolute Value Token

This token takes the absolute value of the value to the left of the token. It then multiplies that value by a random number between 0 (inclusive) and 1 (exclusive). In other words, it makes sure the value is always positive.

* Value: "-10 |?+" -> Result: "{0 - 10 random}"
* Value: "8 |?+" -> Result: "{0 - 8 random}"

Parenthesis Grouping Example:

* "( -10 |?+ ) + 1" -> Result: "{0 - 11 random}"

### '|?-' Random Negative Value Token

This token takes the absolute value of the value to the left of the token, then turns it negative. It then multiplies that value by a random number between 0 (inclusive) and 1 (exclusive). In other words, it makes sure the value is always negative.

* Value: "-10 |?-" -> Result: "{0 - -10 random}"
* Value: "8 |?-" -> Result: "{0 - -8 random}"

Parenthesis Grouping Example:

* "( -10 |?- ) + 1" -> Result: "{0 - -9 random}"

### '|?=' Random Logarithmic Token

This token takes the raw logarithmic function of the value on the left of the token. It then multiplies that value by a random number between 0 (inclusive) and 1 (exclusive).

* Value: "10 |?=" -> Result: "{0 - 2 random}"

Parenthesis Grouping Example:

* "( 1 |?= ) + 1" -> Result: "{0 - 1 random}"

### '|?%' Random Percentage Token

This token takes turns the value on the left of the token into a decimal percentage. It then multiplies that value by a random number between 0 (inclusive) and 1 (exclusive). In other words, divides the value by 100.

* Value: "10 |?%" -> Result: "{0 - 0.1 random}"

Parenthesis Grouping Example:

* "( 110 |?% ) * 20" -> Result: "{0 - 22 random}"

## Other Token Group

If you would like to see more tokens, feel free to create a Github ticket about it (or maybe find me in Discord :P)
