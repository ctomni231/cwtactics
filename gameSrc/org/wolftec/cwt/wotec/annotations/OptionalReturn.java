package org.wolftec.cwt.wotec.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.wolftec.cwt.util.NullUtil;

/**
 * Methods annotated with this annotation may return null in some cases. So a
 * null as return value is not a fault! A usage of this methods should be
 * checked with the {@link NullUtil} in the most situations to prevent a
 * {@link NullPointerException}.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.CLASS)
@Documented
public @interface OptionalReturn {

}
