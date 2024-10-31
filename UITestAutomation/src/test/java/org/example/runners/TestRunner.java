package org.example.runners;

import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(
        features = "src/test/java/org/example/features",
        glue = {"org.example.hooks", "org.example.stepDefinitions"},
        plugin = {
                "pretty",
                "html:target/cucumber-reports.html",
                "json:target/cucumber-reports.json"
        },
        tags = "@UI",
        monochrome = true
)
public class TestRunner {
    // This class will be empty; it is used only as an entry point for Cucumber to run the tests.
}
