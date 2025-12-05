
import { Api } from './api.js';
import { Modal } from './modal.js';

const api = new Api();
const modal = new Modal();

const params = new URLSearchParams(window.location.search);
const catId = params.get('catId');

if (!catId) {
    alert("Error de navegación");
    window.location.href = 'index.html';
}

const form = document.getElementById('siteForm');
const btnCancel = document.getElementById('btnCancel');
const btnGenPass = document.getElementById('btnGenPass');
const passwordInput = document.getElementById('password');

const inputsRequeridos = document.querySelectorAll('input[required]');

inputsRequeridos.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === "") {
            input.classList.add('error'); 
        } else {
            input.classList.remove('error');
        }
    });
    
    input.addEventListener('input', () => {
        input.classList.remove('error');
    });
});

btnGenPass.addEventListener('click', () => {
    const longitud = 10;
    const caracteres = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*";
    let passGenerada = "";

    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        passGenerada += caracteres.charAt(indice);
    }

    passwordInput.value = passGenerada;
    passwordInput.classList.remove('error');
});

btnCancel.addEventListener('click', () => {
    window.location.href = 'index.html';
});

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const name = document.getElementById('name').value.trim();
    const url = document.getElementById('url').value.trim();
    const user = document.getElementById('user').value.trim();
    const password = document.getElementById('password').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!name || !user || !password) {
        modal.alert("Datos incompletos", "Por favor revisa los campos obligatorios marcados en rojo.");
        
        if(!name) document.getElementById('name').classList.add('error');
        if(!user) document.getElementById('user').classList.add('error');
        if(!password) document.getElementById('password').classList.add('error');
        
        return;
    }

    const newSite = {
        name: name,
        url: url,
        user: user,
        password: password,
        description: description,
        categoryId: parseInt(catId) 
    };

    const resultado = await api.createSite(newSite);

    if (resultado) {
        window.location.href = 'index.html';
    } else {
        modal.alert("Error", "No se pudo guardar el sitio. Inténtalo de nuevo.");
    }
});