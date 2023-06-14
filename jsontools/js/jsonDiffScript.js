
window.onload = function () {
    addEventListeners();
    setDemoData();
}




function addEventListeners() {
    const toggleTextareaButton = document.querySelector('#toggle-textarea');
    const textarea1 = document.querySelector('#textarea1-col');
    const textarea2 = document.querySelector('#textarea2-col');

    if (toggleTextareaButton) {
        toggleTextareaButton.addEventListener('click', () => {
            textarea2.classList.toggle('hide');
            textarea1.classList.toggle('double-width');
        });
    }

    const compareButton = document.querySelector('#compare');
    compareButton.addEventListener('click', () => {
        const txtarea1 = document.querySelector('#textarea1');
        const txtarea2 = document.querySelector('#textarea2');

        const formattedJson1 = validateAndFormatJSON(txtarea1.value);
        const formattedJson2 = validateAndFormatJSON(txtarea2.value);

        if (!formattedJson1) { alert("JSON 1 is invalid"); return; }
        txtarea1.value = formattedJson1;

        if (!formattedJson2) { alert("JSON 2 is invalid"); return; }
        txtarea2.value = formattedJson2;

        const jsonObj1 = JSON.parse(formattedJson1);
        const jsonObj2 = JSON.parse(formattedJson2);

        const differences = compareJSONSchemas(jsonObj1, jsonObj2);
        console.log("Missing Keys:", differences.missingKeys);
        console.log("Data Type Differences:", differences.dataTypeDifferences);
        console.log("Data Differences:", differences.dataDifferences);

        const html = createHTMLPageForDifferences(differences);

        const comparisonTable = document.getElementById("comparisonTable");
        comparisonTable.innerHTML = html;
        document.getElementById("print-div-btn").style.display = 'block';
        comparisonTable.scrollIntoView({ block: 'end', behavior: 'smooth' });

        document.getElementById("textarea1-json").innerHTML = formattedJson1;
        document.getElementById("textarea2-json").innerHTML = formattedJson2;

        //Set height of divs
        const div1 = document.getElementById("textarea1-json-div");
        const div2 = document.getElementById("textarea2-json-div");
        const maxHeight = Math.max(div1.offsetHeight, div2.offsetHeight);
        div1.style.height = maxHeight + "px";
        div2.style.height = maxHeight + "px";


    });
}


function compareJSONSchemas(schema1, schema2, path = "$") {
    // Initialize arrays to store missing keys, data type differences, and data differences
    const missingKeys = [];
    const dataTypeDifferences = [];
    const dataDifferences = [];

    // Iterate over the keys in schema1
    for (let key in schema1) {
        // Check if the key exists in schema2
        if (!(key in schema2)) {
            let keyPath = `${path}${Array.isArray(schema1) ? `[${key}]` : `.${key}`}`;
            missingKeys.push({ differenceType: 'Missing Key', path: keyPath, schema1: keyPath, schema2: 'missing' });
            continue;
        }

        // Get the values and data types for the current key in schema1 and schema2
        const value1 = schema1[key];
        const value2 = schema2[key];
        const dataType1 = getDataType(value1);//value1 === null ? "null" : typeof value1;
        const dataType2 = getDataType(value2);//value2 === null ? "null" : typeof value2;

        // Compare the data types
        if (dataType1 !== dataType2) {
            let keyPath = `${path}${Array.isArray(schema1) ? `[${key}]` : `.${key}`}`;
            dataTypeDifferences.push({ differenceType: 'Data Type Difference', path: keyPath, schema1: dataType1, schema2: dataType2 });
            continue;
        }

        // Check if the values are objects
        if (dataType1 === "object" && dataType2 === "object") {
            // Recursively compare nested objects
            const nestedDifferences = compareJSONSchemas(value1, value2, `${path}${Array.isArray(schema1) ? `[${key}]` : `.${key}`}`);
            missingKeys.push(...nestedDifferences.missingKeys);
            dataTypeDifferences.push(...nestedDifferences.dataTypeDifferences);
            dataDifferences.push(...nestedDifferences.dataDifferences);
        } else {
            // Compare the values
            if (value1 !== value2) {
                let keyPath = `${path}${Array.isArray(schema1) ? `[${key}]` : `.${key}`}`;
                dataDifferences.push({ differenceType: 'Data Difference', path: keyPath, schema1: value1, schema2: value2 });
            }
        }
    }

    // Iterate over the keys in schema2
    for (let key in schema2) {
        // Check if the key exists in schema1
        if (!(key in schema1)) {
            let keyPath = `${path}${Array.isArray(schema1) ? `[${key}]` : `.${key}`}`;
            missingKeys.push({ differenceType: 'Missing Key', path: keyPath, schema1: 'missing', schema2: keyPath });
        }
    }

    // Return an object with missingKeys, dataTypeDifferences, and dataDifferences arrays
    return { missingKeys, dataTypeDifferences, dataDifferences };
}

function createHTMLPageForDifferences(differences) {
    // Create an HTML string to store the page content
    let html = `
<div>      
<table>
<tr>
  <th>Difference Type</th>
  <th>Path</th>
  <th>Schema 1</th>
  <th>Schema 2</th>
</tr>
`;

    // Add missing keys to the HTML table
    if (differences.missingKeys.length > 0) {
        for (let diff of differences.missingKeys) {
            html += `<tr class="missing-key">
<td>${diff.differenceType}</td>
<td>${diff.path}</td>
<td>${diff.schema1}</td>
<td>${diff.schema2}</td>
</tr>`;
        }
    }

    // Add data type differences to the HTML table
    if (differences.dataTypeDifferences.length > 0) {
        for (let diff of differences.dataTypeDifferences) {
            html += `<tr class="data-type-difference">
<td>${diff.differenceType}</td>
<td>${diff.path}</td>
<td>${diff.schema1}</td>
<td>${diff.schema2}</td>
</tr>`;
        }
    }

    // Add data differences to the HTML table 
    if (differences.dataDifferences.length > 0) {
        for (let diff of differences.dataDifferences) {
            html += `<tr class="data-difference">
<td>${diff.differenceType}</td>
<td>${diff.path}</td>
<td>${diff.schema1}</td>
<td>${diff.schema2}</td>
</tr>`;
        }
    }

    // Close the HTML table and page
    html += `</table></div>`;

    // Create a new window with the generated HTML content
    console.log(html);
    return html;
}


function setDemoData() {
    const jsonStr1 = `{
"person": {
"name": "John Doe",
"age": 28,
"address": {
"street": "123 Main St",
"city": "Anytown",
"state": "CA",
"zip": 12345
},
"phoneNumbers": [
{
"type": "home",
"number": "555-1234"
},
{
"type": "work",
"number": "555-5678"
}
],
"email": "john.doe@example.com"
}
}`;

    const jsonStr2 = `{
"person": {
"name": "Jane Smith",
"age": 35,
"address": {
"street": "456 Elm St",
"city": "Anytown",
"state": "NY"
},
"phoneNumbers": [
{
"type": "mobile",
"number": "555-7890"
}
]
}
}
`;

    document.querySelector('#textarea1').value = validateAndFormatJSON(jsonStr1);
    document.querySelector('#textarea2').value = validateAndFormatJSON(jsonStr2);


}



