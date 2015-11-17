package org.wolftec.cwt.core.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Method parameters annotated with this annotation will usually gets called
 * when the async task is done.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.CLASS)
@Documented
public @interface AsyncCallback {

}
