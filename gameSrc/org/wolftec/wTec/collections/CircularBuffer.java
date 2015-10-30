package org.wolftec.wTec.collections;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwt.util.JsUtil;

/**
 * An implementation of the concept of a circular buffer. Internally a circular
 * buffer has a fixed size that makes the whole object very memory constant.
 *
 * @param <T>
 */
public class CircularBuffer<T> {

  public static final int DEFAULT_SIZE = 32;

  private int      index;
  private int      size;
  private Array<T> data;
  private int      maxSize;

  @SuppressWarnings("unchecked")
  public CircularBuffer(int lMaxSize) {
    if (lMaxSize <= 0) {
      JsUtil.throwError("size cannot be 0 or lower");
    }

    index = 0;
    size = 0;
    data = JSCollections.$array();
    maxSize = lMaxSize;

    clear();
  }

  public int getSize() {
    return this.size;
  }

  public boolean isEmpty() {
    return this.size == 0;
  }

  public boolean isFull() {
    return this.size == this.maxSize;
  }

  public T get(int index) {
    if (index < 0 || index >= this.size) {
      return JsUtil.throwError("illegal index");
    }

    return this.data.$get((this.index + index) % this.maxSize);
  }

  public void set(int index, T value) {
    if (index < 0 || index >= this.size) {
      JsUtil.throwError("illegal index");
    }
    this.data.$set((this.index + index) % this.maxSize, value);
  }

  public T popFirst() {
    if (this.size == 0) {
      return JsUtil.throwError("buffer is empty");
    }

    T obj = this.data.$get(this.index);

    // release entry to prevent memory leaks
    this.data.$set(this.index, null);

    this.size--;
    this.index++;
    if (this.index == this.maxSize) this.index = 0;

    return obj;
  }

  public T getLast() {
    return get(getSize() - 1);
  }

  public T popLast() {
    if (this.size == 0) {
      JsUtil.throwError("buffer is empty");
    }

    int index = (this.index + this.size - 1) % this.maxSize;
    T obj = this.data.$get(index);

    // release entry to prevent memory leaks
    this.data.$set(index, null);
    this.size--;

    return obj;
  }

  public void push(T el) {
    if (this.size == this.maxSize) {
      JsUtil.throwError("buffer is full");
    }

    this.data.$set((this.index + this.size) % this.maxSize, el);
    this.size++;
  }

  public void pushInFront(T el) {
    if (this.size == this.maxSize) {
      JsUtil.throwError("buffer is full");
    }

    int index = this.index - 1;
    if (index < 0) index = this.maxSize - 1;

    this.data.$set(index, el);
    this.index = index;
    this.size++;
  }

  public void clear() {
    this.index = 0;
    this.size = 0;

    // remove references from list to prevent memory leaks
    for (int i = 0, e = this.data.$length(); i < e; i++) {
      this.data.$set(i, null);
    }
  }

  public void clearFromIndex(int index) { // TODO this buffer is not good
    if (index == 0) {
      clear();
      return;
    }
    for (int i = index; i < getSize(); i++) {
      set(i, null);
    }
    size = index;
  }

  /**
   *
   * @param source
   * @param target
   * @param <M>
   */
  public static <M> void copyBuffer(CircularBuffer<M> source, CircularBuffer<M> target) {
    if (target.maxSize != source.maxSize) {
      JsUtil.throwError("same size required");
    }

    target.clear();
    for (int i = 0, e = source.size; i < e; i++) {
      target.push(source.get(i));
    }
  }

  public void fillByProvider(Function1<Integer, T> provider) {
    clear();
    int i = 0;
    while (!isFull()) {
      push(provider.$invoke(i));
      i++;
    }
  }
}
