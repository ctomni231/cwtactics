package org.wolfTec.cwt.utility.beans;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * This annotation marks a method as bean initialization listener. It will be
 * called by the {@link BeanFactory} after the bean has initialized and it's
 * references been injected.
 */
@Target(ElementType.METHOD) @Retention(RetentionPolicy.RUNTIME) public @interface PostInitialization {

}
