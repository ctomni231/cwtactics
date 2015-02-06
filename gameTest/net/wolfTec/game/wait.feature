Feature: Turn owner can send one of his units into the wait mode
  As a gamer
  I want to send my units into the wait mode
  So I can move them without having to do an action at the target place

  Scenario: Wait action is available when unit does not make a move
    Given I have an unit
    When I double click on it
    Then I have a wait action available
    
  Scenario: Wait action is available when unit does make a move
    Given I have an unit
    When I click on it and move it to an empty tile and click there
    Then I have a wait action available
  
  Scenario: A unit that waits cannot act again in the same turn
    Given I have an unit in wait mode
    When I click on it
    Then I haven't a wait action available 