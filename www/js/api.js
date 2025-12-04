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
            
            // Si la respuesta no es OK (ej: 404 o 500), lanzamos error para capturarlo abajo
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const mensajeError = errorData.error || response.statusText;
                throw new Error(mensajeError); 
            }

            // Los métodos DELETE a veces no devuelven contenido JSON, devolvemos true
            if (method === 'DELETE') {
                return true;
            }

            return await response.json();
        } catch (error) {
            console.error("Fallo en API:", error);
            // Devolvemos un objeto indicando que hubo error, para que el front lo sepa
            return { error: true, message: error.message };
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

   // --- MÉTODOS DE SITES (CONTRASEÑAS) ---

   async createSite(siteData) {
    // CORRECCIÓN: El servidor espera el POST en /categories/ID_CATEGORIA
    // Tu código lo enviaba a /sites (que no existe para crear).
    
    const catId = siteData.categoryId; 
    // Enviamos la petición a la URL correcta:
    return await this.request(`/categories/${catId}`, 'POST', siteData);
}
}