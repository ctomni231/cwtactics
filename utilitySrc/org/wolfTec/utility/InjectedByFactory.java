package org.wolfTec.utility;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This annotation marks a property as reference to a bean. It will be
 * automatically inserted by the {@link BeanFactory} on startup.
 */
@Target(ElementType.FIELD) @Retention(RetentionPolicy.RUNTIME) public @interface InjectedByFactory {
}
