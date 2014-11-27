package net.wolfTec.states;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.input.InputData;
import net.wolfTec.utility.Assert;

import javax.security.auth.callback.Callback;

public abstract class State {

    private Statemachine stateMachine;

    public State(Statemachine stateMachine){
        Assert.notNull(stateMachine);

        this.stateMachine = stateMachine;
    }

    public boolean isAnimationState() {
        return false;
    }

    public void exit(){

    }

    public void enter(){

    }

    public void update(int delta, InputData input) {

    }

    public void render(int delta) {

    }

    public void changeState (String stateId) {
        stateMachine.changeState(stateId);
    }

}
