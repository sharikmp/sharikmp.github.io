var questions = [
    {
        "number": "Session - 3",
        "topic": "String Handling Overview",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: String handling in Java involves working with text data using built-in methods and classes.",
                "Immutability: Strings in Java are immutable, meaning their value cannot be changed after creation.",
                "Methods: Common methods include length(), concat(), replace(), split(), toUpperCase(), and toLowerCase().",
                "StringBuffer and StringBuilder: These classes are used for creating mutable string objects, allowing modifications."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Test Data Management: Strings are used to handle dynamic test data and input values.",
                "Validation: String comparison is used to validate actual vs expected test results.",
                "URL and Path Handling: Strings are used to construct and manipulate URLs and file paths.",
                "Log Analysis: String splitting and parsing help in analyzing automation logs for errors and patterns."
            ]
        },
        "example": {
            "heading": "Example Relevant to Automation Testing",
            "points": [
                "Handling Test Data: Test cases often require generating and validating string inputs.",
                "Comparing Test Results: String comparison is used to verify if actual results match expected outcomes.",
                "Handling Dynamic URLs: Constructing and modifying URLs during test execution using string operations.",
                "Extracting Log Data: Parsing and splitting strings to extract meaningful data from test logs."
            ]
        }
    },
    {
        "number": "Session - 3",
        "topic": "String Pool",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: The String Pool is a special memory area in the Java Heap where String literals are stored.",
                "String Interning: When a String literal is created, Java first checks the String Pool; if it exists, the reference is reused.",
                "Heap vs Pool: Strings created using the `new` keyword are stored in the heap, while literals are stored in the String Pool.",
                "Memory Optimization: String Pool reduces memory consumption by avoiding duplication of identical strings."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Test Data Reusability: Strings in String Pool help in reusing common test data values across test cases.",
                "Performance Improvement: Automation frameworks handling large text data benefit from String Pool for faster processing."
            ]
        }
    },
    {
        "number": "Session - 3",
        "topic": "String functions",
        "usage": {
            "heading": "Important String functions",
            "points": [
                "Length Calculation - length() gives the total characters in the string.",
                "Character Access - charAt() retrieves characters at specific positions.",
                "Concatenation - concat() combines two strings.",
                "Substring - substring(start, end) extracts a part of the string.",
                "Case Conversion - toUpperCase() and toLowerCase() modify case.",
                "Equality Check - equals() checks exact match; equalsIgnoreCase() ignores case.",
                "Replacement - replace() changes characters in the string.",
                "Splitting - split() creates an array of substrings.",
                "Trimming - trim() removes leading and trailing spaces.",
                "Index Search - indexOf() finds the first occurrence of a character.",
                "Last Index Search - lastIndexOf() finds the last occurrence of a character.",
                "Starts With - startsWith() checks the string's beginning.",
                "Ends With - endsWith() checks the string's ending."
            ]
        }
    },
    {
        "number": "Session - 3",
        "topic": "String Questions",
        "usage": {
            "heading": "Write a Java program to:",
            "points": [
                "Accept a string input from the user.",
                "Print the length of the string using the length() method",
                "Print the first and last characters using the charAt() method",
                "Concatenate strings the concat() method.",
                "Extract and print a substring starting from the 3rd character to the 7th character using the substring() method.",
                "Convert and print the string to uppercase using toUpperCase() and lowercase using toLowerCase() methods.",
                "Check if the two strings are equal using equals() and equalsIgnoreCase() methods.",
                "Replace all occurrences of the letter 'a' with 'o' using the replace() method.",
                "Split the string into an array using the split() method.",
                "Remove the extra spaces using the trim() method.",
                "Find the position (index) of the first occurrence of the letter 'e' using the indexOf() method.",
                "Find the position of the last occurrence of the letter 'e' using the lastIndexOf() method.",
                "Check if the string starts with \"Hello\" using startsWith() method.",
                "Check if the string ends with \"World\" using endsWith() method."
            ]
        }
    },
    {
        "number": "Session - 3",
        "topic": "String Buffer",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: StringBuffer is a mutable class in Java used to create and manipulate strings.",
                "Mutability: Unlike String, StringBuffer allows modification without creating a new object.",
                "Thread Safety: StringBuffer is synchronized, making it thread-safe for multi-threaded operations.",
                "Methods: Common methods include append(), insert(), replace(), delete(), and reverse()."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Dynamic Test Data: StringBuffer allows modification of test data during runtime.",
                "Log Generation: StringBuffer is used to create dynamic logs for test execution reports.",
                "URL and Path Construction: It helps in constructing dynamic URLs and file paths efficiently.",
                "Test Result Formatting: StringBuffer allows efficient formatting of large test result strings."
            ]
        }
    },
    {
        "number": "Session - 3",
        "topic": "String Builder",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: StringBuilder is a mutable class in Java used for modifying strings.",
                "Mutability: Unlike String, StringBuilder allows modification of strings without creating a new object.",
                "Non-Synchronized: StringBuilder is not thread-safe, making it faster than StringBuffer.",
                "Methods: Common methods include append(), insert(), replace(), delete(), and reverse()."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Generating Test Data: StringBuilder is used to dynamically create test data during runtime.",
                "Log Creation: Test logs can be dynamically formatted using StringBuilder for better readability.",
                "Building Dynamic URLs: StringBuilder helps in creating dynamic URLs and request payloads.",
                "Result Processing: StringBuilder allows efficient handling and formatting of test results."
            ]
        }
    },
    {
        "number": "Session - 3",
        "topic": "String Buffer vs String Builder",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: Both StringBuffer and StringBuilder are mutable classes used for string manipulation in Java.",
                "Thread Safety: StringBuffer is thread-safe (synchronized), while StringBuilder is not.",
                "Performance: StringBuilder is faster than StringBuffer due to the absence of synchronization.",
                "Use Cases: StringBuffer is suitable for multi-threaded environments; StringBuilder is ideal for single-threaded operations."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Handling Dynamic Data: Both StringBuffer and StringBuilder are used to handle dynamic test data efficiently.",
                "Log Generation: StringBuffer is used for generating synchronized logs in multi-threaded tests.",
                "URL and Path Handling: StringBuilder is faster for constructing URLs and file paths in single-threaded tests.",
                "Performance Tuning: Switching from StringBuffer to StringBuilder improves test execution speed."
            ]
        }
    }




]