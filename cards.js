const CARD_TYPES = {
    onyx: { 
        name: 'Aurora Onyx', 
        price: 0, 
        description: 'O seu primeiro cartão, seguro e gratuito.', 
        designClass: 'card-onyx',
        color: '#1e293b',
        benefits: "Compra segura, proteção contra fraudes"
    },
    cobalt: { 
        name: 'Aurora Cobalt', 
        price: 2500, 
        description: 'Estilo e segurança com um toque de azul.', 
        designClass: 'card-cobalt',
        color: '#2563eb',
        benefits: "Compra segura, proteção contra fraudes, cashback de 1% em compras"
    },
    amber: { 
        name: 'Aurora Amber', 
        price: 7500, 
        description: 'Um cartão vibrante para transações brilhantes.', 
        designClass: 'card-amber',
        color: '#f59e0b',
        benefits: "Compra segura, proteção contra fraudes, cashback de 2% em compras, seguro de viagem"
    },
    ruby: { 
        name: 'Aurora Ruby', 
        price: 15000, 
        description: 'Exclusividade e poder na sua carteira.', 
        designClass: 'card-ruby',
        color: '#dc2626',
        benefits: "Compra segura, proteção contra fraudes, cashback de 3% em compras, seguro de viagem, acesso a salas VIP em aeroportos"
    },
    aurora: { 
        name: 'Aurora Borealis', 
        price: 50000, 
        description: 'O cartão supremo, um espetáculo de cores e benefícios.', 
        designClass: 'card-aurora',
        color: '#8b5cf6',
        benefits: "Compra segura, proteção contra fraudes, cashback de 5% em compras, seguro de viagem premium, acesso ilimitado a salas VIP em aeroportos, concierge 24/7"
    }
};

const MAX_CARDS = 5;

function renderCards() {
    const { currentUser } = window.authManager;
    const userCards = currentUser.cards || {};
    const app = document.getElementById('app');

    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel">
                <h3>Meus Cartões</h3>
                <div class="card-carousel" id="card-carousel">
                    ${Object.keys(userCards).length > 0 ? Object.keys(userCards).map(cardType => renderVirtualCard(cardType)).join('') : '<p class="no-cards-message">Você ainda não possui cartões.</p>'}
                </div>
            </div>
            <div class="glass-panel">
                <h3>Adquirir Novos Cartões</h3>
                <div class="quick-actions-grid">
                    ${Object.entries(CARD_TYPES).map(([type, details]) => {
                        const isOwned = !!userCards[type];
                        const canAfford = currentUser.balance >= details.price;
                        return `
                            <div class="action-btn card-action-btn" style="flex-direction: column; align-items: stretch; text-align: center; ${isOwned || !canAfford ? 'filter: grayscale(80%);' : ''}">
                                <div class="card-preview ${details.designClass}" style="width: 100%; height: 120px; border-radius: 12px; margin-bottom: 10px; background: linear-gradient(135deg, ${details.color} 0%, ${shadeColor(details.color, -20)} 100%); display: flex; align-items: flex-end; justify-content: center; padding: 10px; color: white; font-weight: bold; font-size: 14px;">
                                    ${details.name}
                                </div>
                                <span style="font-size: 1.2rem; font-weight: 600;">${details.name}</span>
                                <small>${details.description}</small>
                                <strong style="margin: 10px 0; font-size: 1.1rem;">${formatCurrency(details.price)}</strong>
                                <button class="btn ${isOwned ? 'btn-secondary' : 'btn-primary'}" ${isOwned || !canAfford ? 'disabled' : ''} onclick="handleBuyCard('${type}')">
                                    ${isOwned ? 'Adquirido' : (canAfford ? 'Comprar' : 'Saldo Insuficiente')}
                                </button>
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
    const cardData = currentUser.cards[cardType];
    const cardConfig = CARD_TYPES[cardType];
    
    const cardNumber = cardData.cardNumber || generateCardNumber(currentUser.uid, cardType);
    const expiryDate = cardData.expiryDate || generateExpiryDate();
    const cvv = cardData.cvv || generateCVV();
    
    return `
        <div class="virtual-card ${cardConfig.designClass}" onclick="showCardDetails('${cardType}', '${cardNumber}', '${expiryDate}', '${cvv}')">
            <div class="card-logo">AURORA</div>
            <div class="card-type">${cardConfig.name}</div>
            <div class="card-number">${cardNumber}</div>
            <div class="card-footer">
                <div class="card-expiry">VALIDO ATE ${expiryDate}</div>
                <div class="card-cvv">CVV: ${cvv}</div>
            </div>
            <div class="card-actions">
                <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); copyCardNumber('${cardNumber}');">
                    <i data-lucide="copy"></i> Copiar
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
    const content = `
        <div class="card-details-modal">
            <div class="virtual-card ${cardConfig.designClass}" style="width: 100%;">
                <div class="card-logo">AURORA</div>
                <div class="card-type">${cardConfig.name}</div>
                <div class="card-number">${cardNumber}</div>
                <div class="card-footer">
                    <div class="card-expiry">VALIDO ATE ${expiryDate}</div>
                    <div class="card-cvv">CVV: ${cvv}</div>
                </div>
            </div>
            <div class="card-info-grid">
                <div class="card-info-item">
                    <strong>Titular:</strong>
                    <span>${window.authManager.currentUser.username}</span>
                </div>
                <div class="card-info-item">
                    <strong>Data de Aquisição:</strong>
                    <span>${new Date(window.authManager.currentUser.cards[cardType].acquiredAt).toLocaleDateString('pt-AO')}</span>
                </div>
                <div class="card-info-item">
                    <strong>Limite:</strong>
                    <span>Ilimitado</span>
                </div>
                <div class="card-info-item">
                    <strong>Segurança:</strong>
                    <span>Chip EMV + Autenticação 3D Secure</span>
                </div>
                <div class="card-info-item">
                    <strong>Benefícios:</strong>
                    <span>${cardConfig.benefits}</span>
                </div>
            </div>
            <div class="card-actions-full">
                <button class="btn btn-outline" onclick="copyCardNumber('${cardNumber}')">
                    <i data-lucide="copy"></i> Copiar Número do Cartão
                </button>
                <button class="btn btn-outline" onclick="copyCardDetails('${cardNumber}', '${expiryDate}', '${cvv}')">
                    <i data-lucide="copy"></i> Copiar Todos os Dados
                </button>
            </div>
        </div>
    `;
    
    createModal(
        { text: 'Detalhes do Cartão', icon: 'credit-card' },
        content,
        [
            { text: 'Fechar', class: 'btn-secondary', icon: 'x', onclick: 'document.querySelector(".modal-overlay").remove()' }
        ]
    );
    
    // Configurar botões de cópia após criar o modal
    setTimeout(() => {
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
    }, 100);
}

function copyCardNumber(cardNumber) {
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''))
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
            showToast("Dados do cartão copiados para a área de transferência!", "success");
        })
        .catch(err => {
            showToast("Erro ao copiar dados do cartão.", "error");
        });
}

async function handleBuyCard(cardType) {
    const { currentUser } = window.authManager;
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
                type: 'purchase',
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
        
        showToast(`Cartão ${cardConfig.name} adquirido com sucesso!`, "success");
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
    createModal(
        { text: 'Confirmar Exclusão de Cartão', icon: 'alert-triangle' },
        `<p>Tem a certeza que deseja excluir o cartão <strong>${cardConfig.name}</strong>? Esta ação é irreversível.</p>`,
        [
            { text: 'Cancelar', class: 'btn-secondary', icon: 'x', onclick: 'document.querySelector(".modal-overlay").remove()' },
            { text: 'Excluir Cartão', class: 'btn btn-primary', style: 'background: var(--error);', icon: 'trash-2', onclick: `confirmDeleteCard('${cardType}')` }
        ]
    );
}

async function confirmDeleteCard(cardType) {
    const { currentUser } = window.authManager;
    const cardConfig = CARD_TYPES[cardType];
    
    if (!currentUser.cards || !currentUser.cards[cardType]) {
        showToast("Cartão não encontrado.", "error");
        document.querySelector(".modal-overlay")?.remove();
        return;
    }
    
    // Não permitir exclusão do cartão Onyx
    if (cardType === 'onyx') {
        showToast("O cartão Aurora Onyx não pode ser excluído.", "error");
        document.querySelector(".modal-overlay")?.remove();
        return;
    }
    
    showLoading();
    try {
        // Remover o cartão
        const updates = {};
        updates[`cards/${cardType}`] = null;
        
        // Adicionar transação de reembolso (50% do valor)
        const refundAmount = cardConfig.price * 0.5;
        const timestamp = Date.now();
        updates[`transactions/${generateUniqueId('tx')}`] = {
            type: 'refund',
            amount: refundAmount,
            description: `Reembolso pela exclusão do cartão ${cardConfig.name}`,
            timestamp: timestamp,
            status: 'completed'
        };
        updates.balance = (currentUser.balance || 0) + refundAmount;
        
        await window.firebase.dbFunc.update(
            window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
            updates
        );
        
        document.querySelector(".modal-overlay")?.remove();
        showToast(`Cartão ${cardConfig.name} excluído com sucesso! Você recebeu ${formatCurrency(refundAmount)} de reembolso.`, "success");
        renderCards();
    } catch (error) {
        console.error("Erro ao excluir cartão:", error);
        showToast("Erro ao excluir cartão. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

// Funções utilitárias de cartão
function generateCardNumber(uid, cardType) {
    const seed = (uid + cardType).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const part1 = 4000 + (seed % 1000); // VISA starts with 4
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

function generateUniqueId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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