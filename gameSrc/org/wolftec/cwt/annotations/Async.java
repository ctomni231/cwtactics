package org.wolftec.cwt.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Methods annotated with this annotation doing some asynchronous stuff. This
 * means when the method call is done then the task of the method may not
 * completed. Most of the times there will be a {@link AsyncCallback} method
 * parameter to act when the async task of the method is completed.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.CLASS)
@Documented
public @interface Async
{

}
