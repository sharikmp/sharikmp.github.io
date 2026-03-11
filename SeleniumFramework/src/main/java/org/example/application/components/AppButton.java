package org.example.application.components;

import org.example.utilities.Element;
import org.openqa.selenium.By;

public class AppButton extends Component {

    public AppButton(String cssSelector) {
        super(cssSelector);
    }

    public AppButton() {
        super("");
    }
}
