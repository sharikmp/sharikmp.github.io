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

window.onload = function () {
    $('#textarea').val(JSON.stringify(json));
}


function createPojo() {
    $('#textarea').val(validateAndFormatJSON($('#textarea').val()));
    const code = generatePOJOClasses(json);
    $('#textarea').val(code);
}

function validateAndFormatJSON(jsonStr) {
    try {
        const obj = JSON.parse(jsonStr);
        return JSON.stringify(obj, null, 4); // returns beautified JSON string with  space indentation
    } catch (error) {
        alert(error);
        console.error(error);
        return false;
    }
}

function generatePOJOClasses(jsonObj, addGetter = true, addSetter = true) {
    let pojoString = '';
    let importsSet = new Set();

    // Recursive function to generate POJO classes
    function generateClasses(obj, className, indentationLevel) {
        const indentation = '  '.repeat(indentationLevel);

        if (indentationLevel === 0) {
            pojoString += `public class ${className} {\n`;
        } else {
            pojoString += `${indentation}private class ${className} {\n`;
        }

        $.each(obj, function (key, value) {
            if (typeof value === 'object' && !Array.isArray(value)) {
                generateClasses(value, capitalizeFirstLetter(key), indentationLevel + 1);
                pojoString += `${indentation}  private ${capitalizeFirstLetter(key)} ${key};\n`;
                if (addGetter) {
                    pojoString += generateGetterMethod(indentation, capitalizeFirstLetter(key), key);
                }
                if (addSetter) {
                    pojoString += generateSetterMethod(indentation, capitalizeFirstLetter(key), key);
                }
            } else if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === 'object') {
                    generateClasses(value[0], capitalizeFirstLetter(key), indentationLevel + 1);
                    pojoString += `${indentation}  private List<${capitalizeFirstLetter(key)}> ${key};\n`;
                    importsSet.add('java.util.List');
                } else {
                    const javaDataType = getJavaDataType(value[0]);
                    pojoString += `${indentation}  private List<${javaDataType}> ${key};\n`;
                    importsSet.add('java.util.List');
                }
                if (addGetter) {
                    pojoString += generateGetterMethod(indentation, `List<${capitalizeFirstLetter(key)}>`, key);
                }
                if (addSetter) {
                    pojoString += generateSetterMethod(indentation, `List<${capitalizeFirstLetter(key)}>`, key);
                }
            } else {
                const javaDataType = getJavaDataType(value);
                pojoString += `${indentation}  private ${javaDataType} ${key};\n`;
                if (addGetter) {
                    pojoString += generateGetterMethod(indentation, javaDataType, key);
                }
                if (addSetter) {
                    pojoString += generateSetterMethod(indentation, javaDataType, key);
                }
            }
        });

        pojoString += `${indentation}}\n\n`;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function getJavaDataType(value) {
        if (typeof value === 'string') {
            return 'String';
        } else if (typeof value === 'number') {
            return Number.isInteger(value) ? 'int' : 'double';
        } else if (typeof value === 'boolean') {
            return 'boolean';
        } else {
            return 'Object';
        }
    }

    function generateGetterMethod(indentation, dataType, propertyName) {
        const capitalizedPropertyName = capitalizeFirstLetter(propertyName);
        const methodName = `get${capitalizedPropertyName}`;
        return `\n${indentation}  public ${dataType} ${methodName}() {\n${indentation}    return ${propertyName};\n${indentation}  }\n`;
    }

    function generateSetterMethod(indentation, dataType, propertyName) {
        const capitalizedPropertyName = capitalizeFirstLetter(propertyName);
        const methodName = `set${capitalizedPropertyName}`;
        return `\n${indentation}  public void ${methodName}(${dataType} ${propertyName}) {\n${indentation}    this.${propertyName} = ${propertyName};\n${indentation}  }\n\n`;
    }

    generateClasses(jsonObj, 'Root', 0);

    let imports = Array.from(importsSet).map(imp => `import ${imp};`).join('\n');
    pojoString = `${imports}\n\n${pojoString}`;

    return pojoString;
}