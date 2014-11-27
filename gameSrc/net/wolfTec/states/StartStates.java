package net.wolfTec.states;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;

public class StartStates {
    public static void addToStateMachine (Statemachine statemachine) {

        final Map<String, Object> stateData = JSCollections.$map();

        stateData.$put("enter", new Callback0() {
            @Override  public void $invoke() {
                stateData.$put("drawn", false);
            }
        });

        stateData.$put("update",  new Callback0() {
            @Override  public void $invoke() {
                /*
                 if (this.data.backgroundDrawn) {
                this.changeState("LOADING_SCREEN");
            }
                 */
            }
        });

        stateData.$put("render",  new Callback0() {
            @Override  public void $invoke() {
                /*
                if (!this.data.backgroundDrawn) {
                var ctx = renderer.layerBG.getContext(constants.INACTIVE);

                ctx.fillStyle = "gray";
                ctx.fillRect(0, 0, renderer.screenWidth, renderer.screenHeight);

                this.data.backgroundDrawn = true;
            }
                 */
            }
        });
    }
}
