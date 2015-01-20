package net.wolfTec.states;

import net.wolfTec.Constants;
import net.wolfTec.CustomWarsTactics;
import net.wolfTec.input.InputData;
import net.wolfTec.states.widgets.UiField;
import net.wolfTec.system.AudioBean;

public abstract class MenuState extends State {

	public abstract AudioBean getAudio();
	
	@Override public void exit() {
    net.wolfTec.renderCtx.layerUI.clear(Constants.INACTIVE_ID);
	}
	
	@Override public void update(int delta, InputData input) {
		if (input != null) {
			switch (input.key) {

				case LEFT:
				case RIGHT:
				case UP:
				case DOWN:
					if (state.layout.handleInput(inputData)) {
						state.currentSubState = 0;
						getAudio().playSfx("MENU_TICK");
					}
					break;

				case ACTION:
					UiField button = state.layout.activeButton();
					button.callAction();
					state.currentSubState = 0;
					getAudio().playSfx("ACTION");
					break;

				case CANCEL:
					if (state.prevState != null) {
						CustomWarsTactics.gameWorkflow.changeState(state.prevState);
						getAudio().playSfx("CANCEL");
					}
					break;
					
				case HOVER:
				case SET_INPUT:
				default:
					break;
			}
		}
	}
}
