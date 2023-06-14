window.onload = function () {
    setDemoData();
}

function setDemoData() {
    var json = {
        "name": "John Smith",
        "age": 32,
        "address": {
            "street": "123 Main St",
            "city": "Anytown",
            "state": "CA",
            "zip": "12345"
        },
        "phoneNumbers": [
            "555-1234",
            "555-5678"
        ],
        "workHistory": [
            {
                "employer": "Acme Corporation",
                "position": "Software Engineer",
                "startYear": 2010,
                "endYear": 2015,
                "projects": [
                    {
                        "name": "Project A",
                        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    },
                    {
                        "name": "Project B",
                        "description": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    }
                ]
            },
            {
                "employer": "Widget Inc",
                "position": "Senior Developer",
                "startYear": null,
                "endYear": 2020,
                "projects": [
                    {
                        "name": "Project C",
                        "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    },
                    {
                        "name": "Project D",
                        "description": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                    }
                ]
            }
        ]
    };

    $('#textarea').val(JSON.stringify(json));
}

function beautify() {
    $('#textarea-div').removeClass('hide');
    $('#json-viewer-div').addClass('hide');
    $('#main-div').removeClass('border');

    const formattedJson = validateAndFormatJSON($('#textarea').val());
    $('#textarea').val(formattedJson);
}

function scrollToCompressedView() {
    $('#textarea-div').addClass('hide');
    $('#json-viewer-div').removeClass('hide');
    $('#main-div').addClass('border');

    createJsonViewer($("#json-viewer"), JSON.parse($('#textarea').val()));

    // document.querySelector('#json-viewer').scrollIntoView({ behavior: 'smooth' });
}

function createJsonViewer($container, json) {

    $container.empty();

    var $ul = $("<ul>").appendTo($container);

    function createListItem(key, value) {
        var $li = $("<li>").appendTo($ul);

        if (value !== null && typeof value === "object") {
            // Value is an object or array
            var $collapser = $("<span>")
                .addClass("json-collapser collapsed")
                .appendTo($li)
                .click(function () {
                    $(this).toggleClass("collapsed");
                    $(this).siblings("ul").toggle();
                });
            $li.append($("<span>").addClass("json-key").text(key));
            if (Array.isArray(value)) {
                $collapser.text("[]");
            } else {
                $collapser.text("{}");
            }
            var $subUl = $("<ul>").appendTo($li).hide();
            for (var subKey in value) {
                createListItem(subKey, value[subKey]).appendTo($subUl);
            }
        } else {
            // Value is a primitive type
            var $keySpan = $("<span>").addClass("json-key").text(key + ": ");
            var $valueSpan;
            switch (typeof value) {
                case "string":
                    $valueSpan = $("<span>").addClass("json-value-string").text("\"" + value + "\"");
                    break;
                case "number":
                    $valueSpan = $("<span>").addClass("json-value-number").text(value);
                    break;
                case "boolean":
                    $valueSpan = $("<span>").addClass("json-value-boolean").text(value);
                    break;
                case "object":
                    $valueSpan = $("<span>").addClass("json-value-null").text("null");
                    break;
                default:
                    throw "Unknown value type: " + typeof value;
            }
            $li.append($keySpan).append($valueSpan);
        }

        return $li;
    }

    for (var key in json) {
        createListItem(key, json[key]);
    }
}