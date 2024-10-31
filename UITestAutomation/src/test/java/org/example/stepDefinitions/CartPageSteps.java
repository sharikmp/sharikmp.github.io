package org.example.stepDefinitions;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.example.application.pages.CartPage;
import org.example.application.pages.InventoryPage;
import org.example.utilities.ScenarioContext;
import org.junit.jupiter.api.Assertions;

public class CartPageSteps {

    private CartPage cartPage = new CartPage();

    public CartPageSteps() {
    }

    @Then("the user verifies the price of item {string} to be {string} in cart page")
    public void the_user_verifies_the_price_of_item_to_be(String itemName, String variableName) {
        String actualPrice = cartPage.getItemPrice(itemName);
        String expectedPrice = ScenarioContext.getTestVariable(variableName);
        Assertions.assertEquals(expectedPrice, actualPrice);
    }

    @Then("the user removes the item {string} from cart")
    public void the_user_removes_the_item_from_cart(String itemName) {
        cartPage.removeItemFromCart(itemName);
    }

    @Then("the user saves the quantity of item {string} as {string} on cart page")
    public void the_user_saves_the_quantity_of_item_as_on_cart_page(String itemName, String variableName) {
        ScenarioContext.setTestVariable(variableName, cartPage.getItemQuantity(itemName));
    }
}