import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Login from './modules/Login';

// Inicializa o formulário de cadastro
const cadastroForm = new Login('.form-cadastro');
cadastroForm.init();

// Inicializa o formulário de login
const loginForm = new Login('.form-login');
loginForm.init();

