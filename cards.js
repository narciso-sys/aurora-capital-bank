const CARD_TYPES = {
    onyx: { 
        name: 'Aurora Onyx', 
        price: 0, 
        description: 'Seu cartão de entrada — ideal para começar.', 
        designClass: 'card-onyx',
        color: '#1e293b',
        benefits: "Compra segura, proteção contra fraudes, aceito em todos os sites Aurora",
        tier: "Básico",
        cashback: 0,
        perks: []
    },
    cobalt: { 
        name: 'Aurora Cobalt', 
        price: 2500, 
        description: 'Estilo e segurança com cashback em todas as compras.', 
        designClass: 'card-cobalt',
        color: '#2563eb',
        benefits: "Compra segura, proteção contra fraudes, cashback de 1% em compras, seguro de compra",
        tier: "Bronze",
        cashback: 1,
        perks: ["Seguro de Compra", "Cashback 1%"]
    },
    amber: { 
        name: 'Aurora Amber', 
        price: 7500, 
        description: 'Cartão premium com benefícios ampliados e cashback maior.', 
        designClass: 'card-amber',
        color: '#f59e0b',
        benefits: "Compra segura, proteção contra fraudes, cashback de 2% em compras, seguro de viagem nacional, acesso a eventos exclusivos",
        tier: "Prata",
        cashback: 2,
        perks: ["Seguro Viagem Nacional", "Cashback 2%", "Eventos Exclusivos"]
    },
    ruby: { 
        name: 'Aurora Ruby', 
        price: 15000, 
        description: 'Cartão de luxo com benefícios internacionais e cashback premium.', 
        designClass: 'card-ruby',
        color: '#dc2626',
        benefits: "Compra segura, proteção contra fraudes, cashback de 3% em compras, seguro de viagem internacional, acesso a salas VIP, concierge básico",
        tier: "Ouro",
        cashback: 3,
        perks: ["Seguro Viagem Internacional", "Cashback 3%", "Salas VIP Aeroportos", "Concierge Básico"]
    },
    aurora: { 
        name: 'Aurora Borealis', 
        price: 50000, 
        description: 'O cartão supremo — benefícios ilimitados e atendimento personalizado.', 
        designClass: 'card-aurora',
        color: '#8b5cf6',
        benefits: "Compra segura, proteção contra fraudes, cashback de 5% em compras, seguro de viagem premium, acesso ilimitado a salas VIP, concierge 24/7, resgate de pontos em dobro",
        tier: "Platina",
        cashback: 5,
        perks: ["Seguro Viagem Premium", "Cashback 5%", "Salas VIP Ilimitadas", "Concierge 24/7", "Resgate em Dobro"]
    },
    // ✅ NOVOS CARTÕES ADICIONADOS
    obsidian: {
        name: 'Aurora Obsidian',
        price: 100000,
        description: 'Para quem exige o máximo — exclusividade absoluta.',
        designClass: 'card-obsidian',
        color: '#0f172a',
        benefits: "Cashback 7%, seguro saúde emergencial, traslado aeroportuário, gerente pessoal, convites para lançamentos globais",
        tier: "Diamante",
        cashback: 7,
        perks: ["Cashback 7%", "Seguro Saúde Emergencial", "Traslado Aeroportuário", "Gerente Pessoal", "Lançamentos Globais"]
    },
    titanium: {
        name: 'Aurora Titanium',
        price: 25000,
        description: 'Desempenho e elegância para o usuário exigente.',
        designClass: 'card-titanium',
        color: '#64748b',
        benefits: "Cashback 2.5%, seguro de equipamentos eletrônicos, descontos em parceiros, suporte prioritário",
        tier: "Titânio",
        cashback: 2.5,
        perks: ["Cashback 2.5%", "Seguro Eletrônicos", "Descontos Parceiros", "Suporte Prioritário"]
    },
    emerald: {
        name: 'Aurora Emerald',
        price: 35000,
        description: 'Verde como a prosperidade — benefícios sustentáveis e premium.',
        designClass: 'card-emerald',
        color: '#10b981',
        benefits: "Cashback 3.5%, doações automáticas para causas ambientais, carbono neutro nas compras, lounge ecológico",
        tier: "Esmeralda",
        cashback: 3.5,
        perks: ["Cashback 3.5%", "Causas Ambientais", "Carbono Neutro", "Lounge Ecológico"]
    },
    sapphire: {
        name: 'Aurora Sapphire',
        price: 65000,
        description: 'Azul como o oceano — viagens e experiências inesquecíveis.',
        designClass: 'card-sapphire',
        color: '#0ea5e9',
        benefits: "Cashback 4.5%, upgrade automático em voos, hospedagem grátis em hotéis parceiros, experiências gastronômicas",
        tier: "Safira",
        cashback: 4.5,
        perks: ["Cashback 4.5%", "Upgrade Voos", "Hospedagem Grátis", "Experiências Gastronômicas"]
    },
    eclipse: {
        name: 'Aurora Eclipse',
        price: 150000,
        description: 'Raridade e poder — apenas para membros selecionados.',
        designClass: 'card-eclipse',
        color: '#1f2937',
        benefits: "Cashback 10%, jatinho privado (simulação), ilha privada (virtual), consultoria financeira global, NFT exclusivo",
        tier: "Eclipse",
        cashback: 10,
        perks: ["Cashback 10%", "Jatinho Virtual", "Ilha Virtual", "Consultoria Global", "NFT Exclusivo"]
    }
};

// ✅ AUMENTADO PARA 10 CARTÕES
const MAX_CARDS = 10;

function renderCards() {
    const { currentUser } = window.authManager || {};
    if (!currentUser) {
        showToast("Usuário não autenticado.", "error");
        return;
    }

    const userCards = currentUser.cards || {};
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel">
                <h3>Meus Cartões Aurora</h3>
                <div class="card-carousel" id="card-carousel">
                    ${Object.keys(userCards).length > 0 
                        ? Object.keys(userCards).map(cardType => renderVirtualCard(cardType)).join('')
                        : '<div class="no-cards-message"><i data-lucide="credit-card" style="font-size: 3rem; margin-bottom: 1rem;"></i><p>Você ainda não possui cartões.</p><p>Adquira seu primeiro cartão gratuitamente!</p></div>'
                    }
                </div>
            </div>
            <div class="glass-panel">
                <h3>Adquirir Novos Cartões</h3>
                <div class="quick-actions-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                    ${Object.entries(CARD_TYPES).map(([type, details]) => {
                        const isOwned = !!userCards[type];
                        const canAfford = currentUser.balance >= details.price;
                        return `
                            <div class="action-card-container" style="position: relative;">
                                <div class="action-btn card-action-btn ${isOwned || !canAfford ? 'disabled-card' : ''}" style="flex-direction: column; align-items: stretch; text-align: center; padding: 1.5rem; border-radius: 16px; transition: all 0.3s ease; ${isOwned || !canAfford ? 'filter: grayscale(60%) opacity(0.8);' : 'box-shadow: 0 8px 24px rgba(0,0,0,0.1);'}">
                                    <div class="card-preview ${details.designClass}" style="width: 100%; height: 140px; border-radius: 12px; margin-bottom: 1rem; background: linear-gradient(135deg, ${details.color} 0%, ${shadeColor(details.color, -25)} 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 1rem; color: white; position: relative; overflow: hidden;">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                            <div class="card-logo" style="font-weight: 800; font-size: 1.2rem;">AURORA</div>
                                            <div style="font-size: 0.8rem; text-align: right;">${details.tier}</div>
                                        </div>
                                        <div style="font-size: 0.9rem; font-weight: 600; text-align: center;">${details.name}</div>
                                        <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.8rem;">
                                            <div>CASHBACK ${details.cashback}%</div>
                                            <div>💳</div>
                                        </div>
                                    </div>
                                    <span style="font-size: 1.3rem; font-weight: 700; margin: 0.5rem 0;">${details.name}</span>
                                    <small style="color: var(--text-secondary); margin-bottom: 0.5rem;">${details.description}</small>
                                    <div style="margin: 0.75rem 0; padding: 0.5rem; background: var(--surface); border-radius: 8px; font-size: 0.9rem;">
                                        <strong>Benefícios:</strong><br>
                                        ${details.perks.map(p => `• ${p}`).join('<br>')}
                                    </div>
                                    <strong style="margin: 1rem 0; font-size: 1.2rem; color: var(--primary);">${formatCurrency(details.price)}</strong>
                                    <button class="btn ${isOwned ? 'btn-secondary' : 'btn-primary'}" ${isOwned || !canAfford ? 'disabled' : ''} onclick="handleBuyCard('${type}')">
                                        ${isOwned ? 'Já Possui' : (canAfford ? 'Adquirir Agora' : 'Saldo Insuficiente')}
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;

    lucide.createIcons();
}

function renderVirtualCard(cardType) {
    const { currentUser } = window.authManager;
    if (!currentUser || !currentUser.cards || !currentUser.cards[cardType]) return '';

    const cardData = currentUser.cards[cardType];
    const cardConfig = CARD_TYPES[cardType];
    
    const cardNumber = cardData.cardNumber || generateCardNumber(currentUser.uid, cardType);
    const expiryDate = cardData.expiryDate || generateExpiryDate();
    const cvv = cardData.cvv || generateCVV();
    
    return `
        <div class="virtual-card ${cardConfig.designClass}" onclick="showCardDetails('${cardType}', '${cardNumber}', '${expiryDate}', '${cvv}')">
            <div class="card-header">
                <div class="card-logo">AURORA</div>
                <div class="card-tier">${cardConfig.tier}</div>
            </div>
            <div class="card-type">${cardConfig.name}</div>
            <div class="card-number">${cardNumber}</div>
            <div class="card-footer">
                <div class="card-expiry">VALIDO ATE ${expiryDate}</div>
                <div class="card-cvv">CVV: ${cvv}</div>
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); copyCardNumber('${cardNumber}');">
                    <i data-lucide="copy"></i> Copiar Número
                </button>
                <button class="btn btn-sm btn-danger delete-card-btn" onclick="event.stopPropagation(); handleDeleteCardPrompt('${cardType}');">
                    <i data-lucide="trash-2"></i> Excluir
                </button>
            </div>
        </div>
    `;
}

function showCardDetails(cardType, cardNumber, expiryDate, cvv) {
    const cardConfig = CARD_TYPES[cardType];
    const { currentUser } = window.authManager;
    const cardData = currentUser.cards[cardType];

    const content = `
        <div class="card-details-modal" style="max-width: 500px; padding: 2rem;">
            <div class="virtual-card ${cardConfig.designClass}" style="width: 100%; padding: 1.5rem; margin-bottom: 1.5rem;">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <div class="card-logo" style="font-weight: 800; font-size: 1.3rem;">AURORA</div>
                    <div class="card-tier" style="font-size: 0.8rem; background: rgba(255,255,255,0.2); padding: 0.25rem 0.5rem; border-radius: 4px;">${cardConfig.tier}</div>
                </div>
                <div class="card-type" style="font-size: 1.1rem; margin-bottom: 0.5rem;">${cardConfig.name}</div>
                <div class="card-number" style="font-size: 1.4rem; letter-spacing: 2px; margin-bottom: 1rem;">${cardNumber}</div>
                <div class="card-footer" style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                    <div class="card-expiry">VALIDO ATE ${expiryDate}</div>
                    <div class="card-cvv">CVV: ${cvv}</div>
                </div>
            </div>
            
            <div class="card-info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div class="card-info-item">
                    <strong>Titular:</strong>
                    <span>${currentUser.username}</span>
                </div>
                <div class="card-info-item">
                    <strong>Data de Aquisição:</strong>
                    <span>${new Date(cardData.acquiredAt).toLocaleDateString('pt-AO')}</span>
                </div>
                <div class="card-info-item">
                    <strong>Limite de Crédito:</strong>
                    <span>Ilimitado (pré-pago)</span>
                </div>
                <div class="card-info-item">
                    <strong>Cashback:</strong>
                    <span>${cardConfig.cashback}% em todas as compras</span>
                </div>
                <div class="card-info-item">
                    <strong>Segurança:</strong>
                    <span>Chip EMV + 3D Secure + Tokenização</span>
                </div>
                <div class="card-info-item">
                    <strong>Status:</strong>
                    <span style="color: var(--success);">Ativo</span>
                </div>
            </div>

            <div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--surface); border-radius: 8px;">
                <strong>Benefícios Inclusos:</strong>
                <ul style="margin: 0.5rem 0 0 1.2rem; padding: 0;">
                    ${cardConfig.perks.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>

            <div class="card-actions-full" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="btn btn-outline" style="flex: 1; min-width: 150px;" onclick="copyCardNumber('${cardNumber}')">
                    <i data-lucide="copy"></i> Copiar Número
                </button>
                <button class="btn btn-outline" style="flex: 1; min-width: 150px;" onclick="copyCardDetails('${cardNumber}', '${expiryDate}', '${cvv}')">
                    <i data-lucide="copy"></i> Copiar Todos os Dados
                </button>
            </div>
        </div>
    `;
    
    createModal(
        { text: 'Detalhes do Cartão', icon: 'credit-card' },
        content,
        [
            { text: 'Fechar', class: 'btn-secondary', icon: 'x', onclick: 'document.querySelector(".modal-overlay")?.remove()' }
        ]
    );
    
    // Configurar botões de cópia após criar o modal
    setTimeout(() => {
        setupCardCopyListeners(cardNumber, expiryDate, cvv);
    }, 100);
}

function setupCardCopyListeners(cardNumber, expiryDate, cvv) {
    const copyCardNumberBtn = document.querySelector('.card-actions-full button:nth-child(1)');
    if (copyCardNumberBtn) {
        copyCardNumberBtn.addEventListener('click', (e) => {
            e.preventDefault();
            copyCardNumber(cardNumber);
        });
    }
    
    const copyCardDetailsBtn = document.querySelector('.card-actions-full button:nth-child(2)');
    if (copyCardDetailsBtn) {
        copyCardDetailsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            copyCardDetails(cardNumber, expiryDate, cvv);
        });
    }
}

function copyCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    navigator.clipboard.writeText(cleanNumber)
        .then(() => {
            showToast("Número do cartão copiado para a área de transferência!", "success");
        })
        .catch(err => {
            showToast("Erro ao copiar número do cartão.", "error");
        });
}

function copyCardDetails(cardNumber, expiryDate, cvv) {
    const cardDetails = `Número: ${cardNumber}\nValidade: ${expiryDate}\nCVV: ${cvv}`;
    navigator.clipboard.writeText(cardDetails)
        .then(() => {
            showToast("Todos os dados do cartão copiados!", "success");
        })
        .catch(err => {
            showToast("Erro ao copiar dados do cartão.", "error");
        });
}

async function handleBuyCard(cardType) {
    const { currentUser } = window.authManager || {};
    if (!currentUser) {
        showToast("Você precisa estar logado.", "error");
        return;
    }

    const cardConfig = CARD_TYPES[cardType];
    if (!cardConfig) {
        showToast("Tipo de cartão inválido.", "error");
        return;
    }
    
    if (currentUser.cards && Object.keys(currentUser.cards).length >= MAX_CARDS) {
        showToast(`Você atingiu o limite máximo de ${MAX_CARDS} cartões.`, "error");
        return;
    }
    
    if (currentUser.cards && currentUser.cards[cardType]) {
        showToast("Você já possui este cartão.", "info");
        return;
    }
    
    if (currentUser.balance < cardConfig.price) {
        showToast("Saldo insuficiente para adquirir este cartão.", "error");
        return;
    }
    
    showLoading();
    try {
        const cardId = generateUniqueId('card');
        const timestamp = Date.now();
        const cardNumber = generateCardNumber(currentUser.uid, cardType);
        const expiryDate = generateExpiryDate();
        const cvv = generateCVV();
        
        // Atualizar dados do usuário
        const updates = {
            [`cards/${cardType}`]: {
                acquiredAt: timestamp,
                cardId: cardId,
                cardType: cardType,
                cardNumber: cardNumber,
                expiryDate: expiryDate,
                cvv: cvv
            },
            balance: currentUser.balance - cardConfig.price,
            [`transactions/${generateUniqueId('tx')}`]: {
                type: 'card_purchase',
                amount: cardConfig.price,
                description: `Aquisição de cartão ${cardConfig.name}`,
                cardType: cardType,
                timestamp: timestamp,
                status: 'completed'
            }
        };
        
        await window.firebase.dbFunc.update(
            window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
            updates
        );
        
        showToast(`🎉 Cartão ${cardConfig.name} adquirido com sucesso!`, "success");
        renderCards();
    } catch (error) {
        console.error("Erro ao adquirir cartão:", error);
        showToast("Erro ao adquirir cartão. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

function handleDeleteCardPrompt(cardType) {
    const cardConfig = CARD_TYPES[cardType];
    if (cardType === 'onyx') {
        showToast("O cartão Aurora Onyx não pode ser excluído.", "error");
        return;
    }

    createModal(
        { text: 'Confirmar Exclusão de Cartão', icon: 'alert-triangle' },
        `<div style="text-align: center; padding: 1.5rem;">
            <i data-lucide="alert-triangle" style="font-size: 3rem; color: var(--error); margin-bottom: 1rem;"></i>
            <h3 style="margin: 0 0 1rem 0;">Tem certeza?</h3>
            <p>Excluir o cartão <strong>${cardConfig.name}</strong>?</p>
            <p style="color: var(--text-secondary); margin-top: 1rem;">Você receberá <strong>50% do valor</strong> como reembolso.</p>
        </div>`,
        [
            { 
                text: 'Cancelar', 
                class: 'btn-secondary', 
                icon: 'x', 
                onclick: 'document.querySelector(".modal-overlay")?.remove()' 
            },
            { 
                text: 'Excluir Cartão', 
                class: 'btn-danger', 
                icon: 'trash-2', 
                onclick: `confirmDeleteCard('${cardType}')` 
            }
        ]
    );
}

async function confirmDeleteCard(cardType) {
    const { currentUser } = window.authManager || {};
    if (!currentUser) return;

    const cardConfig = CARD_TYPES[cardType];
    if (!currentUser.cards || !currentUser.cards[cardType]) {
        showToast("Cartão não encontrado.", "error");
        document.querySelector(".modal-overlay")?.remove();
        return;
    }
    
    // Proteção contra exclusão do cartão Onyx
    if (cardType === 'onyx') {
        showToast("O cartão Aurora Onyx não pode ser excluído.", "error");
        document.querySelector(".modal-overlay")?.remove();
        return;
    }
    
    showLoading();
    try {
        const refundAmount = cardConfig.price * 0.5;
        const timestamp = Date.now();
        
        const updates = {};
        updates[`cards/${cardType}`] = null; // Remove o cartão
        
        // Adiciona transação de reembolso
        updates[`transactions/${generateUniqueId('tx')}`] = {
            type: 'card_refund',
            amount: refundAmount,
            description: `Reembolso pela exclusão do cartão ${cardConfig.name}`,
            timestamp: timestamp,
            status: 'completed'
        };
        
        // Atualiza saldo
        updates.balance = (currentUser.balance || 0) + refundAmount;
        
        await window.firebase.dbFunc.update(
            window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
            updates
        );
        
        document.querySelector(".modal-overlay")?.remove();
        showToast(`✅ Cartão ${cardConfig.name} excluído! Reembolso de ${formatCurrency(refundAmount)} creditado.`, "success");
        renderCards();
    } catch (error) {
        console.error("Erro ao excluir cartão:", error);
        showToast("Erro ao excluir cartão. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

// ======================
// FUNÇÕES UTILITÁRIAS
// ======================

function generateCardNumber(uid, cardType) {
    // Gera um número de cartão mais realista (iniciando com 4 para simular Visa)
    const base = uid.substring(0, 8).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = (base + cardType.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 1000000;
    
    const part1 = 4; // Visa
    const part2 = (seed * 123457 % 9999).toString().padStart(4, '0');
    const part3 = (seed * 789013 % 9999).toString().padStart(4, '0');
    const part4 = (seed * 345679 % 9999).toString().padStart(4, '0');
    
    return `4${part2} ${part3} ${part4}`;
}

function generateCVV() {
    return Math.floor(100 + Math.random() * 899).toString(); // Gera entre 100 e 999
}

function generateExpiryDate() {
    const now = new Date();
    const year = now.getFullYear() + 4; // Válido por 4 anos
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${month}/${year.toString().slice(2)}`;
}

function generateUniqueId(prefix) {
    const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return id.replace(/[.#$\/[\]]/g, '_'); // Sanitiza para Firebase
}

function shadeColor(color, percent) {
    if (!color.startsWith('#')) return color;
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = Math.min(255, Math.max(0, parseInt(R * (100 + percent) / 100)));
    G = Math.min(255, Math.max(0, parseInt(G * (100 + percent) / 100)));
    B = Math.min(255, Math.max(0, parseInt(B * (100 + percent) / 100)));

    const RR = R.toString(16).padStart(2, '0');
    const GG = G.toString(16).padStart(2, '0');
    const BB = B.toString(16).padStart(2, '0');

    return `#${RR}${GG}${BB}`;
}