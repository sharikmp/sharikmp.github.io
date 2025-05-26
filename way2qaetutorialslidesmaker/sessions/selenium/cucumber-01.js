var questions = [
    {
        "number": "Session - 7",
        "topic": "Why Cucumber?",
        "explanation": {
          "heading": "Definition",
          "points": [
            "Cucumber is an open-source tool used for Behavior Driven Development (BDD), allowing expected software behavior to be specified in a logical language that customers can understand.",
            "It supports writing test cases in plain English using Gherkin syntax, which bridges the communication gap between technical teams and non-technical stakeholders.",
            "Cucumber integrates with Selenium and other tools to execute automated tests based on behavior specifications.",
            "It encourages collaboration between developers, testers, and business analysts by using a common language for requirements and test scripts."
          ]
        },
        "usage": {
          "heading": "Key Features",
          "points": [
            "Enables writing test scenarios in human-readable Gherkin language.",
            "Improves collaboration between cross-functional teams.",
            "Supports automation across multiple platforms and programming languages like Java, Ruby, and JavaScript.",
            "Integrates with Selenium, Appium, and other automation frameworks for UI and API testing.",
            "Provides detailed and easy-to-read test reports.",
            "Facilitates maintenance and reusability of test cases due to its structured format."
          ]
        }
      },   
      {
        "number": "Session - 7",
        "topic": "Cucumber components",
        "explanation": {
          "heading": "Definition",
          "points": [
            "Cucumber is a tool used for running automated tests written in plain language. It follows the Behavior Driven Development (BDD) approach.",
            "Cucumber components work together to define and execute test cases based on business-readable specifications.",
            "These components help structure the automation framework clearly and make it easier to maintain and expand over time."
          ]
        },
        "usage": {
          "heading": "Key Components",
          "points": [
            "Feature File: Contains test scenarios written in Gherkin language using keywords like Given, When, Then.",
            "Step Definitions: Java (or other language) methods that map to each step in the feature file and contain the automation code.",
            "Runner Class: Executes the feature files using JUnit or TestNG, and links them with step definitions.",
            "Gherkin: A domain-specific language for writing behavior descriptions in plain English.",
            "Hooks: Blocks of code (like @Before and @After) that run before or after each scenario for setup and teardown activities.",
            "Tags: Used to group scenarios and control which ones to run during test execution."
          ]
        }
      },
      {
        "number": "Session - 7",
        "topic": "Feature File",
        "explanation": {
          "heading": "Definition",
          "points": [
            "A Feature File in Cucumber is a file that contains one or more test scenarios written in Gherkin language.",
            "It serves as the main document that describes the application's behavior in plain, understandable language.",
            "Each Feature File typically focuses on a specific feature or functionality of the application under test.",
            "It helps bridge the communication gap between business stakeholders and the technical team by using a common language."
          ]
        },
        "usage": {
          "heading": "Key Elements",
          "points": [
            "Feature: Describes the high-level functionality or business requirement being tested.",
            "Scenario: Represents a specific test case or example of how the feature should behave.",
            "Given: Defines the initial context or preconditions for the scenario.",
            "When: Specifies the action or event performed by the user.",
            "Then: Describes the expected outcome or result of the action.",
            "And/But: Used to add additional steps to Given/When/Then for better readability.",
            "Tags: Used to group or filter scenarios for selective test execution."
          ]
        }
      },
      {
        "number": "Session - 7",
        "topic": "Step Definitions",
        "explanation": {
          "heading": "Definition",
          "points": [
            "Step Definitions are the methods in the code that execute the steps described in a Cucumber Feature File.",
            "They act as the bridge between the plain language of Gherkin and the actual code that performs the automation.",
            "Each step in the Feature File (Given, When, Then) has a corresponding Step Definition that maps to it using annotations.",
            "Step Definitions are typically written in Java (or other supported languages) and contain Selenium or other automation logic."
          ]
        },
        "usage": {
          "heading": "Key Characteristics",
          "points": [
            "Defined using annotations like @Given, @When, @Then in Java.",
            "Can include regular expressions or Cucumber expressions to match step text dynamically.",
            "Promotes code reusability by allowing the same Step Definition to be used in multiple scenarios.",
            "Helps separate test logic from test scenarios, improving code organization and readability.",
            "Stored in a specific package or directory structure in the project to maintain clarity.",
            "Can be linked with Hooks for setup and teardown actions if needed."
          ]
        }
      },
      {
        "number": "Session - 10",
        "topic": "Runner Class",
        "explanation": {
          "heading": "Definition",
          "points": [
            "The Runner Class in Cucumber is responsible for executing the Feature Files.",
            "It acts as an entry point for the Cucumber test execution process.",
            "This class is typically annotated with `@RunWith` and `@CucumberOptions` to configure test execution settings.",
            "It connects the Feature Files with the Step Definitions and controls which features, scenarios, or tags should be run."
          ]
        },
        "usage": {
          "heading": "Key Characteristics",
          "points": [
            "Uses `@RunWith(Cucumber.class)` to tell JUnit to run tests with Cucumber.",
            "The `@CucumberOptions` annotation allows configuration of paths to feature files and step definitions.",
            "Options can include tags to filter scenarios, plugins for reporting, and flags for dry runs.",
            "Can generate various reports like HTML, JSON, and JUnit for test results.",
            "Essential for integrating Cucumber tests with CI/CD pipelines and test management tools.",
            "Supports parallel test execution through advanced configurations or additional plugins."
          ]
        }
      },
      {
        "number": "Session - 7",
        "topic": "Gherkin",
        "explanation": {
          "heading": "Definition",
          "points": [
            "Gherkin is a domain-specific language used in Cucumber for writing test scenarios in plain English.",
            "It allows business analysts, developers, and testers to understand and collaborate on test cases without needing deep technical knowledge.",
            "Each scenario written in Gherkin follows a structured syntax using keywords like Feature, Scenario, Given, When, Then, And, But."
          ]
        },
        "usage": {
          "heading": "Key Characteristics",
          "points": [
            "Improves communication between stakeholders through readable and understandable language.",
            "Supports Behavior Driven Development (BDD) methodology.",
            "Scenarios describe application behavior through examples.",
            "Can be reused across multiple test cases to maintain consistency.",
            "Promotes living documentation as Gherkin files serve as up-to-date descriptions of system behavior."
          ]
        }
      },
      {
        "number": "Session - 7",
        "topic": "Hooks",
        "explanation": {
          "heading": "Definition",
          "points": [
            "Hooks in Cucumber are blocks of code that run before or after each scenario.",
            "They are used to perform setup and teardown operations like launching or closing the browser, initializing test data, etc.",
            "Hooks help maintain clean test code by separating reusable setup and cleanup logic from the test scenarios."
          ]
        },
        "usage": {
          "heading": "Key Characteristics",
          "points": [
            "Defined using annotations like @Before and @After in the step definition class.",
            "Multiple hooks can be declared and prioritized using the order attribute.",
            "Helps ensure environment consistency before and after test execution.",
            "Supports tagging to apply hooks conditionally to specific scenarios.",
            "Useful for actions like logging, report setup, database connections, etc.",
            "Improves modularity and maintainability of test automation frameworks."
          ]
        }
      },
      {
        "number": "Session - 7",
        "topic": "Tags",
        "explanation": {
          "heading": "Definition",
          "points": [
            "Tags in Cucumber are used to categorize and filter test scenarios for selective execution.",
            "They are added at the beginning of a scenario or feature using the '@' symbol.",
            "Tags help manage large test suites by grouping related scenarios or marking them for specific test runs like smoke, regression, etc."
          ]
        },
        "usage": {
          "heading": "Key Characteristics",
          "points": [
            "Allows running specific tests based on tags using command-line or runner class configuration.",
            "Supports logical operators like AND, OR, and NOT for complex filtering.",
            "Can be used to control execution of hooks and scenarios independently.",
            "Helps in organizing tests according to modules, priority, or functionality.",
            "Improves test efficiency by focusing on relevant parts during different stages of development.",
            "Enhances CI/CD integration by enabling dynamic test selection."
          ]
        }
      }
      
      
      
      
      
      
         
]