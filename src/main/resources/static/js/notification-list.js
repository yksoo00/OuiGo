document.addEventListener("DOMContentLoaded", loadNotifications);

async function loadNotifications() {
  const tbody = document.getElementById("notiListBody");

  try {
    const res = await apiFetch(`/api/v1/notifications`, {method: "GET"});
    const json = await res.json();

    if (!json.data || json.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="empty">알림이 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = "";

    json.data.forEach((noti, index) => {
      const tr = document.createElement("tr");
      tr.classList.add("noti-row");

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td class="noti-content">${noti.content}</td>
        <td><span class="type-tag ${noti.type}">${noti.type}</span></td>
        <td class="actions">
            <button class="check-btn" data-id="${noti.id}">확인</button>
        </td>
      `;
      console.log(noti.url)
      tr.addEventListener("click", () => {
        if (noti.url) {
          window.location.href = noti.url;
        }
      });

      // 확인(읽음)
      tr.querySelector(".check-btn").addEventListener("click", async (e) => {
        e.stopPropagation();
        console.log(noti.id)
        await apiFetch(`/api/v1/notifications/${noti.id}/read`, {
          method: "DELETE"
        });

        alert("읽음 처리되었습니다.");
      });

      tbody.appendChild(tr);
    });

  } catch (e) {
    console.error("알림 로드 실패:", e);
    tbody.innerHTML = `<tr><td colspan="4" class="empty">알림 로드 실패</td></tr>`;
  }
}