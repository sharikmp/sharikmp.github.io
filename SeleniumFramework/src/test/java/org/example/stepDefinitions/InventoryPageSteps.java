package org.example.stepDefinitions;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.example.application.pages.InventoryPage;
import org.example.utilities.ScenarioContext;
import org.junit.jupiter.api.Assertions;

public class InventoryPageSteps {

    private InventoryPage inventoryPage;

    public InventoryPageSteps() {
    }
    @Then("the user verifies the homepage logo is displayed")
    public void the_user_verifies_the_homepage_logo_is_displayed() {
        this.inventoryPage = new InventoryPage();
        Assertions.assertEquals("Swag Labs", this.inventoryPage.getLogoText(), "Logo is displayed!!!");
    }
    @When("the user opens hamburger menu")
    public void the_user_opens_hamburger_menu() {
        inventoryPage.hamburgerMenu.open();
    }
    @When("the user clicks {string} in the hamburger menu")
    public void the_user_clicks_logout_in_the_hamburger_menu(String actionItem) {
        inventoryPage.hamburgerMenu.clickItem(actionItem);
    }

    @When("the user changes the Product Sort to {string} on Products page")
    public void the_user_changes_the_product_sort_to_on_products_page(String sortType) {
        inventoryPage.sortBy(sortType);
    }
    @Then("the user verifies the displayed items on the Product Sort is {string}")
    public void the_user_verifies_the_displayed_items_on_the_product_sort_is(String sortType) {
        Assertions.assertEquals(sortType, inventoryPage.getSortedBy());
    }
    @Then("the user verifies the product price is sorted ascending order")
    public void the_user_verifies_the_product_price_is_sorted_ascending_order() {
        Assertions.assertTrue(inventoryPage.isSortedByPriceLowToHigh());
    }

    @When("the user adds item {string} to cart")
    public void the_user_adds_item_to_cart(String itemName) {
        inventoryPage.addToCart(itemName);
    }

    @When("the user removes the item {string} from cart in product page")
    public void the_user_removes_item_from_cart(String itemName) {
        inventoryPage.removeFromCart(itemName);
    }

    @Then("the user verifies the add to cart button is visible for item {string}:{string}")
    public void the_user_verifies_the_add_to_cart_button_is_not_visible_for_item(String itemName, String expected) {
        Assertions.assertEquals(Boolean.parseBoolean(expected), inventoryPage.isAddToCartVisible(itemName));
    }

    @Then("the user verifies the remove from cart button is enabled for item {string}:{string}")
    public void the_user_verifies_the_remove_from_cart_button_is_enabled_for_item(String itemName, String expected) {
        Assertions.assertEquals(Boolean.parseBoolean(expected), inventoryPage.isRemoveFromCartEnabled(itemName));
    }

    @And("the user saves the price for item {string} as {string} from product page")
    public void the_user_saves_the_price_for_item(String itemName, String variableName) {
        System.out.println("Item: " + itemName + ", price: " + inventoryPage.getItemPrice(itemName));
        ScenarioContext.setTestVariable(variableName, inventoryPage.getItemPrice(itemName));
    }

    @And("the user verifies the cart items to be {string}")
    public void the_user_verifies_the_cart_items_to_be(String itemNum) {
        Assertions.assertEquals(ScenarioContext.getTestVariable(itemNum), inventoryPage.getCartItemCount());
    }

    @When("the user click on shopping cart link")
    public void the_user_click_on_shopping_cart_link() {
        inventoryPage.clickOnCartIcon();
    }
}