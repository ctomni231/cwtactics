package net.temp.wolfTecEngine.renderer;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.wolftec.core.ComponentManager;

/**
 * This annotation marks a class as bean and it will be instantiated by the
 * {@link ComponentManager} on startup.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface LayerFrameTime {
  int value();
}
