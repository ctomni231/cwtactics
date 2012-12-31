package com.cwt.system.jslix.tools;

/**
 * RomanNumeral.java
 * 
 * This class will handle all the interactions with roman numerals, such as
 * converting them to integers and vice-versa.
 * 
 * @author cramsan
 * @license Look into "LICENSE" file for further information
 * @version 12.30.12
 */
public class RomanNumeral {
	/**
	 * This function takes normal numbers and converts them into Roman numerals.
	 * It's main purpose is to help keep the integrity of the XML data to stay
	 * well formed.
	 * 
	 * @param data
	 *            Numerical data in String format
	 * @return The Roman numeral value of the data
	 */
	public static String convertRomanNumeral(String intData) {
		int num = Integer.valueOf(intData);
		intData = "";// Reused this as temporary.
		while (num > 0) {
			if (num >= 1000 - 100) {
				if (num < 1000) {
					intData = intData + "C";
					num += 100;
				}
				intData = intData + "M";
				num -= 1000;
			} else if (num >= 500 - 100) {
				if (num < 500) {
					intData = intData + "C";
					num += 100;
				}
				intData = intData + "D";
				num -= 500;
			} else if (num >= 100 - 10) {
				if (num < 100) {
					intData = intData + "X";
					num += 10;
				}
				intData = intData + "C";
				num -= 100;
			} else if (num >= 50 - 10) {
				if (num < 50) {
					intData = intData + "X";
					num += 10;
				}
				intData = intData + "L";
				num -= 50;
			} else if (num >= 10 - 1) {
				if (num < 10) {
					intData = intData + "I";
					num += 1;
				}
				intData = intData + "X";
				num -= 10;
			} else if (num >= 5 - 1) {
				if (num < 5) {
					intData = intData + "I";
					num += 1;
				}
				intData = intData + "V";
				num -= 5;
			} else {
				intData = intData + "I";
				num -= 1;
			}
		}
		return intData;
	}

}
