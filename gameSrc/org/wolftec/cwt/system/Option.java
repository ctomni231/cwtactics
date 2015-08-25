package org.wolftec.cwt.system;

import java.util.NoSuchElementException;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function0;
import org.wolftec.cwt.core.JsUtil;

/**
 * A container object which may or may not contain a non-null value.
 * 
 * This class is an nearly exact API replica of the official Java 8
 * java.lang.Optional class.
 */
public class Option<T> {

  /**
   * Common instance for {@code empty()}.
   */
  private static final Option<?> EMPTY = new Option<>();

  /**
   * If non-null, the value; if null, indicates no value is present
   */
  private T                      value;

  private Option() {
    this.value = null;
  }

  /**
   * Returns an empty {@code Option} instance. No value is present for this
   * Option.
   *
   * @param <T>
   *          Type of the non-existent value
   * @return an empty {@code Option}
   */
  public static <T> Option<T> empty() {
    @SuppressWarnings("unchecked")
    Option<T> t = (Option<T>) EMPTY;
    return t;
  }

  /**
   * Returns an {@code Option} with the specified present non-null value.
   *
   * @param <T>
   *          the class of the value
   * @param value
   *          the value to be present, which must be non-null
   * @return an {@code Option} with the value present
   * @throws NullPointerException
   *           if value is null
   */
  public static <T> Option<T> of(T value) {
    if (value == null || value == JSGlobal.undefined) {
      JsUtil.throwError("NullPointerException");
    }
    Option<T> opt = new Option<>();
    opt.value = value;
    return opt;
  }

  /**
   * Returns an {@code Option} describing the specified value, if non-null,
   * otherwise returns an empty {@code Option}.
   *
   * @param <T>
   *          the class of the value
   * @param value
   *          the possibly-null value to describe
   * @return an {@code Option} with a present value if the specified value is
   *         non-null, otherwise an empty {@code Option}
   */
  public static <T> Option<T> ofNullable(T value) {
    return value == null || value == JSGlobal.undefined ? empty() : of(value);
  }

  /**
   * If a value is present in this {@code Option}, returns the value, otherwise
   * throws {@code NoSuchElementException}.
   *
   * @return the non-null value held by this {@code Option}
   * @throws NoSuchElementException
   *           if there is no value present
   */
  public T get() {
    if (value == null) {
      JsUtil.throwError("NoSuchElementException('No value present')");
    }
    return value;
  }

  /**
   * @return {@code true} if there is a value present, otherwise {@code false}
   */
  public boolean isPresent() {
    return value != null;
  }

  /**
   * If a value is present, invoke the specified consumer with the value,
   * otherwise do nothing.
   *
   * @param callback
   *          block to be executed if a value is present
   * @throws NullPointerException
   *           if value is present and {@code callback} is null
   */
  public void ifPresent(Callback1<? super T> callback) {
    if (value != null) {
      callback.$invoke(value);
    }
  }

  /**
   * Return the value if present, otherwise return {@code other}.
   *
   * @param other
   *          the value to be returned if there is no value present, may be null
   * @return the value, if present, otherwise {@code other}
   */
  public T orElse(T other) {
    return value != null ? value : other;
  }

  /**
   * Return the value if present, otherwise invoke {@code other} and return the
   * result of that invocation.
   *
   * @param other
   *          a {@code Supplier} whose result is returned if no value is present
   * @return the value if present otherwise the result of {@code other.get()}
   * @throws NullPointerException
   *           if value is not present and {@code other} is null
   */
  public T orElseGet(Function0<? extends T> other) {
    return value != null ? value : other.$invoke();
  }

  /**
   * Return the contained value, if present, otherwise throw an exception.
   *
   * @param exception
   *          exception to be thrown
   * @return the present value
   * @throws exceptionSupplier
   *           if there is no value present
   */
  public T orElseThrow(String exception) {
    if (value != null) {
      return value;
    } else {
      return JsUtil.throwError(exception);
    }
  }
}
