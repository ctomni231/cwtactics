package net.wolfTec.wtEngine.utility;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.annotation.Template;

/**
 * An implementation of the concept of a circular buffer. Internally a circular
 * buffer has a fixed size that makes the whole object very memory constant.
 *
 * @param <T>
 */
@Namespace("wtEngine") public class CircularBuffer<T> {
  public static final int DEFAULT_SIZE = 32;

  private int             index;
  private int             size;
  private Array<T>        data;
  private int             maxSize;

  @SuppressWarnings("unchecked") public CircularBuffer(int maxSize) {
    if (maxSize <= 0) throw new IllegalArgumentException("size cannot be 0 or lower");

    this.index = 0;
    this.size = 0;
    this.data = JSCollections.$array();
    this.maxSize = maxSize;
  }

  @Template("toProperty") public int getSize() {
    return this.size;
  }

  /**
   *
   * @return {boolean} true when no entries are in the buffer, else false
   */
  public boolean isEmpty() {
    return this.size == 0;
  }

  /**
   * @return {boolean} true when buffer is full, else false
   */
  public boolean isFull() {
    return this.size == this.maxSize;
  }

  /**
   * Returns an element at a given index. The element won't be returned.
   *
   * @param index
   * @return {*}
   */
  public T get(int index) {
    if (index < 0 || index >= this.size) throw new IllegalStateException("illegal index");

    return this.data.$get((this.index + index) % this.maxSize);
  }

  /**
   * Returns the oldest object from the buffer. The element will be removed from
   * the buffer.
   *
   * @returns {*}
   */
  public T popFirst() {
    if (this.size == 0) throw new IllegalStateException("buffer is empty");

    T obj = this.data.$get(this.index);

    // release entry to prevent memory leaks
    this.data.$set(this.index, null);

    this.size--;
    this.index++;
    if (this.index == this.maxSize) this.index = 0;

    return obj;
  }

  /**
   * Returns the youngest object from the buffer. The element will be removed
   * from the buffer.
   *
   * @returns {*}
   */
  public T popLast() {
    if (this.size == 0) throw new IllegalStateException("buffer is empty");

    int index = (this.index + this.size - 1) % this.maxSize;
    T obj = this.data.$get(index);

    // release entry to prevent memory leaks
    this.data.$set(index, null);
    this.size--;

    return obj;
  }

  // forEach (fn) {
  // this.data.forEach(fn);
  // }

  /**
   * Pushes an object into the buffer.
   *
   * @param el
   */
  public void push(T el) {
    if (this.size == this.maxSize) throw new IllegalStateException("buffer is full");

    this.data.$set((this.index + this.size) % this.maxSize, el);
    this.size++;
  }

  /**
   * Pushes an object into the buffer.
   *
   * @param el
   */
  public void pushInFront(T el) {
    if (this.size == this.maxSize) throw new IllegalStateException("buffer is full");

    int index = this.index - 1;
    if (index < 0) index = this.maxSize - 1;

    this.data.$set(index, el);
    this.index = index;
    this.size++;
  }

  /**
   * Removes everything from the buffer. After that the buffer will be empty.
   */
  public void clear() {
    this.index = 0;
    this.size = 0;

    // remove references from list to prevent memory leaks
    for (int i = 0, e = this.data.$length(); i < e; i++) {
      this.data.$set(i, null);
    }
  }

  /**
   *
   * @param source
   * @param target
   * @param <M>
   */
  public static <M> void copyBuffer(CircularBuffer<M> source, CircularBuffer<M> target) {
    if (target.maxSize != source.maxSize) throw new IllegalArgumentException("same size required");

    target.clear();
    for (int i = 0, e = source.size; i < e; i++) {
      target.push(source.get(i));
    }
  }
}