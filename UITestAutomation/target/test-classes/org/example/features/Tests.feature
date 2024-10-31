@UI
Feature: Verify Login functionality on Sauce Demo website

  Background:
    Given the user is on login page

  Scenario: Test case 1 - Verify Successful Login and Logout
    When the user enters the username "standard_user" and password
    And the user has clicks login button
    Then the user verifies the homepage logo is displayed
    When the user opens hamburger menu
    Then the user clicks "Logout" in the hamburger menu

  Scenario: Test case 2 - Verify Failed Login
    When the user enters the username "locked_out_user" and password
    And the user has clicks login button
    Then the user verified error message "Epic sadface: Sorry, this user has been locked out." in the login page

  Scenario: Test case 3 - Multiple scenarios Workflow
    When the user enters the username "standard_user" and password
    And the user has clicks login button
    Then the user verifies the homepage logo is displayed
    When the user changes the Product Sort to "Price (low to high)" on Products page
    Then the user verifies the displayed items on the Product Sort is "Price (low to high)"
    And the user verifies the product price is sorted ascending order
    When the user adds item "Sauce Labs Fleece Jacket" to cart
    And the user adds item "Sauce Labs Onesie" to cart
    Then the user verifies the add to cart button is visible for item "Sauce Labs Fleece Jacket":"false"
    Then the user verifies the add to cart button is visible for item "Sauce Labs Onesie":"false"
    And the user verifies the remove from cart button is enabled for item "Sauce Labs Fleece Jacket":"true"
    And the user verifies the remove from cart button is enabled for item "Sauce Labs Onesie":"true"
    And the user saves the price for item "Sauce Labs Fleece Jacket" as "itemPrice1" from product page
    And the user saves the price for item "Sauce Labs Onesie" as "itemPrice2" from product page
    And the user verifies the cart items to be "2"
    When the user click on shopping cart link
    Then the user verifies the price of item "Sauce Labs Fleece Jacket" to be "itemPrice1" in cart page
    And the user verifies the price of item "Sauce Labs Onesie" to be "itemPrice2" in cart page
    And the user removes the item "Sauce Labs Onesie" from cart
    And the user saves the quantity of item "Sauce Labs Fleece Jacket" as "itemQty1" on cart page
    And the user verifies the cart items to be "{itemQty1}"
    When the user clicks on the "Checkout" button
    And the user enters checkout information
    And the user clicks on the "Continue" button
    Then the user verifies the Item Total price to be "{itemPrice1}"
    And the user clicks on the "Finish" button
    And the user verifies the Thank You message to be "Thank you for your order!"


  Scenario: Test case 4 - Error User Workflow
    When the user enters the username "error_user" and password
    And the user has clicks login button
    Then the user verifies the homepage logo is displayed
    When the user adds item "Sauce Labs Bike Light" to cart
    And the user click on shopping cart link
    And the user clicks on the "Checkout" button
    And the user enters checkout information
    And the user clicks on the "Continue" button
    And the user clicks on the "Finish" button
    Then the user verifies the Thank You message to be "Thank you for your order!"


  Scenario: Test case 5 - Verify Browser Refresh
    When the user enters the username "standard_user" and password
    And the user has clicks login button
    Then the user verifies the homepage logo is displayed
    When the user adds item "Sauce Labs Bike Light" to cart
    And the user opens hamburger menu
    And the user clicks "Reset App State" in the hamburger menu
    And the user refreshes the browser
    Then the user verifies the add to cart button is visible for item "Sauce Labs Bike Light":"true"
    And the user verifies the remove from cart button is enabled for item "Sauce Labs Bike Light":"false"
    And the user verifies the cart items to be "0"


  Scenario: Test case 6 - Verify Performance user
    When the user enters the username "performance_glitch_user" and password
    And the user has clicks login button
    Then the user verifies the homepage logo is displayed
    When the user adds item "Sauce Labs Backpack" to cart
    And the user click on shopping cart link
    And the user opens hamburger menu
    And the user clicks "All Items" in the hamburger menu
    And the user removes the item "Sauce Labs Backpack" from cart in product page
    And the user opens hamburger menu
    Then the user clicks "Logout" in the hamburger menu

  Scenario: Bonus Test case 5
    When the user enters the username "standard_user" and password
    And the user has clicks login button
    Then the user verifies the homepage logo is displayed
    And the user clicks on the "Twitter" button
    And the user clicks on the "Facebook" button
    And the user clicks on the "LinkedIn" button
    And the user closes the tab with title "Sauce Labs | Facebook"
    And the user closes the tab with title "Sauce Labs (@saucelabs) / X"
    And the user opens hamburger menu
    Then the user clicks "Logout" in the hamburger menu
    And the user closes the tab with title "Sauce Labs | LinkedIn"
    