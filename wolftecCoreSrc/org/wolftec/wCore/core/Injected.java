package org.wolftec.wCore.core;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This annotation marks a property as reference to a component. It will be
 * automatically inserted by the {@link ComponentManager} on startup.
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Injected {
  
  @Deprecated
  String value() default "";

  @Deprecated
  boolean isClassAnnotation() default false;
}
