let maps;
let position = { lat: 13.883932, lng: 100.512292 }
let trucksArr = JSON.parse(localStorage.arrData);
let truckArr = []
let markers = []
let marker, info;



function initMap() {
    let mapOptions = {
        center: position,
        zoom: 11
    };

    maps = new google.maps.Map(document.getElementById("map"), mapOptions);

    let officeMarker = new google.maps.Marker({
        position: position,
        map: maps,
        animation: google.maps.Animation.BOUNCE,
        icon: "images/mover-truck.png"
    })
    setMarker(truckArr = trucksArr[0])
    addTable()
}

function setMarker() {
    let j;
    $.each(truckArr, function (j, item) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(item.lat, item.lng),
            map: maps,
        });
        markers.push(marker);

        info = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', (function (marker, j) {
            return function () {
                info.setContent(item.address);
                info.open(maps, marker)
            }
        })(marker, j));
    })
}

function clickBtnHandler(objButton) {
    let btnNum = objButton.value;

    switch (btnNum) {
        case '1':
            truckArr = []
            removeMarker()
            setMarker(truckArr = trucksArr[0])
            removeTable()
            addTable()
            break;
        case '2':
            truckArr = []
            removeMarker()
            setMarker(truckArr = trucksArr[1])
            removeTable()
            addTable()
            break;
        case '3':
            truckArr = []
            removeMarker()
            setMarker(truckArr = trucksArr[2])
            removeTable()
            addTable()
            break;
        case '4':
            truckArr = []
            removeMarker()
            setMarker(truckArr = trucksArr[3])
            removeTable()
            addTable()
            break;
        case '5':
            truckArr = []
            removeMarker()
            setMarker(truckArr = trucksArr[4])
            removeTable()
            addTable()
            break;
        default:
            break;
    }
}

function removeMarker() {
    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function addTable() {
    // สร้าง table
    let table = document.querySelector("table");
    let data = Object.keys(truckArr[0]);

    generateTableHead(table, data);
    generateTable(table, truckArr);
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {

        let th = document.createElement("th");
        th.setAttribute("id", "header");
        // th.classList.add("tableHeader");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

function removeTable() {
    $('.aaa').html('');
}