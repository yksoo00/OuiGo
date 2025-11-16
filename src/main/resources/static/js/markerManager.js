/* markerManager.js */

/**
 * markerManager.js
 * * - 전역 'map'과 'geocoder' 변수를 사용합니다.
 * - 'markers' 배열을 직접 관리합니다.
 * - 주소(spot.address)를 좌표로 변환(Geocoding)합니다.
 * - 변환된 좌표에 마커(pin)를 표시합니다.
 */

let markers = [];

function displayMapMarkers(spots) {

    markers.forEach(marker => marker.setMap(null));
    markers = [];

    spots.forEach(spot => {
        if (!spot.address) {
            console.warn(`[${spot.title}] 주소(address)값이 없어 마커를 표시할 수 없습니다.`);
            return;
        }

        geocoder.addressSearch(spot.address, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                const overlayDiv = document.createElement("div");
                overlayDiv.className = "tourist-overlay"; // 새로운 CSS 클래스 (아래 2번에서 정의)
                overlayDiv.innerText = spot.title;

                const overlay = new kakao.maps.CustomOverlay({
                    position: coords,
                    content: overlayDiv,
                    yAnchor: 1.7,
                    xAnchor: 0.5
                });

                overlay.setMap(null);

                kakao.maps.event.addListener(marker, 'click', function () {
                    window.location.href = `/tourist/touristDetail/${spot.id}`;
                });

                kakao.maps.event.addListener(marker, "mouseover", () => {
                    overlay.setMap(map);
                    overlayDiv.classList.add("show");
                });

                kakao.maps.event.addListener(marker, "mouseout", () => {
                    overlayDiv.classList.remove("show");

                    setTimeout(() => {
                        if (!overlayDiv.classList.contains("show")) {
                            overlay.setMap(null);
                        }
                    }, 150);
                });

                markers.push(marker);
            }
        });
    });
}