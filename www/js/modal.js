// Archivo: www/js/modal.js

export class Modal {
    constructor() {
        // Capturamos los elementos del DOM que pusimos en el HTML
        this.overlay = document.getElementById('customModal');
        this.title = document.getElementById('modalTitle');
        this.message = document.getElementById('modalMessage');
        this.input = document.getElementById('modalInput');
        this.btnOk = document.getElementById('modalOkBtn');
        this.btnCancel = document.getElementById('modalCancelBtn');
    }

    // Cierra el modal ocultando el overlay
    close() {
        this.overlay.classList.remove('show');
    }

    // Muestra el modal añadiendo la clase CSS 'show'
    show() {
        this.overlay.classList.add('show');
    }

    // --- TIPO 1: ALERTA (Sustituye a window.alert) ---
    alert(titulo, mensaje) {
        return new Promise((resolve) => {
            this.title.innerText = titulo;
            this.message.innerText = mensaje;
            
            // Configuración visual
            this.message.style.display = 'block';
            this.input.style.display = 'none';
            this.btnCancel.style.display = 'none'; // Alerta solo tiene OK
            this.btnOk.innerText = 'Entendido';

            this.show();

            // Al hacer click, cerramos y resolvemos la promesa
            this.btnOk.onclick = () => {
                this.close();
                resolve(true);
            };
        });
    }

    // --- TIPO 2: CONFIRMACIÓN (Sustituye a window.confirm) ---
    confirm(titulo, mensaje) {
        return new Promise((resolve) => {
            this.title.innerText = titulo;
            this.message.innerText = mensaje;

            // Configuración visual
            this.message.style.display = 'block';
            this.input.style.display = 'none';
            this.btnCancel.style.display = 'block'; // Necesitamos botón cancelar
            this.btnOk.innerText = 'Sí, confirmar';

            this.show();

            // Opción SI
            this.btnOk.onclick = () => {
                this.close();
                resolve(true);
            };
            // Opción NO
            this.btnCancel.onclick = () => {
                this.close();
                resolve(false);
            };
        });
    }

    // --- TIPO 3: INPUT (Sustituye a window.prompt) ---
    prompt(titulo, placeholder = "") {
        return new Promise((resolve) => {
            this.title.innerText = titulo;
            
            // Configuración visual
            this.message.style.display = 'none'; // Ocultamos mensaje
            this.input.style.display = 'block';  // Mostramos input
            this.input.value = '';               // Limpiamos input anterior
            this.input.placeholder = placeholder;
            this.btnCancel.style.display = 'block';
            this.btnOk.innerText = 'Guardar';

            this.show();
            this.input.focus(); // Ponemos el foco para escribir rápido

            // Guardar
            this.btnOk.onclick = () => {
                const val = this.input.value.trim();
                if (!val) return; // No permitimos guardar vacío
                this.close();
                resolve(val);
            };

            // Cancelar
            this.btnCancel.onclick = () => {
                this.close();
                resolve(null);
            };
        });
    }
}