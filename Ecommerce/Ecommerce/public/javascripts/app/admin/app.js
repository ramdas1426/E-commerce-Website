var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    $scope.data = {};
    $scope.submit = function () {
        console.log('clicked submit');
        $http({
            url: 'http://localhost:1337/create',
            method: 'POST',
            data: $scope.data
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
        })
    }
});

function addRow() {

    var myName = document.getElementById("name");
    var age = document.getElementById("age");
    var table = document.getElementById("myTableData");

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    row.insertCell(0).innerHTML = '<input type="button" value = "Delete" onClick="Javacsript:deleteRow(this)">';
    row.insertCell(1).innerHTML = myName.value;
    row.insertCell(2).innerHTML = age.value;

}

function deleteRow(obj) {

    var index = obj.parentNode.parentNode.rowIndex;
    var table = document.getElementById("myTableData");
    table.deleteRow(index);

}

function addTable(contacts) {

    //var searchResultsJson = '[' + contacts + ']';

    //var searchResultsJsonArray = JSON.parse(contacts);

    //console.log(searchResultsJsonArray)

    var myTableDiv = document.getElementById("myDynamicTable");

    var table = document.createElement('TABLE');
    table.border = '1';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);

    for (var i = 0; i < contacts.length; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);

        for (var j = 0; j < 4; j++) {
            var td = document.createElement('TD');
            td.width = '75';
            td.appendChild(document.createTextNode("Cell " + i + "," + j));
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);

}

function load() {

    console.log("Page load finished");

}


