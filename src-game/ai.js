const gameCreateAiHandler = (world, logic, client, player) => {
  
  const state = {}

  const handleTick = () => {

    // TODO maybe analyze the enemy movements here ?

    if (world.turn.owner == player) {
      client.debug("ai: ending turn")
      logic.endTurn()
    }
  }

  client.jobs.add("tick", 500, handleTick)
}
