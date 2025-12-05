
import { Api } from './api.js';
import { Modal } from './modal.js';

const api = new Api();
const modal = new Modal();

let allCategories = [];    
let currentCategoryId = null; 

const categoriesList = document.getElementById('categoriesList');
const sitesBody = document.getElementById('sitesBody');
const btnAddCategory = document.getElementById('btnAddCategory');
const btnAddSite = document.getElementById('btnAddSite');
const searchInput = document.getElementById('searchInput');


document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {

    const result = await api.getCategories();
    if (result) {
        allCategories = result; 
        renderCategories(allCategories);
    } else {
        modal.alert("Error", "No se pudo conectar con el servidor.");
    }
}


function renderCategories(list) {
    categoriesList.innerHTML = '';
    list.forEach(cat => {
        const li = document.createElement('li');
        
        li.innerHTML = `
            <span>📁 ${cat.name}</span>
            <button class="btn-del-cat" title="Eliminar categoría">🗑️</button>
        `;
        
        if (currentCategoryId === cat.id) {
            li.classList.add('active');
        }

        li.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-del-cat')) return;

            selectCategory(cat.id);
        });

        const deleteBtn = li.querySelector('.btn-del-cat');
        deleteBtn.addEventListener('click', async () => {
            const confirmacion = await modal.confirm(
                "Eliminar Categoría", 
                `¿Estás seguro de borrar "${cat.name}" y todos sus datos?`
            );

            if (confirmacion) {
                await api.deleteCategory(cat.id);
                if (currentCategoryId === cat.id) {
                    currentCategoryId = null;
                    sitesBody.innerHTML = '<tr><td colspan="4" style="text-align:center">Selecciona una categoría...</td></tr>';
                }
                loadData(); 
            }
        });

        categoriesList.appendChild(li);
    });
}

async function selectCategory(id) {
    currentCategoryId = id;
    
    const items = categoriesList.querySelectorAll('li');
    renderCategories(allCategories);

    const categoryData = await api.getCategoryById(id);
    
    if (categoryData && categoryData.sites) {
        renderSites(categoryData.sites);
    }
}

function renderSites(sites) {
    sitesBody.innerHTML = ''; 

    if (sites.length === 0) {
        sitesBody.innerHTML = '<tr><td colspan="4" style="text-align:center">Esta categoría está vacía. ¡Añade un site!</td></tr>';
        return;
    }

    sites.forEach(site => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${site.name}</strong></td>
            <td>${site.user}</td>
            <td>${new Date(site.createdAt).toLocaleDateString()}</td>
            <td>
                <a href="${site.url}" target="_blank" class="btn btn-blue" style="padding:2px 8px; text-decoration:none;">Ir</a>
                <button class="btn-del-site btn btn-red" style="padding:2px 8px;">X</button>
            </td>
        `;

        const delBtn = tr.querySelector('.btn-del-site');
        delBtn.addEventListener('click', async () => {
            const confirmacion = await modal.confirm(
                "Eliminar Contraseña", 
                `¿Borrar definitivamente el acceso a "${site.name}"?`
            );

            if (confirmacion) {
                await api.deleteSite(site.id);
                selectCategory(currentCategoryId);
            }
        });

        sitesBody.appendChild(tr);
    });
}


btnAddCategory.addEventListener('click', async () => {
    const nombre = await modal.prompt("Nueva Categoría", "Ej: Redes Sociales");
    
    if (nombre) {
        await api.createCategory(nombre);
        loadData();
    }
});

btnAddSite.addEventListener('click', () => {
    if (!currentCategoryId) {
        modal.alert("Atención", "⚠️ Primero debes seleccionar una categoría de la lista izquierda.");
        return;
    }
    window.location.href = `detail.html?catId=${currentCategoryId}`;
});

searchInput.addEventListener('keyup', (e) => {
    const texto = e.target.value.toLowerCase();
    
    const filtrados = allCategories.filter(cat => 
        cat.name.toLowerCase().includes(texto)
    );
    
    renderCategories(filtrados);
});