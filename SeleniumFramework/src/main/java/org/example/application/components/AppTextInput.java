package org.example.application.components;

import org.example.utilities.Element;

public class AppTextInput extends Component {

    public AppTextInput(String cssSelector) {
        super(cssSelector);
    }

    public void enterValue(String value) {
        click();
        Element.setText(byCssSelector, value);
    }

}
