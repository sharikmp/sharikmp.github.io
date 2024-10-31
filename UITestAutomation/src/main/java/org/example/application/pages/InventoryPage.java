package org.example.application.pages;

import org.example.application.Selectors.CommonSelectors;
import org.example.application.components.AppDropDown;
import org.example.application.components.AppHamburgerMenu;
import org.example.application.components.AppLink;
import org.example.utilities.Element;
import org.openqa.selenium.By;

import java.util.List;
import java.util.stream.Collectors;

public class InventoryPage {
    public final AppHamburgerMenu hamburgerMenu;
    public final AppDropDown sortByDropDown;
    public InventoryPage() {
        this.hamburgerMenu = new AppHamburgerMenu(
                CommonSelectors.inventoryPageHamburgerMenu,
                CommonSelectors.inventoryPageHamburgerMenuOpen,
                CommonSelectors.inventoryPageHamburgerMenuClose,
                CommonSelectors.inventoryPageHamburgerMenuItems
        );
        this.sortByDropDown = new AppDropDown(CommonSelectors.inventoryPageSortByDropdown);
    }

    public String getLogoText() {
        return Element.get(By.cssSelector(CommonSelectors.inventoryPageLogo)).getText();
    }

    public void logout() {
        hamburgerMenu.open();
        hamburgerMenu.clickItem("Logout");
    }

    public void sortBy(String sortByOption) {
        sortByDropDown.setOption(sortByOption);
    }

    public String getSortedBy() {
        return sortByDropDown.getSelectedOption();
    }

    public List<Double> getAllProductPrices() {
        return Element.getTexts(By.cssSelector(CommonSelectors.inventoryPageAllItemsPrice))
                .stream()
                .map(priceText -> priceText.replace("$", "").trim()) // Remove '$' and trim whitespace
                .map(Double::parseDouble)
                .collect(Collectors.toList());
    }

    public boolean isSortedByPriceLowToHigh() {
        List<Double> productPrices = getAllProductPrices();
        List<Double> sortedPrices = productPrices.stream().sorted().toList();
        return productPrices.equals(sortedPrices);
    }

    public void addToCart(String itemName) {
        Element.click(By.xpath(String.format(CommonSelectors.inventoryPageAddToCart, itemName)));
    }

    public boolean isAddToCartVisible(String itemName) {
        return Element.isVisible(By.xpath(String.format(CommonSelectors.inventoryPageAddToCart, itemName)));
    }

    public boolean isRemoveFromCartEnabled(String itemName) {
        return Element.isEnabled(By.xpath(String.format(CommonSelectors.inventoryPageRemoveFromCart, itemName)));
    }

    public String getItemPrice(String itemName) {
        return Element.getText(By.xpath(String.format(CommonSelectors.inventoryPageItemPrice, itemName)));
    }

    public String getCartItemCount() {
        if(!Element.isVisible(By.cssSelector(CommonSelectors.inventoryPageCartBadgeCount))) return "0";
        return Element.getText(By.cssSelector(CommonSelectors.inventoryPageCartBadgeCount));
    }

    public void clickOnCartIcon() {
        new AppLink(CommonSelectors.inventoryPageCartlink).click();
    }

    public void removeFromCart(String itemName) {
        Element.click(By.xpath(String.format(CommonSelectors.inventoryPageRemoveFromCart, itemName)));
    }
}