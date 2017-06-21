# Custom-WarGame Engine

## Motives

The main motive to build this engine is to create a customizable war game engine which allows to build turn based games like Advance Wars. Beside of this brilliant game I want to be able to realize tons of popular war boardgame ideas. To realize that Custom-WarGame (CWG), the former successor of CWT, must be able to be more customizable than ever.

## Structure

### Game Elements

The a CWG game consists of players, non-player entities and player entities. The players are the game elements who changes the state of the game entities.

#### Players

A player is an actor in the game who obtains the ability to change the entities.

#### Player entities

#### Non-Player entities

### Sequence of play

The sequence of play divides into a set of phases. All phases have to evaluated until the sequence of play completes.

#### Phase

## Engine API

### CWG

#### addPhase(Game, PhaseHandler)

#### addEntityType(Game, EntityDescription)

### Game

### EntityDescription

#### type

### GameWorld<T>

The game world will defined by the game itself.

### PhaseHandler - Function<GameWorld, phaseID: string>
