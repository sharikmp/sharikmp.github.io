package org.example.application.components;

import org.example.utilities.Element;
import org.openqa.selenium.By;

public class AppHamburgerMenu extends Component {

    private final String cssSelectorOpen;
    private final String cssSelectorClose;
    private final String cssSelectorItems;

    public AppHamburgerMenu(String cssSelector, String cssSelectorOpen, String cssSelectorClose, String cssSelectorItems) {
        super(cssSelector);
        this.cssSelectorOpen = cssSelectorOpen;
        this.cssSelectorClose = cssSelectorClose;
        this.cssSelectorItems = cssSelectorItems;
    }

    public void open() {
        Element.click(By.cssSelector(cssSelectorOpen));
        Element.waitForVisibility(By.cssSelector(cssSelectorItems));
    }

    public void close() {
        Element.click(By.cssSelector(cssSelectorClose));
    }

    public void clickItem(String actionItem) {
        Element.getMultiple(By.cssSelector(cssSelectorItems))
                .stream()
                .filter(item -> item.getText().trim().equals(actionItem))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item with text '" + actionItem + "' not found"))
                .click();
    }

    public boolean isOpen() {
        return Element.get(byCssSelector).isDisplayed();
    }

}
