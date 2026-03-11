package org.example.application.pages;

import org.example.application.Selectors.CommonSelectors;
import org.example.application.components.AppButton;
import org.example.application.components.AppText;
import org.example.application.components.AppTextInput;
import org.example.utilities.Element;
import org.example.utilities.ScenarioContext;
import org.openqa.selenium.By;

import java.io.IOException;

public class CartPage {
    // Constructor
    public CartPage() {

    }

    public String getItemPrice(String itemName) {
        return Element.get(By.xpath(String.format(CommonSelectors.cartPageItemPrice, itemName))).getText();
    }

    public void removeItemFromCart(String itemName) {
        Element.click(By.xpath(String.format(CommonSelectors.cartPageItemRemoveButton, itemName)));
    }

    public String getItemQuantity(String itemName) {
        return Element.get(By.xpath(String.format(CommonSelectors.cartPageItemQuantity, itemName))).getText();
    }
}
