package org.wolftec.cwt.view;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.annotations.MayRaisesError;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.persistence.FolderStorage;
import org.wolftec.cwt.model.Model;
import org.wolftec.cwt.view.audio.Audio;
import org.wolftec.cwt.view.i18n.LanguageBundle;
import org.wolftec.cwt.view.i18n.LanguageFolderReader;
import org.wolftec.cwt.view.i18n.LanguageSetter;
import org.wolftec.cwt.view.input.InputService;
import org.wolftec.cwt.view.input.MappingLoader;

public class View {

  public final Model model;

  public final InputService input;
  public final Audio audio;
  public final GraphicManager gfx;
  public final LanguageBundle localization;

  private final MappingLoader mappingLoader;
  private final FolderStorage cfgFolder;

  public View(Model model) {
    this.model = model;

    input = new InputService();
    audio = new Audio();
    gfx = new GraphicManager();
    localization = new LanguageBundle();

    cfgFolder = new FolderStorage("cfg");
    mappingLoader = new MappingLoader();
  }

  @AsyncOperation
  public void autoselectLanguage(@AsyncCallback Callback0 onFinish) {
    (new LanguageSetter()).setLanguageForActiveEnvironment(localization, onFinish);
  }

  @AsyncOperation
  @MayRaisesError("if remote location is not available or the downloaded data is corrupted")
  public void loadViewResources(@AsyncCallback Callback1<String> onLoad, @AsyncCallback Callback1<String> onLoaded, @AsyncCallback Callback0 onFinish) {
    (new LanguageFolderReader()).downloadLanguageFiles(onFinish);
  }

  @AsyncOperation
  @MayRaisesError("on missing or corrupted save data")
  public void loadViewConfig(@AsyncCallback Callback0 onFinish) {
    cfgFolder.readFile("view-config", (Map<String, Map<String, String>> data) -> {
      mappingLoader.loadMapping(input, data.$get("input"));
      onFinish.$invoke();
    } , JsUtil.throwErrorCallback());
  }

  @AsyncOperation
  @MayRaisesError
  public void saveViewConfig(@AsyncCallback Callback0 onFinish) {
    Map<String, Map<String, String>> saveData = JSCollections.$map();

    Map<String, String> inputData = JSCollections.$map();
    mappingLoader.saveMapping(input, inputData);
    saveData.$put("input", inputData);

    cfgFolder.writeFile("view-config", saveData, onFinish, JsUtil.throwErrorCallback());
  }
}
