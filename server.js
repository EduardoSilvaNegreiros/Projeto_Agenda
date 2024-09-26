require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env para process.env
const express = require('express'); // Importa o framework Express
const app = express(); // Cria uma instância do Express para gerenciar o servidor

const mongoose = require('mongoose'); // Importa o Mongoose, uma biblioteca para interagir com o MongoDB

// Conecta ao MongoDB usando a string de conexão fornecida pela variável de ambiente CONNECTIONSTRING
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        app.emit('pronto'); // Emite um evento 'pronto' quando a conexão com o banco de dados é bem-sucedida
    })
    .catch(e => console.log(e)); // Caso haja erro na conexão, o erro é exibido no console

const session = require('express-session'); // Importa o express-session para gerenciar sessões
const MongoStore = require('connect-mongo'); // Usado para armazenar sessões no MongoDB
const flash = require('connect-flash'); // Usado para exibir mensagens temporárias, como alertas de sucesso/erro

const routes = require('./routes'); // Importa o arquivo de rotas da aplicação
const path = require('path'); // Importa o módulo path para trabalhar com caminhos de arquivos
const csrf = require('csurf'); // Importa o csurf para proteção contra ataques CSRF

// Importa middlewares personalizados
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

// Permite que o Express entenda requisições com corpo de formulário (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Permite que o Express lide com requisições com corpo em JSON (application/json)
app.use(express.json());

// Define a pasta de arquivos estáticos (CSS, JavaScript, imagens)
app.use(express.static(path.resolve(__dirname, 'public')));

// Configura as opções da sessão, incluindo onde serão armazenadas (MongoDB), tempo de duração e segurança
const sessionOptions = session({
    secret: 'sasasas', // Chave secreta usada para assinar a sessão (pode ser qualquer string)
    store: new MongoStore({ mongoUrl: process.env.CONNECTIONSTRING }), // Armazena as sessões no MongoDB
    resave: false, // Evita salvar a sessão novamente se não houver mudanças
    saveUninitialized: false, // Não cria sessões vazias automaticamente
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // Define que o cookie da sessão vai durar 7 dias
        httpOnly: true // Garante que o cookie não seja acessível via JavaScript no navegador
    }
});

app.use(sessionOptions); // Aplica as configurações de sessão
app.use(flash()); // Aplica o middleware para mensagens flash (temporárias)

// Define a pasta onde ficam as views e o motor de templates (EJS) que será usado
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs'); // Define o EJS como motor de renderização de views

app.use(csrf()); // Ativa a proteção CSRF para todas as rotas
app.use(middlewareGlobal); // Aplica um middleware global
app.use(checkCsrfError); // Verifica se há erros relacionados ao CSRF
app.use(csrfMiddleware); // Injeta o token CSRF nas views

app.use(routes); // Aplica o arquivo de rotas, que define todas as URLs da aplicação

// Quando o evento 'pronto' é emitido (após a conexão com o banco de dados), o servidor começa a ouvir a porta 3000
app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000'); // Informa o endereço local do servidor
        console.log('Servidor rodando na porta 3000'); // Exibe no console que o servidor está funcionando
    });
});
