package org.example.stepDefinitions;

import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.example.application.pages.CartPage;
import org.example.application.pages.CheckoutPage;
import org.example.utilities.ScenarioContext;
import org.junit.jupiter.api.Assertions;

public class CheckoutSteps {

    private CheckoutPage checkoutPage = new CheckoutPage();

    public CheckoutSteps() {
    }

    @When("the user enters checkout information")
    public void the_user_input_checkout_information() {
        checkoutPage.enterCheckoutInfo();
    }

    @Then("the user verifies the Item Total price to be {string}")
    public void the_user_verifies_the_item_total_price_to_be(String variableName) {
        String expectedPrice = ScenarioContext.getTestVariable(variableName);
        String actualPrice = checkoutPage.getItemTotalPrice();
        Assertions.assertEquals(expectedPrice, actualPrice);
    }

    @Then("the user verifies the Thank You message to be {string}")
    public void the_user_verifies_the_thank_you_message_to_be(String expectedMessage) {
        Assertions.assertEquals(expectedMessage, checkoutPage.getThankYouMessage(), "Verify Thank you message!");
    }
}