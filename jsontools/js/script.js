
function validateAndFormatJSON(jsonStr) {
    try {
        const obj = JSON.parse(jsonStr);
        return JSON.stringify(obj, null, 4); 
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getDataType(value) {
    if (value === null) {
        return "null";
    } else if (value instanceof Object) {
        return "object";
    } else if (value instanceof Array) {
        return "array";
    } else {
        return typeof value;
    }
}

function printDiv(selector) {
    var printContents = document.querySelector(selector).innerHTML;
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
}
