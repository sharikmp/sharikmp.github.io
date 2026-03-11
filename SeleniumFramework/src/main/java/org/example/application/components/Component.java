package org.example.application.components;

import org.example.utilities.Element;
import org.example.utilities.ScenarioContext;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public abstract class Component {

    public final String cssSelector;
    public By byCssSelector;

    public Component(String cssSelector) {
        this.cssSelector = cssSelector;
        this.byCssSelector = By.cssSelector(cssSelector);
    }

    // Method to wait for the element to be visible
    public void waitForLoad() {
        Element.waitForVisibility(byCssSelector);
    }

    // Method to find the element
    public WebElement get() {
        waitForLoad();
        return Element.get(byCssSelector);
    }

    public void click() {
        Element.click(byCssSelector);
    }
}
