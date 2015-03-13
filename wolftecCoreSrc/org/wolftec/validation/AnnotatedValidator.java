package org.wolftec.validation;

import java.lang.annotation.Annotation;

/**
 * 
 */
public interface AnnotatedValidator<T extends Annotation> {

  /**
   * 
   * @return
   */
  Class<T> getAnnoationClass();

  /**
   * 
   * @param value
   * @param name
   * @param metaData
   * @return
   */
  boolean validate(ValidationManager manager, Object value, String name, T metaData);
}
