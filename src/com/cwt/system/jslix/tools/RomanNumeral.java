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
	public static String convertToRomanNumeral(String intData) {
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

	/**
	 * This function takes roman numerals and converts them into normal
	 * numerals.
	 * 
	 * @param data
	 *            Roman numeral in String format
	 * @return The integer value of the data
	 */
	public static String convertFromRomanNumeral(String romanData) {
		int decimal = 0;
		int lastNumber = 0;
		String romanNumeral = romanData.toUpperCase();
		/*
		 * operation to be performed on upper cases even if user enters roman
		 * values in lower case chars
		 */
		for (int x = romanNumeral.length() - 1; x >= 0; x--) {
			char convertToDecimal = romanNumeral.charAt(x);

			switch (convertToDecimal) {
			case 'M':
				decimal = processDecimal(1000, lastNumber, decimal);
				lastNumber = 1000;
				break;

			case 'D':
				decimal = processDecimal(500, lastNumber, decimal);
				lastNumber = 500;
				break;

			case 'C':
				decimal = processDecimal(100, lastNumber, decimal);
				lastNumber = 100;
				break;

			case 'L':
				decimal = processDecimal(50, lastNumber, decimal);
				lastNumber = 50;
				break;

			case 'X':
				decimal = processDecimal(10, lastNumber, decimal);
				lastNumber = 10;
				break;

			case 'V':
				decimal = processDecimal(5, lastNumber, decimal);
				lastNumber = 5;
				break;

			case 'I':
				decimal = processDecimal(1, lastNumber, decimal);
				lastNumber = 1;
				break;
			}
		}
		return Integer.toString(decimal);
	}

	/**
	 * Helper method used by convertFromRoman to extract the next decimal value.
	 * 
	 * @see http
	 *      ://stackoverflow.com/questions/9073150/converting-roman-numerals-
	 *      to-decimal
	 * 
	 * @param decimal
	 *            Roman character in decimal form
	 * @param lastNumber
	 *            Last roman numeral that was processed by this method
	 * @param lastDecimal
	 *            Last integer output from this method
	 * @return Next integer based on the roman numeral and lastNumber and
	 *         lastDecimal.
	 */

	private static int processDecimal(int decimal, int lastNumber,
			int lastDecimal) {
		if (lastNumber > decimal) {
			return lastDecimal - decimal;
		} else {
			return lastDecimal + decimal;
		}
	}

	public static void main(String[] args) {
		String input, output, roman;
		for (int i = 0; i < 10000; i++) {
			input = Integer.toString(i);
			roman = convertToRomanNumeral(input);
			output = convertFromRomanNumeral(roman);
			System.out.println(input + " - " + roman + " - " + output);
			if (!input.equals(output)) {
				break;
			}
		}
	}
}
