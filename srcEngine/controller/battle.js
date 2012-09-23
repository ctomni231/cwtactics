
  /*
     D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]

     D = Actual damage expressed as a percentage

     B = Base damage (in damage chart)
     ACO = Attacking CO attack value (example:130 for Kanbei)

     R = Random number 0-9

     AHP = HP of attacker

     DCO = Defending CO defense value (example:80 for Grimm)
     DTR = Defending Terrain Stars (IE plain = 1, wood = 2)
     DHP = HP of defender
   */


  /*
     Denoted as xxxXXXX where x = small star and X = big star..for now.
     Every star is worth 9000 fund at the start of the game. Each additional use of CO Power(including SCOP)
     increase the value of each star by 1800 fund up to the tenth usage, when it won't increase any further.

     Stars on your Charge Meter can be charged in two ways:

     Damaging your oppoent's units. You gain meter equal to half the fund damage you deal.
     Receiving damage from your opponent. You gain meter equal to the fund damage you take.
     Keep in mind that AWBW only keeps track of real numbers for the purpose of Charge Meter calculation.
     That means taking a 57% attack and ending up with 5 hp only adds 0.5*full cost of unit to your Charge Meter.
     In Summary, the amount of charge added to your meter can be calculated as:

     (0.5*0.1*Damage Dealt*Cost of Unit X)+(0.1*Damage Received*Cost of Unit Y)


     It should be noted that a COs meter does not charge during the turn they activate a power.
   */

  /*
     There are multiple victory conditions in Advance Wars By Web, not all of them are possible every game.

     Annihilation
     Kill Everything that's not yours and you win, simple

     Head Quarters Capture
     Capturing a HQ defeats the owning player, no matter what, if a player owns multiple HQs the capture of any
     of them eliminates the owner.

     Lab Monopoly
     If there are no HQs Labs take their place, they work like HQs except you have to capture all of a players
     labs to eliminate them.

     Property
     In some games taking a set number of properties under your control wins you the game. Most of the time
     this option is left off, but be sure to check for it when joining a game!

     Forfeit
     Sometimes the only way to win is to get the other player to give up

     Draw
     Not actually a victory condition, but if both players agree be clicking (set draw) the game is officially tied,
     use it to end stalemates.
   */
