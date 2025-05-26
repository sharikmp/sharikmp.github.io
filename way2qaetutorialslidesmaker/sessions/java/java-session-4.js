var questions = [
    {
        "number": "Session - 4",
        "topic": "Type Casting",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: Type casting is the process of converting one data type into another in Java.",
                "Implicit Casting: Automatically done by the compiler when a smaller data type is converted into a larger data type.",
                "Explicit Casting: Requires manual conversion when a larger data type is converted into a smaller data type.",
                "Use Case: Type casting helps in converting objects or variables into compatible types."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "WebElement Casting: Converting generic WebElement into specific element types like Button or Link.",
                "Handling Test Data: Converting string-based test data into numeric or boolean types.",
                "Dynamic Element Identification: Type casting helps when identifying and interacting with dynamic elements.",
                "JSON Parsing: Type casting is used to convert API response data into appropriate Java objects."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Auto-boxing",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: Auto-boxing is the automatic conversion of primitive data types into their corresponding wrapper classes.",
                "Purpose: It allows treating primitive data types as objects when needed.",
                "Example: An int value can be directly assigned to an Integer object without explicit conversion.",
                "Unboxing: The reverse process, where an object of a wrapper class is converted back to its corresponding primitive type."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Handling Test Data: Test data stored in collections like List or Map require objects, not primitives.",
                "API Response Parsing: Auto-boxing helps in converting numeric values from JSON responses into wrapper objects.",
                "Element Indexing: When working with dynamic web elements, integer values are auto-boxed to Integer objects.",
                "Assertions: Comparing expected and actual values using wrapper classes relies on auto-boxing."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Wrapper Class",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: A wrapper class converts primitive data types into objects.",
                "Purpose: Wrapper classes are used to store primitive values in collections that require objects.",
                "Common Wrapper Classes: Examples include Integer, Double, Boolean, and Character.",
                "Boxing and Unboxing: Boxing converts primitive to object; unboxing converts object to primitive."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Storing Test Data: Wrapper classes allow storing numeric values in collections like List or Map.",
                "Parsing API Responses: Numeric values from API responses are often handled as wrapper objects.",
                "Handling Null Values: Wrapper classes can hold null values, unlike primitive types.",
                "Comparison and Assertions: Wrapper classes are useful for comparing test results."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Access Modifier in Java",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: Access modifiers define the visibility of classes, methods, and variables.",
                "Types: Java provides four types of access modifiers – public, protected, default, and private.",
                "Scope of Access: Public is accessible everywhere; private is restricted to the same class.",
                "Purpose: Access modifiers help in implementing encapsulation and controlling data access."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Encapsulation: Access modifiers help in controlling access to test data and utility methods.",
                "Page Object Model: Public methods allow interaction with web elements in test scripts.",
                "Reusable Components: Protected methods enable creating reusable test components across packages.",
                "Data Protection: Private variables help in protecting sensitive test data."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Exceptions in Java",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: Exceptions are events that disrupt the normal flow of execution.",
                "Types: Java has Checked Exceptions (compile-time) and Unchecked Exceptions (runtime).",
                "Handling: try-catch-finally blocks are used to handle exceptions and prevent crashes.",
                "Purpose: Proper exception handling ensures better error reporting and recovery."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Element Not Found: Handle NoSuchElementException when an element is not found.",
                "Timeout Handling: Catch TimeoutException when a page takes too long to load.",
                "Invalid Input: Handle NumberFormatException for incorrect input formats.",
                "Network Issues: Handle IOException for network-related failures during test execution."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Custom Exceptions",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: A custom exception is a user-defined exception created by extending the Exception class.",
                "Purpose: Custom exceptions allow creating meaningful error messages specific to the application.",
                "Implementation: Extend the Exception class and define a constructor to pass a message.",
                "Handling: Use try-catch blocks to catch and handle custom exceptions."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Test Data Validation: Create custom exceptions for invalid test data input.",
                "Element State Handling: Handle specific cases like element not clickable using custom exceptions.",
                "Business Rule Enforcement: Create custom exceptions for business logic failures.",
                "API Response Handling: Throw custom exceptions when unexpected API responses are received."
            ]
        }
    },        
    {
        "number": "Session - 4",
        "topic": "Reading Text File",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Purpose: Reading a text file allows accessing external data for processing.",
                "File Handling Classes: Java provides FileReader and BufferedReader to read files efficiently.",
                "Line-by-Line Reading: BufferedReader reads file data line-by-line, improving performance.",
                "Exception Handling: IOException should be handled to prevent runtime errors."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Test Data Storage: Test data can be stored in text files and read during test execution.",
                "Configuration Files: Test configuration details like URLs and credentials can be read from files.",
                "Log Analysis: Automation logs can be read and analyzed from text files.",
                "Report Generation: Test results can be written to files for further analysis."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Writing Text File",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Purpose: Writing to a text file allows saving data for future use.",
                "File Handling Classes: Java provides FileWriter and BufferedWriter to write to files efficiently.",
                "Appending Data: FileWriter allows writing new data to the file or appending to existing data.",
                "Exception Handling: IOException should be handled to prevent runtime errors."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Test Reports: Test results and logs can be written to files for review and analysis.",
                "Configuration Files: Test configuration details can be dynamically written to files.",
                "Test Data Output: Output data from automation runs can be stored for future validation.",
                "Performance Tracking: Write performance metrics to files for benchmarking.",
                "Note: Excel file handling to be covered in Automation (Selenium) sessions"
            ]
        }
    }  
    

]