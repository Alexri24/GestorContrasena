
export class Api {
    constructor() {
        this.baseUrl = "http://localhost:3000";
    }

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
                const errorData = await response.json().catch(() => ({}));
                const mensajeError = errorData.error || response.statusText;
                throw new Error(mensajeError); 
            }

            if (method === 'DELETE') {
                return true;
            }

            return await response.json();
        } catch (error) {
            console.error("Fallo en API:", error);
            return { error: true, message: error.message };
        }
    }


    async getCategories() {
        return await this.request('/categories');
    }

    async getCategoryById(id) {
        return await this.request(`/categories/${id}`);
    }

    async createCategory(name) {
        return await this.request('/categories', 'POST', { name });
    }

    async deleteCategory(id) {
        return await this.request(`/categories/${id}`, 'DELETE');
    }



   async createSite(siteData) {
    
    const catId = siteData.categoryId; 
    return await this.request(`/categories/${catId}`, 'POST', siteData);
}
}