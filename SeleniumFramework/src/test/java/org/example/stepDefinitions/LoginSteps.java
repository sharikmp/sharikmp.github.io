package org.example.stepDefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.example.application.Selectors.CommonSelectors;
import org.example.application.components.AppText;
import org.example.application.pages.LoginPage;
import org.junit.jupiter.api.Assertions;

import java.io.IOException;

public class LoginSteps {

    private LoginPage loginPage;

    public void LoginPageSteps() {
    }
    @Given("^the user is on login page$")
    public void the_user_is_on_login_page() throws IOException {
        this.loginPage = new LoginPage();
        this.loginPage.navigateToLoginPage();
    }
    @When("the user enters the username {string} and password")
    public void the_user_enters_the_username_and_password(String username) throws IOException {
        this.loginPage.enterUsername(username);
        this.loginPage.enterPassword();
    }
    @When("the user has clicks login button")
    public void the_user_clicks_login_button() {
        this.loginPage.clickLoginButton();
    }

    @Then("the user verified error message {string} in the login page")
    public void the_user_verified_error_message_in_the_login_page(String expectedErrorMessage) {
        Assertions.assertEquals(expectedErrorMessage, this.loginPage.getErrorMessage(), "Verify Login Error message");
    }
}