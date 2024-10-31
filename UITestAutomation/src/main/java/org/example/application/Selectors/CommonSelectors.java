package org.example.application.Selectors;

public class CommonSelectors {
    // Login Page CSS Selector/Locators
    public static final String loginFormUsernameInput = "[id='user-name']";
    public static final String loginFormPasswordInput = "[id='password']";
    public static final String loginFormLoginButton = "[id='login-button']";
    public static final String loginFormErrorMessage = "[data-test='error']";


    // Home Page CSS Selector/Locators
    public static final String inventoryPageLogo = "[class='app_logo']";

    // Hamburger Menu Options
    public static final String inventoryPageHamburgerMenu = "[class='bm-menu']";
    public static final String inventoryPageHamburgerMenuOpen = "[id='react-burger-menu-btn']";
    public static final String inventoryPageHamburgerMenuClose = "[id='react-burger-cross-btn']";
    public static final String inventoryPageHamburgerMenuItems = "[class~='menu-item']";

    //Product Sort
    public static final String inventoryPageSortByDropdown = "[data-test='product-sort-container']";
    public static final String inventoryPageAllItemsPrice = "[class='inventory_item_price']";
    public static final String inventoryPageItemPrice = "//*[contains(text(), '%s')]/ancestor::div[@class='inventory_item']//*[@class='inventory_item_price']";
    public static final String inventoryPageAddToCart = "//*[contains(text(), '%s')]/ancestor::div[@class='inventory_item']//button[contains(text(), 'Add to cart')]";
    public static final String inventoryPageRemoveFromCart = "//*[contains(text(), '%s')]/ancestor::div[@class='inventory_item']//button[contains(text(), 'Remove')]";
    public static final String inventoryPageCartBadgeCount = "[data-test='shopping-cart-badge']";
    public static final String inventoryPageCartlink = "[data-test='shopping-cart-link']";
    public static final String cartPageItemPrice = "//*[contains(text(), '%s')]/ancestor::div[@class='cart_item']//*[@class='inventory_item_price']";
    public static final String cartPageItemRemoveButton = "//*[contains(text(), '%s')]/ancestor::div[@class='cart_item']//button[contains(text(), 'Remove')]";
    public static final String cartPageItemQuantity = "//*[contains(text(), '%s')]/ancestor::div[@class='cart_item']//*[@class='cart_quantity']";
    public static final String cartPageCheckoutButton = "[id='checkout']";

    //Checkout Page
    public static final String checkoutPageFirstNameInput = "[id='first-name']";
    public static final String checkoutPageLastNameInput = "[id='last-name']";
    public static final String checkoutPagePostalCodeInput = "[id='postal-code']";
    public static final String checkoutPageContinueButton = "[id='continue']";
    public static final String checkoutPageSubTotal = "[data-test='subtotal-label']";
    public static final String checkoutPageFinishButton = "[id='finish']";
    public static final String checkoutPageThankYouMessage = "[data-test='complete-header']";





}
