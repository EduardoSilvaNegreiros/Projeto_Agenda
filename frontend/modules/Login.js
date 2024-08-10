import validator from "validator";

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        });
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passwordInput = el.querySelector('input[name="password"]');
        const emailError = el.querySelector('.email-error');
        const passwordError = el.querySelector('.password-error');

        let error = false;

        emailError.textContent = '';
        passwordError.textContent = '';

        if (!validator.isEmail(emailInput.value)) {
            emailError.textContent = 'E-mail inválido';
            error = true;
        }

        if (passwordInput.value.length < 3 || passwordInput.value.length > 30) {
            passwordError.textContent = 'A senha precisa ter entre 3 e 30 caracteres';
            error = true;
        }

        if (!error) el.submit();
    }
}
