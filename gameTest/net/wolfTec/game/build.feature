Feature: The turn owner can build things on his factories
  As a gamer
  I want to build units on my factories
  
  Scenario: The turn owner can build infantries
    Given a BASE property of the turn owner
      And turn owner has 10000 gold
     When click on it
     Then menu is not empty
     
  Scenario: The turn owner cannot build infantries on enemy factories
    Given a BASE property of a player which is not the turn owner
      And turn owner has 10000 gold
     When click on it
     Then menu is not visible
     
  Scenario: The turn owner cannot build infantries on factories which are occupied by an unit
    Given a BASE property of the turn owner
      And the selected tile is occupied
      And turn owner has 10000 gold
     When click on it
     Then menu is not visible
