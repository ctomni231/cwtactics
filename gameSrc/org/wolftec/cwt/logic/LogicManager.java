package org.wolftec.cwt.logic;

import org.wolftec.cwt.core.ioc.Injectable;

public class LogicManager implements Injectable {

  public BattleLogic       battle;
  public SpecialWeaponsLogic       cannon;
  public CaptureLogic      capture;
  public CommanderLogic    commander;
  public ExplodeLogic      explode;
  public FactoryLogic      factory;
  public FogLogic          fog;
  public HideLogic         stealth;
  public JoinLogic         join;
  public LaserLogic        laser;
  public LifecycleLogic    lifecycle;
  public MoveLogic         move;
  public RelationshipLogic relationship;
  public SupplyLogic       supply;
  public TeamLogic         team;
  public TransportLogic    transport;
  public TurnLogic         turn;
  public WeatherLogic      weather;
}
