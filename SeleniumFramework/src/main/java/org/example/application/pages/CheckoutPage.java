package org.example.application.pages;

import org.example.application.Selectors.CommonSelectors;
import org.example.application.components.AppButton;
import org.example.application.components.AppText;
import org.example.application.components.AppTextInput;
import org.example.utilities.Element;
import org.openqa.selenium.By;

public class CheckoutPage {
    // Constructor
    public CheckoutPage() {

    }

    public void clickButton(String buttonText) {
        Element.clickByText(buttonText);
    }

    public void enterCheckoutInfo() {
        new AppTextInput(CommonSelectors.checkoutPageFirstNameInput).enterValue("Test");
        new AppTextInput(CommonSelectors.checkoutPageLastNameInput).enterValue("Test");
        new AppTextInput(CommonSelectors.checkoutPagePostalCodeInput).enterValue("100001");
    }

    public String getItemTotalPrice() {
        return new AppText(CommonSelectors.checkoutPageSubTotal).getText().replace("Item total: ", "");
    }

    public String getThankYouMessage() {
        return new AppText(CommonSelectors.checkoutPageThankYouMessage).getText();
    }
}
