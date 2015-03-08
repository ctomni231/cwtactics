package org.wolfTec.wolfTecEngine.test.gherkin;

import org.stjs.javascript.Array;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.components.ManagedConstruction;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.test.TestManager;
import org.wolfTec.wolfTecEngine.vfs.Vfs;
import org.wolfTec.wolfTecEngine.vfs.VfsEntityDescriptor;

/**
 * Simple test runner to run all gherkin tests from the
 * <code>/test/features</code> folder
 */
@ManagedComponent
public class GherkinTestManager implements ManagedComponentInitialization, TestManager {

  public static final String VALUE_PASSED = "PASSED";
  public static final String VALUE_FAILED = "FAILED";

  @ManagedConstruction
  private Logger log;

  @Injected
  private Vfs vfs;

  private FactsBase facts;

  private Array<Feature> features;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    GherkinFileConverter converter = manager.getComponentByClass(GherkinFileConverter.class);
    
    // TODO some query feature 
    vfs.readConvertedFiles(converter, (Array<VfsEntityDescriptor<Feature>> files) -> {
      for (int i = 0; i < files.$length(); i++) {
        VfsEntityDescriptor<Feature> file = files.$get(i);
        if(file.key.startsWith("/test/features")) {
          features.push(file.value);
        }
      }

      log.info("Loading features to test (Completed)");
      // cb.$invoke();
      // TODO
      });
  }

  @Override
  public void runAll() {
    log.info("Testing game features");

    for (int i = 0; i < features.$length(); i++) {
      Feature feature = features.$get(i);

      log.info("  => Feature " + feature.name);
      log.info(feature.description);

      Array<Screnario> scenarios = feature.scenarios;
      for (int j = 0; j < scenarios.$length(); j++) {
        Screnario scenario = scenarios.$get(j);

        log.info("   => Scenario " + scenario.name);
        log.info(scenario.description);
      }
    }
  }
}
