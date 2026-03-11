package org.example.stepDefinitions;

import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import org.example.utilities.Element;

public class CommonSteps {


    public CommonSteps() {
    }

    @When("the user clicks on the {string} button")
    public void the_user_clicks_on_the_button(String buttonText) {
        Element.clickByText(buttonText);
    }

    @And("the user refreshes the browser")
    public void the_user_refreshes_the_browser() {
        Element.refreshBrowser();
    }

    @And("the user closes the tab with title {string}")
    public void the_user_closes_the_tab(String tabTitle) {
        Element.closeTabByTitle(tabTitle);
    }



}