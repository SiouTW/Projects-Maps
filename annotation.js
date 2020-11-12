var map, nearByResults;
const lowToHigh = document.getElementById('lowToHigh');
const nameLowToHigh = document.getElementById('nameLowToHigh');
const priceLowToHigh = document.getElementById('priceLowToHigh');
const highToLow = document.getElementById('highToLow');
const nameHighToLow = document.getElementById('nameHighToLow');
const priceHighToLow = document.getElementById('priceHighToLow');
const test = document.getElementById('test');

(
  function initMap() {
    // 跟使用者要求所在地位置
    navigator.geolocation.getCurrentPosition((position) => {
      // 使用者所在地
      console.log(position.coords);
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      // 台北火車站的經緯度
      // const taipeiTrainStation = { lat: 25.04770, lng: 121.51704 };
      // 創造地圖
      map = new google.maps.Map(document.getElementById("map"), {
        // zoom數字越小能看到的範圍越大 (0~20)
        zoom: 15,
        // 設定能縮小的最小數字
        minZoom: 5,
        // 地圖以哪裡為中心
        // center: taipeiTrainStation,
        center: { lat: lat, lng: lng },
        // 不用案crtl+滾輪就可以直接放大縮小地圖
        gestureHandling: 'greedy',
      })
      // 對使用者的位置進行 marker
      new google.maps.Marker({
        // position: taipeiTrainStation,
        position: { lat: lat, lng: lng },
        map: map,
      });


      // const infoWindow = new google.maps.infoWindow({
      //   content: '<h3>' + place.name + '</h3><p>地址:' + place.vicinity + '</p>',
      // })


      // marker.addListener('click', () => {
      //   infoWindow.open(map, marker)
      // })


      const service = new google.maps.places.PlacesService(map);
      // 搜尋指定座標特定範圍內的指定類型
      service.nearbySearch(
        // { location: taipeiTrainStation, radius: 500, type: "restaurant" },
        { location: { lat: lat, lng: lng }, radius: 500, type: "restaurant" },
        (results, status, pagination) => {
          if (status !== "OK") return;
          createMarkers(results, map);
          // 把值傳到全域變數
          nearByResults = results;

          // console.log(nearByResults);
          // console.log('價格等級(0~4|越高越貴):' + results[0].price_level);
          // console.log('評分等級(0~5|越高越好):' + results[0].rating);
          // console.log('完整地址:' + results[0].vicinity);
          // console.log(pagination);
          // moreButton.disabled = !pagination.hasNextPage;
          // 如果有其他分頁資料的話
          // if (pagination.hasNextPage) {
          //   getNextPage = pagination.nextPage;
          // }
        }
      );
      // 為了獲得完整的地址，需用getDetails
      // service.getDetails({ placeId: 'ChIJ15RhJXOpQjQR9KORWgjDPr8' },
      //   (e) => {
      //     console.log(e.formatted_address);
      //   })
    })
  }
)()

lowToHigh.addEventListener('click', () => {
  nearByResults.sort(function (a, b) {
    return a.rating - b.rating
  });
  sortedList()
})

highToLow.addEventListener('click', () => {
  nearByResults.sort(function (a, b) {
    return b.rating - a.rating
  });
  sortedList()
})

nameLowToHigh.addEventListener('click', () => {
  nearByResults.sort(function (a, b) {
    return a.name.localeCompare(b.name, "zh-hant")
  });
  sortedList()
})

nameHighToLow.addEventListener('click', () => {
  nearByResults.sort(function (a, b) {
    return b.name.localeCompare(a.name, "zh-hant")
  });
  sortedList()
})

priceLowToHigh.addEventListener('click', () => {
  nearByResults.sort(function (a, b) {
    return a.price_level - b.price_level
  });
  sortedList()
})

priceHighToLow.addEventListener('click', () => {
  nearByResults.sort(function (a, b) {
    return b.price_level - a.price_level
  });
  sortedList()
})

function createMarkers(places, map) {
  const bounds = new google.maps.LatLngBounds();
  const placesList = document.getElementById("places");
  // console.log(places);
  for (let i = 0, place; (place = places[i]); i++) {
    // 設定圖片大小和圖案
    // const image = {
    //   url: place.icon,
    //   size: new google.maps.Size(71, 71),
    //   origin: new google.maps.Point(0, 0),
    //   anchor: new google.maps.Point(17, 34),
    //   scaledSize: new google.maps.Size(25, 25),
    // };
    const marker = new google.maps.Marker({
      map,
      // icon: image,
      title: place.name,
      position: place.geometry.location,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: '<h3>' + place.name + '</h3><p>地址:' + place.vicinity + '</p>',
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })

    const tr = document.createElement("tr");
    if (place.price_level == undefined)
      place.price_level = '0'
    if (place.business_status == 'OPERATIONAL')
      place.business_status = '營業中'
    else
      place.business_status = '非營業時間'
    tr.innerHTML =
      `<td>` + place.name + `</td >
      <td>`+ place.rating + `</td>
      <td>`+ place.price_level + `</td>
      <td>`+ place.business_status + `</td>
      <td>`+ place.vicinity + `</td>`;
    // 可以把 marker 的資料打開
    tr.addEventListener('click', () => {
      infoWindow.open(map, marker)
    })
    placesList.appendChild(tr);
    bounds.extend(place.geometry.location);
  }
  // 自動縮放到適合的大小
  map.fitBounds(bounds);
}

function sortedList() {
  for (let i = 0, nearByResult; (nearByResult = nearByResults[i]); i++) {
    console.log(i);
    const marker = new google.maps.Marker({
      map,
      title: nearByResult.name,
      position: nearByResult.geometry.location,
    });
    const infoWindow = new google.maps.InfoWindow({
      content: '<h3>' + nearByResult.name + '</h3><p>地址:' + nearByResult.vicinity + '</p>',
    })
    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })
    if (i == 0) {
      var placesList = document.getElementById("places");
      placesList.parentNode.removeChild(placesList);
      const table = document.createElement("table");
      table.setAttribute('id', 'places');
      table.innerHTML =
        `<tr>
      <th>店名</th>
      <th>使用者評價 (0~5) </th>
      <th>消費單價 (0~4)<br>0代表查不到</th>
      <th>是否營業中</th>
      <th>地址</th>
      </tr>`
      test.appendChild(table);
    }
    var placesList = document.getElementById("places");
    const tr = document.createElement("tr");
    tr.innerHTML =
      `<td>` + nearByResult.name + `</td >
    <td>`+ nearByResult.rating + `</td>
    <td>`+ nearByResult.price_level + `</td>
    <td>`+ nearByResult.business_status + `</td>
    <td>`+ nearByResult.vicinity + `</td>`;
    tr.addEventListener('click', () => {
      infoWindow.open(map, marker)
    })
    placesList.appendChild(tr);
  }
}

// google maps api 相關資料
// https://developers.google.com/maps/documentation/javascript/examples/place-search-pagination