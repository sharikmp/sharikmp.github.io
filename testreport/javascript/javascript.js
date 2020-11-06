var totalTCs_count = 0, passedTCs_count = 0, failedTCs_count = 0, noRunTCsCount = 0;


function refreshExecutionTable() {
  var jsonObj, i, j, x = "";

  var exeTable = document.getElementById("exeTable");

  //Remove if any row is present
  var rowCount = exeTable.rows.length;
  for (var r = 1; r < rowCount; r++) {
    exeTable.deleteRow(-1);
  }

  jsonObj = JSON.parse(data);

  for (i in jsonObj.testcases) {

    var row = exeTable.insertRow(-1); //Adding a new row

    // Insert new cells in the "new" row :
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);

    // Add some text to the new cells:
    cell1.innerHTML = jsonObj.testcases[i].id;
    cell2.innerHTML = jsonObj.testcases[i].desc;
    cell3.innerHTML = colorText(jsonObj.testcases[i].status);
    //cell4.innerHTML = jsonObj.testcases[i].steps;
	addHyperlinkForStepsModal(cell4, 'View Steps', '#myModal', i);
    //addHyperlink(cell5, 'Screenshot', jsonObj.testcases[i].logs);
	addHyperlinkForScreenshotModal(cell5, 'screenshot', '#myImageModal', jsonObj.testcases[i].desc, jsonObj.testcases[i].logs);
  } // end of for loop

  loadExecutionSummary();
  pieChart();
}


function loadExecutionSummary() {

  var jsonObj = JSON.parse(data);
  
  var table = document.getElementById("SummaryTable");

  //Remove if any row is present
  var rowCount = table.rows.length;
  for (var r = 1; r < rowCount; r++) {
    table.deleteRow(-1);
  }


    var row = table.insertRow(-1); //Adding a new row

    // Insert new cells in the "new" row :
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);

    // Add some text to the new cells:
    cell1.innerHTML = jsonObj.executiontool;
    cell2.innerHTML = new Date().toLocaleString();//jsonObj.timestamp
    cell3.innerHTML = jsonObj.environment
    cell4.innerHTML = jsonObj.testcases.length;
    cell5.innerHTML = passedTCs_count;
    cell6.innerHTML = failedTCs_count;
    cell7.innerHTML = noRunTCsCount;

	document.getElementById('reportName').innerHTML = 'Excecution Summary - ' + jsonObj.testingmodulename;
}


function searchInTable(tableId, inputBox) {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById(inputBox);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableId);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    for (var j = 0; j < td.length; j++) {
      if (td[j]) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break;
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}


function colorText(str) {
  var result;
  str = str.toUpperCase();
  if (str === "PASS") {
    result = str.fontcolor("green");
	passedTCs_count++;
  } else if (str === "NO RUN") {
    result = str.fontcolor("blue");
	noRunTCsCount++;
  } else {
    result = str.fontcolor("red");
	failedTCs_count++;
  }
  return result;
}




function sortTable(tableId, rowNum) {

  var table, rows, switching, i, x, y, shouldSwitch;

  table = document.getElementById(tableId);

  switching = true;

  while (switching) {

    switching = false;

    rows = table.rows;

    for (i = 1; i < (rows.length - 1); i++) {

      shouldSwitch = false;

      x = rows[i].getElementsByTagName("td")[rowNum];

      y = rows[i + 1].getElementsByTagName("td")[rowNum];

      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

        shouldSwitch = true;

        break;

      }

    }

    if (shouldSwitch) {

      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);

      switching = true;

    }

  }

}





function pieChart(){
// Load google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
// Draw the chart and set the chart values
function drawChart() {
  var data = google.visualization.arrayToDataTable([
  ['Test cases', 'Count'],
  ['PASS', passedTCs_count],
  ['FAIL', failedTCs_count],
  ['NO RUN', noRunTCsCount]
]);

  var options = {
  width: w*0.6,
  height: 300,
  title: 'Execution Analysis',
  colors: ['green', 'red', 'blue']
};

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}
}




function addHyperlink(cell, linkName, actualLink){
  var x = document.createElement("A");
  var t = document.createTextNode(linkName);
  x.setAttribute("href", actualLink);
  x.appendChild(t);
  cell.appendChild(x);
}


function addHyperlinkForStepsModal(cell, linkName, modalId, i){
  var x = document.createElement("A");
  var t = document.createTextNode(linkName);
  x.setAttribute("href", modalId);
  x.setAttribute("data-toggle", 'modal');
  //x.setAttribute("data-target", modalId);
  x.setAttribute("onclick", 'setStepsModal('+i+')');
  x.appendChild(t);
  cell.appendChild(x);
}

function setStepsModal(num){
	var jsonObj = JSON.parse(data);
	
	var header = document.getElementById('stepsModalHeader');
	header.innerHTML = jsonObj.testcases[num].desc;
	
	var modalBody = document.getElementById('stepsModalBody');
	createTestStepsTable(modalBody, jsonObj.testcases[num].steps);
	
}

function createTestStepsTable(modalBody, steps) {
	
	modalBody.innerHTML = '';
	var tbl = document.createElement('table');
	tbl.style.width = '90%';
	tbl.setAttribute('class', 'mainTable');
	modalBody.appendChild(tbl);
	
	var row = tbl.insertRow(0);
	var header = document.createElement('th');
	header.innerHTML = 'TEST STEPS';
	row.appendChild(header);
	header = document.createElement('th');
	header.innerHTML = 'STATUS';
	row.appendChild(header);
	header = document.createElement('th');
	header.innerHTML = 'SCREENSHOT';
	row.appendChild(header);
	
	//Remove if any row is present
	var rowCount = tbl.rows.length;
	for (var r = 1; r < rowCount; r++) {
		tbl.deleteRow(-1);
	}


	for (var i = 0; i < steps.length; i++) { 
		var row = tbl.insertRow(-1); //Adding a new row

		// Insert new cells in the "new" row :
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);

		// Add some text to the new cells:
		cell1.innerHTML = steps[i].step;
		cell2.innerHTML = colorText(steps[i].status);
		addHyperlinkForScreenshotModal(cell3, 'screenshot', '#myImageModal', steps[i].step, steps[i].screenshot);
	}
}






function addHyperlinkForScreenshotModal(cell, linkName, modalId, title, imagePath){
  var x = document.createElement("A");
  var t = document.createTextNode(linkName);
  x.setAttribute("href", modalId);
  x.setAttribute("data-toggle", 'modal');
  //x.setAttribute("data-target", modalId);
  x.setAttribute("onclick", 'setImageModal("'+title+'", "' + imagePath +'")');
  x.appendChild(t);
  cell.appendChild(x);
}

function setImageModal(title, imagePath){
	var header = document.getElementById('screenshotModalHeader');
	header.innerHTML = title;
	
	var modalBody = document.getElementById('screenshotModalBody');
	modalBody.innerHTML = '';
	var img = document.createElement('img');
	img.setAttribute('src', imagePath);
	modalBody.appendChild(img);
}


