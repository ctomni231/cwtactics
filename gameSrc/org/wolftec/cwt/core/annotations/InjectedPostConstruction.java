package org.wolftec.cwt.core.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * The content of the value will be injected from the class which constructs the
 * class which holds property. This means the property is null during the
 * invocation of the constructor and must be set directly after the constructor
 * invocation completes.
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.CLASS)
@Documented
public @interface InjectedPostConstruction {

}
