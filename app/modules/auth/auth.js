

export async function login() {
  document.querySelectorAll(".error-message").forEach(el => el.innerText = "");

  const username = document.querySelector("#username-input").value;
  const password = document.querySelector("#password-input").value;

  const error = findEmptyValues({"username": username, "password": password});

  if (error != null) {
    const p = document.getElementById(error + "Error");
    p.textContent = error.replace(/^\w/, c => c.toUpperCase()) + " не может быть пустым";
    return;
}

  const result = await fetch("https://localhost:7076/api/auth/login", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
       
    },
    credentials: 'include',
    body: JSON.stringify({
      Username: username,
      Password: password
    })
  });

  if (result.ok){
    window.isAuthenticated = true
    window.location.href = '/';

  }else{
    const textError = await result.text();

    document.querySelector(".server-error").textContent = textError;
    document.querySelector(".server-error").removeAttribute("hidden");
  }
    
}

export async function registration() {
  document.querySelectorAll(".error-message").forEach(el => el.innerText = "");

  const username = document.querySelector("#username-input").value;
  const email = document.querySelector("#email-input").value;
  const password = document.querySelector("#password-input").value;

  const error = findEmptyValues({"username": username, "email": email, "password": password });

  if (error != null) {
    const p = document.getElementById(error + "Error");
    p.textContent = error.replace(/^\w/, c => c.toUpperCase()) + " не может быть пустым";
    return;
}

  const result = await fetch("https://localhost:7076/api/auth/register", {
    method: "POST",
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
       
    },
    body: JSON.stringify({
      Username: username,
      Email: email,
      Password: password
    })
  });

  if (!result.ok){
    const textError = await result.text();

    document.querySelector(".server-error").textContent = textError;
    document.querySelector(".server-error").removeAttribute("hidden");
  }
    
}

export function makeRegister() {
  document.querySelectorAll(".error-message").forEach(el => el.innerText = "");

  document.querySelector(".method").textContent = "Регистрация";
  document.querySelector(".question").textContent = "Вы уже зарегистрированы?";

  // Удаляем старый обработчик
  const question = document.querySelector(".question");
  question.replaceWith(question.cloneNode(true));
  document.querySelector(".question").addEventListener('click', makeLogin);

  const button = document.querySelector(".login-button") || document.querySelector(".registration-button");
  button.textContent = "Зарегистрироваться";
  button.setAttribute("class", "registration-button");
  button.onclick = registration;

  // Добавляем поле email, если его нет
  if (!document.querySelector(".email-input-con")) {
    const emailDiv = document.createElement("div");
    emailDiv.className = "email-input-con";
    emailDiv.innerHTML = `
      <label for="email-input">Почта</label>
      <input type="email" id="email-input">
      <p class="error-message" id="emailError"></p>
    `;

    const passwordBlock = document.querySelector(".password-input-con");
    passwordBlock.parentNode.insertBefore(emailDiv, passwordBlock);
  }
}

export function makeLogin() {
  document.querySelectorAll(".error-message").forEach(el => el.innerText = "");

  document.querySelector(".method").textContent = "Логин";
  document.querySelector(".question").textContent = "Вы еще не зарегистрированы?";

  // Удаляем старый обработчик
  const question = document.querySelector(".question");
  question.replaceWith(question.cloneNode(true));
  document.querySelector(".question").addEventListener('click', makeRegister);

  const button = document.querySelector(".registration-button") || document.querySelector(".login-button");
  button.textContent = "Логин";
  button.setAttribute("class", "login-button");
  button.onclick = login;

  // Удаляем email-блок, если он есть
  const emailBlock = document.querySelector(".email-input-con");
  if (emailBlock) {
    emailBlock.remove();
  }
}



function findEmptyValues(fields){
  for (var fieldName in fields) {

    if (!fields.hasOwnProperty(fieldName)) continue;

    var fieldValue = fields[fieldName];

    if (fieldValue == "") {
        return fieldName;
    }
  }
}
