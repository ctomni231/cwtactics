# Folders

## ai

## base

Base folder contains the base file with some constants for the whole game. Every folder can interact with the base
folder.

## classes

Contains all classes of the game. Nothing here should be designed to interact with other folders (except base).
Classes can depend each other (e.g. inheritance).

## commands

Commands are the highest level in the abstraction of the game engine. Commands are created and used from the game flow
controller. Every command should only interact with the game flow and nothing else.

## controller

Controller objects are usable from other folders. It should not contain direct game logic. It's more suited to realize
supporting task like serialization, data holders and so on.

## data

The single objects of the game are defined here plus their game changing effects (e.g. CO powers).

## flow

## html

Contains the start HTML file with the DOM structure.

## input

Contains all input modules. In general a module creates an Input instance and registers it in the Input object.

## loading

Contains all loading modules. The modules are evaluated at start of the game in the order how they defined in the
starter HTML file. The loading modules should only interact with the controller folder.

## logic

This folder implements the game rules. It interacts with the instances of game classes, game model and other
logic objects.

## model

Holds the game model.

## sheets

Definition of the single game data types.

## test

Everything for tests goes into this folder.