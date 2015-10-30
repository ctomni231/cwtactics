package org.wolftec.cwt.wotec.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Method parameters annotated with this annotation may be null. So you can
 * safely call the annotated method with a null as method parameter without to
 * worry about a {@link NullPointerException}.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.CLASS)
@Documented
public @interface OptionalParameter {

}
