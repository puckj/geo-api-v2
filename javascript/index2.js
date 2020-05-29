let maps;
let position = { lat: 13.883932, lng: 100.512292 }
// let positionArr = JSON.parse(localStorage.myArrData);
let positionArr = locationArray;
let buffer = [...positionArr]; //จุดทั้งหมด
let trucksArr = []; // array ที่ต้องเก็บรถ 5 คัน
let truckArr = []; // array ของรถแต่ละคัน ต้องเก็บ location 5 จุด
let positionArrTable = [];

let numTrucks = 5; // จำนวนรถ
let numItems = 5; // จำนวนจุดที่รถหนึ่งคันไปรับ


function initMap() {


    maps = new google.maps.Map(document.getElementById('map'), {
        center: position,
        zoom: 12
    });

    let officeMarker = new google.maps.Marker({
        position: position,
        map: maps,
        animation: google.maps.Animation.BOUNCE,
        icon: "images/mover-truck.png"
    })

    let marker, info;
    let i;

    moveLocation(buffer)

    //สร้าง Marker
    for (i = 0; i < trucksArr.length; i++) {
        $.each(trucksArr[i], function (j, item) {
            trucksArr[i][j].index = (i + 1) + "." + (j + 1);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.lat, item.lng),
                map: maps,
                label: (item.index).toString()
            });
            // console.log(trucksArr[i][j],i,j);
            info = new google.maps.InfoWindow();
            google.maps.event.addListener(marker, 'click', (function (marker, j) {
                return function () {
                    info.setContent(item.address);
                    info.open(maps, marker)
                }
            })(marker, j));
        })
    }

    //mark ที่ไม่มีรถไปถึง
    $.each(buffer, function (i, item) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(item.lat, item.lng),
            map: maps,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
        });

        info = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                info.setContent(item.address);
                info.open(maps, marker)
            }
        })(marker, i));
    })

    modifyArr(trucksArr, positionArrTable)

    // สร้าง table
    let table = document.querySelector("table");
    let data = Object.keys(positionArrTable[0]);
    generateTableHead(table, data);
    generateTable(table, positionArrTable);
    localStorage.arrData = JSON.stringify(trucksArr, 0);
}

function modifyArr(trucksArr, positionArrTable) {
    for (i = 0; i < trucksArr.length; i++) {
        $.each(trucksArr[i], function (j, item) {
            // delete trucksArr[i][j].lat;
            // delete trucksArr[i][j].lng;
            positionArrTable.push(trucksArr[i][j]);
        })
    }
}

function compare(a, b) {
    if (a.distance < b.distance) {
        return -1;
    }
    if (a.distance > b.distance) {
        return 1;
    }
    return 0;
}

function rad(x) {
    return x * Math.PI / 180;
};

function getDistance(p1, p2) {
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = rad(p2.lat - p1.lat);
    let dLong = rad(p2.lng - p1.lng);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d; // returns the distance in meter
};

function moveLocation(buffer) {
    for (k = 0; k < numTrucks; k++) {
        for (i = 0; i < numItems; i++) {
            let lastIndexTruckArr = truckArr.length;
            let distance;

            buffer.sort(compare);
            truckArr.push(buffer[0]);
            buffer.shift();

            //loop หาระยะทาง
            for (j = 0; j < buffer.length; j++) {
                distance = getDistance(truckArr[lastIndexTruckArr], buffer[j]);
                buffer[j].distance = distance;
            }
        }
        trucksArr.push(truckArr)
        truckArr = []; // clean array
        setStart(buffer)
    }
}

//function ตั้งจุด start ใหม่ ให้กลับมาเริ่มต้นที่ office 
function setStart(buffer) {
    let distance;
    for (i = 0; i < buffer.length; i++) {
        distance = getDistance(position, buffer[i])
        buffer[i].distance = distance;
    }
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {

        let th = document.createElement("th");
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