package org.example.drivers;

import java.io.IOException;
import java.time.Duration;

import org.example.enums.DriverType;
import org.example.enums.EnvironmentType;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;


public class WebDriverManager {

    private WebDriver driver;
    private final DriverType driverType;
    private final EnvironmentType environmentType;
    private static final String CHROME_DRIVER_PROPERTY = "webdriver.chrome.driver";
    private static final String CHROME_DRIVER_PATH = "./src/main/resources/drivers/chromedriver.exe";

    public WebDriverManager() {
        driverType = DriverType.CHROME;
        environmentType = EnvironmentType.LOCAL;
        createDriver();
    }


    public WebDriver getDriver() {
        return driver;
    }



    private WebDriver createDriver() {
        switch (environmentType) {
            case LOCAL -> driver = createLocalDriver();
            case REMOTE -> driver = createRemoteDriver();
        }
        return driver;
    }



    private WebDriver createRemoteDriver() {
        throw new RuntimeException("RemoteWebDriver is not yet implemented");
    }



    private WebDriver createLocalDriver() {

        switch (driverType) {
            case FIREFOX -> driver = new FirefoxDriver();
            case INTERNETEXPLORER -> driver = new InternetExplorerDriver();
            case CHROME -> {
                System.setProperty(CHROME_DRIVER_PROPERTY, CHROME_DRIVER_PATH);
                driver = new ChromeDriver();
            }
        }
        driver.manage().window().maximize();
        return driver;
    }



    /**
     * driver.close() closes only the current window on which Selenium is running automated tests.
     * The WebDriver session, however, remains active.
     */
    public void closeDriver() {
        driver.close();
        driver = null;
    }

    /**
     * The driver.quit() method closes all browser windows and ends the WebDriver session.
     */
    public void quitDriver() {
        driver.quit();
        driver = null;
    }

}