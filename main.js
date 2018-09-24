function getData() {
    var repoName = document.getElementById("repo");
    var url = 'https://api.github.com/search/repositories?q=' + repoName.value;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            createTableData(myJson);
        });

    return false
}

var searchData;

function createTableData(json) {
    searchData = [];

    for (let j = 0; j < 10; j++) {
        searchData.push(json.items[j]);

        url2 = 'https://api.github.com/repos/' + json.items[j].full_name + '/releases/latest';

        fetch(url2)
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                searchData[j].latest_release_tag = (myJson.name) ? myJson.name : '-';
                // Added a 15 ms delay to ensure all the API calls are done and the new data is added before createTable() function is called
                if (j == 9) {
                    setTimeout(function() {
                        createTable(searchData, 'main-table-body');
                    }, 15);
                }
            });
    }
}

function createTable(data, targetTable) {
    var tableBody = document.getElementById(targetTable);
    tableBody.innerHTML = "";
    
    var isTargetBox2 = (targetTable == 'box2-table-body');
    var row, cell, isFave;

    for (let i = 0; i < data.length; i++) {
        isFave = data[i].isFavourite;
        if (!isTargetBox2 || (isTargetBox2 && isFave)) {
            row = document.createElement("tr");

            cell = document.createElement("td");
            aTag = document.createElement("a");
            aTag.innerHTML = data[i].full_name;
            aTag.setAttribute("href", data[i].html_url);
            aTag.setAttribute("target", "_blank");
            aTag.setAttribute("class", "full_name");
            cell.appendChild(aTag);
            row.appendChild(cell);

            row.appendChild(createParaTag(data[i].language));
            row.appendChild(createParaTag(data[i].latest_release_tag));

            if (!isFave) {
                row.appendChild(createAddOrRemove(i, isFave));
            }
            else if (isTargetBox2) {
                row.appendChild(createAddOrRemove(i, isFave));
            }            

            tableBody.appendChild(row);
        }        
    }
}

// Callback is used to ensure that the click function does not fire when the button is loading
function setFavourite(i, isFave) {
    return function () {
        searchData[i].isFavourite = isFave;
        createTable(searchData, 'main-table-body');
        createTable(searchData, 'box2-table-body');
    }
}

function checkLength() {
    var searchInput = document.getElementById("repo");

    if (searchInput.value.length == 0) {
        searchData = [];
        createTable(searchData, 'main-table-body');
        createTable(searchData, 'box2-table-body');
    }
}

function createAddOrRemove (i, isFave) {
    var cell, bTag;
    cell = document.createElement("td");
    bTag = document.createElement("input");
    bTag.setAttribute("type", "button");
    bTag.setAttribute("value", (isFave) ? "Remove" : "Add");
    bTag.addEventListener('click', setFavourite(i, !isFave));
    cell.appendChild(bTag);
    return cell;
}

function createParaTag(data) {
    var cell, pTag;
    cell = document.createElement("td");
    pTag = document.createElement("p");
    pTag.innerHTML = data;
    cell.appendChild(pTag);
    return cell;
}