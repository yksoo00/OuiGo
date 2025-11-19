document.addEventListener('DOMContentLoaded', async () => {

  // ========================= 모집글 등록 =========================
  document.getElementById('btn-create').addEventListener('click', async () => {
    const recruitTitle = document.getElementById('recruitTitle').value.trim();
    const recruitContent = document.getElementById(
        'recruitContent').value.trim();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const recruitCategory = document.getElementById('recruitCategory').value;
    const touristSpotId = document.getElementById('touristSpotId').value;

    const genderCodes = [...document.querySelectorAll(
        'input[name="genderCodes"]:checked')]
    .map(e => e.value);
    const ageCodes = [...document.querySelectorAll(
        'input[name="ageCodes"]:checked')]
    .map(e => e.value);

    // 검증
    if (!recruitTitle || !recruitContent || !startDate || !endDate
        || !recruitCategory || !touristSpotId) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    try {
      const res = await apiFetch('/api/v1/recruit', {
        method: 'POST',
        body: JSON.stringify({
          recruitTitle,
          recruitContent,
          startDate,
          endDate,
          recruitCategory,
          touristSpotId,
          genderCodes,
          ageCodes
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message || '모집글이 등록되었습니다.');
        window.location.href = `/recruit/${result.data}`;
      } else {
        alert(result.message || '등록 실패');
      }

    } catch (err) {
      console.error('등록 실패:', err);
    }
  });

});
document.addEventListener("DOMContentLoaded", () => {

  function showError(input, key, message) {
    const errorDiv = document.querySelector(
        `.error-message[data-error="${key}"]`);

    input.classList.remove("box-success");
    input.classList.add("box-error");

    if (errorDiv) {
      errorDiv.textContent = message;
    }
  }

  function clearError(input, key) {
    const errorDiv = document.querySelector(
        `.error-message[data-error="${key}"]`);

    input.classList.remove("box-error");
    input.classList.add("box-success");

    if (errorDiv) {
      errorDiv.textContent = "";
    }
  }

  // ==========================
  //   필드별 Validation 규칙
  // ==========================
  const validators = {
    recruitTitle: (v) => {
      if (!v) {
        return "제목은 필수입니다.";
      }
      if (v.length > 100) {
        return "제목은 최대 100글자까지 가능합니다.";
      }
      return null;
    },

    recruitContent: (v) => {
      if (!v) {
        return "내용은 필수입니다.";
      }
      if (v.length > 1000) {
        return "내용은 최대 1000글자까지 가능합니다.";
      }
      return null;
    }
  };

  // ==========================
  //   날짜 검증 로직
  // ==========================
  function validateDates() {
    const start = document.getElementById("startDate");
    const end = document.getElementById("endDate");

    const startVal = start.value;
    const endVal = end.value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 시작일 검증
    if (startVal) {
      const startDateObj = new Date(startVal);
      if (startDateObj < today) {
        showError(start, "startDate", "시작일은 오늘보다 빠를 수 없습니다.");
      } else {
        clearError(start, "startDate");
      }
    }

    // 종료일 검증 (시작일보다 빠를 수 없음)
    if (startVal && endVal) {
      if (endVal < startVal) {
        showError(end, "endDate", "종료일은 시작일보다 빠를 수 없습니다.");
      } else {
        clearError(end, "endDate");
      }
    }
  }

  // ==========================
  //   실시간 Validation
  // ==========================
  const inputs = ["recruitTitle", "recruitContent", "startDate", "endDate"];

  inputs.forEach(id => {
    const el = document.getElementById(id);

    el.addEventListener("input", () => {
      // 날짜인 경우 날짜 검증 호출
      if (id === "startDate" || id === "endDate") {
        validateDates();
        return;
      }

      // 일반 텍스트 검증
      const msg = validators[id](el.value.trim());
      if (msg) {
        showError(el, id, msg);
      } else {
        clearError(el, id);
      }
    });
  });

  // ==========================
  //   '등록하기' 버튼 클릭 시
  // ==========================
  document.getElementById("btn-create").addEventListener("click", async () => {
    let hasError = false;

    // 1) 텍스트 필드 검증
    inputs.forEach(id => {
      const el = document.getElementById(id);
      const val = el.value.trim();

      if (id !== "startDate" && id !== "endDate") {
        const msg = validators[id](val);
        if (msg) {
          showError(el, id, msg);
          hasError = true;
        }
      }
    });

    // 2) 날짜 검증
    validateDates();

    const startErr = document.querySelector(
        `.error-message[data-error="startDate"]`);
    const endErr = document.querySelector(
        `.error-message[data-error="endDate"]`);

    if (startErr.textContent || endErr.textContent) {
      hasError = true;
    }

    if (hasError) {
      window.scrollTo(0, 0);
      return;
    }

    // ==========================
    //   모든 검증 통과 → 등록 로직 실행
    // ==========================
    console.log("Validation OK → 모집글 등록 요청 전송됨");
    // 기존 등록 POST 요청 코드 넣으면 됨

  });

});