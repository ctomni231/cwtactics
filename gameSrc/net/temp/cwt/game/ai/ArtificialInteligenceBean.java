package net.temp.cwt.game.ai;

import net.temp.cwt.game.gamemodel.model.Player;
import net.temp.wolfTecEngine.decision.DecisionTree;
import net.temp.wolfTecEngine.decision.Sequence;
import net.temp.wolfTecEngine.logging.Logger;

import org.stjs.javascript.JSCollections;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagedConstruction;

@ManagedComponent
public class ArtificialInteligenceBean implements ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;
  
  private DecisionTree tree;
  
  @Override
  public void onComponentConstruction(ComponentManager manager) {
    tree = new DecisionTree(
        new Sequence(JSCollections.$array(
            new SampleHello(log),
            new SampleHello(log),
            new SampleHello(log),
            new SampleHello(log),
            new SampleHello(log)
        ))
    );
  }

  /* TODO
   * 
   * var tree = new behaviorTree.BehaviorTree( behaviorTree.Selector([
   * 
   * behaviorTree.Sequence([
   * 
   * // is power available for activation? behaviorTree.Task(function (model){
   * return (co.canActivatePower(model.turnOwner, co.POWER_LEVEL_COP)?
   * behaviorTree.Node.SUCCESS : behaviorTree.Node.FAILURE); }),
   * 
   * // when super power is not far away and the battlefield situation equal or
   * in win situation // then try to saveGameConfig for the super co power
   * behaviorTree.Task(function (){
   * 
   * }),
   * 
   * // activate power behaviorTree.Task(function (){
   * actions.sharedAction("activatePower", model.turnOwner.id,
   * co.POWER_LEVEL_COP); }) ]),
   * 
   * behaviorTree.Sequence([
   * 
   * // lookup for visible enemy captures behaviorTree.Task(function () {
   * 
   * }),
   * 
   * // make decision on capture type (neutral/own stuff?)
   * behaviorTree.Task(function () {
   * 
   * }),
   * 
   * // lookup for possible attacking unit behaviorTree.Task(function () {
   * 
   * }),
   * 
   * // make attack behaviorTree.Task(function () {
   * 
   * }) ]),
   * 
   * // capture properties behaviorTree.Sequence([
   * 
   * ]),
   * 
   * // attack units behaviorTree.Sequence([
   * 
   * ]),
   * 
   * behaviorTree.Sequence([
   * 
   * ]),
   * 
   * behaviorTree.Sequence([
   * 
   * // check battlefield -> do not build things when the own army is strong
   * enough to hold // position -> saveGameConfig money (if you) // -> when
   * enough money is saved to build super heavy objects then build regardless //
   * of the situation on the battlefield behaviorTree.Task(function () {
   * 
   * }),
   * 
   * // at least one factory must be free and ready to produce things
   * behaviorTree.Task(function () {
   * 
   * }),
   * 
   * // check money: the player must at least able to buy the cheapest thing
   * behaviorTree.Task(function () { return behaviorTree.Node.FAILURE; }),
   * 
   * // foot soldiers behaviorTree.Sequence([
   * 
   * // check the situation on the battlefield // - dumbboy will try to generate
   * a footsoldier ratio // - the ratio changes when dumbboy sees enemy or
   * neutral properties behaviorTree.Task(function () {
   * 
   * }),
   * 
   * // build infantry on factory behaviorTree.Task(function () {
   * 
   * }) ]),
   * 
   * // artilleries behaviorTree.Sequence([
   * 
   * // check the situation on the battlefield // - dumbboy will try to generate
   * a direct/indirect ratio // - the ratio changes maybe when the ai sees a lot
   * of strong enemy units behaviorTree.Task(function () {
   * 
   * }),
   * 
   * // build artillery on factory behaviorTree.Task(function () {
   * 
   * }) ]),
   * 
   * // other direct attack units behaviorTree.Sequence([
   * 
   * // build other direct attack units on factory behaviorTree.Task(function ()
   * {
   * 
   * }) ]) ]),
   * 
   * behaviorTree.Task(function () { // there is nothing to do for dumbBoy when
   * a tick reaches this leaf // -> invoke next turn to end the turn for the
   * current active ai instance.
   * 
   * actions.sharedAction("nextTurn"); return behaviorTree.Node.SUCCESS; }) ])
   * );
   */

  /**
   * Makes a step for the AI state machine. The AI will do things here.
   */
  public void doTick() {
    tree.iterate();
  }

  /**
   * Registers a player as AI player. The player will be handled by the host
   * instance of a game round instance.
   *
   * @param player
   */
  public void registerAiPlayer(Player player) {
    log.error("NotImplementedException");
  }

  /**
   * Resets all given AI data.
   */
  public void reset() {
    log.error("NotImplementedException");
  }
}
