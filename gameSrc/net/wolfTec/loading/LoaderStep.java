package net.wolfTec.loading;

import net.wolfTec.system.StorageBean;

public interface LoaderStep {
	public void grabAssetsFromRemove (StorageBean storage);
	public void loadAssets (StorageBean storage);
}
