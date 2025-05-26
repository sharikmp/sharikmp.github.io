var questions = [
    {
        "number": "Session - 4",
        "topic": "Encapsulation in Java",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Encapsulation is the practice of hiding the internal details of a class and exposing only necessary functionalities.",
                "It is achieved using private access modifiers for variables and public getter and setter methods to access and modify data.",
                "This approach ensures data security and prevents direct modification of variables from outside the class.",
                "It promotes modularity and maintainability in software development"
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Encapsulating Web Elements: Page Object Model (POM) encapsulates web elements and their behaviors to improve maintainability.",
                "Data Protection: Test data variables are kept private within test classes, ensuring controlled access.",
                "Reusable Methods: Commonly used functionalities (e.g., login, form submission) are encapsulated in utility classes.",
                "Improved Code Maintainability: Changes in the UI require modifications only within the encapsulated class, not across multiple test cases."
            ]
        },
        "example": {
            "heading": "Explanation of Encapsulation",
            "points": [
                "Login Functionality: Instead of writing login code in multiple test cases, we encapsulate the login logic inside a LoginPage class.",
                "Web Elements Encapsulation: The username, password, and login button elements are kept private, ensuring they cannot be modified outside the class.",
                "Public Methods for Interaction: A public method like performLogin() interacts with these elements, maintaining controlled access.",
                "Benefit: If the login button’s locator changes, only the LoginPage class needs an update, not all test cases."
            ]
        },
    },
    {
        "number": "Session - 4",
        "topic": "Inheritance in Java",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: Inheritance allows one class (child) to acquire properties and behaviors from another class (parent).",
                "Code Reusability: Common functionalities can be defined in a parent class and reused in multiple child classes.",
                "Method Overriding: Child classes can override parent methods to provide specific implementations.",
                "Hierarchical Structure: Enables a structured and modular approach in application development."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Base Test Classes: Common setup and teardown methods are defined in a base class and inherited by all test cases.",
                "Page Object Model (POM): A base page class contains common web element actions, which are inherited by specific page classes.",
                "Reusable Test Components: Common functionalities like logging, reporting, and handling exceptions are inherited across test cases.",
                "Test Framework Design: Inheritance helps create a structured framework where test scripts inherit functionalities from parent classes."
            ]
        },
        "example": {
            "heading": "Example Relevant to Automation Testing",
            "points": [
                "Test Case Inheritance: A base test class contains setup and cleanup logic, inherited by multiple test cases.",
                "Page Actions Inheritance: A base page class defines common web actions, inherited by specific page classes like LoginPage and HomePage.",
                "Reusability: Instead of writing the same code multiple times, inherited methods streamline test execution.",
                "Framework Modularity: Changes in the base class automatically reflect in all child classes, improving maintainability."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Polymorphism",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Method Overloading: Allows multiple methods with the same name but different parameters within a class.",
                "Compile-time Polymorphism: Method overloading is resolved during compilation based on method signatures.",
                "Improves Readability: Overloading makes code more intuitive by allowing multiple ways to call a method.",
                "Encapsulation of Functionality: Methods with the same name but different inputs help achieve flexibility in handling various scenarios."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Multiple Test Scenarios: Overloading is used to write reusable methods for handling different test inputs.",
                "Flexible Test Execution: Allows the same method name to be used for logging in with different credentials (e.g., username/password vs. username/password/OTP).",
                "Data-Driven Testing: Overloaded methods help in executing tests with varying parameters dynamically.",
                "Code Maintainability: Reduces code duplication by defining a single method with multiple variations."
            ]
        },
        "example": {
            "heading": "Example Relevant to Automation Testing",
            "points": [
                "Login Functionality: A login method can be overloaded to support different authentication methods (e.g., password-only, password with OTP, or admin login).",
                "Parameterized Test Cases: Overloaded methods allow running tests with different sets of data without modifying the core test logic.",
                "Web Element Actions: Overloading can be used for interacting with web elements differently (e.g., clicking with default timeout vs. clicking with a custom timeout).",
                "Simplified Test Case Writing: Instead of writing separate functions, overloading enables using a common function name for multiple testing scenarios."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Polymorphism (Overriding)",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Method Overriding: Allows a subclass to provide a specific implementation of a method defined in the parent class.",
                "Runtime Polymorphism: Overridden methods are determined at runtime based on the object’s actual type.",
                "Ensures Consistency: Helps maintain a common interface while allowing specialized behavior in derived classes.",
                "Improves Code Reusability: Shared methods in parent classes can be customized by subclasses without modifying the base logic."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Customizing Browser Actions: Different browsers may need different initialization steps in test automation.",
                "Flexible Test Execution: Allows execution of test cases on various browsers without changing test scripts.",
                "Page Object Model (POM): Overriding methods in page classes help in maintaining consistency while allowing customization for different pages.",
                "Reusable Framework Design: Base classes define common methods, and child classes override them based on test requirements."
            ]
        },
        "example": {
            "heading": "Example Relevant to Automation Testing",
            "points": [
                "Cross-Browser Testing: Overriding allows different browsers to be initialized using the same method name but with unique implementations.",
                "Web Element Actions: Click methods can be overridden to add wait times before interacting with elements dynamically.",
                "Test Execution Control: Overridden methods can be used to define different ways of handling test failures (e.g., retry logic).",
                "Consistent API for Test Cases: Overriding ensures that test scripts remain the same while allowing different behaviors under the hood."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Abstraction in Java",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: Abstraction is the process of hiding implementation details and exposing only the essential functionalities.",
                "Achieved Using: Abstract classes and interfaces define methods without implementing them, enforcing structure in derived classes.",
                "Code Simplification: It reduces code complexity by providing a clear separation between high-level logic and implementation.",
                "Implementation Flexibility: Different classes can provide their own implementations for the abstract methods, making the system more adaptable."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Base Test Structure: Abstract classes define common test methods that must be implemented by test-specific classes.",
                "Web Actions Abstraction: Interfaces define common actions like 'click', 'enterText', and 'selectDropdown', ensuring consistency across test scripts.",
                "Framework Scalability: Abstract methods enforce standardization, making test automation frameworks easier to extend.",
                "Reusability: Abstracting test setup, execution, and teardown allows new test cases to reuse common logic while implementing specific test behaviors."
            ]
        },
        "example": {
            "heading": "Example Relevant to Automation Testing",
            "points": [
                "Abstract Base Test Case: A base class defines abstract methods like setUp() and executeTest(), forcing test cases to implement them.",
                "Page Object Abstraction: An interface 'Page' defines common actions like navigateTo(), implemented differently in LoginPage, HomePage, etc.",
                "Test Execution Consistency: All test cases follow a uniform structure, ensuring maintainability and clarity.",
                "Encapsulation of Test Logic: Abstract classes ensure that test cases only implement specific logic while inheriting common functionalities."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Interface in Java",
        "explanation": {
            "heading": "Explanation",
            "points": [
                "Definition: An interface in Java is a blueprint that defines a set of methods without implementing them.",
                "Multiple Inheritance Support: A class can implement multiple interfaces, overcoming the limitation of single inheritance in Java.",
                "Achieved Using: Interfaces contain abstract methods and constants, which must be implemented by the classes that use them.",
                "Code Standardization: It enforces a structure in different classes, ensuring consistent method implementation across the project."
            ]
        },
        "usage": {
            "heading": "Usage in Automation Testing",
            "points": [
                "Standardized Web Actions: Interfaces define methods like click(), enterText(), and selectDropdown() for uniform web element interactions.",
                "Multiple Browser Support: Different browser drivers (Chrome, Firefox, Edge) implement a common interface, ensuring cross-browser compatibility.",
                "Reusability: Common automation actions are defined in an interface and implemented in various test components.",
                "Flexible Framework Design: Using interfaces allows test scripts to switch implementations without changing the core automation framework."
            ]
        },
        "example": {
            "heading": "Example Relevant to Automation Testing",
            "points": [
                "WebActions Interface: Defines standard actions like click() and enterText() for UI elements like buttons and text fields.",
                "Button and TextField Implementations: Different UI elements implement these actions based on their specific behavior.",
                "Test Case Flexibility: The automation test interacts with UI elements using the common interface, making it adaptable.",
                "Code Maintainability: Any changes in the implementation only require modifications in the respective class, not in multiple test cases."
            ]
        }
    },
    {
        "number": "Session - 4",
        "topic": "Abstraction vs Interface",
        "usage": {
            "heading": "Differences - Abstraction vs Interface",
            "points": [
                "Definition: Abstraction allows hiding implementation details using abstract classes, while interfaces define a contract with method declarations.",
                "Implementation: Abstract classes can have both abstract and concrete methods, whereas interfaces contain only abstract methods (until Java 8, which introduced default methods).",
                "Multiple Inheritance: Java allows a class to implement multiple interfaces but can extend only one abstract class.",
                "Use Case: Abstract classes are used for closely related objects with shared functionality, while interfaces define behavior for unrelated objects."
            ]
        }
    }

]