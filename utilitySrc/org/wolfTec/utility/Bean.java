package org.wolfTec.utility;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This annotation marks a class as bean and it will be instantiated by the
 * {@link BeanFactory} on startup.
 */
@Target(ElementType.TYPE) @Retention(RetentionPolicy.RUNTIME) public @interface Bean {

}
