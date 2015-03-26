package org.wolftec.wCore.gherkin;

import org.stjs.javascript.Array;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.VfsEntity;
import org.wolftec.wCore.persistence.VirtualFilesystemManager;

/**
 * Simple test runner to run all gherkin tests from the
 * <code>/test/features</code> folder
 */
public class GherkinTestManager {

  public static final String VALUE_PASSED = "PASSED";
  public static final String VALUE_FAILED = "FAILED";

  @ManagedConstruction
  private Logger log;

  @Injected
  private VirtualFilesystemManager vfs;

  @Injected
  private GherkinFileConverter converter;

  private FactsBase facts;

  private Array<Feature> features;

  public void loadTests(ComponentManager manager) {
    log.info("Loading tests..");
    vfs.readKeys("/test/features/\\w*", converter, (err, featureEntities) -> {
      for (int i = 0; i < featureEntities.$length(); i++) {
        VfsEntity<Feature> feature = featureEntities.$get(i);
        features.push(feature.value);
      }
      log.info("..loaded");
    });
  }

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
