const STORE_PRODUCTS = [
    { id: 'ebook_finance', name: 'E-book: Finanças 101', price: 1999.99, icon: 'book-open', category: 'educação', description: 'O guia essencial para iniciantes em finanças pessoais.' },
    { id: 'webinar_invest', name: 'Acesso ao Webinar de Investimentos', price: 4999.50, icon: 'video', category: 'educação', description: 'Aprenda com especialistas de mercado sobre estratégias de investimento.' },
    { id: 'consult_sim', name: 'Consulta Financeira (Simulada)', price: 15000.00, icon: 'users', category: 'serviços', description: 'Uma sessão 1-para-1 para planear o seu futuro financeiro.' },
    { id: 'premium_sub', name: 'Assinatura Aurora Premium (1 Mês)', price: 999.99, icon: 'star', category: 'assinatura', description: 'Benefícios e taxas reduzidas por 30 dias.' },
    { id: 'course_invest', name: 'Curso Completo de Investimentos', price: 29999.99, icon: 'graduation-cap', category: 'educação', description: 'Domine os fundamentos dos investimentos com nosso curso completo.' },
    { id: 'financial_planner', name: 'Planejador Financeiro Personalizado', price: 19999.99, icon: 'calendar', category: 'serviços', description: 'Um plano financeiro personalizado para seus objetivos.' },
    { id: 'tax_consultation', name: 'Consulta de Planejamento Tributário', price: 24999.99, icon: 'file-text', category: 'serviços', description: 'Otimize sua situação fiscal com nossa consultoria especializada.' },
    { id: 'retirement_plan', name: 'Plano de Aposentadoria Personalizado', price: 29999.99, icon: 'umbrella', category: 'serviços', description: 'Planeje sua aposentadoria com segurança e tranquilidade.' },
    { id: 'business_consult', name: 'Consultoria para Empreendedores', price: 34999.99, icon: 'briefcase', category: 'serviços', description: 'Estratégias financeiras para o seu negócio crescer.' },
    { id: 'real_estate_guide', name: 'Guia de Investimentos em Imóveis', price: 14999.99, icon: 'home', category: 'educação', description: 'Aprenda a investir em imóveis com segurança e rentabilidade.' },
    { id: 'crypto_course', name: 'Curso de Criptomoedas', price: 19999.99, icon: 'bitcoin', category: 'educação', description: 'Domine o mundo das criptomoedas e blockchain.' },
    { id: 'stock_market', name: 'Análise Técnica para o Mercado de Ações', price: 24999.99, icon: 'trending-up', category: 'educação', description: 'Aprenda a analisar gráficos e tomar decisões de investimento.' },
    { id: 'financial_psychology', name: 'Psicologia Financeira', price: 12999.99, icon: 'brain', category: 'educação', description: 'Entenda como suas emoções afetam suas decisões financeiras.' },
    { id: 'family_budget', name: 'Planejamento Financeiro Familiar', price: 17999.99, icon: 'heart', category: 'serviços', description: 'Crie um plano financeiro que funcione para toda a família.' },
    { id: 'debt_free', name: 'Programa para Ficar Livre de Dívidas', price: 15999.99, icon: 'check-circle', category: 'educação', description: 'Método comprovado para eliminar suas dívidas em 12 meses.' },
    { id: 'emergency_fund', name: 'Guia do Fundo de Emergência', price: 9999.99, icon: 'shield', category: 'educação', description: 'Aprenda a criar e manter seu fundo de emergência.' },
    { id: 'passive_income', name: 'Curso de Renda Passiva', price: 29999.99, icon: 'dollar-sign', category: 'educação', description: 'Descubra como criar múltiplas fontes de renda passiva.' },
    { id: 'financial_independence', name: 'Caminho para a Independência Financeira', price: 39999.99, icon: 'flag', category: 'educação', description: 'O plano completo para alcançar sua liberdade financeira.' },
    { id: 'investment_portfolio', name: 'Análise da sua Carteira de Investimentos', price: 24999.99, icon: 'pie-chart', category: 'serviços', description: 'Análise profissional da sua carteira de investimentos.' },
    { id: 'financial_audit', name: 'Auditoria Financeira Completa', price: 34999.99, icon: 'clipboard', category: 'serviços', description: 'Análise detalhada da sua situação financeira atual.' },
    { id: 'financial_goals', name: 'Definição de Metas Financeiras', price: 14999.99, icon: 'target', category: 'serviços', description: 'Defina e planeje suas metas financeiras de curto e longo prazo.' },
    { id: 'financial_habits', name: 'Hábitos Financeiros que Enriquecem', price: 12999.99, icon: 'clock', category: 'educação', description: 'Desenvolva hábitos diários que transformarão sua vida financeira.' },
    { id: 'negotiation_skills', name: 'Curso de Negociação Financeira', price: 19999.99, icon: 'message-circle', category: 'educação', description: 'Aprenda a negociar melhores condições financeiras em todas as áreas.' },
    { id: 'financial_tools', name: 'Pacote de Ferramentas Financeiras', price: 7999.99, icon: 'tool', category: 'ferramentas', description: 'Planilhas, calculadoras e templates para gerenciar suas finanças.' },
    { id: 'financial_apps', name: 'Acesso a Aplicativos Premium', price: 5999.99, icon: 'smartphone', category: 'ferramentas', description: 'Acesso premium a nossos aplicativos de gestão financeira.' },
    { id: 'financial_community', name: 'Acesso à Comunidade Aurora', price: 3999.99, icon: 'users', category: 'comunidade', description: 'Participe de nossa comunidade exclusiva de investidores.' },
    { id: 'financial_events', name: 'Ingressos para Eventos Financeiros', price: 8999.99, icon: 'ticket', category: 'eventos', description: 'Participe de nossos eventos exclusivos com especialistas financeiros.' },
    { id: 'financial_mentor', name: 'Mentoria Financeira (3 meses)', price: 59999.99, icon: 'user-check', category: 'serviços', description: 'Acompanhamento personalizado com um mentor financeiro por 3 meses.' },
    { id: 'financial_coach', name: 'Coaching Financeiro (6 meses)', price: 89999.99, icon: 'user-plus', category: 'serviços', description: 'Transformação financeira completa com nosso coaching de 6 meses.' },
    { id: 'financial_master', name: 'Masterclass de Finanças', price: 49999.99, icon: 'award', category: 'educação', description: 'O curso mais completo de finanças pessoais e investimentos.' },
    { id: 'financial_workshop', name: 'Workshop de Orçamento Familiar', price: 12999.99, icon: 'clipboard-list', category: 'educação', description: 'Aprenda a criar e manter um orçamento familiar eficiente.' },
    { id: 'financial_seminar', name: 'Seminário de Investimentos em Renda Fixa', price: 18999.99, icon: 'bar-chart-2', category: 'educação', description: 'Domine os investimentos em renda fixa com nosso seminário completo.' },
    { id: 'financial_retreat', name: 'Retiro Financeiro de 3 Dias', price: 79999.99, icon: 'sun', category: 'eventos', description: 'Um retiro imersivo para transformar sua relação com o dinheiro.' },
    { id: 'financial_intensive', name: 'Curso Intensivo de 5 Dias', price: 49999.99, icon: 'clock', category: 'educação', description: 'Transforme sua vida financeira em apenas 5 dias intensivos.' }
];

function renderStore() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel">
                <div class="store-header">
                    <h3>Loja Aurora</h3>
                    <p style="margin-bottom: 2rem; color: var(--text-secondary);">Use o seu saldo para adquirir produtos e serviços exclusivos.</p>
                    
                    <div class="store-controls">
                        <div class="search-box">
                            <i data-lucide="search"></i>
                            <input type="text" id="product-search" placeholder="Buscar produtos...">
                        </div>
                        <select id="product-category" class="category-filter">
                            <option value="all">Todas as categorias</option>
                            <option value="educação">Educação</option>
                            <option value="serviços">Serviços</option>
                            <option value="assinatura">Assinaturas</option>
                            <option value="ferramentas">Ferramentas</option>
                            <option value="comunidade">Comunidade</option>
                            <option value="eventos">Eventos</option>
                        </select>
                    </div>
                </div>
                
                <div class="products-grid" id="products-grid">
                    ${STORE_PRODUCTS.map(product => renderProductCard(product)).join('')}
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
    
    // Configurar filtros de busca
    setupProductFilters();
}

function renderMyProducts() {
    const { currentUser } = window.authManager;
    const app = document.getElementById('app');
    const userProducts = Object.values(currentUser.products || {});

    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel">
                <h3>Meus Produtos Adquiridos</h3>
                ${userProducts.length > 0 ? `
                    <div class="transaction-list">
                    ${userProducts.map(p => {
                        const productDetails = STORE_PRODUCTS.find(sp => sp.id === p.productId);
                        return `
                            <div class="transaction-item">
                                <div class="tx-icon incoming">
                                    <i data-lucide="${productDetails?.icon || 'package'}"></i>
                                </div>
                                <div class="tx-details">
                                    <h4>${productDetails?.name || 'Produto não encontrado'}</h4>
                                    <p>Adquirido em: ${new Date(p.acquiredAt).toLocaleDateString('pt-AO')}</p>
                                    <p>${productDetails?.description || ''}</p>
                                </div>
                                <div class="tx-actions">
                                    <button class="btn btn-outline" onclick="accessProduct('${p.productId}')">
                                        <i data-lucide="play"></i> Acessar
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                    </div>
                ` : `
                    <div class="no-products">
                        <i data-lucide="package" style="font-size: 48px; margin-bottom: 1rem; color: var(--text-secondary);"></i>
                        <p>Você ainda não adquiriu nenhum produto.</p>
                        <p style="margin-top: 1rem; color: var(--text-secondary);">Visite nossa loja para encontrar produtos que podem ajudar você!</p>
                    </div>
                `}
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-header">
                <i data-lucide="${product.icon}"></i>
                <span class="product-category">${product.category}</span>
            </div>
            <h4 class="product-title">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <button class="btn btn-primary" onclick="handleBuyProduct('${product.id}')">
                <i data-lucide="shopping-cart"></i> Comprar
            </button>
        </div>
    `;
}

function setupProductFilters() {
    const searchInput = document.getElementById('product-search');
    const categorySelect = document.getElementById('product-category');
    const productsGrid = document.getElementById('products-grid');
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const categoryFilter = categorySelect.value;
        
        const productCards = productsGrid.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productName = card.querySelector('.product-title').textContent.toLowerCase();
            const productCategory = card.dataset.category;
            
            const matchesSearch = searchTerm === '' || productName.includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || productCategory === categoryFilter;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
}

function handleBuyProduct(productId) {
    const { currentUser } = window.authManager;
    const product = STORE_PRODUCTS.find(p => p.id === productId);
    
    if (!product) {
        showToast("Produto não encontrado.", "error");
        return;
    }
    
    if (currentUser.balance < product.price) {
        showToast("Saldo insuficiente para adquirir este produto.", "error");
        return;
    }
    
    showLoading();
    try {
        const productIdKey = generateUniqueId('prod');
        const timestamp = Date.now();
        
        // Atualizar dados do usuário
        const updates = {
            [`products/${productIdKey}`]: {
                productId: productId,
                acquiredAt: timestamp
            },
            balance: currentUser.balance - product.price,
            [`transactions/${generateUniqueId('tx')}`]: {
                type: 'purchase',
                amount: product.price,
                description: `Compra de ${product.name}`,
                productId: productId,
                timestamp: timestamp,
                status: 'completed'
            }
        };
        
        window.firebase.dbFunc.update(
            window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
            updates
        ).then(() => {
            showToast(`${product.name} adquirido com sucesso!`, "success");
        }).catch(error => {
            console.error("Erro ao adquirir produto:", error);
            showToast("Erro ao adquirir produto. Tente novamente.", "error");
        });
    } catch (error) {
        console.error("Erro ao adquirir produto:", error);
        showToast("Erro ao adquirir produto. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

function accessProduct(productId) {
    const product = STORE_PRODUCTS.find(p => p.id === productId);
    
    if (!product) {
        showToast("Produto não encontrado.", "error");
        return;
    }
    
    // Simular acesso ao produto
    createModal(
        { text: `Acessar ${product.name}`, icon: product.icon },
        `
        <div class="product-access-modal">
            <div class="access-header">
                <i data-lucide="${product.icon}"></i>
                <h3>${product.name}</h3>
            </div>
            <div class="access-content">
                <p>Parabéns! Você tem acesso completo a este produto.</p>
                <p>Em breve, você receberá um email com instruções detalhadas sobre como acessar seu produto.</p>
                <p>Se você tiver alguma dúvida, entre em contato com nosso suporte.</p>
            </div>
        </div>
        `,
        [
            { text: 'Ok', class: 'btn-primary', icon: 'check', onclick: 'document.querySelector(".modal-overlay").remove();' }
        ]
    );
}

// Função utilitária para gerar ID único
function generateUniqueId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}