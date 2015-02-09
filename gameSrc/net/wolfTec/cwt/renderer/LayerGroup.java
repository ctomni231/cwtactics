package net.wolfTec.cwt.renderer;

public interface LayerGroup {

  /**
   * Renders the layer with the given index into the front layer.
   *
   * @param index
   */
  public void renderState(int index);
}
