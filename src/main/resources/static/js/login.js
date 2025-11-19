document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById('login-in');
  const registerForm = document.getElementById('login-up');

  // ------------------------
  // 로그인 처리
  // ------------------------
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const memberId = loginForm.username.value.trim();
    const memberPassword = loginForm.password.value.trim();

    if (!memberId || !memberPassword) {
      return alert('아이디와 비밀번호를 입력하세요.');
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
        localStorage.setItem('memberId', memberId);

        console.log("member = ", memberId);

        window.location.href = '/layout'; // 로그인 후 이동 경로
      } else {
        alert(data.message || '로그인 실패');
      }
    } catch (err) {
      console.error(err);
      alert('로그인 중 오류가 발생했습니다.');
    }
  });
});
// ------------------------
// 회원가입 처리
// ------------------------
// ------------------------
// 폼 토글 함수
// ------------------------
function toggleForm(isRegister) {
  const loginForm = document.getElementById('login-in');
  const registerForm = document.getElementById('login-up');

  if (isRegister) {
    loginForm.classList.add('none');
    registerForm.classList.remove('none');
  } else {
    loginForm.classList.remove('none');
    registerForm.classList.add('none');
  }
}
