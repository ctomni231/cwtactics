package org.wolfTec.wolfTecEngine.test.gherkin;

import org.stjs.javascript.Array;
import org.wolfTec.vfs.DecoratedVfs;
import org.wolfTec.vfs.Serializer;
import org.wolfTec.vfs.Vfs;
import org.wolfTec.vfs.VfsEntityDescriptor;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.logging.LogManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.test.TestManager;

/**
 * Simple test runner to run all gherkin tests from the
 * <code>/test/features</code> folder
 */
@ManagedComponent(whenQualifier="testrunner=WOLFTEC_GHERKIN")
public class GherkinTestManager implements ManagedComponentInitialization, TestManager {

  public static final String VALUE_PASSED = "PASSED";
  public static final String VALUE_FAILED = "FAILED";

  private Logger log;
  private FactsBase facts;
  private Array<Feature> features;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    Vfs vfs;
    
    log = manager.getComponentByClass(LogManager.class).createByClass(getClass());
    Serializer ser = new GherkinFileConverter(log);
    vfs = new DecoratedVfs(manager.getComponentByClass(Vfs.class), "/test/features", ser);
    
    vfs.readFiles((Array<VfsEntityDescriptor<Feature>> files) -> {
      for (int i = 0; i < files.$length(); i++) {
        VfsEntityDescriptor<Feature> file = files.$get(i);
        features.push(file.value);
      }

      log.info("Loading features to test (Completed)");
      // cb.$invoke();
      // TODO
    });
  }

  /* (non-Javadoc)
   * @see org.wolfTec.wolfTecEngine.test.TestManag#runAll()
   */
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
