// Archivo: www/js/api.js

export class Api {
    constructor() {
        this.baseUrl = "http://localhost:3000";
    }

    // Método centralizado para hacer fetch. Gestiona errores y cabeceras.
    async request(endpoint, method = 'GET', body = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, options);
            
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.statusText}`);
            }

            // Los métodos DELETE a veces no devuelven contenido JSON, devolvemos true
            if (method === 'DELETE') {
                return true;
            }

            return await response.json();
        } catch (error) {
            console.error("Fallo en API:", error);
            // Si falla la conexión, devolvemos null para gestionarlo en la UI
            return null;
        }
    }

    // --- MÉTODOS DE CATEGORÍAS ---

    async getCategories() {
        return await this.request('/categories');
    }

    // Obtener una categoría por ID (incluye sus sites dentro)
    async getCategoryById(id) {
        return await this.request(`/categories/${id}`);
    }

    async createCategory(name) {
        return await this.request('/categories', 'POST', { name });
    }

    async deleteCategory(id) {
        return await this.request(`/categories/${id}`, 'DELETE');
    }

    // --- MÉTODOS DE SITES (CONTRASEÑAS) ---

    async createSite(siteData) {
        // siteData espera: { name, user, password, url, description, categoryId }
        return await this.request('/sites', 'POST', siteData);
    }

    async deleteSite(id) {
        return await this.request(`/sites/${id}`, 'DELETE');
    }
}