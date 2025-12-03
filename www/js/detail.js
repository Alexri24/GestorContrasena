// Archivo: www/js/detail.js

import { Api } from './api.js';
import { Modal } from './modal.js';

const api = new Api();
const modal = new Modal();

// Obtener el ID de la categoría desde la URL (?catId=123)
const params = new URLSearchParams(window.location.search);
const catId = params.get('catId');

// Si no hay ID, no deberíamos estar aquí -> volver al inicio
if (!catId) {
    alert("Error de navegación");
    window.location.href = 'index.html';
}

// Referencias DOM
const form = document.getElementById('siteForm');
const btnCancel = document.getElementById('btnCancel');
const btnGenPass = document.getElementById('btnGenPass');
const passwordInput = document.getElementById('password');

// --- VALIDACIONES DINÁMICAS (Requisito Extra: evento blur) ---
const inputsRequeridos = document.querySelectorAll('input[required]');

inputsRequeridos.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === "") {
            input.classList.add('error'); // Añade borde rojo (definido en CSS)
        } else {
            input.classList.remove('error');
        }
    });
    
    // Opcional: Quitar el rojo en cuanto el usuario empiece a escribir
    input.addEventListener('input', () => {
        input.classList.remove('error');
    });
});

// --- GENERADOR DE CONTRASEÑA (Requisito Extra) ---
btnGenPass.addEventListener('click', () => {
    const longitud = 10;
    const caracteres = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
    let passGenerada = "";

    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        passGenerada += caracteres.charAt(indice);
    }

    passwordInput.value = passGenerada;
    // Quitamos error visual si lo tenía
    passwordInput.classList.remove('error');
});

// --- CANCELAR ---
btnCancel.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// --- GUARDAR (SUBMIT) ---
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue sola

    // Recogemos valores
    const name = document.getElementById('name').value.trim();
    const url = document.getElementById('url').value.trim();
    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('password').value.trim();
    const description = document.getElementById('description').value.trim();

    // Validación extra por seguridad (aunque HTML required ya ayuda)
    if (!name || !user || !password) {
        modal.alert("Datos incompletos", "Por favor revisa los campos obligatorios marcados en rojo.");
        
        // Marcar manualmente los vacíos
        if(!name) document.getElementById('name').classList.add('error');
        if(!user) document.getElementById('user').classList.add('error');
        if(!password) document.getElementById('password').classList.add('error');
        
        return;
    }

    // Objeto a enviar al servidor
    const newSite = {
        name: name,
        url: url,
        user: user,
        password: password,
        description: description,
        categoryId: parseInt(catId) // Importante: la API espera un número entero
    };

    // Llamada a la API
    const resultado = await api.createSite(newSite);

    if (resultado) {
        // Si todo va bien, volvemos a la pantalla principal
        window.location.href = 'index.html';
    } else {
        modal.alert("Error", "No se pudo guardar el sitio. Inténtalo de nuevo.");
    }
});