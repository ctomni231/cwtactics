package net.wolfTec.dataTransfer;

import net.wolfTec.application.CustomWarsTactics;
import net.wolfTec.bridges.Base64Helper;
import net.wolfTec.bridges.Globals;
import net.wolfTec.bridges.webAudio.AudioBuffer;
import net.wolfTec.model.Modification;
import net.wolfTec.utility.Debug;
import net.wolfTec.utility.Storage;
import net.wolfTec.utility.Storage.StorageEntry;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSStringAdapter;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Callback3;

public class AudioTransfer {

	/**
	 * Storage parameter for sfx volume
	 */
	public static final String SFX_VOLUME_KEY = "cfg_sfx_volume";

	/**
	 * Storage parameter for music volume
	 */
	public static final String MUSIC_VOLUME_KEY = "cfg_music_volume";

	/**
	 *  
	 */
	public static final String SFX_KEY = "SFX_";

	/** 
	 *
	 */
	public static final String MUSIC_KEY = "MUSIC_";

	private boolean isAudioEnabled() {
		return CustomWarsTactics.features.audioMusic && CustomWarsTactics.features.audioSFX;
	}

	/**
	 *
	 * @param callback
	 */
	public void transferAudioFromStorage(Callback0 callback) {
		if (!isAudioEnabled()) {
			callback.$invoke();
			return;
		}

		final Callback2<String, Callback0> loadKey = new Callback2<String, Callback0>() {
			@Override public void $invoke(String key, Callback0 next) {
				Storage.get(key, new Callback1<StorageEntry>() {
					@Override public void $invoke(StorageEntry entry) {

						Debug.logInfo(DataTransferHandler.LOG_HEADER, "grab audio " + key + " from cache");
						String realKey = key.replace(SFX_KEY, "");

						CustomWarsTactics.audioHandler.decodeAudio(Globals.Base64Helper.decodeBuffer(entry.value),

						new Callback1<AudioBuffer>() {
							@Override public void $invoke(AudioBuffer buffer) {
								CustomWarsTactics.audioHandler.registerAudioBuffer(realKey, buffer);
								next.$invoke();
							}
						},

						new Callback1<Object>() {
							@Override public void $invoke(Object arg0) {
								Debug.logCritical(DataTransferHandler.LOG_HEADER, "Could not loadGameConfig audio from cache");
							}
						});
					};
				});
			}
		};

		final Callback2<Array<Callback1<Callback0>>, String> appendStep = new Callback2<Array<Callback1<Callback0>>, String>() {
			@Override public void $invoke(Array<Callback1<Callback0>> list, String key) {
				list.push(new Callback1<Callback0>() {
					@Override public void $invoke(Callback0 next) {
						loadKey.$invoke(key, next);
					}
				});
			}
		};

		// load all possible audio (except music) keys from the storage into the
		// RAM
		Storage.keys(new Callback1<Array<String>>() {
			@Override public void $invoke(Array<String> keys) {
				Array<Callback1<Callback0>> keysToLoad = JSCollections.$array();

				for (int i = 0, e = keys.$length(); i < e; i++) {
					String key = keys.$get(i);
					if (key.indexOf(SFX_KEY) == 0) {
						appendStep.$invoke(keysToLoad, key.replace(SFX_KEY, ""));
					}
				}

				// start loading sfx files
				Globals.R.parallel(keysToLoad, callback);
			}
		});
	}

	/**
	 *
	 * @param callback
	 */
	public void transferAudioFromRemote (Callback0 callback) {
        if (!isAudioEnabled()) {
            callback.$invoke();
            return;
        }

        Modification mod = CustomWarsTactics.dataTransfer.mod;
        
        Callback3<String, Object, Callback0> loadBuffer = new Callback3<String, Object, Callback0>() {
					@Override public void $invoke(String id, Object buffer, Callback0 callback) {
						CustomWarsTactics.audioHandler.decodeAudio(
								buffer, 
								
								new Callback1<AudioBuffer>() {
									@Override public void $invoke(AudioBuffer buffer) {
		                CustomWarsTactics.audioHandler.registerAudioBuffer(id, buffer);
		                if (callback != null) {
		                	callback.$invoke();
		                }
									};
								},
									
								new Callback1<Object>() {
									@Override public void $invoke(Object arg0) {
										Debug.logInfo(DataTransferHandler.LOG_HEADER, "Could not loadGameConfig audio from remote");
									}
								}
						);
					}
				};
				
				

        //
        //
        // @inner
        // @param key
        // @param path
        // @param saveKey
        // @param loadIt
        // @param callback
        //
        var loadFile = function (key, path, saveKey, loadIt, callback) {
            
        		if (constants.DEBUG) {
                console.log("going to loadGameConfig " + path + " for key " + key);
            }

            var request = new XMLHttpRequest();

            request.open("GET", constants.MOD_PATH + path, true);
            request.responseType = "arraybuffer";

            request.onload = function () {
                assert(this.status !== 404);

                if (constants.DEBUG) {
                    console.log("loadGameConfig " + path + " for key " + key + " successfully");
                }

                storage.set(saveKey,
                        Base64Helper.encodeBuffer(request.response),
                        function () {
                    if (loadIt) {
                        loadBuffer(key, request.response, callback);
                    } else {
                        callback();
                    }
                }
                );
            };

            request.send();
        };

        // only loadGameConfig music when supported
        if (CustomWarsTactics.features.audioMusic) {
        	
            Object.keys(mod.musics).forEach(function (key) {
                stuff.push(function (next) {
                    loadFile(key, mod.musics[key], MUSIC_KEY + key, false, next);
                });
            });
        }

        // only loadGameConfig sfx audio when supported
        if (CustomWarsTactics.features.audioSFX) {
            Object.keys(mod.sounds).forEach(function (key) {
                stuff.push(function (next) {
                    loadFile(key, mod.sounds[key], SFX_KEY + key, true, next);
                });
            });
        }

        
    }

	/**
	 * Saves the configurations for the audio volume in the user storage.
	 *
	 * @param callback
	 */
	public void saveVolumeConfigs(Callback0 callback) {
		Storage.set(SFX_VOLUME_KEY, CustomWarsTactics.audioHandler.getSfxVolume(), new Callback2<Object, Object>() {
			@Override public void $invoke(Object result, Object err) {

				Storage.set(MUSIC_VOLUME_KEY, CustomWarsTactics.audioHandler.getMusicVolume(), new Callback2<Object, Object>() {
					@Override public void $invoke(Object result, Object err) {
						if (callback != null) {
							callback.$invoke();
						}
					}
				});
			}
		});
	}

	/**
	 * Loads the volume configuration from the user storage.
	 *
	 * @param callback
	 */
	public void loadVolumeConfigs(Callback0 callback) {
		Storage.get(SFX_VOLUME_KEY, new Callback1<StorageEntry>() {
			@Override public void $invoke(StorageEntry entry) {

				if (entry.value != null) {
					CustomWarsTactics.audioHandler.setSfxVolume((int) entry.value);
				}

				Storage.get(SFX_VOLUME_KEY, new Callback1<StorageEntry>() {
					@Override public void $invoke(StorageEntry entry) {

						if (entry.value != null) {
							CustomWarsTactics.audioHandler.setMusicVolume((int) entry.value);
						}

						if (callback != null) {
							callback.$invoke();
						}
					}
				});
			}
		});
	}
}