package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.Native;
import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.collection.MatrixSegment;
import org.wolftec.cwt.model.actions.MoveCodes;

public class PathGenerator {

  /* --------------- start a-star API --------------- */

  @GlobalScope
  @STJSBridge
  private static class Window {
    static AStar astar;
  }

  @STJSBridge
  private static class AStar {
    native Array<Node> search(Array<Array<Node>> nodes, Node start, Node end);
  }

  @STJSBridge
  private static class Graph {

    @Native
    Graph(Array<Array<Integer>> data) {
    }

    Array<Array<Node>> nodes;
  }

  @STJSBridge
  private static class Node {
    int x;
    int y;
  }

  /* --------------- end a-star API --------------- */

  private static final String ALGORITHM_ASTAR = "astar";

  public PathGenerator() {
    setAlgorithm(ALGORITHM_ASTAR);
  }

  public void setAlgorithm(String algo) {
    AssertUtil.assertThat(algo == ALGORITHM_ASTAR, "only astar supported at the moment");
  }

  public void calculatePath(Position startp, Position endp, MatrixSegment map, Movepath mpath) {
    int dsx = startp.getX() - map.getCenterX();
    int dsy = startp.getY() - map.getCenterY();
    int dtx = endp.getX() - map.getCenterX();
    int dty = endp.getY() - map.getCenterY();

    Array<Node> path = calcPathInSegment(map, dsx, dsy, dtx, dty);

    mpath.flush();

    int cx = startp.getX();
    int cy = startp.getY();
    for (int i = 0, e = path.$length(); i < e; i++) {
      Node cNode = path.$get(i);

      // add code to move path
      mpath.appendCode(MoveCodes.codeFromAtoB(cx, cy, cNode.x, cNode.y));

      /*
       * we need to update the current position to generate a correct move code
       * in the next iteration step
       */
      cx = cNode.x;
      cy = cNode.y;
    }
  }

  private Array<Node> calcPathInSegment(MatrixSegment map, int dsx, int dsy, int dtx, int dty) {
    Array<Array<Integer>> matrix = map.getDataArray();
    Graph graph = JSObjectAdapter.$js("new Graph(matrix)"); // TODO
    Node start = graph.nodes.$get(dsx).$get(dsy);
    Node end = graph.nodes.$get(dtx).$get(dty);
    Array<Node> path = Window.astar.search(graph.nodes, start, end);
    return path;
  }
}
