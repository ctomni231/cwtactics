Feature: Turn owner can send one of his units into the wait mode
  As a gamer
  I want to send my units into the wait mode
  So I can move them without having to do an action at the target place

  Scenario: Wait action is available when unit does not move
    Given I have an unit
    When I double click on it
    Then I have the wait action available