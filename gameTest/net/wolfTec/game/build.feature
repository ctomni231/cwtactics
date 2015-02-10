Feature: Turn owner can send one of his units into the wait mode
  As a gamer
  I want to send my units into the wait mode
  So I can move them without having to do an action at the target place
  
  Scenario: ...
    Given an empty tile
    When click on it
    Then wait action is not visible
