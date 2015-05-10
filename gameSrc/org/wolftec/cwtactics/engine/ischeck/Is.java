package org.wolftec.cwtactics.engine.ischeck;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;

@GlobalScope
@STJSBridge
public class Is {

  public static Is is;

  public Is not;
  public Is all;
  public Is any;

  public native boolean arguments(Object... arguments);

  public native boolean array(Object... arguments);

  public native boolean bool(Object... arguments);

  public native boolean date(Object... arguments);

  public native boolean error(Object... arguments);

  public native boolean function(Object... arguments);

  public native boolean nan(Object... arguments);

  public native boolean nil(Object... arguments);

  public native boolean number(Object... arguments);

  public native boolean object(Object... arguments);

  public native boolean json(Object... arguments);

  public native boolean regexp(Object... arguments);

  public native boolean string(Object... arguments);

  public native boolean character(Object... arguments);

  public native boolean undef(Object... arguments);

  public native boolean sameType(Object valueA, Object valueB);

  public native boolean empty(Object... arguments);

  public native boolean existy(Object... arguments);

  public native boolean truthy(Object arguments);

  public native boolean falsy(Object... arguments);

  public native boolean space(String... arguments);

  public native boolean url(String... arguments);

  public native boolean email(String... arguments);

  public native boolean creditCard(String... arguments);

  public native boolean alphaNumeric(String... arguments);

  public native boolean timeString(String... arguments);

  public native boolean dateString(String... arguments);

  public native boolean usZipCode(String... arguments);

  public native boolean caPostalCode(String... arguments);

  public native boolean ukPostCode(String... arguments);

  public native boolean nanpPhone(String... arguments);

  public native boolean eppPhone(String... arguments);

  public native boolean socialSecurityNumber(String... arguments);

  public native boolean affirmative(String... arguments);

  public native boolean hexadecimal(String... arguments);

  public native boolean hexColor(String... arguments);

  public native boolean ip(String... arguments);

  public native boolean ipv4(String... arguments);

  public native boolean ipv6(String... arguments);

  public native boolean include(String string, String subString);

  public native boolean upperCase(String... arguments);

  public native boolean lowerCase(String... arguments);

  public native boolean startWith(String string, String subString);

  public native boolean endWith(String string, String subString);

  public native boolean capitalized(String... arguments);

  public native boolean palindrome(String... arguments);

  public native boolean equal(Number left, Number right);

  public native boolean even(Number... arguments);

  public native boolean odd(Number... arguments);

  public native boolean positive(Number... arguments);

  public native boolean negative(Number... arguments);

  public native boolean above(Number value, Number min);

  public native boolean under(Number value, Number min);

  public native boolean within(Number value, Number mine, Number max);

  public native boolean decimal(Number... arguments);

  public native boolean integer(Number... arguments);

  public native boolean finite(Number... arguments);

  public native boolean infinite(Number... arguments);

  public native boolean propertyCount(Object value, int count);

  public native boolean propertyDefined(Object value, String property);

  public native boolean windowObject(Object value);

  public native boolean domNode(Object... arguments);

  public native boolean inArray(Object value, Array<Object> array);

  public native boolean sorted(Array<Object>... array);

  public native boolean ie();

  public native boolean ie(int version);

  public native boolean chrome();

  public native boolean firefox();

  public native boolean opera();

  public native boolean safari();

  public native boolean ios();

  public native boolean iphone();

  public native boolean ipad();

  public native boolean ipod();

  public native boolean android();

  public native boolean androidPhone();

  public native boolean androidTablet();

  public native boolean blackberry();

  public native boolean windowsPhone();

  public native boolean windowsTablet();

  public native boolean windows();

  public native boolean mac();

  public native boolean linux();

  public native boolean desktop();

  public native boolean mobile();

  public native boolean tablet();

  public native boolean online();

  public native boolean offline();

  public native boolean touchDevice();

  public native boolean today(Object... arguments);

  public native boolean yesterday(Object... arguments);

  public native boolean tomorrow(Object... arguments);

  public native boolean past(Object... arguments);

  public native boolean future(Object... arguments);

  public native boolean day(Object value, String dayString);

  public native boolean month(Object value, String monthString);

  public native boolean year(Object value, int yearNumber);

  public native boolean leapYear(Number... arguments);

  public native boolean weekend(Object... arguments);

  public native boolean weekday(Object... arguments);

  public native boolean inDateRange(Object value, Object start, Object end);

  public native boolean inLastWeek(Object... arguments);

  public native boolean inLastMonth(Object... arguments);

  public native boolean inLastYear(Object... arguments);

  public native boolean inNextWeek(Object... arguments);

  public native boolean inNextMonth(Object... arguments);

  public native boolean inNextYear(Object... arguments);

  public native boolean quarterOfYear(Object value, int quarterNumber);

  public native boolean dayLightSavingTime(Object... arguments);

}
