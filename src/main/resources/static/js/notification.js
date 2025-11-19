// notification.js

document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("accessToken");
  if (!token) {
    return;
  }

  const eventSource = new EventSource(
      `/api/v1/notifications/connect?token=${token}`);

  eventSource.onmessage = (event) => {
    console.log("SSE:", event.data);
    let response;
    try {
      response = JSON.parse(event.data);
    } catch {
      return;
    }

    if (!response.data) {
      return;
    }

    const noti = response.data;

    console.log(noti)

    increaseBadgeCount();
    showLivePopup(noti.content, noti.url);

    addNotificationToList(noti);
  };

  eventSource.onerror = (err) => console.error("SSE Error", err);
});

// 🔔 뱃지 증가
function increaseBadgeCount() {
  const badge = document.getElementById("alert-badge");
  let count = Number(badge.innerText || 0) + 1;
  badge.innerText = count;
  badge.style.display = "inline-block";
}

// 🔔 실시간 팝업 (카카오톡 느낌)
function showLivePopup(message, url) {
  const popup = document.createElement("div");
  popup.className = "live-popup";
  popup.innerText = message;

  popup.onclick = () => {
    if (url) {
      location.href = url;
    }
  };

  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 5000);
}

// 🔔 드롭다운 목록에 추가 (선택)
function addNotificationToList(noti) {
  const list = document.getElementById("noti-list");
  if (!list) {
    return;
  }

  const li = document.createElement("li");
  li.className = "noti-item";
  li.innerHTML = `<span>${noti.content}</span>`;
  li.onclick = () => location.href = noti.url;

  list.prepend(li);
}

if (window.location.pathname.includes("notificationListPage")) {
  loadNotifications(); // 실시간 새 알림을 바로 테이블에 업데이트
}