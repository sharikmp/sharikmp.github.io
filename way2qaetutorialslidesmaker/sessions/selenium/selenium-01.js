var questions = [
    {
        "number": "Session - 1",
        "topic": "What is Selenium?",
        "explanation": {
            "heading": "Definition",
            "points": [
                "Selenium is an open-source automation tool primarily used for automating web applications for testing purposes. It interacts with the browser just like a real user—clicking, typing, scrolling, etc.",
                "It supports multiple browsers like Chrome, Firefox, Safari, and Edge.",
                "Selenium supports various programming languages like Java, Python, C#, Ruby, and JavaScript.",
                "It is widely used for functional and regression testing of web applications."
            ]
        },
        "usage": {
            "heading": "Key Features",
            "points": [
                "Open-source and free to use.",
                "Supports cross-browser testing.",
                "Allows test execution on different operating systems.",
                "Supports multiple programming languages for writing test scripts.",
                "Large community support and active development.",
                "Integrates well with frameworks like TestNG, JUnit, and tools like Maven, Jenkins."
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "Selenium Suite",
        "explanation": {
            "heading": "Overview",
            "points": [
                "Selenium is not a single tool—it’s a suite of tools that cater to different needs in web automation testing."
            ]
        },
        "usage": {
            "heading": "Components of Selenium Suite",
            "points": [
                "Selenium IDE: A record and playback tool, mostly for quick prototyping. Runs as a browser extension (Chrome/Firefox). Limited flexibility, not suitable for complex testing.",
                "Selenium RC (Remote Control): Deprecated tool that required a separate server. Slower and has been replaced by WebDriver.",
                "Selenium WebDriver: The most powerful and widely used component. It directly communicates with the browser using browser drivers. Supports multiple programming languages and enables dynamic interaction with web elements.",
                "Selenium Grid: Used for parallel execution of tests. Supports distributed testing across multiple machines and browsers. Useful for large-scale test automation in CI/CD pipelines."
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "Why Selenium with Java?",
        "explanation": {
            "heading": "Language Support in Selenium",
            "points": [
                "Selenium supports multiple programming languages including Java, Python, C#, Ruby, JavaScript, and Kotlin."
            ]
        },
        "usage": {
            "heading": "Why Java?",
            "points": [
                "Popularity: Java is one of the most widely used languages in automation and software testing.",
                "Strong Community Support: A vast number of tutorials, forums, and documentation are available for Java with Selenium.",
                "Integration Friendly: Java works smoothly with popular tools such as TestNG (test framework), Maven/Gradle (dependency management), and Jenkins (CI/CD).",
                "OOP-Based: Java's object-oriented nature makes it easy to implement design patterns like Page Object Model (POM).",
                "Stability & Performance: Offers faster execution compared to some interpreted languages, making it a reliable choice for large-scale automation.",
                "Industry Trends: Many automation roles specifically require Java-based Selenium skills, and large enterprise projects often adopt Java-based Selenium frameworks."
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "What is Maven?",
        "explanation": {
            "heading": "Definition",
            "points": [
                "Maven is a build automation and dependency management tool used primarily for Java projects.",
                "It uses a declarative approach through a configuration file called pom.xml to manage project build, reporting, and documentation."
            ]
        },
        "usage": {
            "heading": "Why use Maven?",
            "points": [
                "Manages all required JAR files automatically via pom.xml.",
                "Helps maintain a clean and standardized project structure.",
                "Easily integrates with tools like TestNG, JUnit, Jenkins, and various reporting libraries.",
                "Supports plugins and lifecycle phases for tasks like compiling, testing, and packaging.",
                "Uses the POM (Project Object Model) file — pom.xml — as the heart of the project for defining configuration and dependencies.",
                "Handles dependencies through repositories, either local (~/.m2) or remote (Maven Central), making library management efficient."
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "Maven Project in Eclipse",
        "explanation": {
            "heading": "Definition",
            "points": [
                "A Maven project in Eclipse IDE allows you to manage your Selenium test framework efficiently with a standardized structure and automatic dependency handling.",
                "Eclipse provides built-in support or can be extended with the Maven plugin (M2E) to create and manage Maven-based Java projects."
            ]
        },
        "usage": {
            "heading": "Steps to Create a Maven Project",
            "points": [
                "Open Eclipse IDE and go to File > New > Project.",
                "Select 'Maven Project' under the Maven folder and click Next.",
                "Choose Create a simple project > Click Next.",
                "Provide Group ID (e.g., com.selenium.project) and Artifact ID (e.g., SeleniumFramework).",
                "Click Finish to create the project with the standard Maven structure (src/main/java, src/test/java, pom.xml).",
                "Once created, open the pom.xml file to add Selenium and TestNG dependencies from Maven Central.",
                "Right-click the project and select Maven > Update Project to download the required dependencies.",
                "Cross check and Switch Project to Java 17 in Eclipse"
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "TestNG setup",
        "explanation": {
            "heading": "Add TestNG to pom.xml",
            "points": [
                "Open your pom.xml and add this inside the <dependencies> section",
            ]
        },
        "usage": {
            "heading": "Install TestNG Plugin in Eclipse (Optional but Useful)",
            "points": [
                "Go to Help > Eclipse Marketplace",
                "Search: TestNG",
                "Find TestNG for Eclipse and click Install",
                "Restart Eclipse after installation",
                "Create a Sample TestNG Class: as below",
                "> Right-click on src/test/java > New > Class",
                "> Name it 'GoogleTest'",
                "> Check the box for public static void main if you want, or leave it unchecked",
                "> Click Finish",
                "Add Sample code: Next slide",
                "Right-click the class → Run As → TestNG Test"
            ]
        }
    }, ,
    {
        "number": "Session - 1",
        "topic": "Sample code",
        "explanation": {
            "heading": "Add the following code",
            "points": [
                "xyz",
            ]
        },
        "usage": {
            "heading": "Add the following code",
            "points": [
                "xyz",
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "Important keywords in Maven",
        "explanation": {
            "heading": "Definition",
            "points": [
                "Maven uses a specific set of keywords and elements within the pom.xml file to define the configuration, structure, and behavior of a project.",
                "Understanding these keywords is essential for managing dependencies, build processes, and plugin executions in a Maven-based project."
            ]
        },
        "usage": {
            "heading": "Common Maven Keywords",
            "points": [
                "groupId: Defines the group or organization the project belongs to (e.g., com.selenium.framework).",
                "artifactId: The name of the project or module that is built (e.g., SeleniumFramework).",
                "version: Specifies the version of the project (e.g., 1.0.0).",
                "packaging: Defines how the project will be packaged (e.g., jar, war).",
                "dependencies: A section where all required external libraries (like Selenium or TestNG) are declared.",
                "dependency: A single library entry within the dependencies block that includes groupId, artifactId, and version.",
                "repositories: Used to specify remote repositories like Maven Central from which dependencies are downloaded.",
                "build: Section used to define build-specific configurations like plugins.",
                "plugins: Tools that add functionality during the build lifecycle (e.g., compiler plugin, surefire plugin)."
            ]
        },
    },
    {
        "number": "Session - 1",
        "topic": "TestNG tags",
        "explanation": {
            "heading": "Definition",
            "points": [
                "TestNG is a testing framework inspired by JUnit and NUnit, designed to simplify test execution in Java.",
                "It provides several annotations (tags) to define the sequence and structure of test execution.",
                "These annotations help manage setup, teardown, and grouping of test methods for better control and flexibility."
            ]
        },
        "usage": {
            "heading": "Common TestNG Annotations",
            "points": [
                "@BeforeSuite: Runs once before all tests in the suite. Used for global setup (e.g., launching browser).",
                "@AfterSuite: Runs once after all tests in the suite. Used for global teardown (e.g., closing browser).",
                "@BeforeTest: Executes before any test method in the <test> tag of testng.xml. Common for setting up test-level configuration.",
                "@AfterTest: Executes after all test methods in the <test> tag. Used for cleanup tasks at the test level.",
                "@BeforeClass: Runs before the first method in the current class. Good for setting up data or configuration shared across methods.",
                "@AfterClass: Runs after all methods in the current class. Used to release shared resources.",
                "@BeforeMethod: Runs before each test method. Commonly used to set preconditions.",
                "@AfterMethod: Runs after each test method. Typically used to reset conditions or clean up.",
                "@Test: Marks a method as a test case. You can set attributes like priority, groups, expectedExceptions, etc."
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "Mastering Locators",
        "explanation": {
            "heading": "Definition",
            "points": [
                "Locators are addressing mechanisms used by Selenium WebDriver to identify and interact with elements on a webpage.",
                "They form the foundation of web automation by helping Selenium locate UI components like buttons, text fields, links, etc."
            ]
        },
        "usage": {
            "heading": "Built-in Locator Types and Best Practices",
            "points": [
                "By.id(): Locates elements using the 'id' attribute. Fast and preferred when available.",
                "By.name(): Uses the 'name' attribute of an element.",
                "By.className(): Locates elements using the value of the 'class' attribute.",
                "By.tagName(): Selects elements by their HTML tag (e.g., input, div, a).",
                "By.linkText() / By.partialLinkText(): Used to locate hyperlinks using the visible text.",
                "By.cssSelector(): Powerful and flexible; uses CSS syntax to locate elements.",
                "By.xpath(): XML path syntax used to locate elements. Supports advanced queries and functions.",
                "Best Practices:",
                "- Prefer ID and Name locators as they are fast and reliable.",
                "- Use XPath or CSS selectors when dealing with dynamic content or when other attributes are unavailable.",
                "- Avoid fragile or overly complex locators that can easily break with UI changes.",
                "Comparison Table:"
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "Locators Examples",
        "explanation": {
            "heading": "Definition",
            "points": [
                "Examples of locators in Selenium WebDriver demonstrate how to practically identify and interact with web elements.",
                "Each locator strategy targets elements in different ways, depending on the HTML structure and available attributes."
            ]
        },
        "usage": {
            "heading": "Locator Examples in Selenium",
            "points": [
                "By.id(\"username\"): Locates an element with id='username'.",
                "By.name(\"password\"): Locates an element with name='password'.",
                "By.className(\"btn-primary\"): Locates an element with class='btn-primary'.",
                "By.tagName(\"input\"): Locates the first input element on the page.",
                "By.linkText(\"Click Here\"): Finds a link with exact visible text 'Click Here'.",
                "By.partialLinkText(\"Click\"): Finds a link that contains 'Click' in its visible text.",
                "By.cssSelector(\"input[type='email']\"): Locates an input element where type='email'.",
                "By.cssSelector(\"#loginButton\"): Locates element with id='loginButton'.",
                "By.xpath(\"//input[@id='username']\"): Locates input element with a specific id using XPath.",
                "By.xpath(\"//div[@class='container']//input[@type='submit']\"): Advanced XPath to find submit button inside a container."
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "XPath – Basics",
        "explanation": {
            "heading": "Definition",
            "points": [
                "XPath (XML Path Language) is a powerful syntax used for navigating through elements and attributes in an XML document. In Selenium, it's used to locate elements in an HTML DOM.",
                "It is especially useful when elements do not have unique identifiers like id or name."
            ]
        },
        "usage": {
            "heading": "Basic XPath Syntax and Examples",
            "points": [
                "Absolute XPath: Starts from the root node (html) and follows a direct path. Example: /html/body/div[1]/input",
                "Relative XPath: Starts from any matching node and is more flexible. Example: //input[@id='username']",
                "//tagname[@attribute='value']: Matches elements based on attribute value. Example: //button[@type='submit']",
                "text(): Used to match elements based on visible text. Example: //a[text()='Login']",
                "contains(): Used to match partial attribute values. Example: //input[contains(@name, 'user')]",
                "starts-with(): Matches elements whose attribute value starts with a specific string. Example: //input[starts-with(@id, 'user')]",
                "Wildcard (*): Matches any element node. Example: //*[@class='btn']",
                "Avoid using absolute XPath in real projects as it is fragile and breaks easily with UI changes."
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "XPath Functions",
        "explanation": {
            "heading": "Definition",
            "points": [
                "XPath functions allow dynamic and flexible element identification based on partial matches, string patterns, and content.",
                "They are extremely useful when working with dynamic elements, inconsistent attribute values, or complex DOM structures."
            ]
        },
        "usage": {
            "heading": "Common XPath Functions with Examples",
            "points": [
                "text(): Matches exact visible text. Example: //a[text()='Login']",
                "contains(): Matches partial attribute or text value. Example: //input[contains(@name, 'user')]",
                "starts-with(): Matches beginning of an attribute value. Example: //input[starts-with(@id, 'email')]",
                "normalize-space(): Removes leading and trailing spaces from text. Example: //button[normalize-space()='Submit']",
                "last(): Selects the last element in a node set. Example: (//div[@class='item'])[last()]",
                "position(): Selects element based on position index. Example: (//input[@type='text'])[2]",
                "not(): Selects elements that do not match a condition. Example: //input[not(@type='hidden')]",
                "Example with multiple functions: //div[contains(@class,'card') and starts-with(@id, 'prod')]"
            ]
        }
    },
    {
        "number": "Session - 1",
        "topic": "XPath Axes",
        "explanation": {
            "heading": "Definition",
            "points": [
                "XPath Axes are used to navigate through the DOM tree in relation to the current node.",
                "They allow locating elements based on their relationship to other elements, such as parent, child, sibling, or ancestor nodes.",
                "Axes are especially useful when elements don’t have unique attributes but can be located relative to nearby elements."
            ]
        },
        "usage": {
            "heading": "Common XPath Axes with Examples",
            "points": [
                "child: Selects all children of the current node. Example: //div[@id='container']/child::input",
                "parent: Selects the parent of the current node. Example: //label[@for='email']/parent::div",
                "ancestor: Selects all ancestors (parents, grandparents, etc.) of the current node. Example: //input[@id='email']/ancestor::form",
                "descendant: Selects all descendants (children, grandchildren, etc.) of the current node. Example: //form[@id='login']/descendant::input",
                "following: Selects all nodes that appear after the current node. Example: //h2[text()='Features']/following::ul",
                "following-sibling: Selects all siblings after the current node. Example: //label[@for='email']/following-sibling::input",
                "preceding: Selects all nodes that appear before the current node. Example: //button[@id='submit']/preceding::input",
                "preceding-sibling: Selects all siblings before the current node. Example: //h3/following-sibling::p",
                "Table:"
            ]
        }
    }
    
    
    
    
   
    
    
    
    
    




]