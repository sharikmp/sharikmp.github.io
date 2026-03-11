package org.example.hooks;


import io.cucumber.java.*;
import org.example.drivers.WebDriverManager;
import org.example.utilities.Element;
import org.example.utilities.ScenarioContext;

public class Hooks {
    private WebDriverManager webDriverManager;

    @Before(value = "@UI")
    public void setup(Scenario scenario) {
        webDriverManager = new WebDriverManager();
        ScenarioContext.setDriver(webDriverManager.getDriver());
        Element.setDriver(webDriverManager.getDriver());         // Initialize Element with the driver
    }

    @After(value = "@UI")
    public void tearDown(Scenario scenario) {
        webDriverManager.quitDriver();
        ScenarioContext.setDriver(null);
        System.out.println("Browser closed for scenario: " + scenario.getName());
    }

    @BeforeAll
    public static void setup(){
        System.out.println("@BeforeAll");
    }


    @AfterAll
    public static void teardown() {
        System.out.println("@AfterAll");
    }

}
