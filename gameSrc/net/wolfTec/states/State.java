package net.wolfTec.states;

import net.wolfTec.input.InputData;
import net.wolfTec.states.widgets.UiScreenLayout;

import org.stjs.javascript.functions.Callback1;

public abstract class State {

	public void enter() {
	}

	public void exit() {
	}

	public void init() {
	}

	public void update(int delta, InputData input) {
	}

	public void render(int delta) {
	}

	public void cursorMovedTo(int x, int y) {
	}

	public void clickAtCanvasPosition(int cx, int cy) {
	}

	public void keyUp() {
	}

	public void keyDown() {
	}

	public void keyLeft() {
	}

	public void keyRight() {
	}

	public void keyAction() {
	}

	public void keyCancel() {
	}

	public Callback1<UiScreenLayout>	doLayout;
	public UiScreenLayout							layout;

	// only for animation states
	public boolean										animationState;
	public int												subStates;
	public int												currentSubState;

	public String											prevState;				// TODO: move exit
																											// logic directly into
																											// the states
	public String											nextState;				// TODO: move exit
																											// logic directly into
																											// the states

	public State() { // TODO: use compositions here

		this.animationState = false;
		this.subStates = 0;
		this.currentSubState = 0;
		this.nextState = null;
		this.prevState = null;
		this.doLayout = null;
		this.layout = null;
	}
}
