// --- Cadastro de usuário ---
function cadastrarUsuario(event) {
  event.preventDefault();
  const nome = document.getElementById('cad-nome')?.value.trim();
  const email = document.getElementById('cad-email')?.value.trim();
  const senha = document.getElementById('cad-senha')?.value;
  const confirma = document.getElementById('cad-confirma')?.value;

  if (!nome || !email || !senha || !confirma) return;

  if (senha !== confirma) {
    alert('As senhas não coincidem!');
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  if (usuarios.find(u => u.email === email)) {
    alert('E-mail já cadastrado!');
    return;
  }

  usuarios.push({ nome, email, senha });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  alert('Cadastro realizado com sucesso!');
  window.location.href = 'login.html';
}

// --- Função de busca (ligada ao dados.json) ---
async function buscarConteudo(termo) {
  try {
    const resposta = await fetch('dados.json'); // arquivo deve estar na mesma pasta que home.html
    if (!resposta.ok) throw new Error('Erro ao carregar dados.json');
    const dados = await resposta.json();

    termo = termo.toLowerCase();
    return dados.filter(item =>
      item.titulo.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(termo)))
    );
  } catch (erro) {
    console.error('Erro na busca:', erro);
    return [];
  }
}

// --- Função para mostrar resultados na home ---
async function mostrarResultados() {
  const campo = document.getElementById('busca');
  if (!campo) return;

  const termo = campo.value.trim();
  const container = document.getElementById('resultados');
  if (!termo) {
    container.innerHTML = '';
    return;
  }

  const resultados = await buscarConteudo(termo);

  if (resultados.length === 0) {
    container.innerHTML = '<p>Nenhum resultado encontrado.</p>';
    return;
  }

  container.innerHTML = resultados.map(item => `
    <div style="margin: 10px 0; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
      <h3><a href="${item.link}">${item.titulo}</a></h3>
      <p>${item.descricao}</p>
    </div>
  `).join('');
}

// --- Login de usuário ---
function loginUsuario(event) {
  event.preventDefault();
  const email = document.getElementById('login-email')?.value.trim();
  const senha = document.getElementById('login-senha')?.value;

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    window.location.href = 'home.html';
  } else {
    alert('E-mail ou senha incorretos!');
  }
}

// --- Carregar home ---
function carregarHome() {
  const nomeSpan = document.getElementById('nome-usuario');
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (usuarioLogado) {
    nomeSpan.textContent = usuarioLogado.nome;
  } else {
    window.location.href = 'login.html';
  }
}

// --- Logout ---
function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}

// --- Event listeners ---
const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) formCadastro.addEventListener('submit', cadastrarUsuario);

const formLogin = document.getElementById('form-login');
if (formLogin) formLogin.addEventListener('submit', loginUsuario);

const btnLogout = document.getElementById('btn-logout');
if (btnLogout) btnLogout.addEventListener('click', logout);

if (document.getElementById('nome-usuario')) carregarHome();