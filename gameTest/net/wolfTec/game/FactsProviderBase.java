package net.wolfTec.game;

import static org.stjs.javascript.JSObjectAdapter.$js;

import org.stjs.javascript.functions.*;

public class FactsProviderBase {

  private Object cucumber;

  public FactsProviderBase() {
    super();
  }

  protected void addGiven1(String pattern, Callback1<Callback0> callback) {
    $js("this.cucumber.Given(pattern, callback)");
  }

  protected void addGiven2(String pattern, Callback2<Object, Callback0> callback) {
    $js("this.cucumber.Given(pattern, callback)");
  }

  protected void addWhen1(String pattern, Callback1<Callback0> callback) {
    $js("this.cucumber.When(pattern, callback)");
  }

  protected void addWhen2(String pattern, Callback2<Object, Callback0> callback) {
    $js("this.cucumber.When(pattern, callback)");
  }

  protected void addThen1(String pattern, Callback1<Callback0> callback) {
    $js("this.cucumber.Then(pattern, callback)");
  }

  protected void addThen2(String pattern, Callback2<Object, Callback0> callback) {
    $js("this.cucumber.Then(pattern, callback)");
  }

  protected void fine(Object callback) {
    $js("callback()");
  }

  protected void fail(Object callback) {
    $js("callback.fail()");
  }

}