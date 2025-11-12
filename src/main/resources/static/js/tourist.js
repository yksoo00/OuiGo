let map;
let geocoder;
let currentKeyword = null;


document.addEventListener("DOMContentLoaded", function () {
    const mapContainer = document.getElementById('map');
    const mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 7
    };

    map = new kakao.maps.Map(mapContainer, mapOption);
    geocoder = new kakao.maps.services.Geocoder();

    loadAllMarkers();
    loadPage(0);


    document.getElementById('keyword-search-btn').addEventListener('click', function () {
        currentKeyword = document.getElementById('keyword-search-input').value;
        loadPage(0);
    });

    document.getElementById('keyword-search-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            document.getElementById('keyword-search-btn').click();
        }
    });
});


function loadAllMarkers() {
    fetch(`/api/v1/tourist-spots/markers`)
        .then(response => response.json())
        .then(data => {
            const allSpots = data.data;

            displayMapMarkers(allSpots);
        })
        .catch(error => console.error('Error fetching all markers:', error));
}


function loadPage(page) {

    let url = `/api/v1/tourist-spots?page=${page}&size=10`;

    if (currentKeyword && currentKeyword.trim() !== '') {
        url += `&keyword=${encodeURIComponent(currentKeyword)}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pageData = data.data;
            displayList(pageData.content);
            displayPagination(pageData);
        })
        .catch(error => console.error('Error fetching tourist spots page:', error));
}


function displayList(spots) {
    const listElement = document.getElementById('spot-list-container');
    listElement.innerHTML = '';

    if (!spots || spots.length === 0) {
        listElement.innerHTML = '<div class="empty-state"><p class="empty-state-text">검색된 관광지가 없습니다.</p></div>';
        return;
    }

    spots.forEach(spot => {
        const card = document.createElement('div');
        card.className = 'recruit-card';

        card.onclick = function () {
            window.location.href = `/layout/${spot.id}`;
        };

        const spotAddress = spot.address || '주소 정보 없음';

        card.innerHTML = `
            <div class="card-content">
                <h3 class="card-title">[${spot.district}] ${spot.title}</h3>
                <p class="card-description">${spotAddress}</p>
                <div class="card-author" style="border-top: none; padding-top: 5px;">
                    <div class="author-info">
                    </div>
                </div>
            </div>
        `;
        listElement.appendChild(card);
    });
}


function displayPagination(pageData) {
    const paginationElement = document.getElementById('pagination-container');
    paginationElement.innerHTML = '';

    const totalPages = pageData.totalPages;
    const currentPage = pageData.number;

    for (let i = 0; i < totalPages; i++) {
        const pageLink = document.createElement('button');
        pageLink.className = 'page-btn';
        pageLink.textContent = i + 1;

        if (i === currentPage) {
            pageLink.classList.add('active');
        }

        pageLink.addEventListener('click', (function (pageIndex) {
            return function (e) {
                e.preventDefault();
                loadPage(pageIndex);
            }
        })(i));

        paginationElement.appendChild(pageLink);
    }
}

