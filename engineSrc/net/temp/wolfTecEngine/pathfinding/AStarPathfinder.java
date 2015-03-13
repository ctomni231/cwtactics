package net.temp.wolfTecEngine.pathfinding;

import net.temp.wolfTecEngine.container.MoveableMatrix;
import net.temp.wolfTecEngine.renderer.screen.DirectionUtil;
import net.temp.wolfTecEngine.renderer.screen.DirectionUtil.Direction;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.core.JsExec;
import org.wolftec.core.ManagedComponent;

/**
 * Path finder which implements the A* algorithm.
 */
@ManagedComponent
public class AStarPathfinder implements PathFinder {

  @STJSBridge
  public class ResultNode {
    public int x;
    public int y;
  }

  @Override
  public Array<Direction> findPath(MoveableMatrix costs, int sx, int sy, int tx, int ty) {
    int dsx = sx - costs.getCenterX();
    int dsy = sy - costs.getCenterY();
    int dtx = tx - costs.getCenterX();
    int dty = ty - costs.getCenterY();
    int cx = sx;
    int cy = sy;

    Object dataGrid = JsExec.injectJS("new Graph(costs.getDataArray())");
    Object start = JsExec.injectJS("dataGrid.nodes[dsx][dsy]");
    Object end = JsExec.injectJS("dataGrid.nodes[dtx][dty]");
    Array<ResultNode> path = JsExec.injectJS("astar.search(graph.nodes, start, end)");
    Array<Direction> result = JSCollections.$array();

    // extract data from generated path map and fill the movePath object
    for (int i = 0, e = path.$length(); i < e; i++) {
      ResultNode cNode = path.$get(i);

      // add code to move path
      result.$set(i, DirectionUtil.codeFromAtoB(cx, cy, cNode.x, cNode.y));

      // update current position
      cx = cNode.x;
      cy = cNode.y;
    }
    
    return result;
  }

}
