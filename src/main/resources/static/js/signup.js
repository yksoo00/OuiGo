document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById('login-in');
  const registerForm = document.getElementById('login-up');

  /* -------------------------------
      공통 함수: 에러 표시 & 제거
  -------------------------------- */
  function showFieldError(input, field, message) {
    const errorDiv = document.querySelector(
        `.error-message[data-error="${field}"]`);
    const box = input.closest(".login__box");   // ⬅ 부모 박스 선택

    if (box) {
      box.classList.remove("box-success");
      box.classList.add("box-error");
    }

    if (errorDiv) {
      errorDiv.textContent = message;
    }
  }

  function clearFieldError(input, field) {
    const errorDiv = document.querySelector(
        `.error-message[data-error="${field}"]`);
    const box = input.closest(".login__box");

    if (box) {
      box.classList.remove("box-error");
      box.classList.add("box-success");
    }

    if (errorDiv) {
      errorDiv.textContent = "";
    }
  }

  function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(
        div => div.textContent = '');
    document.querySelectorAll(".login__input").forEach(input => {
      input.classList.remove("input-error");
      input.classList.remove("input-success");
    });
  }

  /* -------------------------------
      백엔드와 동일한 Validation 규칙
  -------------------------------- */
  const validators = {
    username: (value) => {
      if (!value) {
        return "아이디는 필수 입력 사항입니다.";
      }
      if (value.length > 10) {
        return "아이디는 최대 10자여야 합니다.";
      }
      return null;
    },

    password: (value) => {
      if (!value) {
        return "비밀번호는 필수 입력 사항입니다.";
      }
      if (value.length > 18) {
        return "비밀번호는 최대 18자여야 합니다.";
      }
      return null;
    },

    confirmPassword: (value) => {
      const pw = registerForm.password.value.trim();
      if (value !== pw) {
        return "비밀번호가 일치하지 않습니다.";
      }
      return null;
    },

    nickname: (value) => {
      if (!value) {
        return "닉네임는 필수 입력 사항입니다.";
      }
      if (value.length > 6) {
        return "닉네임은 최대 6자여야 합니다.";
      }
      return null;
    },

    email: (value) => {
      if (!value) {
        return "이메일은 필수 입력 사항입니다.";
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "이메일 형식을 유지해야 합니다.";
      }
      return null;
    },

    age: (value) => {
      if (!value) {
        return "나이는 필수 입력 사항입니다.";
      }
      const num = Number(value);
      if (num < 0) {
        return "나이는 0세 이상이어야 합니다.";
      }
      if (num > 99) {
        return "나이는 99세 이하이어야 합니다.";
      }
      return null;
    },

    introduce: (value) => {
      if (!value) {
        return "자기소개는 필수 입력 사항입니다.";
      }
      if (value.length > 50) {
        return "자기소개는 최대 50자여야 합니다.";
      }
      return null;
    }
  };

  /* -------------------------------
      실시간 Validation 적용
  -------------------------------- */
  registerForm.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", (e) => {
      const name = e.target.name;
      if (!validators[name]) {
        return;
      }

      const message = validators[name](e.target.value.trim());
      if (message) {
        showFieldError(e.target, name, message);
      } else {
        clearFieldError(e.target, name);
      }
    });
  });

  /* -------------------------------
      성별 Validation
  -------------------------------- */
  function validateGender() {
    const checked = document.querySelector('input[name="gender"]:checked');
    const errorDiv = document.querySelector(
        '.error-message[data-error="gender"]');

    if (!checked) {
      errorDiv.textContent = "성별은 필수 입력 사항입니다.";
      return false;
    } else {
      errorDiv.textContent = "";
      return true;
    }
  }

  document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener("change", validateGender);
  });

  /* -------------------------------
      회원가입 Submit
  -------------------------------- */
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    let hasError = false;

    // 1) 모든 input 검증 실행
    registerForm.querySelectorAll("input").forEach(input => {
      const name = input.name;
      if (!validators[name]) {
        return;
      }

      const msg = validators[name](input.value.trim());
      if (msg) {
        showFieldError(input, name, msg);
        hasError = true;
      }
    });

    // 2) 성별 검증
    if (!validateGender()) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // 3) 입력값 수집
    const body = {
      memberId: registerForm.username.value.trim(),
      memberPassword: registerForm.password.value.trim(),
      memberName: registerForm.nickname.value.trim(),
      memberEmail: registerForm.email.value.trim(),
      memberAge: registerForm.age.value.trim(),
      memberGender: document.querySelector(
          'input[name="gender"]:checked').value,
      memberIntro: registerForm.introduce.value.trim()
    };

    // 4) 서버 요청
    try {
      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (res.ok) {
        alert("회원가입 성공!");
        toggleForm(false);
      } else {
        // 백엔드 Validation 에러
        if (data.data && typeof data.data === 'object') {
          Object.entries(data.data).forEach(([field, message]) => {
            const input = registerForm.querySelector(`[name="${field}"]`);
            if (input) {
              showFieldError(input, field, message);
            }
          });
        } else {
          alert(data.message);
        }
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  });

  /* -------------------------------
      로그인 Submit
  -------------------------------- */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const memberId = loginForm.username.value.trim();
    const memberPassword = loginForm.password.value.trim();

    if (!memberId || !memberPassword) {
      return alert("아이디와 비밀번호를 입력하세요.");
    }

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({memberId, memberPassword})
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        alert("로그인 성공!");
        location.href = '/layout';
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("로그인 오류 발생");
    }
  });
});

/* -------------------------------
    폼 토글
-------------------------------- */
function toggleForm(isRegister) {
  const loginForm = document.getElementById('login-in');
  const registerForm = document.getElementById('login-up');

  loginForm.classList.toggle('none', isRegister);
  registerForm.classList.toggle('none', !isRegister);
}