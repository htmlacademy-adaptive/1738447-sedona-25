ymaps.ready(init);
function init() {
  var myMap = new ymaps.Map("map", {
    center: [34.869497, -111.760186],
    zoom: 12
  });
  var myGeoObject = new ymaps.GeoObject({
    geometry: {
      type: "Point",
      coordinates: [34.869497, -111.760186] // координаты точки
    }
  });

  var myPlacemark = new ymaps.Placemark([34.869497, -111.760186], {}, {
    iconLayout: 'default#image',
    iconImageHref: 'img/logo.svg',
    iconImageSize: [50, 50],
    iconImageOffset: [-3, -42]
  });

  // Размещение геообъекта на карте.
  myMap.geoObjects.add(myGeoObject);
  myMap.geoObjects.add(myPlacemark);

}
