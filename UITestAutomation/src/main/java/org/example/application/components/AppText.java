package org.example.application.components;

import org.example.utilities.Element;

public class AppText extends Component{
    public AppText(String cssSelector) {
        super(cssSelector);
    }

    public String getText() {
        return Element.getText(byCssSelector);
    }
}
