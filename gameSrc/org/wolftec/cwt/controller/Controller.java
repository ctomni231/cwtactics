package org.wolftec.cwt.controller;

import org.wolftec.cwt.controller.net.XmlHttpNetwork;
import org.wolftec.cwt.controller.states.StateAdministration;
import org.wolftec.cwt.controller.states.base.Gameloop;
import org.wolftec.cwt.controller.ui.UserInteraction;
import org.wolftec.cwt.controller.urlConfig.UrlConfiguration;
import org.wolftec.cwt.core.persistence.LocalForage;
import org.wolftec.cwt.core.persistence.LocalForageConfig;
import org.wolftec.cwt.model.ActionDataPuffer;
import org.wolftec.cwt.model.Model;
import org.wolftec.cwt.view.View;
import org.wolftec.cwt.view.audio.MusicLoader;
import org.wolftec.cwt.view.audio.SoundLoader;
import org.wolftec.cwt.view.audio.VolumePersistence;

public class Controller {

  public final Model model;
  public final View view;

  public final VolumePersistence volumeStorage;
  public final MusicLoader musicLoader;
  public final SoundLoader sfxLoader;
  public final XmlHttpNetwork network;

  public final ActionDataPuffer actionEvalPuffer;

  public final UrlConfiguration urlConfig;

  public final Gameloop loop;

  public final UserInteraction ui;

  public final StateAdministration state;

  public Controller(Model model, View view) {
    this.view = view;
    this.model = model;

    volumeStorage = new VolumePersistence();
    sfxLoader = new SoundLoader();
    musicLoader = new MusicLoader();
    network = new XmlHttpNetwork();

    actionEvalPuffer = new ActionDataPuffer();

    ui = new UserInteraction();
    ui.gameround.actions = model.actions;

    urlConfig = new UrlConfiguration();

    // TODO
    // loader = new GameDataLoader();
    // loader.ctr = this;
    // loader.view = view;

    loop = new Gameloop();

    state = new StateAdministration();

    initPersistence();
  }

  private void initPersistence() {
    LocalForageConfig config = new LocalForageConfig();
    config.name = "CWT_DATABASE";
    config.size = 50 * 1024 * 1024;
    LocalForage.localforage.config(config);
  }
}
