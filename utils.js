// Utilitários de UI

// ✅ FUNÇÃO CORRIGIDA — APENAS UMA VEZ, COM "Kz"
function formatCurrency(amount) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return `0,00 Kz`;
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(parsedAmount).replace('AOA', 'Kz').trim();
}

function showLoading() { 
    const loader = document.getElementById('loading');
    if (loader) loader.classList.remove('hidden'); 
}

function hideLoading() { 
    const loader = document.getElementById('loading');
    if (loader) loader.classList.add('hidden'); 
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    const icons = { success: 'check-circle', error: 'alert-octagon', info: 'info', warning: 'alert-triangle' };
    toast.innerHTML = `<i data-lucide="${icons[type]}"></i><span>${message}</span>`;
    toast.className = `toast ${type} show`;
    lucide.createIcons();
    setTimeout(() => { 
        toast.classList.remove('show'); 
    }, 4000);
}

function createModal(title, content, buttons = []) {
    document.querySelector('.modal-overlay')?.remove();
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="glass-panel modal-content-wrapper">
            <div class="modal-header">
                <h3><i data-lucide="${title.icon || 'info'}"></i> ${title.text}</h3>
                <button class="modal-close-btn"><i data-lucide="x"></i></button>
            </div>
            <div class="modal-body">${content}</div>
            <div class="modal-actions">${buttons.map(btn => `<button class="btn ${btn.class}" ${btn.onclick ? `onclick="${btn.onclick}"` : ''}>${btn.icon ? `<i data-lucide="${btn.icon}"></i> ` : ''}${btn.text}</button>`).join('')}</div>
        </div>
    `;
    document.body.appendChild(modalOverlay);
    lucide.createIcons();
    const closeModal = () => modalOverlay.remove();
    modalOverlay.querySelector('.modal-close-btn').onclick = closeModal;
    modalOverlay.onclick = (e) => { if (e.target === modalOverlay) closeModal(); };
}

// Funções de cartão
function generateCardNumber(uid, cardType) {
    const seed = (uid + cardType).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const part1 = 4000 + (seed % 1000);
    const part2 = (seed * 1234 % 9999).toString().padStart(4, '0');
    const part3 = (seed * 5678 % 9999).toString().padStart(4, '0');
    const part4 = (seed * 9101 % 9999).toString().padStart(4, '0');
    return `${part1} ${part2} ${part3} ${part4}`;
}

function generateCVV() {
    return Math.floor(100 + Math.random() * 900).toString();
}

function generateExpiryDate() {
    const now = new Date();
    const year = now.getFullYear() + 4;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${month}/${year.toString().slice(2)}`;
}

// Quiz Questions — MANTIDO, MAS VAMOS SUBSTITUIR PELO NOVO NO games.js
async function fetchQuizQuestions() {
    try {
        const response = await fetch('perguntas.json');
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        return data.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        return [
            { question: "O que é um orçamento?", options: ["Um tipo de investimento", "Um plano de gastos", "Um cartão de crédito", "Um imposto"], correct: 1, difficulty: "fácil" },
            { question: "Qual é a melhor forma de começar a poupar?", options: ["Esperar ter muito dinheiro", "Definir metas e poupar mensalmente", "Pedir empréstimos", "Gastar tudo e depois poupar"], correct: 1, difficulty: "fácil" },
            { question: "O que significa juro composto?", options: ["Juros calculados apenas sobre o capital inicial", "Juros sobre juros acumulados", "Taxa fixa de juros", "Desconto em compras"], correct: 1, difficulty: "médio" },
            { question: "Por que diversificar investimentos?", options: ["Para aumentar o risco", "Para reduzir o risco", "Para complicar a carteira", "Para pagar mais impostos"], correct: 1, difficulty: "médio" },
            { question: "O que é uma emergência financeira?", options: ["Uma promoção no shopping", "Um imprevisto que exige dinheiro imediato", "Um aumento de salário", "Um feriado prolongado"], correct: 1, difficulty: "fácil" },
            { question: "Qual é o principal objetivo de um fundo de emergência?", options: ["Investir em ações", "Cobrir despesas inesperadas", "Comprar um carro novo", "Fazer uma viagem"], correct: 1, difficulty: "fácil" },
            { question: "O que é inflação?", options: ["Aumento geral dos preços", "Diminuição dos preços", "Aumento dos salários", "Redução dos impostos"], correct: 0, difficulty: "médio" },
            { question: "Qual é a vantagem de investir a longo prazo?", options: ["Menos risco", "Maior potencial de crescimento", "Retornos garantidos", "Liquidez imediata"], correct: 1, difficulty: "difícil" },
            { question: "O que é CDI?", options: ["Certificado de Depósito Interbancário", "Certificado de Depósito Internacional", "Certificado de Depósito Individual", "Certificado de Depósito Inflacionário"], correct: 0, difficulty: "difícil" },
            { question: "Qual é a principal função do Banco Central?", options: ["Fazer empréstimos para empresas", "Controlar a inflação e a política monetária", "Gerenciar contas de clientes", "Vender produtos financeiros"], correct: 1, difficulty: "difícil" }
        ];
    }
}

// Assistente IA
function openAIAssistant() {
    const modalContent = `
        <div class="ai-chat-window">
            <div class="ai-messages" id="ai-messages">
                <div class="ai-message bot">Olá! Sou a Aurora, a sua assistente financeira. Como posso ajudar hoje?</div>
            </div>
            <form class="ai-input-form" id="ai-input-form">
                <div class="input-group">
                    <i data-lucide="message-circle"></i>
                    <input type="text" id="ai-user-input" placeholder="Pergunte sobre as suas finanças..." required>
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

    setTimeout(() => {
        const response = getGeminiResponse(message);
        messagesContainer.innerHTML += `<div class="ai-message bot">${response}</div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1500);
}

function getGeminiResponse(prompt) {
    const p = prompt.toLowerCase();
    const { currentUser } = window.authManager;

    if (p.includes('saldo')) return `O seu saldo atual é de ${formatCurrency(currentUser.balance)}.`;
    if (p.includes('investimento')) return "Investir é uma ótima forma de fazer o seu dinheiro crescer. Recomendo que comece por analisar os nossos fundos na secção de 'Investimentos' e escolha um que se alinhe com o seu perfil de risco.";
    if (p.includes('cartão') || p.includes('cartões')) return `Você possui ${Object.keys(currentUser.cards || {}).length} cartões. Pode geri-los, ver detalhes ou adquirir novos na secção 'Cartões'.`;
    if (p.includes('poupar') || p.includes('economizar')) return "Uma boa dica para poupar é a regra 50/30/20: 50% do seu rendimento para necessidades, 30% para desejos e 20% para poupanças e investimentos. Gostaria de uma análise mais detalhada das suas transações?";
    if (p.includes('transferir') || p.includes('enviar')) return "Para transferir dinheiro, vá à secção 'Transações', insira o PIX ou IBAN do destinatário e o valor. A transferência é instantânea!";
    if (p.includes('jogo') || p.includes('quiz')) return "Na secção 'Jogos & Recompensas', você pode participar do Quiz Financeiro e ganhar até 30.000,00 Kz em saldo de jogos! É divertido e educativo.";
    if (p.includes('loja') || p.includes('produtos')) return "Na Loja Aurora, você pode comprar produtos como e-books, webinars e consultas financeiras usando seu saldo principal. Vale a pena conferir!";
    
    return "Não tenho a certeza de como responder a isso. Pode tentar reformular a sua pergunta? Sou especialista em questões sobre saldos, transações, investimentos, cartões, jogos e dicas de poupança.";
}

// Função para escurecer uma cor
function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    const RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

// Função utilitária para gerar ID único — sanitizado
function generateUniqueId(prefix) {
    const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return id.replace(/[.#$\/[\]]/g, '_');
}
