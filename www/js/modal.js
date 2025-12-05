
export class Modal {
    constructor() {
        this.overlay = document.getElementById('customModal');
        this.title = document.getElementById('modalTitle');
        this.message = document.getElementById('modalMessage');
        this.input = document.getElementById('modalInput');
        this.btnOk = document.getElementById('modalOkBtn');
        this.btnCancel = document.getElementById('modalCancelBtn');
    }

    close() {
        this.overlay.classList.remove('show');
    }

    show() {
        this.overlay.classList.add('show');
    }

    alert(titulo, mensaje) {
        return new Promise((resolve) => {
            this.title.innerText = titulo;
            this.message.innerText = mensaje;
            
            this.message.style.display = 'block';
            this.input.style.display = 'none';
            this.btnCancel.style.display = 'none'; 
            this.btnOk.innerText = 'Entendido';

            this.show();

            this.btnOk.onclick = () => {
                this.close();
                resolve(true);
            };
        });
    }

    confirm(titulo, mensaje) {
        return new Promise((resolve) => {
            this.title.innerText = titulo;
            this.message.innerText = mensaje;

            this.message.style.display = 'block';
            this.input.style.display = 'none';
            this.btnCancel.style.display = 'block'; 
            this.btnOk.innerText = 'Sí, confirmar';

            this.show();

            this.btnOk.onclick = () => {
                this.close();
                resolve(true);
            };
            this.btnCancel.onclick = () => {
                this.close();
                resolve(false);
            };
        });
    }

    prompt(titulo, placeholder = "") {
        return new Promise((resolve) => {
            this.title.innerText = titulo;
            
            this.message.style.display = 'none'; 
            this.input.style.display = 'block';  
            this.input.value = '';               
            this.input.placeholder = placeholder;
            this.btnCancel.style.display = 'block';
            this.btnOk.innerText = 'Guardar';

            this.show();
            this.input.focus(); 

            
            this.btnOk.onclick = () => {
                const val = this.input.value.trim();
                if (!val) return; 
                this.close();
                resolve(val);
            };

            
            this.btnCancel.onclick = () => {
                this.close();
                resolve(null);
            };
        });
    }
}