Feature: Turn owner can end his turn
  As a gamer
  I want to end my turn when I'm done

  Scenario: 
    Given an empty tile
    When click on it
    Then nextTurn action is visible