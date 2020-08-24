declare var google: any;
declare var window: any;

export const setLatLng = (city: string, lat?: any, lng?: any) => {
  let gll;
  if (city && city !== "") {
    gll = new google.maps.LatLng(
      window.latLangs[city][0],
      window.latLangs[city][1]
    );
    lat = window.latLangs[city][0];
    lng = window.latLangs[city][1];
  } else {
    gll = new google.maps.LatLng(lat, lng);
  }
  window.map.setCenter(gll);
  window.marker.setPosition(gll);
  window.latitude = lat;
  window.longitude = lng;
  window.showInfoWindow(window.geocoder, window.infowindow, {
    lat: lat,
    lng: lng
  });
};

export const enableGmap = () => {
  window.map = null;
  window.marker = null;
  window.latLangs = {
    Cochabamba: [-17.393814, -66.156981],
    "El Alto": [-16.515869, -68.155007],
    "La Paz": [-16.495653, -68.133518],
    "Santa Cruz": [-17.783326, -63.182132]
  };
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          __initMap(position.coords.latitude, position.coords.longitude);
        },
        function () {
          __initMap();
        }
      );
    } else {
      __initMap();
    }
  }
  function __initMap(lat?: any, lng?: any) {
    var i = setInterval(() => {
      if (document.getElementById("gmap") && google) {
        clearInterval(i);

        var uluru = {
          lat: lat || -16.5207007,
          lng: lng || -68.194118
        };
        window.map = new google.maps.Map(document.getElementById("gmap"), {
          zoom: 13,
          center: uluru,
          disableDefaultUI: true
        });
        window.marker = new google.maps.Marker({
          map: window.map,
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: uluru
        });
        window.geocoder = new google.maps.Geocoder();
        window.infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(window.map, "click", function (
          event: any
        ) {
          var currentLatitude = event.latLng.lat();
          var currentLongitude = event.latLng.lng();
          window.marker.setPosition(
            new google.maps.LatLng(currentLatitude, currentLongitude)
          );
          window.showInfoWindow(window.geocoder, window.infowindow, {
            lat: currentLatitude,
            lng: currentLongitude
          });
          updateLatLng(currentLatitude, currentLongitude);
          if ((window as any).updateMapUsed) (window as any).updateMapUsed();
        });
        google.maps.event.addListener(window.marker, "dragend", function (
          marker: any
        ) {
          var latLng = marker.latLng;
          window.showInfoWindow(window.geocoder, window.infowindow, latLng);
          updateLatLng(latLng.lat(), latLng.lng());
          if ((window as any).updateMapUsed) (window as any).updateMapUsed();
        });
        updateLatLng(uluru.lat, uluru.lng);
      }
    }, 100);
  }

  window.showInfoWindow = function (
    geocoder: any,
    infowindow: any,
    latLng: any
  ) {
    geocoder.geocode({ location: latLng }, (results: any, status: any) => {
      if (status === "OK") {
        if (results[0]) {
          window.formatted_address = results[0].formatted_address;
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(window.map, window.marker);
        }
      }
    });
  };

  function updateLatLng(currentLatitude: any, currentLongitude: any) {
    window.latitude = currentLatitude.toFixed(7);
    window.longitude = currentLongitude.toFixed(7);
  }

  window.initMap = function () {
    getLocation();
  };

  if (!document.getElementById("gmapLoader")) {
    let script_tag = document.createElement("script");
    script_tag.id = "gmapLoader";
    script_tag.type = "text/javascript";
    script_tag.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyD-ytvHpafjsy_r9WbqGTj09_wkYuQAjSk&callback=initMap";
    document.body.appendChild(script_tag);
  } else {
    window.initMap();
  }
};
