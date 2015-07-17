package org.wolftec.cwtactics.game.events.ui;

import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback3;
import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface RegisterAction extends SystemEvent {
  void onRegisterAction(Callback3<String, Callback1<TriggerData>, Callback1<InvokeData>> registerAction);
}
