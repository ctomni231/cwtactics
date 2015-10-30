package org.wolftec.wTec.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.wolftec.cwt.util.NullUtil;

/**
 * Class fields annotated with this annotation may be null in some cases. A
 * usage of this fields should be checked with the {@link NullUtil} in the most
 * situations to prevent a {@link NullPointerException}.
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.CLASS)
@Documented
public @interface OptionalField {

}
