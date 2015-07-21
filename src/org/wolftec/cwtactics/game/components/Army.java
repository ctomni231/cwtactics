package org.wolftec.cwtactics.game.components;

import org.wolftec.cwtactics.game.core.DataDescriptor;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class Army implements Component {

  public String name;
  public String music; // TODO this maybe solvable by repo organization e.g.
                       // LASH --> music\lash.mp3
  public int    color;

  @Override
  public void describe(DataDescriptor data) {
    data.desc("name").pattern("AR[a-zA-Z0-9]{4,10}");

    data.desc("music").pattern("MS[.]{4}");

    data.desc("color").integer().ge(0).le(6);
  }
}
