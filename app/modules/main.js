import '../styles/index.css'
import '../styles/general.css'
import '../styles/personal.css'
import '../styles/auction.css'
import './auth/auth.js'
import './product/product.js'
import './auction/auction.js'
import { login, makeRegister, logout } from './auth/auth.js';
import { createProduct } from './product/product.js'


async function initHandlers() {
  const loginBtn = document.querySelector(".login-button");
  if (loginBtn) loginBtn.onclick = login;

  const question = document.querySelector(".question");
  if (question) question.onclick = makeRegister;

  const productForm = document.querySelector("#productForm");
  if (productForm) {
    productForm.addEventListener("submit", async (event) => {
      await createProduct(event);
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await initHandlers();

  const isAuthenticated = await checkAuth();
  const path = window.location.pathname;

  if(isAuthenticated){
    const logoutButton = document.querySelector(".logout-button-header");
    logoutButton.onclick = logout;
    logoutButton.removeAttribute("hidden");
  }
  if(!isAuthenticated){
    document.querySelector(".logout-button-header").hidden = true;
  }

  if (isAuthenticated && path === '/auth') {
    window.location.href = '/';
  } else if (!isAuthenticated && path !== '/auth') {
    window.location.href = '/auth';
  } 

});

async function checkAuth() {
  try {
    const response = await fetch('https://localhost:7076/api/auth/check', { 
      method: "GET",
      credentials: 'include' 
    });
    return response.ok;
  } catch (ex) {
    console.log("Auth check error:", ex);
    return false;
  } 
}