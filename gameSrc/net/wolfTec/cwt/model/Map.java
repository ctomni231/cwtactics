package net.wolfTec.cwt.model;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback4;

@Namespace("cwt") public class Map {

	private Array<Array<Tile>>	mapData;
	private int									maxX;
	private int									maxY;

	@SuppressWarnings("unchecked") public Map(int sizeX, int sizeY) {
		this.maxX = sizeX;
		this.maxY = sizeY;

		mapData = JSCollections.$array();
		for (int x = 0, xe = sizeX; x < xe; x++) {
			Array<Tile> column = JSCollections.$array();

			for (int y = 0, ye = sizeY; y < ye; y++) {
				column.push(new Tile());
			}

			mapData.push(column);
		}
	}

	public Tile getTile(int x, int y) {
		return mapData.$get(x).$get(y);
	}

	/**
	 * Returns the distance of two positions.
	 *
	 * @param sx
	 * @param sy
	 * @param tx
	 * @param ty
	 * @return
	 */
	public int getDistance(int sx, int sy, int tx, int ty) {
		// TODO maybe we need a bridge here
		return Math.abs(sx - tx) + Math.abs(sy - ty);
	}

	public void searchUnit(Unit unit, Callback4<Integer, Integer, Unit, Array<Object>> callback, Array<Object> callbackArgument) {

		for (int x = 0, xe = maxX; x < xe; x++) {
			for (int y = 0, ye = maxY; y < ye; y++) {
				if (mapData.$get(x).$get(y).unit == unit) {
					callback.$invoke(x, y, unit, callbackArgument);
				}
			}
		}
	}
}
