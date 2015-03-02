Feature: Wait-Action
  As a gamer
  I want to send my units into the wait mode
  So I can move them without having to do an action at the target place

  Scenario: ...
    Given an empty tile
    When click on it
    Then wait action is not visible
    
  Scenario: Wait action is available when unit does not make a move
    Given an unit that can act
    When click on it
     And click on it
    Then wait action is visible
    
  Scenario: Wait action is available when unit does make a move
    Given an unit that can act
    When click on it
     And move it to an empty tile 
     And click on it
    Then wait action is visible
  
  Scenario: A unit that waits cannot act again in the same turn
    Given an unit that cannot act
    When click on it
    Then wait action is not visible
