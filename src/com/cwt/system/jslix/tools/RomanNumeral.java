package com.cwt.system.jslix.tools;

/**
 * RomanNumeral.java
 * 
 * This class will handle all the interactions with Roman numerals, such as
 * converting them to integers and vice-versa.
 * 
 * @author <ul><li>Ramirez-Sanchez, Cesar (cramsan)</li>
 *          <li>Carr, Crecen</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 12.31.12
 */
public class RomanNumeral {
	
	/** Holds all the Roman numerals in one straight String */
	public static final String ROMAN = "IVXLCDM";
	
	/**
	 * This function takes normal numbers and converts them into Roman numerals.
	 * It's main purpose is to help keep the integrity of the XML data to stay
	 * well formed.
	 * 
	 * @param intData 
	 * 				Numerical data in String format
	 * @return The Roman numeral value of the data
	 */
	public static String convert(int numData) {
		//Added functionality for the number zero
		if(numData == 0)
			return "O";
		
		String intData = "";// Reused this as temporary.
		while(numData > 0){
			for(int i = 1000, j = 3; i > 0; i /= 10, j--){
				if(numData >= i - (i / 10)){
					if(numData < i){
						intData += ROMAN.charAt((j*2)-2);
						numData += i / 10;
					}
					intData += ROMAN.charAt(j*2);
					numData -= i;
					break;
				}else if(j > 0 && numData >= 4*(i / 10)){
					if(numData < 5*(i / 10)){
						intData += ROMAN.charAt((j*2)-2);
						numData += (i / 10);
					}
					intData += ROMAN.charAt(j*2-1);
					numData -= 5*(i/10);
					break;
				}
			}
		}
		return intData;
	}

	/**
	 * This function takes Roman numerals and reverts them into normal
	 * numerals.
	 * 
	 * @param data
	 *            Roman numeral in String format
	 * @return The integer value of the data
	 */
	public static int revert(String romanData) {
		//Added functionality for zero
		if(romanData.toUpperCase().matches("O"))
			return 0;
		
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
		return decimal;
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

	/**
	 * The testing file for Roman numerals
	 * @param args N/A
	 */
	public static void main(String[] args) {
		String input, output, roman;
		for (int i = 0; i < 10000; i++) {
			input = Integer.toString(i);
			roman = convert(Integer.valueOf(input));
			output = Integer.toString(revert(roman));
			System.out.println(input + " - " + roman + " - " + output);
			if (!input.equals(output)) {
				break;
			}
		}
	}
}
