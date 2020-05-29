let maps;
let position = { lat: 13.883932, lng: 100.512292 };
let positionArr = [];


function positionItem(address, lat, lng, distance) {
    this.address = address;
    this.lat = lat;
    this.lng = lng;
    this.distance = distance;
}

function initMap() {
    maps = new google.maps.Map(document.getElementById('map'), {
        center: position,
        zoom: 15
    });
    let geocoder = new google.maps.Geocoder();
    let infowindow = new google.maps.InfoWindow();
    document.getElementById('submit').addEventListener('click', function () {
        geocoderAddress(geocoder, maps);
    });

    //กด Search ค้นหาตำแหน่ง
    function geocoderAddress(geocoder, resultsMap) {
        let address = document.getElementById('address').value;
        geocoder.geocode({ 'address': address }, function (results, status) {
            if (status === 'OK') {
                resultsMap.setCenter(results[0].geometry.location);
                let marker = new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    map: resultsMap,
                    position: results[0].geometry.location,
                    draggable: true
                })
                let latitude = marker.getPosition().lat();
                let longitude = marker.getPosition().lng();

                document.getElementById("latitude").value = latitude;
                document.getElementById("longitude").value = longitude;
                infowindow.setContent(results[0].formatted_address);
                infowindow.open(maps, marker);

                //drag mark เพิ่มเปลี่ยน lat,lng
                google.maps.event.addListener(marker, 'dragend', function (event) {
                    geocoder.geocode({ 'latLng': marker.getPosition() }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                document.getElementById("address").value = results[0].formatted_address;
                                document.getElementById("latitude").value = marker.getPosition().lat();
                                document.getElementById("longitude").value = marker.getPosition().lng();
                                infowindow.setContent(results[0].formatted_address);
                                infowindow.open(maps, marker);
                            }
                        }
                    });
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        })
    }
}

//กด Add เพิ่มตำแหน่งลงในตาราง
function addLocationHandler() {
    let address = document.getElementById("address").value;
    let lat = document.getElementById("latitude").value;
    let lng = document.getElementById("longitude").value;
    let rowLength = document.getElementById("myTable").rows.length;
    let distance = getDistance(position, lat, lng);
    let currentPosition = new positionItem(address, lat, lng, distance);

    if (lat && lng) {
        if (rowLength < 6) {
            let table = document.getElementById("myTable");
            let row = table.insertRow(0);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            cell1.innerHTML = address;
            cell2.innerHTML = lat;
            cell3.innerHTML = lng;

            positionArr.push(currentPosition);
            console.log(currentPosition);

        } else {
            alert('เพิ่มตำแหน่งครบแล้ว');
        }
    } else {
        alert('กรุณาเลือกตำแหน่ง');
    }

}

function confirmLocationHandler() {
    let rowLength = document.getElementById("myTable").rows.length;
    if (rowLength > 5) {
        localStorage.myArrData = JSON.stringify(positionArr);
        location.replace("http://localhost:3021/map");
    } else {
        alert('กรุณาเพิ่มตำแหน่งในตารางให้ครบ');
    }

}

function rad(x) {
    return x * Math.PI / 180;
};

function getDistance(p1, lat, lng) {
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = rad(lat - p1.lat);
    let dLong = rad(lng - p1.lng);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d; // returns the distance in meter
};