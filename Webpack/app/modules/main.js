import '../styles/index.css'
import '../styles/general.css'
import './auth/auth.js'
import './auction/index.js'
import { login, makeRegister } from './auth/auth.js';
import { test } from './auction/index.js';

window.isAuthenticated = false;

// Инициализатор событий
function initHandlers() {
  const loginBtn = document.querySelector(".login-button");
  if (loginBtn) loginBtn.addEventListener('click', login);

  const question = document.querySelector(".question");
  if (question) question.addEventListener('click', makeRegister);

  const testBtn = document.querySelector(".test-button");
  if (testBtn) testBtn.addEventListener('click', test);
}


document.addEventListener("DOMContentLoaded", async () => {
  initHandlers();

  const isAuthenticated = await checkAuth();
  const path = window.location.pathname;

  if (isAuthenticated && path === '/auth') {
    window.location.href = '/';
  } else if (!isAuthenticated && path !== '/auth') {
    window.location.href = '/auth';
  }
});

async function checkAuth(){
  try{

    const response = await fetch('https://localhost:7076/api/auth/check', { 
      method: "GET",
      credentials: 'include' });

    return response.ok ? true : false;
  }
  catch (ex){
    console.log("error occurred: " + ex)  
    return false;
  } 
}


