package org.wolftec.wCore.validation.validators;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface IntValue {
  
  int max() default 0;

  int min() default 0;

  int not() default 0;

  int defaultValue() default 0;
}
