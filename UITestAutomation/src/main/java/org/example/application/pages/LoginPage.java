package org.example.application.pages;

import org.example.application.Selectors.CommonSelectors;
import org.example.application.components.AppButton;
import org.example.application.components.AppText;
import org.example.application.components.AppTextInput;
import org.example.utilities.Element;
import org.example.utilities.ScenarioContext;

import java.io.IOException;

public class LoginPage {
    // Constructor
    public LoginPage() {

    }

    // Method to navigate to the Sauce Demo login page
    public void navigateToLoginPage() throws IOException {
        Element.navigateToUrl(ScenarioContext.getProperty("homepage"));
    }

    // Method to enter the username
    public void enterUsername(String username) throws IOException {
        new AppTextInput(CommonSelectors.loginFormUsernameInput).enterValue(username);
    }

    // Method to enter the password
    public void enterPassword() throws IOException {
        new AppTextInput(CommonSelectors.loginFormPasswordInput).enterValue(ScenarioContext.getProperty("standard_user_passweord"));
    }

    // Method to click the login button
    public void clickLoginButton() {
        new AppButton(CommonSelectors.loginFormLoginButton).click();

    }

    //Method to perform login
    public void login(String username) throws IOException {
        enterUsername(username);
        enterPassword();
        clickLoginButton();
    }

    public String getErrorMessage() {
        return new AppText(CommonSelectors.loginFormErrorMessage).getText();
    }
}
