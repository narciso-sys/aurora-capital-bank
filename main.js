// Inicialização da aplicação
window.addEventListener('load', () => {
    // Esconder o loading imediatamente
    hideLoading();
    
    // Verificar se o Firebase está disponível
    if (!window.firebase || !window.firebase.auth || !window.firebase.db) {
        document.getElementById('app').innerHTML = `
            <div class="auth-container">
                <div class="glass-panel" style="text-align: center; padding: 2rem;">
                    <h2>Erro de Conexão</h2>
                    <p>Não foi possível conectar aos serviços do banco.</p>
                    <p>Por favor, verifique sua conexão com a internet e tente novamente.</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i data-lucide="refresh-cw"></i> Tentar Novamente
                    </button>
                </div>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    // Aplicar tema salvo
    applySavedTheme();
    
    // Inicializar o gerenciador de autenticação
    try {
        window.authManager.initialize();
    } catch (error) {
        console.error("Erro fatal ao inicializar a aplicação:", error);
        hideLoading();
        document.getElementById('app').innerHTML = `
            <div class="auth-container">
                <div class="glass-panel" style="text-align: center; padding: 2rem;">
                    <h2>Erro de Inicialização</h2>
                    <p>Desculpe, ocorreu um erro ao iniciar a aplicação.</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i data-lucide="refresh-cw"></i> Recarregar
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    // Configurar listeners de eventos
    window.addEventListener('hashchange', () => {
        if (window.authManager) {
            window.authManager.renderPage();
        }
    });

    // Configurar botões globais
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (window.authManager) {
                showLoading();
                await window.authManager.logout();
            }
        });
    }
    
    const aiHelpFab = document.getElementById('ai-help-fab');
    if (aiHelpFab) {
        aiHelpFab.addEventListener('click', openAIAssistant);
    }
    
    // Configurar botão de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Garantir que o loading não fique infinito
    setTimeout(() => {
        hideLoading();
        if (!window.authManager?.initialized) {
            console.warn("Inicialização demorada. Renderizando fallback.");
            if (window.authManager) {
                window.authManager.renderAuthScreen();
            }
        }
    }, 8000);
});

// Funções de tema
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        showToast("Tema claro ativado!", "info");
    } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        showToast("Tema escuro ativado!", "info");
    }
}

// Funções utilitárias
function generateUniqueId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Assistente IA (Gemini)
function openAIAssistant() {
    const modalContent = `
        <div class="ai-chat-window">
            <div class="ai-messages" id="ai-messages">
                <div class="ai-message bot">Olá! Sou a Aurora, sua assistente financeira. Como posso ajudar hoje?</div>
            </div>
            <form class="ai-input-form" id="ai-input-form">
                <div class="input-group">
                    <i data-lucide="message-circle"></i>
                    <input type="text" id="ai-user-input" placeholder="Pergunte sobre suas finanças..." required>
                </div>
                <button type="submit" class="btn btn-primary"><i data-lucide="send"></i></button>
            </form>
        </div>
    `;
    createModal({ text: 'Assistente Aurora IA', icon: 'sparkles' }, modalContent, []);
    document.getElementById('ai-input-form').addEventListener('submit', handleAIChatSubmit);
}

function handleAIChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('ai-user-input');
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById('ai-messages');
    messagesContainer.innerHTML += `<div class="ai-message user">${message}</div>`;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    input.value = '';

    // Simulação da resposta da IA
    setTimeout(() => {
        const response = getGeminiResponse(message);
        messagesContainer.innerHTML += `<div class="ai-message bot">${response}</div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1500);
}

function getGeminiResponse(prompt) {
    const p = prompt.toLowerCase();
    const { currentUser } = window.authManager;

    if (p.includes('saldo')) return `Seu saldo atual é de ${formatCurrency(currentUser.balance)}. Você também tem ${formatCurrency(currentUser.gameBalance || 0)} em saldo de jogos que pode resgatar.`;
    if (p.includes('investimento')) return "Investir é uma ótima forma de fazer seu dinheiro crescer. Recomendo que comece por analisar nossos fundos na seção de 'Investimentos' e escolha um que se alinhe com seu perfil de risco. O Fundo Conservador é ideal para iniciantes!";
    if (p.includes('cartão') || p.includes('cartões')) return `Você possui ${Object.keys(currentUser.cards || {}).length} cartões. Pode geri-los, ver detalhes ou adquirir novos na seção 'Cartões'. O cartão Aurora Onyx é gratuito e já está disponível para você!`;
    if (p.includes('poupar') || p.includes('economizar')) return "Uma boa dica para poupar é a regra 50/30/20: 50% do seu rendimento para necessidades, 30% para desejos e 20% para poupanças e investimentos. Que tal começar definindo metas de poupança?";
    if (p.includes('transferir') || p.includes('enviar')) return "Para transferir dinheiro, vá à seção 'Transações', insira a chave PIX (seu email) ou IBAN do destinatário e o valor. A transferência é instantânea e segura!";
    if (p.includes('jogo') || p.includes('quiz')) return "Na seção 'Jogos & Recompensas', você pode participar do Quiz Financeiro e ganhar até A$ 3.000,00 em saldo de jogos! É divertido, educativo e você pode resgatar o saldo a qualquer momento.";
    if (p.includes('loja') || p.includes('produtos')) return "Na Loja Aurora, você pode comprar produtos como e-books, webinars e consultas financeiras usando seu saldo principal. Temos mais de 30 produtos diferentes para ajudar você a melhorar sua educação financeira!";
    if (p.includes('pix') || p.includes('iban')) return `Sua chave PIX é: ${currentUser.email}. Seu IBAN é: ${currentUser.iban}. Você pode copiar ambos na seção de 'Configurações'. Para transferir para outro usuário, basta colar a chave PIX ou IBAN dele no campo correspondente.`;
    if (p.includes('tema') || p.includes('escuro') || p.includes('claro')) return "Você pode mudar o tema entre claro e escuro na seção de 'Configurações'. Basta clicar no interruptor de tema e sua preferência será salva automaticamente!";
    if (p.includes('ajuda') || p.includes('suporte')) return "Estou aqui para ajudar! Você também pode entrar em contato com nosso suporte através do email suporte@aurora.capital ou pelo telefone +244 900 000 000.";
    
    return "Não tenho certeza de como responder a isso. Pode tentar reformular sua pergunta? Sou especialista em questões sobre saldos, transações, investimentos, cartões, jogos, dicas de poupança e configurações da conta.";
}