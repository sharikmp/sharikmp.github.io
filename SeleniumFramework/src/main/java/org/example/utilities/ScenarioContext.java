package org.example.utilities;

import org.openqa.selenium.WebDriver;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ScenarioContext {
    private static final Map<String, String> testVariables = new HashMap<>();
    private static PropertyReader propertyReader;
    private static WebDriver driver;

    public static void setDriver(WebDriver driver) {
        ScenarioContext.driver = driver;
    }

    public static WebDriver getDriver() {
        if (driver == null) {
            throw new IllegalStateException("Driver is not initialized! Make sure to call setDriver() before getDriver().");
        }
        return driver;
    }

    public static String getProperty(String key) throws IOException {
        if(propertyReader == null)
            propertyReader = new PropertyReader("src/main/resources/config.properties");
        return propertyReader.getProperty(key);
    }

    public static void setTestVariable(String key, String value) {
        testVariables.put(key, value);
    }

    public static String getTestVariable(String key) {
        String parsedKey = key.replace("{", "").replace("}", "");
        if(testVariables.get(parsedKey) == null ) return key;
        return testVariables.get(parsedKey);
    }

    public static void clearTestVariables() {
        testVariables.clear();
    }
}
