
var fs = require('fs');
var path = require('path');
var convert = require('xml-js');

var filePath;
var currentData;


var ipxactInfoForm = document.getElementById("ipxact_info");
var ipxactVendorField = document.getElementById("ipxact_vendor");
var ipxactLibraryField = document.getElementById("ipxact_library");
var ipxactNameField = document.getElementById("ipxact_name");
var ipxactVersionField = document.getElementById("ipxact_version");

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
    return 'none';
}

if (getQueryVariable('mode') === 'open') {
    filePath = getQueryVariable('path');
    loadData();
}

function registersTableAddRow(name, offset, size) {
    // Get a reference to the table
    var tableRef = document.getElementById("registersTable");

    // Insert a row in the table at row index 0
    var newRow = tableRef.insertRow(-1);

    // Insert a cell in the row at index 0
    var newCell0 = newRow.insertCell(0);
    var newCell1 = newRow.insertCell(1);
    var newCell2 = newRow.insertCell(2);

    // Append a text node to the cell
    newCell0.appendChild(document.createTextNode(name));
    newCell1.appendChild(document.createTextNode(offset));
    newCell2.appendChild(document.createTextNode(size));
}

////////////////////////////////////////////////////////////////////

document.querySelector("html").classList.add('js');

var fileInput = document.querySelector(".inputfile");

/*fileInput.addEventListener("change", function (event) {
 try {
 filePath = fileInput.files[0].path;
 } catch (err) {
 alert('Empty file!\nDebug:\n' + err);
 return;
 }
 openTab(event, 'Info');
 loadData();
 });*/

////////////////////////////////////////////////////////////////////



ipxactInfoForm.addEventListener('change', function (event) {
    currentData.elements[0]['elements'].forEach(function (element) {
        if (element.name === ipxactType + ':vendor')
            element.elements[0].text = ipxactVendorField.value;
        if (element.name === ipxactType + ':library')
            element.elements[0].text = ipxactLibraryField.value;
        if (element.name === ipxactType + ':name')
            element.elements[0].text = ipxactNameField.value;
        if (element.name === ipxactType + ':version')
            element.elements[0].text = ipxactVersionField.value;
    });
    saveData();
});

////////////////////////////////////////////////////////////////////

function loadData() {
    var xml;
    try {
        xml = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        alert('Empty file!\nDebug:\n' + err);
        return;
    }
    populateData(null, xml);
}

function saveData() {
    var xml = convert.js2xml(currentData, {spaces: 2});
    fs.writeFileSync(filePath, xml);
    console.log('Saved');
}

function populateData(form, xml) {
    //openTab(event, 'Info');
    //document.getElementsByClassName("tablink")[0].classList.add('w3-red');

    var options = {ignoreComment: true, alwaysChildren: true};
    currentData = convert.xml2js(xml, options);

    //fs.writeFileSync('ipxactTestOut.json', JSON.stringify(currentData, null, 2));


    var ipxactType = "ipxact";
    //var ipxactType = "spirit";

    currentData.elements[0]['elements'].forEach(function (element) {
        console.log(element.type + ' ' + element.name);

        if (element.name === ipxactType + ':vendor')
            ipxactVendorField.value = element.elements[0].text;

        if (element.name === ipxactType + ':library')
            ipxactLibraryField.value = element.elements[0].text;

        if (element.name === ipxactType + ':name')
            ipxactNameField.value = element.elements[0].text;

        if (element.name === ipxactType + ':version')
            ipxactVersionField.value = element.elements[0].text;

        if (element.name === ipxactType + ':memoryMaps') {
            element.elements.forEach(function (element2) {
                element2.elements.forEach(function (element3) {
                    element3.elements.forEach(function (element4) {
                        if (element4.name === ipxactType + ':register') {
                            element4.elements.forEach(function (element5) {
                                if (element5.name === ipxactType + ':name')
                                    registerName = element5.elements[0].text;
                                if (element5.name === ipxactType + ':description')
                                    registerDesc = element5.elements[0].text;
                                if (element5.name === ipxactType + ':addressOffset')
                                    registerOffset = element5.elements[0].text;
                                if (element5.name === ipxactType + ':size')
                                    registerSize = element5.elements[0].text;
                                if (element5.name === ipxactType + ':access')
                                    registerAccess = element5.elements[0].text;
                            });
                            registersTableAddRow(registerName, registerOffset, registerSize);
                            console.log(registerAccess);
                        }
                    });
                });
            });
        }

        if (element.name === ipxactType + ':fileSets') {
            element.elements.forEach(function (element2) {
                var div = document.createElement('div');
                div.setAttribute('class', 'someClass');
                div.innerHTML = "<h3>fileSet</h3>";
                var child = document.getElementById('ipxact_filesets_div').appendChild(div);
                var form = document.createElement('form');
                child_form = child.appendChild(form);
                element2.elements.forEach(function (element3) {
                    console.log(element3.elements[0]);
                    console.log(element3.name);
                    console.log(element3.elements[0].text);
                    if (element3.elements[0].name == ipxactType + ':name') {
                        var label = document.createElement('label');
                        label.innerHTML = element3.elements[0].text;
                        child_form.appendChild(label);
                    }
                });
            });
        }

    });
}
