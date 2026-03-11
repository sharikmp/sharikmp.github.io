package org.example.application.components;

import org.example.utilities.Element;

public class AppDropDown extends Component{
    public AppDropDown(String cssSelector) {
        super(cssSelector);
    }

    public void setOption(String option) {
        Element.selectDropdownByVisibleText(byCssSelector, option);
    }

    public String getSelectedOption() {
        return Element.getSelectedDropdownText(byCssSelector);
    }
}
