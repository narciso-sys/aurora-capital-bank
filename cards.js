// ======================
// TIPOS DE CARTÕES (25 NOVOS + 15 ANTIGOS = 25 TOTAL)
// ======================

const CARD_TYPES = {
    // === CARTÕES EXISTENTES (15) ===
    onyx: { 
        name: 'Aurora Onyx', 
        price: 0, 
        description: 'Seu cartão de entrada — ideal para começar.', 
        designClass: 'card-onyx',
        color: '#1e293b',
        benefits: "Compra segura, proteção contra fraudes, aceito em todos os sites Aurora",
        tier: "Básico",
        cashback: 0,
        perks: [],
        network: "visa"
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
        perks: ["Seguro de Compra", "Cashback 1%"],
        network: "visa"
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
        perks: ["Seguro Viagem Nacional", "Cashback 2%", "Eventos Exclusivos"],
        network: "mastercard"
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
        perks: ["Seguro Viagem Internacional", "Cashback 3%", "Salas VIP Aeroportos", "Concierge Básico"],
        network: "amex"
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
        perks: ["Seguro Viagem Premium", "Cashback 5%", "Salas VIP Ilimitadas", "Concierge 24/7", "Resgate em Dobro"],
        network: "visa"
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
        perks: ["Cashback 7%", "Seguro Saúde Emergencial", "Traslado Aeroportuário", "Gerente Pessoal", "Lançamentos Globais"],
        network: "mastercard"
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
        perks: ["Cashback 2.5%", "Seguro Eletrônicos", "Descontos Parceiros", "Suporte Prioritário"],
        network: "visa"
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
        perks: ["Cashback 3.5%", "Causas Ambientais", "Carbono Neutro", "Lounge Ecológico"],
        network: "unionpay"
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
        perks: ["Cashback 4.5%", "Upgrade Voos", "Hospedagem Grátis", "Experiências Gastronômicas"],
        network: "diners"
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
        perks: ["Cashback 10%", "Jatinho Virtual", "Ilha Virtual", "Consultoria Global", "NFT Exclusivo"],
        network: "amex"
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
        perks: ["Cashback 12%", "IPOs Privados", "Family Office", "Gerente 24/7", "Jatinho Real Mensal"],
        network: "mastercard"
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
        perks: ["Cashback 15%", "Crédito Ilimitado", "Ilha Real Anual", "Advogados Globais", "NFTs de Obras-Primas"],
        network: "visa"
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
        perks: ["Cashback 18%", "IA Preditiva", "Hedge Automático", "Lab Quântico", "Consultoria Nobel"],
        network: "amex"
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
        perks: ["Cashback 20%", "Moeda Própria", "Veto Bancário", "Cofre Fort Knox", "Embaixador ONU"],
        network: "mastercard"
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
        perks: ["Cashback 25%", "Controle do Banco", "Nomear CEO", "Satélite Pessoal", "Bunker Anti-Apocalipse"],
        network: "visa"
    },

    // === NOVOS 10 CARTÕES ULTRA-PREMIUM ===
    mastercard_black: {
        name: 'Mastercard Black Quantum',
        price: 3500000,
        description: 'O cartão Mastercard mais exclusivo do planeta.',
        designClass: 'card-mastercard-black',
        color: '#000000',
        benefits: "Cashback 30%, acesso a ilhas privadas reais, concierge global 24/7, jatinho particular ilimitado",
        tier: "BLACK QUANTUM",
        cashback: 30,
        perks: ["Cashback 30%", "Ilhas Reais", "Concierge Global", "Jatinho Ilimitado", "Cartão de Titânio"],
        network: "mastercard"
    },
    amex_centurion: {
        name: 'American Express Centurion',
        price: 5000000,
        description: 'O lendário cartão preto — por convite apenas.',
        designClass: 'card-amex-centurion',
        color: '#00008b',
        benefits: "Cashback 35%, acesso a lounges globais, gerente pessoal, resgate de milhas ilimitado",
        tier: "CENTURION",
        cashback: 35,
        perks: ["Cashback 35%", "Lounge Global", "Gerente Pessoal", "Milhas Ilimitadas", "Convite Exclusivo"],
        network: "amex"
    },
    unionpay_dragon: {
        name: 'UnionPay Dragon Emperor',
        price: 7000000,
        description: 'Poder oriental em forma de cartão — aceito em toda Ásia.',
        designClass: 'card-unionpay-dragon',
        color: '#c3272b',
        benefits: "Cashback 40%, consultoria imperial, acesso a palácios, tradução simultânea em 50 idiomas",
        tier: "DRAGON EMPEROR",
        cashback: 40,
        perks: ["Cashback 40%", "Consultoria Imperial", "Acesso a Palácios", "Tradução 50 Idiomas", "VIP China"],
        network: "unionpay"
    },
    diners_reserve: {
        name: 'Diners Club Reserve',
        price: 4500000,
        description: 'Exclusividade gastronômica e experiências únicas.',
        designClass: 'card-diners-reserve',
        color: '#0066b3',
        benefits: "Cashback 28%, jantares com chefs Michelin, ingressos para festivais, wine tasting privado",
        tier: "RESERVE",
        cashback: 28,
        perks: ["Cashback 28%", "Jantares Michelin", "Festivais Exclusivos", "Wine Tasting", "Reservas VIP"],
        network: "diners"
    },
    jcb_platinum: {
        name: 'JCB The Platinum',
        price: 4000000,
        description: 'Elegância japonesa e tecnologia de ponta.',
        designClass: 'card-jcb-platinum',
        color: '#ffd700',
        benefits: "Cashback 32%, spas premium, tecnologia antifraude quântica, tradutor IA em tempo real",
        tier: "PLATINUM",
        cashback: 32,
        perks: ["Cashback 32%", "Spas Premium", "Antifraude Quântico", "Tradutor IA", "VIP Japão"],
        network: "jcb"
    },
    discover_ultimate: {
        name: 'Discover Ultimate',
        price: 3200000,
        description: 'Cashback máximo e proteção total em todas as compras.',
        designClass: 'card-discover-ultimate',
        color: '#ff6600',
        benefits: "Cashback 45%, proteção de preço, devolução sem perguntas, cashback dobrado no primeiro ano",
        tier: "ULTIMATE",
        cashback: 45,
        perks: ["Cashback 45%", "Proteção de Preço", "Devolução Sem Perguntas", "Cashback Dobrado", "Sem Anuidade"],
        network: "discover"
    },
    elo_supremo: {
        name: 'Elo Supremo',
        price: 2800000,
        description: 'O ápice do cartão brasileiro — benefícios locais e globais.',
        designClass: 'card-elo-supremo',
        color: '#009739',
        benefits: "Cashback 27%, acesso a eventos no Brasil, cashback em combustível, parceiros exclusivos LATAM",
        tier: "SUPREMO",
        cashback: 27,
        perks: ["Cashback 27%", "Eventos Brasil", "Combustível", "Parceiros LATAM", "VIP Samba"],
        network: "elo"
    },
    ru_pay_premier: {
        name: 'RuPay Premier',
        price: 3100000,
        description: 'Cartão indiano de elite — benefícios culturais e espirituais.',
        designClass: 'card-rupay-premier',
        color: '#ff9933',
        benefits: "Cashback 33%, ioga privada, retiros espirituais, massagem ayurvédica mensal",
        tier: "PREMIER",
        cashback: 33,
        perks: ["Cashback 33%", "Ioga Privada", "Retiros Espirituais", "Ayurveda Mensal", "Templos VIP"],
        network: "rupay"
    },
    mir_infinity: {
        name: 'Mir Infinity',
        price: 3800000,
        description: 'Cartão russo de elite — benefícios em toda Eurásia.',
        designClass: 'card-mir-infinity',
        color: '#0033aa',
        benefits: "Cashback 36%, trens privados, caviar mensal, babushka concierge",
        tier: "INFINITY",
        cashback: 36,
        perks: ["Cashback 36%", "Trens Privados", "Caviar Mensal", "Babushka Concierge", "VIP Sibéria"],
        network: "mir"
    },
    hipercard_elite: {
        name: 'Hipercard Elite',
        price: 2600000,
        description: 'O cartão brasileiro mais poderoso — benefícios em todo o Nordeste e além.',
        designClass: 'card-hipercard-elite',
        color: '#8b0000',
        benefits: "Cashback 26%, camarote em festivais, descontos em resorts, cashback em restaurantes locais",
        tier: "ELITE",
        cashback: 26,
        perks: ["Cashback 26%", "Camarote Festivais", "Resorts", "Restaurantes Locais", "VIP Nordeste"],
        network: "hipercard"
    }
};

const MAX_CARDS = 25;

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
                    <div class="card-carousel-wrapper" style="position: relative; padding: 30px 0; overflow: visible;">
                        <button class="carousel-nav-btn left" aria-label="Cartão anterior" tabindex="0">
                            <i data-lucide="chevron-left"></i>
                        </button>
                        <div class="card-carousel" id="card-carousel" role="region" aria-label="Carrossel de cartões">
                            ${Object.keys(userCards).length > 0 
                                ? Object.keys(userCards).map(cardType => renderVirtualCard(cardType)).join('')
                                : '<div class="no-cards-message" style="text-align: center; padding: 4rem;"><i data-lucide="credit-card" style="font-size: 4rem; margin-bottom: 1.5rem; color: var(--text-secondary);"></i><p style="font-size: 1.2rem; margin-bottom: 1rem;">Você ainda não possui cartões.</p><p>Adquira seu primeiro cartão gratuitamente!</p></div>'
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
                    <div class="quick-actions-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; padding: 1rem 0;">
                        ${Object.entries(CARD_TYPES).map(([type, details]) => {
                            const isOwned = !!userCards[type];
                            const canAfford = currentUser.balance >= details.price;
                            return `
                                <div class="action-card-container" style="position: relative;">
                                    <div class="action-btn card-action-btn ${isOwned || !canAfford ? 'disabled-card' : ''}" style="flex-direction: column; align-items: stretch; text-align: center; padding: 1.8rem; border-radius: 20px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); ${isOwned || !canAfford ? 'filter: grayscale(70%) opacity(0.7); transform: scale(0.98);' : 'box-shadow: 0 12px 30px rgba(0,0,0,0.15); transform: scale(1);'} background: linear-gradient(145deg, ${details.color} 0%, ${shadeColor(details.color, -30)} 100%); color: white;">
                                        <div class="card-preview ${details.designClass}" style="width: 100%; height: 160px; border-radius: 16px; margin-bottom: 1.2rem; background: linear-gradient(135deg, ${details.color} 0%, ${shadeColor(details.color, -40)} 100%); display: flex; flex-direction: column; justify-content: space-between; padding: 1.2rem; color: white; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.2);">
                                            <!-- Rede -->
                                            ${getNetworkSVG(details.network)}
                                            
                                            <!-- Tier -->
                                            <div style="font-size: 0.85rem; text-align: right; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${details.tier}</div>
                                            
                                            <div style="font-size: 1rem; font-weight: 800; text-align: center; letter-spacing: 0.5px; margin: 0.5rem 0;">${details.name}</div>
                                            
                                            <div style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.85rem;">
                                                <div style="font-weight: 600;">CASHBACK ${details.cashback}%</div>
                                                <div>💳</div>
                                            </div>
                                        </div>
                                        <span style="font-size: 1.4rem; font-weight: 800; margin: 0.8rem 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${details.name}</span>
                                        <small style="color: rgba(255,255,255,0.9); margin-bottom: 1rem; line-height: 1.4;">${details.description}</small>
                                        <div style="margin: 1rem 0; padding: 0.8rem; background: rgba(0,0,0,0.2); backdrop-filter: blur(10px); border-radius: 12px; font-size: 0.95rem; border: 1px solid rgba(255,255,255,0.1);">
                                            <strong style="color: white;">Benefícios:</strong><br>
                                            ${details.perks.map(p => `• ${p}`).join('<br>')}
                                        </div>
                                        <strong style="margin: 1.2rem 0; font-size: 1.4rem; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${formatCurrency(details.price)}</strong>
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
            setupCardHoverEffects();
            setupCarouselAccessibility();
        }, 100);

    } catch (err) {
        handleError(err, "renderCards");
    }
}

// ======================
// EFEITOS 3D: ZOOM, ROTAÇÃO, PARALLAX
// ======================

function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.virtual-card, .card-preview');
    cards.forEach(card => {
        let isHovered = false;

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            gsap.to(card, {
                scale: 1.05,
                rotationY: 5,
                rotationX: 5,
                duration: 0.6,
                ease: "power2.out"
            });
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovered) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(card, {
                rotationY: rotateY,
                rotationX: -rotateX,
                duration: 0.5,
                ease: "power1.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            gsap.to(card, {
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
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

        return `
            <div class="virtual-card ${cardConfig.designClass}" 
                 tabindex="0" 
                 role="button" 
                 aria-label="Cartão ${cardConfig.name}"
                 style="min-width: 320px; height: 200px; margin: 0 16px; padding: 24px; border-radius: 24px; background: linear-gradient(135deg, ${cardConfig.color} 0%, ${shadeColor(cardConfig.color, -40)} 100%); color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.2); position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); transform-style: preserve-3d; transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;"
                 onclick="showCardDetails('${cardType}', '${cardNumber}', '${expiryDate}', '${cvv}')"
                 data-card-type="${cardType}">
                
                <!-- CHIP -->
                <div class="card-chip" style="position: absolute; top: 24px; left: 24px; background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.5px;">CHIP</div>
                
                <!-- LOGO DA REDE -->
                ${getNetworkSVG(cardConfig.network, true)}

                <!-- TIPO/TIER -->
                <div class="card-tier" style="position: absolute; top: 24px; right: 24px; font-size: 0.85rem; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${cardConfig.tier}</div>

                <!-- NÚMERO -->
                <div class="card-number" style="font-size: 1.4rem; font-weight: 700; letter-spacing: 2px; margin: 60px 0 20px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${cardNumber}</div>

                <!-- TITULAR -->
                <div class="card-holder" style="font-size: 1rem; font-weight: 600; margin-bottom: 8px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${currentUser.username}</div>

                <!-- VALIDADE + CVV -->
                <div class="card-footer" style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.85rem; font-weight: 500;">
                    <div class="card-expiry">VALIDO ATE ${expiryDate}</div>
                    <div class="card-cvv">CVV: ${cvv}</div>
                </div>

                <!-- AÇÕES (copiar/excluir) -->
                <div class="card-actions" style="position: absolute; bottom: -50px; left: 0; right: 0; display: flex; gap: 12px; padding: 0 24px; opacity: 0; transition: all 0.4s ease; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); border-radius: 0 0 24px 24px; transform: translateY(10px);">
                    <button class="btn btn-sm btn-outline" style="flex: 1; min-width: 120px;" onclick="event.stopPropagation(); copyCardNumber('${cardNumber}');">
                        <i data-lucide="copy"></i> Copiar Número
                    </button>
                    <button class="btn btn-sm btn-danger delete-card-btn" style="flex: 1; min-width: 120px;" onclick="event.stopPropagation(); handleDeleteCardPrompt('${cardType}');">
                        <i data-lucide="trash-2"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    } catch (err) {
        handleError(err, "renderVirtualCard");
        return `<div class="error-card" style="min-width: 320px; padding: 2rem; text-align: center; color: var(--error);">Erro ao carregar cartão</div>`;
    }
}

// ======================
// SVGs DAS REDES (VISA, MASTERCARD, AMEX, ETC)
// ======================

function getNetworkSVG(network, isLarge = false) {
    const size = isLarge ? 'width="56" height="36"' : 'width="48" height="30"';
    switch (network) {
        case 'visa':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="Visa">
                    <path fill="#fff" d="M146.8,25.5v-7.4h-7.5c-2.3,0-4.1,1.1-4.1,3.5c0,1.7,1.1,2.7,3.2,3L146.8,25.5z M159.3,37.1l-4.8-21.9h-7.5l4.9,21.9H159.3z M119.1,37.1l-5.4-21.9h-7.4l5.4,21.9H119.1z M98.6,15.2h-7.5v21.9h7.5V15.2z M76.2,15.2h-7.5v21.9h7.5V15.2z M53.8,15.2h-7.5v21.9h7.5V15.2z M31.4,15.2h-7.5v21.9h7.5V15.2z"/>
                </svg>
            `;
        case 'mastercard':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 136" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="Mastercard">
                    <circle cx="68" cy="68" r="60" fill="#eb001b"/>
                    <circle cx="148" cy="68" r="60" fill="#f79e1b"/>
                    <circle cx="108" cy="68" r="36" fill="#ff5f00"/>
                </svg>
            `;
        case 'amex':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="American Express">
                    <rect width="200" height="120" fill="#006fcf"/>
                    <path d="M40,30 L60,90 L80,30 L100,90 L120,30 L140,90 L160,30" stroke="white" stroke-width="8" fill="none"/>
                </svg>
            `;
        case 'unionpay':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="UnionPay">
                    <rect width="200" height="120" fill="#0066cc"/>
                    <circle cx="100" cy="60" r="40" fill="#ffcc00"/>
                    <text x="100" y="65" text-anchor="middle" fill="#0066cc" font-size="40" font-weight="bold">U</text>
                </svg>
            `;
        case 'diners':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="Diners Club">
                    <rect width="200" height="120" fill="#0066b3"/>
                    <path d="M50,40 L150,40 L130,80 L70,80 Z" fill="white"/>
                </svg>
            `;
        case 'jcb':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="JCB">
                    <rect width="200" height="120" fill="#ef3340"/>
                    <circle cx="100" cy="60" r="40" fill="white"/>
                    <text x="100" y="65" text-anchor="middle" fill="#ef3340" font-size="40" font-weight="bold">J</text>
                </svg>
            `;
        case 'discover':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="Discover">
                    <rect width="200" height="120" fill="#ff6600"/>
                    <circle cx="100" cy="60" r="40" fill="white"/>
                    <text x="100" y="65" text-anchor="middle" fill="#ff6600" font-size="40" font-weight="bold">D</text>
                </svg>
            `;
        case 'elo':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="Elo">
                    <rect width="200" height="120" fill="#009739"/>
                    <path d="M60,40 C80,20 120,20 140,40 C160,60 160,100 140,80 C120,60 80,60 60,80 C40,100 40,60 60,40 Z" fill="white"/>
                </svg>
            `;
        case 'rupay':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="RuPay">
                    <rect width="200" height="120" fill="#ff9933"/>
                    <circle cx="100" cy="60" r="40" fill="white"/>
                    <text x="100" y="65" text-anchor="middle" fill="#ff9933" font-size="40" font-weight="bold">R</text>
                </svg>
            `;
        case 'mir':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="Mir">
                    <rect width="200" height="120" fill="#0033aa"/>
                    <circle cx="100" cy="60" r="40" fill="white"/>
                    <text x="100" y="65" text-anchor="middle" fill="#0033aa" font-size="40" font-weight="bold">M</text>
                </svg>
            `;
        case 'hipercard':
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="Hipercard">
                    <rect width="200" height="120" fill="#8b0000"/>
                    <circle cx="100" cy="60" r="40" fill="white"/>
                    <text x="100" y="65" text-anchor="middle" fill="#8b0000" font-size="40" font-weight="bold">H</text>
                </svg>
            `;
        default:
            return `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 64" ${size} style="position: absolute; bottom: 20px; right: 20px;" aria-label="Cartão">
                    <rect width="200" height="64" fill="white"/>
                    <text x="100" y="40" text-anchor="middle" fill="black" font-size="24" font-weight="bold">CARD</text>
                </svg>
            `;
    }
}

// ======================
// DETALHES DO CARTÃO (MODAL COM EFEITO 3D)
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

        const modalContent = `
            <div class="card-details-modal" style="max-width: 550px; padding: 2.5rem; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 28px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <div class="virtual-card ${cardConfig.designClass}" 
                     style="width: 100%; padding: 2rem; margin-bottom: 2rem; border-radius: 24px; background: linear-gradient(135deg, ${cardConfig.color} 0%, ${shadeColor(cardConfig.color, -40)} 100%); color: white; box-shadow: 0 15px 40px rgba(0,0,0,0.3); position: relative; transform: scale(1.05); transform-style: preserve-3d; transition: transform 0.5s;"
                     data-card-type="${cardType}">
                    
                    <div class="card-chip" style="position: absolute; top: 24px; left: 24px; background: rgba(255,255,255,0.2); padding: 6px 12px; border-radius: 4px; font-size: 0.7rem; font-weight: 600;">CHIP</div>
                    
                    ${getNetworkSVG(cardConfig.network, true)}
                    
                    <div class="card-tier" style="position: absolute; top: 24px; right: 24px; font-size: 0.9rem; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${cardConfig.tier}</div>
                    
                    <div class="card-number" style="font-size: 1.6rem; font-weight: 700; letter-spacing: 2px; margin: 60px 0 24px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${cardNumber}</div>
                    
                    <div class="card-holder" style="font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${currentUser.username}</div>
                    
                    <div class="card-footer" style="display: flex; justify-content: space-between; align-items: flex-end; font-size: 0.9rem; font-weight: 500;">
                        <div class="card-expiry">VALIDO ATE ${expiryDate}</div>
                        <div class="card-cvv">CVV: ${cvv}</div>
                    </div>
                </div>
                
                <div class="card-info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 2rem; color: white;">
                    <div class="card-info-item">
                        <strong>Titular:</strong>
                        <span>${currentUser.username}</span>
                    </div>
                    <div class="card-info-item">
                        <strong>Data de Aquisição:</strong>
                        <span>${new Date(cardData.acquiredAt).toLocaleDateString('pt-AO')}</span>
                    </div>
                    <div class="card-info-item">
                        <strong>Rede:</strong>
                        <span style="text-transform: uppercase; font-weight: 600;">${cardConfig.network}</span>
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
                        <span style="color: #10b981; font-weight: 600;">Ativo</span>
                    </div>
                </div>

                <div style="margin-bottom: 2rem; padding: 1.2rem; background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                    <strong style="color: white; display: block; margin-bottom: 0.8rem;">Benefícios Inclusos:</strong>
                    <ul style="margin: 0; padding: 0 0 0 1.5rem; color: rgba(255,255,255,0.9);">
                        ${cardConfig.perks.map(p => `<li style="margin-bottom: 0.4rem;">${p}</li>`).join('')}
                    </ul>
                </div>

                <div class="card-actions-full" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
                    <button class="btn btn-outline" style="flex: 1; min-width: 160px; padding: 0.8rem 1rem;" onclick="copyCardNumber('${cardNumber}')">
                        <i data-lucide="copy"></i> Copiar Número
                    </button>
                    <button class="btn btn-outline" style="flex: 1; min-width: 160px; padding: 0.8rem 1rem;" onclick="copyCardDetails('${cardNumber}', '${expiryDate}', '${cvv}')">
                        <i data-lucide="copy"></i> Copiar Todos os Dados
                    </button>
                </div>
            </div>
        `;
        
        createModal(
            { text: 'Detalhes do Cartão', icon: 'credit-card' },
            modalContent,
            [
                { text: 'Fechar', class: 'btn-secondary', icon: 'x', onclick: 'document.querySelector(".modal-overlay")?.remove()' }
            ]
        );
        
        setTimeout(() => {
            setupCardCopyListeners(cardNumber, expiryDate, cvv);
            // Aplica efeito 3D ao cartão no modal
            const modalCard = document.querySelector('.card-details-modal .virtual-card');
            if (modalCard) {
                modalCard.addEventListener('mousemove', (e) => {
                    const rect = modalCard.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 15;
                    const rotateY = (centerX - x) / 15;
                    
                    modalCard.style.transform = `scale(1.05) rotateY(${rotateY}deg) rotateX(${-rotateX}deg)`;
                });
                
                modalCard.addEventListener('mouseleave', () => {
                    modalCard.style.transform = 'scale(1.05) rotateY(0deg) rotateX(0deg)';
                });
            }
        }, 100);

    } catch (err) {
        handleError(err, "showCardDetails");
    }
}

// ======================
// CARROSSEL COMPLETO (SETAS + SWIPE + DOTS)
// ======================

let carouselState = {
    currentIndex: 0,
    isDragging: false,
    startPos: 0,
    currentTranslate: 0,
    prevTranslate: 0,
    animationID: 0,
    cardWidth: 0,
    totalCards: 0,
    autoPlay: null
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

        // Calcula largura do cartão (com margem)
        const firstCard = cards[0];
        if (!firstCard) return;
        const style = window.getComputedStyle(firstCard);
        const margin = parseFloat(style.marginRight) + parseFloat(style.marginLeft);
        carouselState.cardWidth = firstCard.offsetWidth + margin;

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
                e.preventDefault();
                prevCarouselSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextCarouselSlide();
            }
        });

        // Inicia no primeiro cartão
        goToCarouselSlide(0);

        // Estilo CSS necessário
        injectCarouselStyles();

        console.log("✅ Carrossel inicializado com sucesso.");

    } catch (err) {
        handleError(err, "setupCardCarousel");
    }
}

function injectCarouselStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .carousel-nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.95);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            color: #333;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0,0,0,0.1);
        }
        .carousel-nav-btn:hover {
            background: rgba(255,255,255,1);
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 6px 25px rgba(0,0,0,0.4);
        }
        .carousel-nav-btn.left { left: 20px; }
        .carousel-nav-btn.right { right: 20px; }
        .card-carousel-wrapper:hover .carousel-nav-btn,
        .carousel-nav-btn:focus {
            opacity: 1;
        }
        .carousel-nav-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
            transform: translateY(-50%) scale(1);
        }
        
        .carousel-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255,255,255,0.5);
            margin: 0 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        .carousel-dot.active {
            background: var(--primary, #2563eb);
            transform: scale(1.2);
            border-color: rgba(255,255,255,0.8);
        }
        .carousel-dot:hover {
            transform: scale(1.3);
            background: var(--primary, #2563eb);
        }
        
        .card-carousel {
            display: flex;
            align-items: center;
            padding: 20px 0;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .virtual-card:hover .card-actions {
            opacity: 1;
            transform: translateY(0);
            bottom: 0;
        }
    `;
    document.head.appendChild(style);
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
    document.body.style.userSelect = 'none';
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
    event.preventDefault();
    const currentPosition = getPositionX(event);
    carouselState.currentTranslate = carouselState.prevTranslate + currentPosition - carouselState.startPos;
}

function endDrag() {
    if (!carouselState.isDragging) return;
    cancelAnimationFrame(carouselState.animationID);
    carouselState.isDragging = false;
    document.body.style.userSelect = '';

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
    carousel.setAttribute('aria-roledescription', 'carrossel');
    carousel.setAttribute('aria-label', 'Carrossel de cartões Aurora');
    
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextCarouselSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevCarouselSlide();
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToCarouselSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToCarouselSlide(carouselState.totalCards - 1);
        }
    });
}

// ======================
// FUNÇÕES AUXILIARES (COM TRATAMENTO DE ERROS)
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
            `<div style="text-align: center; padding: 2rem;">
                <i data-lucide="alert-triangle" style="font-size: 4rem; color: var(--error); margin-bottom: 1.5rem;"></i>
                <h3 style="margin: 0 0 1.5rem 0; font-size: 1.5rem;">Tem certeza que deseja excluir?</h3>
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">Você está prestes a excluir o cartão <strong>${cardConfig.name}</strong>.</p>
                <p style="color: var(--text-secondary); font-size: 1rem; margin-top: 1rem;">Você receberá <strong>50% do valor</strong> (${formatCurrency(cardConfig.price * 0.5)}) como reembolso.</p>
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
// UTILS — MOEDA EM KZ (KWANZA ANGOLANO)
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

// ✅ FORMATAR MOEDA PARA KWANZA ANGOLANO (AOA)
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA',
        currencyDisplay: 'symbol'
    }).format(amount);
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

// Inicializa animações 3D se GSAP estiver disponível
if (typeof gsap === 'undefined') {
    console.warn("GSAP não encontrado. Efeitos 3D estarão limitados.");
    window.gsap = {
        to: (element, props) => {
            if (props.scale) element.style.transform = `scale(${props.scale})`;
            if (props.rotationY !== undefined) element.style.transform += ` rotateY(${props.rotationY}deg)`;
            if (props.rotationX !== undefined) element.style.transform += ` rotateX(${props.rotationX}deg)`;
        }
    };
}
