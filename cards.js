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
    },
    celestial: {
        name: 'Aurora Celestial',
        price: 300000,
        description: 'Para deuses financeiros — acesso a mercados fechados e ativos exclusivos.',
        designClass: 'card-celestial',
        color: '#0c0a09',
        benefits: "Cashback 12%, acesso a IPOs privados, consultoria de family office, gerente dedicado 24/7, jatinho real (1 voo/mês)",
        tier: "CELESTIAL",
        cashback: 12,
        perks: ["Cashback 12%", "IPOs Privados", "Family Office", "Gerente 24/7", "Jatinho Real Mensal"]
    },
    infinity: {
        name: 'Aurora Infinity',
        price: 500000,
        description: 'Sem limites. Literalmente. Cartão com crédito infinito e benefícios impossíveis.',
        designClass: 'card-infinity',
        color: '#000000',
        benefits: "Cashback 15%, crédito ilimitado, ilha real (uso 1 semana/ano), time de advogados globais, NFTs de obras-primas",
        tier: "INFINITY",
        cashback: 15,
        perks: ["Cashback 15%", "Crédito Ilimitado", "Ilha Real Anual", "Advogados Globais", "NFTs de Obras-Primas"]
    },
    quantum: {
        name: 'Aurora Quantum',
        price: 750000,
        description: 'Tecnologia quântica aplicada às finanças — previsão de mercado e hedge automático.',
        designClass: 'card-quantum',
        color: '#1e3a8a',
        benefits: "Cashback 18%, IA preditiva de mercado, hedge automático, acesso a laboratórios quânticos, consultoria de Nobel em Economia",
        tier: "QUANTUM",
        cashback: 18,
        perks: ["Cashback 18%", "IA Preditiva", "Hedge Automático", "Lab Quântico", "Consultoria Nobel"]
    },
    apex: {
        name: 'Aurora Apex',
        price: 1000000,
        description: 'O ápice do poder financeiro — você define as regras.',
        designClass: 'card-apex',
        color: '#7c2d12',
        benefits: "Cashback 20%, emissão de moeda própria, veto em políticas do banco, cofre em Fort Knox, embaixador pessoal da ONU",
        tier: "APEX",
        cashback: 20,
        perks: ["Cashback 20%", "Moeda Própria", "Veto Bancário", "Cofre Fort Knox", "Embaixador ONU"]
    },
    omnissiah: {
        name: 'Aurora Omnissiah',
        price: 2500000,
        description: 'Para o ser supremo das finanças — você é o sistema.',
        designClass: 'card-omnissiah',
        color: '#4c0519',
        benefits: "Cashback 25%, controle acionário do Aurora Bank, direito a nomear CEO, satélite dedicado, residência em bunker anti-apocalipse",
        tier: "OMNISSIAH",
        cashback: 25,
        perks: ["Cashback 25%", "Controle do Banco", "Nomear CEO", "Satélite Pessoal", "Bunker Anti-Apocalipse"]
    }
};

const MAX_CARDS = 15;

// ======================
// TRATAMENTO DE ERROS
// ======================

class CardSystemError extends Error {
    constructor(message, context = "CardSystem") {
        super(message);
        this.name = "CardSystemError";
        this.context = context;
    }
}

function handleError(err, context = "Desconhecido") {
    console.error(`[ERRO - ${context}]:`, err);
    showToast(`Erro: ${err.message || "Ocorreu um erro inesperado."}`, "error");
}

// ======================
// RENDERIZAÇÃO PRINCIPAL
// ======================

function renderCards() {
    try {
        const { currentUser } = window.authManager || {};
        if (!currentUser) {
            throw new CardSystemError("Usuário não autenticado.", "Auth");
        }

        const userCards = currentUser.cards || {};
        const app = document.getElementById('app');
        if (!app) {
            throw new CardSystemError("Elemento #app não encontrado.", "DOM");
        }

        app.innerHTML = `
            <div class="page-container">
                <div class="glass-panel">
                    <h3>Meus Cartões Aurora</h3>
                    <div class="card-carousel-wrapper" style="position: relative; padding: 20px 0;">
                        <button class="carousel-nav-btn left" aria-label="Cartão anterior" tabindex="0">
                            <i data-lucide="chevron-left"></i>
                        </button>
                        <div class="card-carousel" id="card-carousel" role="region" aria-label="Carrossel de cartões">
                            ${Object.keys(userCards).length > 0 
                                ? Object.keys(userCards).map(cardType => renderVirtualCard(cardType)).join('')
                                : '<div class="no-cards-message" style="text-align: center; padding: 3rem;"><i data-lucide="credit-card" style="font-size: 3rem; margin-bottom: 1rem;"></i><p>Você ainda não possui cartões.</p><p>Adquira seu primeiro cartão gratuitamente!</p></div>'
                            }
                        </div>
                        <button class="carousel-nav-btn right" aria-label="Próximo cartão" tabindex="0">
                            <i data-lucide="chevron-right"></i>
                        </button>
                        <div class="carousel-dots" id="carousel-dots" role="tablist" aria-label="Navegação por cartões"></div>
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
        setTimeout(() => {
            setupCardCarousel();
            setupCarouselAccessibility();
        }, 100);

    } catch (err) {
        handleError(err, "renderCards");
    }
}

// ======================
// RENDERIZAÇÃO DO CARTÃO VIRTUAL
// ======================

function renderVirtualCard(cardType) {
    try {
        const { currentUser } = window.authManager;
        if (!currentUser || !currentUser.cards || !currentUser.cards[cardType]) {
            return '';
        }

        const cardData = currentUser.cards[cardType];
        const cardConfig = CARD_TYPES[cardType];
        
        if (!cardConfig) {
            throw new CardSystemError(`Configuração de cartão inválida: ${cardType}`, "CardConfig");
        }
        
        const cardNumber = cardData.cardNumber || generateCardNumber(currentUser.uid, cardType);
        const expiryDate = cardData.expiryDate || generateExpiryDate();
        const cvv = cardData.cvv || generateCVV();
        
        // ✅ SVG VISA FUNCIONAL (EMBEDDED, NÃO BASE64)
        const visaSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64" width="48" height="30" aria-label="Visa">
                <path fill="#fff" d="M146.8,25.5v-7.4h-7.5c-2.3,0-4.1,1.1-4.1,3.5c0,1.7,1.1,2.7,3.2,3L146.8,25.5z M159.3,37.1l-4.8-21.9h-7.5l4.9,21.9H159.3z M119.1,37.1l-5.4-21.9h-7.4l5.4,21.9H119.1z M98.6,15.2h-7.5v21.9h7.5V15.2z M76.2,15.2h-7.5v21.9h7.5V15.2z M53.8,15.2h-7.5v21.9h7.5V15.2z M31.4,15.2h-7.5v21.9h7.5V15.2z"/>
            </svg>
        `;

        return `
            <div class="virtual-card ${cardConfig.designClass}" tabindex="0" role="button" aria-label="Cartão ${cardConfig.name}" onclick="showCardDetails('${cardType}', '${cardNumber}', '${expiryDate}', '${cvv}')">
                <!-- CHIP -->
                <div class="card-chip">CHIP</div>
                
                <!-- LOGO VISA -->
                ${visaSVG}

                <!-- TIPO/TIER -->
                <div class="card-tier">${cardConfig.tier}</div>

                <!-- NÚMERO -->
                <div class="card-number">${cardNumber}</div>

                <!-- TITULAR -->
                <div class="card-holder">${currentUser.username}</div>

                <!-- VALIDADE + CVV -->
                <div class="card-footer">
                    <div class="card-expiry">VALIDO ATE ${expiryDate}</div>
                    <div class="card-cvv">CVV: ${cvv}</div>
                </div>

                <!-- AÇÕES (copiar/excluir) -->
                <div class="card-actions" style="position: absolute; bottom: -40px; left: 0; right: 0; display: flex; gap: 8px; padding: 0 24px; opacity: 0; transition: opacity 0.3s, bottom 0.3s; background: rgba(0,0,0,0.7); border-radius: 0 0 16px 16px;">
                    <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); copyCardNumber('${cardNumber}');">
                        <i data-lucide="copy"></i> Copiar Número
                    </button>
                    <button class="btn btn-sm btn-danger delete-card-btn" onclick="event.stopPropagation(); handleDeleteCardPrompt('${cardType}');">
                        <i data-lucide="trash-2"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    } catch (err) {
        handleError(err, "renderVirtualCard");
        return `<div class="error-card">Erro ao carregar cartão</div>`;
    }
}

// ======================
// DETALHES DO CARTÃO (MODAL)
// ======================

function showCardDetails(cardType, cardNumber, expiryDate, cvv) {
    try {
        const cardConfig = CARD_TYPES[cardType];
        if (!cardConfig) {
            throw new CardSystemError(`Cartão inválido: ${cardType}`, "CardDetails");
        }

        const { currentUser } = window.authManager;
        const cardData = currentUser.cards[cardType];

        if (!cardData) {
            throw new CardSystemError("Dados do cartão não encontrados.", "CardData");
        }

        // ✅ SVG VISA NO MODAL
        const visaSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64" width="48" height="30" aria-label="Visa">
                <path fill="#fff" d="M146.8,25.5v-7.4h-7.5c-2.3,0-4.1,1.1-4.1,3.5c0,1.7,1.1,2.7,3.2,3L146.8,25.5z M159.3,37.1l-4.8-21.9h-7.5l4.9,21.9H159.3z M119.1,37.1l-5.4-21.9h-7.4l5.4,21.9H119.1z M98.6,15.2h-7.5v21.9h7.5V15.2z M76.2,15.2h-7.5v21.9h7.5V15.2z M53.8,15.2h-7.5v21.9h7.5V15.2z M31.4,15.2h-7.5v21.9h7.5V15.2z"/>
            </svg>
        `;

        const content = `
            <div class="card-details-modal" style="max-width: 500px; padding: 2rem;">
                <div class="virtual-card ${cardConfig.designClass}" style="width: 100%; padding: 1.5rem; margin-bottom: 1.5rem; transform: scale(1.1); transform-origin: top center;">
                    <div class="card-chip">CHIP</div>
                    ${visaSVG}
                    <div class="card-tier">${cardConfig.tier}</div>
                    <div class="card-number">${cardNumber}</div>
                    <div class="card-holder">${currentUser.username}</div>
                    <div class="card-footer">
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
        
        setTimeout(() => {
            setupCardCopyListeners(cardNumber, expiryDate, cvv);
        }, 100);

    } catch (err) {
        handleError(err, "showCardDetails");
    }
}

// ======================
// CARROSSEL COM SWIPE + SETAS + DOTS
// ======================

let carouselState = {
    currentIndex: 0,
    isDragging: false,
    startPos: 0,
    currentTranslate: 0,
    prevTranslate: 0,
    animationID: 0,
    cardWidth: 0,
    totalCards: 0
};

function setupCardCarousel() {
    try {
        const carousel = document.getElementById('card-carousel');
        const leftBtn = document.querySelector('.carousel-nav-btn.left');
        const rightBtn = document.querySelector('.carousel-nav-btn.right');
        const dotsContainer = document.getElementById('carousel-dots');

        if (!carousel || !leftBtn || !rightBtn || !dotsContainer) {
            throw new CardSystemError("Elementos do carrossel não encontrados.", "CarouselInit");
        }

        const cards = carousel.querySelectorAll('.virtual-card');
        carouselState.totalCards = cards.length;

        if (carouselState.totalCards === 0) return;

        // Calcula largura do cartão
        const firstCard = cards[0];
        if (!firstCard) return;
        carouselState.cardWidth = firstCard.offsetWidth + 20; // + margem

        // Renderiza dots
        renderCarouselDots();

        // Eventos de navegação
        leftBtn.addEventListener('click', prevCarouselSlide);
        rightBtn.addEventListener('click', nextCarouselSlide);

        // Suporte a teclado
        leftBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                prevCarouselSlide();
            }
        });
        rightBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                nextCarouselSlide();
            }
        });

        // Arrastar com mouse
        carousel.addEventListener('mousedown', startDrag);
        carousel.addEventListener('mouseleave', endDrag);
        carousel.addEventListener('mouseup', endDrag);
        carousel.addEventListener('mousemove', drag);

        // Arrastar com touch
        carousel.addEventListener('touchstart', startDrag, { passive: false });
        carousel.addEventListener('touchend', endDrag);
        carousel.addEventListener('touchmove', drag, { passive: false });

        // Teclado global
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevCarouselSlide();
            } else if (e.key === 'ArrowRight') {
                nextCarouselSlide();
            }
        });

        updateCarouselNav();
        console.log("✅ Carrossel inicializado com sucesso.");

    } catch (err) {
        handleError(err, "setupCardCarousel");
    }
}

function renderCarouselDots() {
    const dotsContainer = document.getElementById('carousel-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    for (let i = 0; i < carouselState.totalCards; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.setAttribute('tabindex', '0');
        dot.dataset.index = i;
        dot.addEventListener('click', () => goToCarouselSlide(i));
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToCarouselSlide(i);
            }
        });
        dotsContainer.appendChild(dot);
    }

    // Estilo básico dos dots
    const style = document.createElement('style');
    style.textContent = `
        .carousel-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ccc;
            margin: 0 4px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .carousel-dot.active {
            background: var(--primary, #2563eb);
        }
        .carousel-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10;
            opacity: 0;
            transition: opacity 0.3s;
            color: #333;
        }
        .carousel-nav-btn:hover {
            background: rgba(255,255,255,1);
        }
        .carousel-nav-btn.left { left: 10px; }
        .carousel-nav-btn.right { right: 10px; }
        .card-carousel-wrapper:hover .carousel-nav-btn { opacity: 1; }
        .carousel-nav-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
}

function goToCarouselSlide(index) {
    if (index < 0 || index >= carouselState.totalCards) return;

    carouselState.currentIndex = index;
    const offset = -index * carouselState.cardWidth;
    const carousel = document.getElementById('card-carousel');
    if (carousel) {
        carousel.style.transform = `translateX(${offset}px)`;
        updateCarouselNav();
    }
}

function nextCarouselSlide() {
    if (carouselState.currentIndex < carouselState.totalCards - 1) {
        goToCarouselSlide(carouselState.currentIndex + 1);
    }
}

function prevCarouselSlide() {
    if (carouselState.currentIndex > 0) {
        goToCarouselSlide(carouselState.currentIndex - 1);
    }
}

function updateCarouselNav() {
    const leftBtn = document.querySelector('.carousel-nav-btn.left');
    const rightBtn = document.querySelector('.carousel-nav-btn.right');
    const dots = document.querySelectorAll('.carousel-dot');

    if (leftBtn) leftBtn.disabled = carouselState.currentIndex <= 0;
    if (rightBtn) rightBtn.disabled = carouselState.currentIndex >= carouselState.totalCards - 1;

    dots.forEach((dot, i) => {
        if (i === carouselState.currentIndex) {
            dot.classList.add('active');
            dot.setAttribute('aria-selected', 'true');
        } else {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
        }
    });
}

// Funções de arrasto
function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function startDrag(event) {
    if (carouselState.isDragging) return;
    carouselState.isDragging = true;
    carouselState.startPos = getPositionX(event);
    carouselState.prevTranslate = carouselState.currentTranslate;
    carouselState.animationID = requestAnimationFrame(animation);
    document.getElementById('card-carousel')?.classList.add('grabbing');
}

function animation() {
    setSliderPosition();
    if (carouselState.isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
    const carousel = document.getElementById('card-carousel');
    if (carousel) {
        carousel.style.transform = `translateX(${carouselState.currentTranslate}px)`;
    }
}

function drag(event) {
    if (!carouselState.isDragging) return;
    const currentPosition = getPositionX(event);
    carouselState.currentTranslate = carouselState.prevTranslate + currentPosition - carouselState.startPos;
}

function endDrag() {
    if (!carouselState.isDragging) return;
    cancelAnimationFrame(carouselState.animationID);
    carouselState.isDragging = false;

    const movedBy = carouselState.currentTranslate - carouselState.prevTranslate;
    const threshold = carouselState.cardWidth * 0.3;

    if (movedBy < -threshold && carouselState.currentIndex < carouselState.totalCards - 1) {
        carouselState.currentIndex++;
    } else if (movedBy > threshold && carouselState.currentIndex > 0) {
        carouselState.currentIndex--;
    }

    // Animação suave ao soltar
    const targetPosition = -carouselState.currentIndex * carouselState.cardWidth;
    carouselState.currentTranslate = targetPosition;
    setSliderPosition();
    updateCarouselNav();

    document.getElementById('card-carousel')?.classList.remove('grabbing');
}

// ======================
// ACESSIBILIDADE
// ======================

function setupCarouselAccessibility() {
    const carousel = document.getElementById('card-carousel');
    if (!carousel) return;

    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextCarouselSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevCarouselSlide();
        }
    });
}

// ======================
// FUNÇÕES EXISTENTES (COM TRATAMENTO DE ERROS ADICIONADO)
// ======================

function setupCardCopyListeners(cardNumber, expiryDate, cvv) {
    try {
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
    } catch (err) {
        handleError(err, "setupCardCopyListeners");
    }
}

function copyCardNumber(cardNumber) {
    try {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        navigator.clipboard.writeText(cleanNumber)
            .then(() => {
                showToast("Número do cartão copiado para a área de transferência!", "success");
            })
            .catch(err => {
                throw new CardSystemError("Falha ao acessar área de transferência.", "Clipboard");
            });
    } catch (err) {
        handleError(err, "copyCardNumber");
    }
}

function copyCardDetails(cardNumber, expiryDate, cvv) {
    try {
        const cardDetails = `Número: ${cardNumber}\nValidade: ${expiryDate}\nCVV: ${cvv}`;
        navigator.clipboard.writeText(cardDetails)
            .then(() => {
                showToast("Todos os dados do cartão copiados!", "success");
            })
            .catch(err => {
                throw new CardSystemError("Falha ao acessar área de transferência.", "Clipboard");
            });
    } catch (err) {
        handleError(err, "copyCardDetails");
    }
}

async function handleBuyCard(cardType) {
    try {
        const { currentUser } = window.authManager || {};
        if (!currentUser) {
            throw new CardSystemError("Você precisa estar logado.", "Auth");
        }

        const cardConfig = CARD_TYPES[cardType];
        if (!cardConfig) {
            throw new CardSystemError("Tipo de cartão inválido.", "CardType");
        }
        
        if (currentUser.cards && Object.keys(currentUser.cards).length >= MAX_CARDS) {
            throw new CardSystemError(`Você atingiu o limite máximo de ${MAX_CARDS} cartões.`, "CardLimit");
        }
        
        if (currentUser.cards && currentUser.cards[cardType]) {
            showToast("Você já possui este cartão.", "info");
            return;
        }
        
        if (currentUser.balance < cardConfig.price) {
            throw new CardSystemError("Saldo insuficiente para adquirir este cartão.", "Balance");
        }
        
        showLoading();
        
        const cardId = generateUniqueId('card');
        const timestamp = Date.now();
        const cardNumber = generateCardNumber(currentUser.uid, cardType);
        const expiryDate = generateExpiryDate();
        const cvv = generateCVV();
        
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
        handleError(error, "handleBuyCard");
    } finally {
        hideLoading();
    }
}

function handleDeleteCardPrompt(cardType) {
    try {
        const cardConfig = CARD_TYPES[cardType];
        if (!cardConfig) {
            throw new CardSystemError("Cartão inválido.", "CardType");
        }

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
    } catch (err) {
        handleError(err, "handleDeleteCardPrompt");
    }
}

async function confirmDeleteCard(cardType) {
    try {
        const { currentUser } = window.authManager || {};
        if (!currentUser) {
            throw new CardSystemError("Usuário não autenticado.", "Auth");
        }

        const cardConfig = CARD_TYPES[cardType];
        if (!currentUser.cards || !currentUser.cards[cardType]) {
            throw new CardSystemError("Cartão não encontrado.", "CardNotFound");
        }
        
        if (cardType === 'onyx') {
            throw new CardSystemError("O cartão Aurora Onyx não pode ser excluído.", "ProtectedCard");
        }
        
        showLoading();
        
        const refundAmount = cardConfig.price * 0.5;
        const timestamp = Date.now();
        
        const updates = {};
        updates[`cards/${cardType}`] = null;
        updates[`transactions/${generateUniqueId('tx')}`] = {
            type: 'card_refund',
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
        showToast(`✅ Cartão ${cardConfig.name} excluído! Reembolso de ${formatCurrency(refundAmount)} creditado.`, "success");
        renderCards();
    } catch (error) {
        handleError(error, "confirmDeleteCard");
    } finally {
        hideLoading();
    }
}

// ======================
// UTILS (COM TRATAMENTO DE ERROS)
// ======================

function generateCardNumber(uid, cardType) {
    try {
        const base = uid.substring(0, 8).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const seed = (base + cardType.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % 1000000;
        
        const part1 = 4;
        const part2 = (seed * 123457 % 9999).toString().padStart(4, '0');
        const part3 = (seed * 789013 % 9999).toString().padStart(4, '0');
        const part4 = (seed * 345679 % 9999).toString().padStart(4, '0');
        
        return `4${part2} ${part3} ${part4}`;
    } catch (err) {
        console.error("Erro ao gerar número do cartão:", err);
        return "4000 0000 0000 0000";
    }
}

function generateCVV() {
    try {
        return Math.floor(100 + Math.random() * 899).toString();
    } catch (err) {
        console.error("Erro ao gerar CVV:", err);
        return "123";
    }
}

function generateExpiryDate() {
    try {
        const now = new Date();
        const year = now.getFullYear() + 4;
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${month}/${year.toString().slice(2)}`;
    } catch (err) {
        console.error("Erro ao gerar data de expiração:", err);
        return "12/30";
    }
}

function generateUniqueId(prefix) {
    try {
        const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return id.replace(/[.#$\/[\]]/g, '_');
    } catch (err) {
        console.error("Erro ao gerar ID único:", err);
        return `${prefix}-${Date.now()}`;
    }
}

function shadeColor(color, percent) {
    try {
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
    } catch (err) {
        console.error("Erro ao sombrear cor:", err);
        return color;
    }
}

// ======================
// TRATAMENTO GLOBAL DE ERROS
// ======================

window.addEventListener('error', (event) => {
    handleError(event.error, "Global Error");
});

window.addEventListener('unhandledrejection', (event) => {
    handleError(event.reason, "Unhandled Promise");
});
