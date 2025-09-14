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

// 🆕 INTEGRAÇÃO REAL COM GEMINI API
// ⚠️ AVISO DE SEGURANÇA: Manter a chave da API aqui no código do frontend (client-side)
// não é seguro. Qualquer pessoa que visitar seu site pode ver sua chave e usá-la.
// O ideal é criar um backend (ex: uma Cloud Function ou um endpoint no seu servidor)
// que recebe a pergunta do seu site, adiciona a chave de forma segura no servidor,
// chama a API do Gemini e retorna a resposta para o site.
const GEMINI_API_KEY = 'AIzaSyB_4lhxnHfuYiUlGm9JKASjvl3wrOp0YL4'; // <-- 🔑 INSIRA SUA CHAVE AQUI
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

async function callGeminiAPI(prompt, context = "") {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'AIzaSyB_4lhxnHfuYiUlGm9JKASjvl3wrOp0YL4') {
        throw new Error("Chave da API do Gemini não configurada. Por favor, insira sua chave real no código.");
    }

    const fullPrompt = `
Você é Aurora, a assistente financeira virtual do Banco Aurora.
Responda de forma clara, direta e amigável, sempre em português.
Use no máximo 2 frases curtas. Seja prática e útil.

Contexto do usuário:
${context}

Pergunta do usuário:
${prompt}
    `.trim();

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro da API Gemini:', errorData);
            throw new Error(`Erro Gemini: ${errorData.error?.message || 'Erro desconhecido ao contatar a IA.'}`);
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            // Isso pode acontecer se o conteúdo for bloqueado por segurança
            console.warn('API Gemini retornou sem candidatos. Verifique o prompt e as configurações de segurança.');
            return "Não consegui gerar uma resposta para isso. Tente perguntar de outra forma.";
        }
        
        return data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error("Erro ao chamar Gemini API:", error);
        throw error; // Re-lança o erro para ser pego por handleAIChatSubmit
    }
}


// Assistente IA (Gemini) — INTEGRADO REAL
function openAIAssistant() {
    const modalContent = `
        <div class="ai-chat-window">
            <div class="ai-messages" id="ai-messages">
                <div class="ai-message bot">Olá! Sou a Aurora, sua assistente financeira. Como posso ajudar hoje?</div>
            </div>
            <form class="ai-input-form" id="ai-input-form">
                <div class="input-group">
                    <i data-lucide="message-circle"></i>
                    <input type="text" id="ai-user-input" placeholder="Pergunte sobre suas finanças..." required autocomplete="off">
                </div>
                <button type="submit" class="btn btn-primary"><i data-lucide="send"></i></button>
            </form>
        </div>
    `;
    createModal({ text: 'Assistente Aurora IA', icon: 'sparkles' }, modalContent, []);
    lucide.createIcons();
    document.getElementById('ai-input-form').addEventListener('submit', handleAIChatSubmit);
    document.getElementById('ai-user-input').focus();
}

async function handleAIChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('ai-user-input');
    const submitButton = e.target.querySelector('button[type="submit"]');
    const message = input.value.trim();
    if (!message) return;

    // Desabilitar o formulário enquanto processa
    input.disabled = true;
    submitButton.disabled = true;

    const messagesContainer = document.getElementById('ai-messages');
    messagesContainer.innerHTML += `<div class="ai-message user">${escapeHtml(message)}</div>`;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    input.value = '';

    // Mostrar "digitando..."
    const thinkingElement = document.createElement('div');
    thinkingElement.className = 'ai-message bot';
    thinkingElement.innerHTML = '<i data-lucide="loader" class="spin-icon"></i> Pensando...';
    messagesContainer.appendChild(thinkingElement);
    lucide.createIcons();
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const { currentUser } = window.authManager || {};
        const context = currentUser ? `
- Nome: ${currentUser.username}
- Saldo: ${formatCurrency(currentUser.balance)}
- Saldo de jogos: ${formatCurrency(currentUser.gameBalance || 0)}
- Cartões: ${Object.keys(currentUser.cards || {}).length}
- IBAN: ${currentUser.iban}
- PIX: ${currentUser.email}
        `.trim() : "Usuário não autenticado.";

        const response = await callGeminiAPI(message, context);

        // Substituir "digitando..." pela resposta real
        thinkingElement.innerHTML = escapeHtml(response);
    } catch (error) {
        console.error("Erro ao obter resposta da IA:", error);
        thinkingElement.innerHTML = `❌ ${escapeHtml(error.message) || "Erro ao processar sua pergunta. Tente novamente."}`;
    } finally {
        // Habilitar o formulário novamente
        input.disabled = false;
        submitButton.disabled = false;
        input.focus();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Função auxiliar para escapar HTML (segurança contra XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

