// Archivo: www/js/index.js

import { Api } from './api.js';
import { Modal } from './modal.js';

// Instanciamos nuestras clases de ayuda
const api = new Api();
const modal = new Modal();

// Estado de la aplicación
let allCategories = [];    // Guardamos copia local para el buscador
let currentCategoryId = null; // ID de la categoría seleccionada actualmente

// Referencias al DOM
const categoriesList = document.getElementById('categoriesList');
const sitesBody = document.getElementById('sitesBody');
const btnAddCategory = document.getElementById('btnAddCategory');
const btnAddSite = document.getElementById('btnAddSite');
const searchInput = document.getElementById('searchInput');

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    // Llamada a la API usando nuestra clase
    const result = await api.getCategories();
    if (result) {
        allCategories = result; // Guardamos para el filtro
        renderCategories(allCategories);
    } else {
        modal.alert("Error", "No se pudo conectar con el servidor.");
    }
}

// --- RENDERIZADO (PINTAR EN PANTALLA) ---

function renderCategories(list) {
    categoriesList.innerHTML = ''; // Limpiamos la lista actual

    list.forEach(cat => {
        const li = document.createElement('li');
        
        // Estructura interna del LI: Nombre + Botón Borrar
        li.innerHTML = `
            <span>📁 ${cat.name}</span>
            <button class="btn-del-cat" title="Eliminar categoría">🗑️</button>
        `;
        
        // Si esta categoría es la seleccionada, le ponemos la clase active
        if (currentCategoryId === cat.id) {
            li.classList.add('active');
        }

        // EVENTO 1: CLICK EN CATEGORÍA (Seleccionar)
        li.addEventListener('click', (e) => {
            // Importante: Si hago click en el botón borrar, NO quiero seleccionar la categoría
            if(e.target.classList.contains('btn-del-cat')) return;

            selectCategory(cat.id);
        });

        // EVENTO 2: CLICK EN BORRAR CATEGORÍA
        const deleteBtn = li.querySelector('.btn-del-cat');
        deleteBtn.addEventListener('click', async () => {
            const confirmacion = await modal.confirm(
                "Eliminar Categoría", 
                `¿Estás seguro de borrar "${cat.name}" y todos sus datos?`
            );

            if (confirmacion) {
                await api.deleteCategory(cat.id);
                // Si borramos la categoría activa, reseteamos la vista
                if (currentCategoryId === cat.id) {
                    currentCategoryId = null;
                    sitesBody.innerHTML = '<tr><td colspan="4" style="text-align:center">Selecciona una categoría...</td></tr>';
                }
                loadData(); // Recargar lista
            }
        });

        categoriesList.appendChild(li);
    });
}

// Función para marcar categoría activa y cargar sus sites
async function selectCategory(id) {
    currentCategoryId = id;
    
    // Actualizamos visualmente la lista (clase .active)
    const items = categoriesList.querySelectorAll('li');
    // Como el orden es el mismo que allCategories, podemos buscar por índice o repintar
    // Para simplificar y asegurar, repintamos marcando el active
    renderCategories(allCategories);

    // Pedimos a la API los detalles (sites) de esta categoría
    const categoryData = await api.getCategoryById(id);
    
    if (categoryData && categoryData.sites) {
        renderSites(categoryData.sites);
    }
}

function renderSites(sites) {
    sitesBody.innerHTML = ''; // Limpiar tabla

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

        // EVENTO: BORRAR SITE
        const delBtn = tr.querySelector('.btn-del-site');
        delBtn.addEventListener('click', async () => {
            const confirmacion = await modal.confirm(
                "Eliminar Contraseña", 
                `¿Borrar definitivamente el acceso a "${site.name}"?`
            );

            if (confirmacion) {
                await api.deleteSite(site.id);
                // Recargamos solo los sites de la categoría actual
                selectCategory(currentCategoryId);
            }
        });

        sitesBody.appendChild(tr);
    });
}

// --- BOTONES GLOBALES Y BUSCADOR ---

// 1. Añadir Categoría
btnAddCategory.addEventListener('click', async () => {
    // Usamos nuestro modal.prompt en vez de window.prompt
    const nombre = await modal.prompt("Nueva Categoría", "Ej: Redes Sociales");
    
    if (nombre) {
        await api.createCategory(nombre);
        loadData();
    }
});

// 2. Añadir Site (Navegación)
btnAddSite.addEventListener('click', () => {
    if (!currentCategoryId) {
        modal.alert("Atención", "⚠️ Primero debes seleccionar una categoría de la lista izquierda.");
        return;
    }
    // Redirigimos pasando el ID por la URL
    window.location.href = `detail.html?catId=${currentCategoryId}`;
});

// 3. Buscador (Filtro local)
searchInput.addEventListener('keyup', (e) => {
    const texto = e.target.value.toLowerCase();
    
    // Filtramos el array local allCategories
    const filtrados = allCategories.filter(cat => 
        cat.name.toLowerCase().includes(texto)
    );
    
    renderCategories(filtrados);
});