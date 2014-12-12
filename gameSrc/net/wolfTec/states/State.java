package net.wolfTec.states;

import net.wolfTec.application.CustomWarsTactics;
import net.wolfTec.input.InputData;
import net.wolfTec.utility.Assert;
import net.wolfTec.widgets.UiScreenLayout;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

import javax.security.auth.callback.Callback;

public class State {

    private static final Callback0 EMPTY_FN = new Callback0() {
        @Override
        public void $invoke() { }
    };

    public Callback0 enter;
    public Callback0 exit;
    public Callback0 init;
    public Callback2<Integer, Integer> inputMove;
    public Callback2<Integer, InputData> update;
    public Callback1<Integer> render;

    // usable for in-game and menu states
    public Callback1<Integer> UP;
    public Callback1<Integer> DOWN;
    public Callback1<Integer> LEFT;
    public Callback1<Integer> RIGHT;
    public Callback1<Integer> ACTION;
    public Callback1<Integer> CANCEL;
    public Callback2<Integer, Integer> GENERIC_INPUT;

    // menu states
    public Callback1<UiScreenLayout> doLayout;
    public UiScreenLayout layout;

    // only for animation states
    public boolean animationState;
    public int subStates;
    public int currentSubState;

    public String prevState; // TODO: move exit logic directly into the states
    public String nextState; // TODO: move exit logic directly into the states

    public State(){ // TODO: use compositions here
        this.enter = EMPTY_FN;
        this.exit = EMPTY_FN;
        this.init = EMPTY_FN;
        this.update = (Callback2) EMPTY_FN;
        this.render = (Callback1) EMPTY_FN;
        this.GENERIC_INPUT = null;
        this.inputMove = null;
        this.UP = null;
        this.DOWN = null;
        this.LEFT = null;
        this.RIGHT = null;
        this.ACTION = null;
        this.CANCEL = null;
        this.animationState = false;
        this.subStates = 0;
        this.currentSubState = 0;
        this.nextState = null;
        this.prevState = null;
        this.doLayout = null;
        this.layout = null;
    }
}
