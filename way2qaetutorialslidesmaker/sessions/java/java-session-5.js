var questions = [
    {
        "number": "Session - 5",
        "topic": "Why Java Collections",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Java Collections Framework is an essential part of automation testing, as it provides data structures and algorithms that help manage and manipulate test data efficiently. Understanding how to use collections like List, Set, Map etc. helps in handling dynamic test data, managing test results, and improving the scalability of automation frameworks."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Dynamic Data Handling: Collections can handle dynamic sets of data without needing a fixed size.",
                "Efficient Data Retrieval: Collections provide fast search, retrieval, and sorting mechanisms.",
                "Data Grouping: Collections allow grouping of related data, which is useful for storing test data sets.",
                "Key-Value Mapping: Use Map to store test data and expected results.",
                "Easy Maintenance: Collections simplify code by reducing boilerplate and enhancing reusability."
            ]
        }
    },
    {
        "number": "Session - 5",
        "topic": "Java Collections",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "List: Use when order matters and duplicates are allowed.",
                "Set: Use when uniqueness is required and order is not important.",
                "Map: Use when data needs to be stored as key-value pairs.",
                "Queue: Use when the order of processing elements matters (FIFO).",
                "Stack: Use when the order of processing elements matters (LIFO)."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Storing Test Cases: Use List to store test cases in execution order.",
                "Handling Unique Locators: Use Set to store unique locators for elements.",
                "Mapping Test Data: Use Map to store test data and expected results.",
                "Managing Test Execution: Use Queue to manage test execution in FIFO order.",
                "Cleanup Test Execution: Use Stack to manage clean up in LIFO order."
            ]
        }
    },
    {
        "number": "Session - 5",
        "topic": "Lists",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "ArrayList: Implements a dynamic array; allows fast access and search.",
                "LinkedList: Implements a doubly linked list; allows fast insertion and deletion.",
                "Vector: Similar to ArrayList but thread-safe; slower due to synchronization.",
                "Stack: Extends Vector; follows LIFO (Last In, First Out) order.",
                "List Interface: Allows ordered collection with duplicate elements."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "ArrayList: Use when you need fast access to test data or element locators.",
                "LinkedList: Use when insertion and deletion frequency is high.",
                "Vector: Use when you need thread-safe operations in parallel tests.",
                "Stack: Use when you need to track execution order or backtracking."
            ]
        }
    },
    {
        "number": "Session - 5",
        "topic": "Maps",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "HashMap: Stores key-value pairs, allows null keys and values, does not guarantee order.",
                "LinkedHashMap: Extends HashMap; maintains insertion order of elements.",
                "TreeMap: Implements SortedMap; maintains keys in ascending order.",
                "Hashtable: Synchronized and thread-safe; slower than HashMap.",
                "Map Interface: Does not allow duplicate keys but allows duplicate values."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "HashMap: Fast retrieval of test data or element locators.",
                "LinkedHashMap: Maintain insertion order for consistent test execution.",
                "TreeMap: Store test data in sorted order for structured processing.",
                "Hashtable: Use in multithreaded test scenarios requiring thread safety."
            ]
        }
    },
    {
        "number": "Session - 5",
        "topic": "Sets",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Set Interface: A collection that does not allow duplicate elements.",
                "HashSet: Unordered, does not maintain insertion order.",
                "LinkedHashSet: Maintains insertion order.",
                "TreeSet: Maintains elements in sorted order.",
                "Set Operations: Includes methods like add(), remove(), and contains()."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Unique Test Data: Use Set to store unique test data like user IDs or session tokens.",
                "Element Identification: Use Set to store unique element locators.",
                "Data Validation: Compare expected and actual results using a Set for unique values.",
                "Order Preservation: Use LinkedHashSet when insertion order matters."
            ]
        }
    },
                
    
    
    

]