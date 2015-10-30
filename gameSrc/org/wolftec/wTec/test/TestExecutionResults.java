package org.wolftec.wTec.test;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.SyntheticType;

@SyntheticType
public class TestExecutionResults {
  public Array<TestClassResult> tests;
  public int                    passed;
  public int                    failed;
  public int                    runs;
}