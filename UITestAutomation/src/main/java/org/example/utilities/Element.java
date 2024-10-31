package org.example.utilities;

import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class Element {

    private static WebDriver driver;
    private static WebDriverWait wait;
    private static Actions actions;

    // Set up WebDriver and utilities
    public static void setDriver(WebDriver driverInstance) {
        driver = driverInstance;
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        actions = new Actions(driver);
    }

    public static void navigateToUrl(String url) {
        System.out.println("Navigating to url: " + url);
        driver.navigate().to(url);
    }

    public static WebElement get(By locator) {
        return driver.findElement(locator);
    }

    public static List<WebElement> getMultiple(By locator) {
        return driver.findElements(locator);
    }

    /**
     * Waits for an element to be visible by locator.
     *
     * @param locator The By locator of the element to wait for
     */
    public static void waitForVisibility(By locator) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    /**
     * Waits for an element to be clickable by locator.
     *
     * @param locator The By locator of the element to wait for
     */
    public static void waitForClickability(By locator) {
        wait.until(ExpectedConditions.elementToBeClickable(locator));
    }

    /**
     * Checks if the element located by the given locator is visible.
     *
     * @param locator The By locator of the element to check
     * @return true if the element is visible, false otherwise
     */
    public static boolean isVisible(By locator) {
        try {
            return get(locator).isDisplayed();
        } catch (WebDriverException e) {
            return false;
        }
    }

    public static boolean isEnabled(By locator) {
        try {
            return get(locator).isEnabled();
        } catch (WebDriverException e) {
            return false;
        }
    }

    /**
     * Clicks on an element after waiting for it to be clickable by locator.
     * If the standard click fails, it attempts to click using JavaScript.
     *
     * @param locator The By locator of the element to click
     */
    public static void click(By locator) {
        waitForVisibility(locator);
        waitForClickability(locator);
        try {
            driver.findElement(locator).click(); // Attempt regular click
        } catch (Exception e) {
            System.out.println("Standard click failed, attempting JavaScript click. Exception: " + e.getMessage());
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript("arguments[0].click();", driver.findElement(locator));
        }
    }



    public static void clickByText(String buttonText) {
        By buttonLocator = By.xpath("//*[text()='" + buttonText + "' or @value='" + buttonText + "' ]");
        waitForVisibility(buttonLocator);
        waitForClickability(buttonLocator);
        click(buttonLocator);
    }

    // Method to refresh the browser and wait for the page to reload completely
    public static void refreshBrowser() {
        driver.navigate().refresh();
        waitForPageToLoad();
    }

    /**
     * Waits until the page has completely loaded.
     */
    private static void waitForPageToLoad() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        wait.until((ExpectedCondition<Boolean>) wd ->
        {
            assert wd != null;
            return ((JavascriptExecutor) wd).executeScript("return document.readyState").equals("complete");
        });
    }


    /**
     * Waits for an element to be visible by locator, then sets the specified text.
     *
     * @param locator The By locator of the element
     * @param text    The text to be entered into the element
     */
    public static void setText(By locator, String text) {
        waitForVisibility(locator);
        driver.findElement(locator).clear();
        driver.findElement(locator).sendKeys(text);
    }

    public static String getText(By locator) {
        waitForVisibility(locator);
        return get(locator).getText();
    }

    /**
     * Gets the text of all elements located by the given locator.
     *
     * @param locator The By locator of the elements
     * @return A list of strings containing the text of each element
     */
    public static List<String> getTexts(By locator) {
        waitForVisibility(locator); // Wait for at least one element to be visible
        return getMultiple(locator).stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
    }

    /**
     * Selects an option in a dropdown by visible text after waiting for it to be visible and clickable.
     *
     * @param locator     The By locator of the dropdown element
     * @param visibleText The visible text of the option to select
     */
    public static void selectDropdownByVisibleText(By locator, String visibleText) {
        waitForVisibility(locator);
        waitForClickability(locator);

        Select dropdown = new Select(get(locator));
        dropdown.selectByVisibleText(visibleText);
    }

    /**
     * Gets the visible text of the currently selected option in a dropdown.
     *
     * @param locator The By locator of the dropdown element
     * @return The visible text of the selected option
     */
    public static String getSelectedDropdownText(By locator) {
        waitForVisibility(locator);
        waitForClickability(locator);

        Select dropdown = new Select(get(locator));
        WebElement selectedOption = dropdown.getFirstSelectedOption();
        return selectedOption.getText();
    }


    /**
     * Switches to a new window by its title.
     *
     * @param title The title of the window to switch to
     */
    public static void switchToWindowWithTitle(String title) {
        String originalWindow = driver.getWindowHandle();
        Set<String> allWindows = driver.getWindowHandles();

        for (String window : allWindows) {
            driver.switchTo().window(window);
            if (driver.getTitle().equals(title)) {
                return;
            }
        }
        driver.switchTo().window(originalWindow);
    }

    public static void closeTabByTitle(String tabTitle) {
        // Store the current window handle
        String currentWindow = driver.getWindowHandle();

        // Loop through all open windows
        for (String windowHandle : driver.getWindowHandles()) {
            driver.switchTo().window(windowHandle);

            // If the title matches, close the tab
            if (driver.getTitle().equals(tabTitle)) {
                driver.close();
                break;
            }
        }

        // Switch back to the original window
        driver.switchTo().window(currentWindow);
    }

    /**
     * Scrolls the page to bring the specified element into view by locator.
     *
     * @param locator The By locator of the element to scroll to
     */
    public static void scrollToElement(By locator) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        WebElement element = driver.findElement(locator);
        js.executeScript("arguments[0].scrollIntoView(true);", element);
    }

    /**
     * Moves the mouse over an element by locator.
     *
     * @param locator The By locator of the element to hover over
     */
    public static void hoverOverElement(By locator) {
        WebElement element = driver.findElement(locator);
        actions.moveToElement(element).perform();
    }

    /**
     * Captures a screenshot and saves it to a specified path.
     *
     * @param filePath The path where the screenshot will be saved
     */
    public static void captureScreenshot(String filePath) {
        File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        try {
            FileUtils.copyFile(screenshot, new File(filePath));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Maximizes the browser window.
     */
    public static void maximizeWindow() {
        driver.manage().window().maximize();
    }

    /**
     * Closes all tabs except the main window.
     */
    public static void closeAllTabsExceptMain() {
        String mainWindow = driver.getWindowHandle();
        Set<String> allWindows = driver.getWindowHandles();

        for (String window : allWindows) {
            if (!window.equals(mainWindow)) {
                driver.switchTo().window(window).close();
            }
        }
        driver.switchTo().window(mainWindow);
    }

    /**
     * Retrieves the current URL.
     *
     * @return The current URL as a string
     */
    public static String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

}
