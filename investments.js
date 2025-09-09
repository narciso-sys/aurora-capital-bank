const INVESTMENT_PLANS = {
    conservador: { 
        name: 'Fundo Conservador', 
        risk: 'Baixo', 
        monthlyRate: { min: 0.004, max: 0.008 },
        description: 'Investimento de baixo risco com retornos estáveis. Ideal para iniciantes.',
        color: '#3b82f6'
    },
    moderado: { 
        name: 'Fundo Moderado', 
        risk: 'Médio', 
        monthlyRate: { min: 0.009, max: 0.015 },
        description: 'Equilíbrio entre risco e retorno. Crescimento consistente.',
        color: '#f59e0b'
    },
    agressivo: { 
        name: 'Fundo Agressivo', 
        risk: 'Alto', 
        monthlyRate: { min: -0.01, max: 0.03 },
        description: 'Alto potencial de retorno com maior risco. Volatilidade esperada.',
        color: '#ef4444'
    },
    daytrade: { 
        name: 'Carteira Day Trade Pro', 
        risk: 'Muito Alto', 
        monthlyRate: { min: -0.02, max: 0.06 },
        description: 'Operações diárias com ativos voláteis. Alta chance de ganhos rápidos — e perdas também.',
        color: '#8b5cf6'
    },
    cripto: { 
        name: 'Fundo Cripto Alpha', 
        risk: 'Extremo', 
        monthlyRate: { min: -0.03, max: 0.08 },
        description: 'Exposição a criptomoedas de alta volatilidade. Para quem busca retornos exponenciais.',
        color: '#06b6d4'
    },
    dividendos: { 
        name: 'Carteira Dividendos Premium', 
        risk: 'Baixo-Médio', 
        monthlyRate: { min: 0.005, max: 0.012 },
        description: 'Ações de empresas sólidas que pagam dividendos mensais. Crescimento lento e seguro.',
        color: '#10b981'
    },
    internacional: { 
        name: 'Fundo Global Explorer', 
        risk: 'Médio-Alto', 
        monthlyRate: { min: -0.005, max: 0.025 },
        description: 'Investimento em mercados internacionais com diversificação cambial e setorial.',
        color: '#ec4899'
    },
    // NOVOS: ULTRA ALTO RISCO / ALTO RETORNO
    sniper: { 
        name: 'Sniper de Ações', 
        risk: 'Ultra Alto', 
        monthlyRate: { min: -0.05, max: 0.12 },
        description: 'Compra e venda relâmpago de ações em movimento. Lucro ou perda em minutos.',
        color: '#dc2626'
    },
    futuros: { 
        name: 'Mercado de Futuros Turbo', 
        risk: 'Ultra Alto', 
        monthlyRate: { min: -0.06, max: 0.15 },
        description: 'Alavancagem extrema em contratos futuros. Só para corações fortes.',
        color: '#be123c'
    },
    opcoes: { 
        name: 'Opções Explosivas', 
        risk: 'Ultra Alto', 
        monthlyRate: { min: -0.07, max: 0.15 },
        description: 'Estratégias com opções de compra e venda. Ganhe muito ou perca tudo.',
        color: '#7c2d12'
    },
    // TRADING REAL (FICTÍCIO) - NOVO
    trading_real: { 
        name: 'Trading Real Fictício', 
        risk: 'Variável', 
        monthlyRate: { min: -0.04, max: 0.10 },
        description: 'Simulação em tempo real de operações como um trader profissional. Resultados imediatos e aleatórios.',
        color: '#059669'
    }
};

// Estado global para controle de abas e filtros
let currentInvestmentTab = 'ativos';
let filterDate = null;

function renderInvestments() {
    const { currentUser } = window.authManager;
    const app = document.getElementById('app');
    
    // Separar investimentos ativos e resgatados
    const allInvestments = currentUser.investments || {};
    const activeInvestments = Object.entries(allInvestments).filter(([id, inv]) => inv.status === 'active');
    const rescuedInvestments = Object.entries(allInvestments).filter(([id, inv]) => inv.status === 'rescued');

    // Aplicar filtro de data, se houver
    const filteredActive = filterDate ? activeInvestments.filter(([id, inv]) => {
        const invDate = new Date(inv.startDate);
        return invDate >= filterDate;
    }) : activeInvestments;

    const filteredRescued = filterDate ? rescuedInvestments.filter(([id, inv]) => {
        const invDate = new Date(inv.rescueDate || inv.startDate);
        return invDate >= filterDate;
    }) : rescuedInvestments;

    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel" style="margin-bottom: 20px; padding: 1.5rem; background: var(--surface); border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                <h3 style="margin-bottom: 1rem; color: var(--text-primary);">📈 Investir Agora</h3>
                <p style="margin-bottom: 1.5rem; color: var(--text-secondary); font-size: 0.95rem;">Escolha seu estilo de investimento. Resultados são calculados <strong>imediatamente</strong> após o investimento.</p>
                <div class="quick-actions-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                ${Object.entries(INVESTMENT_PLANS).map(([key, plan]) => `
                    <div class="action-btn investment-plan" 
                         style="cursor: pointer; 
                                background: linear-gradient(135deg, ${plan.color} 0%, ${shadeColor(plan.color, -20)} 100%); 
                                color: white; 
                                padding: 1.25rem; 
                                border-radius: 12px; 
                                transition: transform 0.2s, box-shadow 0.2s; 
                                box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
                         onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)';"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)';"
                         onclick="openInvestmentModal('${key}')">
                        <div class="plan-header" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                            <i data-lucide="briefcase" style="font-size: 1.25rem;"></i>
                            <h4 style="margin: 0; font-size: 1.1rem; font-weight: 600;">${plan.name}</h4>
                        </div>
                        <div class="plan-details" style="font-size: 0.875rem; line-height: 1.4;">
                            <p><strong>Risco:</strong> <span style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.5rem; border-radius: 9999px; font-size: 0.8rem;">${plan.risk}</span></p>
                            <p><strong>Retorno Imediato:</strong> ${plan.monthlyRate.min > 0 ? '+' : ''}${(plan.monthlyRate.min * 100).toFixed(1)}% a ${(plan.monthlyRate.max * 100).toFixed(1)}%</p>
                            <p class="plan-description" style="margin-top: 0.5rem; opacity: 0.9;">${plan.description}</p>
                        </div>
                    </div>
                `).join('')}
                </div>
            </div>

            <!-- Abas de Investimentos -->
            <div class="glass-panel" style="padding: 1.5rem; background: var(--surface); border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
                <div class="tabs" style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--border-color);">
                    <button class="tab-btn ${currentInvestmentTab === 'ativos' ? 'active' : ''}" 
                            style="padding: 0.75rem 1.5rem; border: none; background: none; font-weight: 600; font-size: 1rem; cursor: pointer; color: ${currentInvestmentTab === 'ativos' ? 'var(--primary)' : 'var(--text-secondary)'}; border-bottom: 3px solid ${currentInvestmentTab === 'ativos' ? 'var(--primary)' : 'transparent'}; transition: all 0.3s;"
                            onclick="switchInvestmentTab('ativos')">
                        💼 Investimentos Correntes
                    </button>
                    <button class="tab-btn ${currentInvestmentTab === 'levantados' ? 'active' : ''}" 
                            style="padding: 0.75rem 1.5rem; border: none; background: none; font-weight: 600; font-size: 1rem; cursor: pointer; color: ${currentInvestmentTab === 'levantados' ? 'var(--primary)' : 'var(--text-secondary)'}; border-bottom: 3px solid ${currentInvestmentTab === 'levantados' ? 'var(--primary)' : 'transparent'}; transition: all 0.3s;"
                            onclick="switchInvestmentTab('levantados')">
                        🗃️ Investimentos Levantados
                    </button>
                </div>

                <!-- Filtro de Data -->
                <div class="date-filter" style="margin: 1rem 0; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                    <label for="investment-date-filter" style="font-weight: 500; color: var(--text-primary); white-space: nowrap;">Filtrar por data a partir de:</label>
                    <input type="date" 
                           id="investment-date-filter" 
                           style="padding: 0.5rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--background); color: var(--text-primary); font-size: 0.95rem;"
                           onchange="applyDateFilter()" />
                    <button class="btn btn-secondary" 
                            style="padding: 0.5rem 1rem; background: var(--surface-light); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); cursor: pointer; font-size: 0.9rem; transition: background 0.2s;"
                            onmouseover="this.style.background='var(--surface)';"
                            onmouseout="this.style.background='var(--surface-light)';"
                            onclick="clearDateFilter()">
                        🗑️ Limpar Filtro
                    </button>
                </div>

                <!-- Conteúdo da aba ativa -->
                <div class="tab-content">
                    ${currentInvestmentTab === 'ativos' ? 
                        (filteredActive.length > 0 ? `
                            <div class="transaction-list" style="display: flex; flex-direction: column; gap: 1rem;">
                                ${filteredActive.map(([id, inv]) => renderInvestmentItem(id, inv)).join('')}
                            </div>
                        ` : `
                            <div class="no-investments" style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
                                <i data-lucide="briefcase" style="font-size: 48px; margin-bottom: 1rem; color: var(--text-secondary);"></i>
                                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Você não tem investimentos ativos.</p>
                                <p style="margin-top: 1rem; color: var(--text-secondary);">Comece investindo em um dos nossos fundos!</p>
                            </div>
                        `)
                    : 
                        (filteredRescued.length > 0 ? `
                            <div class="transaction-list" style="display: flex; flex-direction: column; gap: 1rem;">
                                ${filteredRescued.map(([id, inv]) => renderRescuedInvestmentItem(id, inv)).join('')}
                            </div>
                        ` : `
                            <div class="no-investments" style="text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
                                <i data-lucide="archive" style="font-size: 48px; margin-bottom: 1rem; color: var(--text-secondary);"></i>
                                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nenhum investimento levantado encontrado.</p>
                                <p style="margin-top: 1rem; color: var(--text-secondary);">Resgate um investimento para vê-lo aqui.</p>
                            </div>
                        `)
                    }
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function switchInvestmentTab(tab) {
    currentInvestmentTab = tab;
    renderInvestments();
}

function applyDateFilter() {
    const input = document.getElementById('investment-date-filter');
    if (input.value) {
        filterDate = new Date(input.value);
    } else {
        filterDate = null;
    }
    renderInvestments();
}

function clearDateFilter() {
    document.getElementById('investment-date-filter').value = '';
    filterDate = null;
    renderInvestments();
}

function openInvestmentModal(planKey) {
    const plan = INVESTMENT_PLANS[planKey];
    if (!plan) {
        showToast("Plano de investimento inválido.", "error");
        return;
    }
    
    const content = `
        <div class="investment-modal-content" style="padding: 1.5rem;">
            <div class="plan-header" style="background: linear-gradient(135deg, ${plan.color} 0%, ${shadeColor(plan.color, -20)} 100%); color: white; padding: 1.25rem; border-radius: 12px; margin: -1.5rem -1.5rem 1.5rem -1.5rem; display: flex; align-items: center; gap: 1rem;">
                <i data-lucide="zap" style="font-size: 1.5rem;"></i>
                <h3 style="margin: 0; font-size: 1.25rem;">${plan.name}</h3>
            </div>
            <div class="plan-details" style="margin-bottom: 1.5rem;">
                <p><strong>⚡ Risco:</strong> <span style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.9rem;">${plan.risk}</span></p>
                <p><strong>💰 Retorno Imediato Esperado:</strong> ${plan.monthlyRate.min > 0 ? '+' : ''}${(plan.monthlyRate.min * 100).toFixed(1)}% a ${(plan.monthlyRate.max * 100).toFixed(1)}%</p>
                <p><strong>📌 Descrição:</strong> ${plan.description}</p>
                <div style="margin-top: 1.5rem; padding: 1rem; background: var(--surface-light); border-radius: 10px; border-left: 4px solid ${plan.color};">
                    <p style="margin: 0; font-weight: 600; color: var(--text-primary);">💡 Simulação em tempo real:</p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: var(--text-secondary);">O resultado (lucro ou perda) é calculado <strong>imediatamente</strong> após o investimento, simulando uma operação de trading real.</p>
                </div>
            </div>
            <div class="input-group" style="margin-top: 1rem;">
                <label for="investment-amount" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary);">Valor do Investimento (mínimo A$ 1.000,00)</label>
                <input type="number" 
                       id="investment-amount" 
                       min="1000" 
                       step="100" 
                       placeholder="Digite o valor" 
                       required
                       style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--background); color: var(--text-primary); font-size: 1rem;">
            </div>
        </div>
    `;
    
    createModal(
        { text: 'Investir Agora', icon: 'trending-up' },
        content,
        [
            { 
                text: 'Cancelar', 
                class: 'btn-secondary', 
                icon: 'x', 
                onclick: 'document.querySelector(".modal-overlay").remove()',
                style: 'margin-right: 0.5rem; padding: 0.75rem 1.5rem;'
            },
            { 
                text: 'Investir', 
                class: 'btn btn-primary', 
                style: `background: ${plan.color}; padding: 0.75rem 1.5rem;`, 
                icon: 'zap', 
                onclick: `handleInvest('${planKey}')` 
            }
        ],
        { width: '500px' }
    );
}

async function handleInvest(planKey) {
    const { currentUser } = window.authManager;
    const plan = INVESTMENT_PLANS[planKey];
    const amount = parseFloat(document.getElementById('investment-amount').value);
    
    if (!plan) {
        showToast("Plano de investimento inválido.", "error");
        return;
    }
    
    if (!amount || amount < 1000) {
        showToast("O valor mínimo de investimento é A$ 1.000,00.", "error");
        return;
    }
    
    if (amount > currentUser.balance) {
        showToast("Saldo insuficiente para este investimento.", "error");
        return;
    }
    
    showLoading();
    try {
        const investmentId = generateUniqueId('inv');
        const timestamp = Date.now();
        
        // 🔥 CALCULAR RETORNO IMEDIATO NO MOMENTO DO INVESTIMENTO
        const randomRate = plan.monthlyRate.min + Math.random() * (plan.monthlyRate.max - plan.monthlyRate.min);
        const currentValue = amount * (1 + randomRate); // Aplicado imediatamente
        
        // Criar o investimento com valor já ajustado
        const investmentData = {
            id: investmentId,
            planKey: planKey,
            planName: plan.name,
            amount: amount,
            startDate: timestamp,
            lastUpdate: timestamp,
            currentValue: currentValue, // Já reflete o lucro/perda instantâneo
            status: 'active',
            risk: plan.risk,
            color: plan.color
        };
        
        // Atualizar dados do usuário
        const updates = {
            [`investments/${investmentId}`]: investmentData,
            balance: currentUser.balance - amount,
            [`transactions/${generateUniqueId('tx')}`]: {
                type: 'investment',
                amount: amount,
                planName: plan.name,
                planKey: planKey,
                investmentId: investmentId,
                timestamp: timestamp,
                status: 'completed',
                resultRate: randomRate // opcional: registrar a taxa aplicada
            }
        };
        
        await window.firebase.dbFunc.update(
            window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
            updates
        );
        
        document.querySelector(".modal-overlay")?.remove();
        
        const growth = ((currentValue / amount) - 1) * 100;
        const message = growth >= 0 ? 
            `✅ Investimento de ${formatCurrency(amount)} em ${plan.name} realizado! Lucro de ${growth.toFixed(2)}%!` :
            `⚠️ Investimento de ${formatCurrency(amount)} em ${plan.name} realizado. Perda de ${Math.abs(growth).toFixed(2)}%.`;
        
        showToast(message, growth >= 0 ? "success" : "warning");
        renderInvestments();
    } catch (error) {
        console.error("Erro ao realizar investimento:", error);
        showToast("Erro ao realizar investimento. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

function renderInvestmentItem(id, inv) {
    // Como o retorno já foi aplicado no momento do investimento, não recalculamos.
    // O valor atual é o que foi definido na compra.
    const growth = ((inv.currentValue / inv.amount) - 1) * 100;
    const startDate = new Date(inv.startDate).toLocaleDateString('pt-AO');
    const color = inv.color || '#3b82f6';
    
    return `
        <div class="transaction-item investment-item" 
             style="border-left: 4px solid ${color}; 
                    padding: 1.25rem; 
                    background: var(--surface); 
                    border-radius: 12px; 
                    display: flex; 
                    align-items: flex-start; 
                    gap: 1rem; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div class="tx-icon incoming" 
                 style="background: ${color}20; 
                        color: ${color}; 
                        width: 50px; 
                        height: 50px; 
                        border-radius: 12px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        flex-shrink: 0;">
                <i data-lucide="trending-up"></i>
            </div>
            <div class="tx-details" style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary);">${inv.planName}</h4>
                <p style="margin: 0.25rem 0; color: var(--text-secondary);"><strong>Iniciado em:</strong> ${startDate}</p>
                <p style="margin: 0.25rem 0; color: var(--text-secondary);"><strong>Valor investido:</strong> ${formatCurrency(inv.amount)}</p>
                <p style="margin: 0.25rem 0; font-weight: 600; ${growth >= 0 ? 'color: #10b981;' : 'color: #ef4444;'}">
                    <strong>Valor atual:</strong> ${formatCurrency(inv.currentValue)} 
                    <span style="font-size: 0.85em;">(${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%)</span>
                </p>
                <p style="margin: 0.25rem 0; color: var(--text-secondary);"><strong>Risco:</strong> ${inv.risk}</p>
            </div>
            <div class="tx-actions" style="display: flex; align-items: center;">
                <button class="btn btn-secondary" 
                        style="padding: 0.5rem 1rem; background: var(--surface-light); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); cursor: pointer; font-size: 0.9rem;"
                        onclick="handleRescueInvestment('${id}')">
                    <i data-lucide="dollar-sign" style="margin-right: 0.5rem;"></i> Resgatar
                </button>
            </div>
        </div>
    `;
}

function renderRescuedInvestmentItem(id, inv) {
    const rescueDate = inv.rescueDate ? new Date(inv.rescueDate).toLocaleDateString('pt-AO') : '—';
    const startDate = new Date(inv.startDate).toLocaleDateString('pt-AO');
    const growth = ((inv.currentValue / inv.amount) - 1) * 100;
    const color = inv.color || '#3b82f6';
    
    return `
        <div class="transaction-item investment-item" 
             style="border-left: 4px solid ${color}; 
                    padding: 1.25rem; 
                    background: var(--surface); 
                    border-radius: 12px; 
                    display: flex; 
                    align-items: flex-start; 
                    gap: 1rem; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
                    opacity: 0.85;">
            <div class="tx-icon incoming" 
                 style="background: ${color}20; 
                        color: ${color}; 
                        width: 50px; 
                        height: 50px; 
                        border-radius: 12px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        flex-shrink: 0;">
                <i data-lucide="archive"></i>
            </div>
            <div class="tx-details" style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; color: var(--text-primary);">${inv.planName} <span style="font-size: 0.8em; color: var(--text-secondary); font-weight: normal;">(Resgatado)</span></h4>
                <p style="margin: 0.25rem 0; color: var(--text-secondary);"><strong>Iniciado:</strong> ${startDate}</p>
                <p style="margin: 0.25rem 0; color: var(--text-secondary);"><strong>Resgatado:</strong> ${rescueDate}</p>
                <p style="margin: 0.25rem 0; color: var(--text-secondary);"><strong>Valor investido:</strong> ${formatCurrency(inv.amount)}</p>
                <p style="margin: 0.25rem 0; font-weight: 600; ${growth >= 0 ? 'color: #10b981;' : 'color: #ef4444;'}">
                    <strong>Valor resgatado:</strong> ${formatCurrency(inv.currentValue)} 
                    <span style="font-size: 0.85em;">(${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%)</span>
                </p>
                <p style="margin: 0.25rem 0; color: var(--text-secondary);"><strong>Risco:</strong> ${inv.risk}</p>
            </div>
        </div>
    `;
}

async function handleRescueInvestment(invId) {
    const { currentUser } = window.authManager;
    const investment = currentUser.investments?.[invId];
    
    if (!investment || investment.status !== 'active') {
        showToast("Investimento não encontrado ou já resgatado.", "error");
        return;
    }
    
    // Valor de resgate = valor atual (já definido no investimento)
    const rescueAmount = investment.currentValue;

    showLoading();
    try {
        // Atualizar dados do usuário
        const updates = {};
        updates[`investments/${invId}/status`] = 'rescued';
        updates[`investments/${invId}/rescueDate`] = Date.now();
        updates.balance = (currentUser.balance || 0) + rescueAmount;
        updates[`transactions/${generateUniqueId('tx')}`] = {
            type: 'investment_return',
            amount: rescueAmount,
            description: `Resgate de investimento ${investment.planName}`,
            investmentId: invId,
            timestamp: Date.now(),
            status: 'completed'
        };
        
        await window.firebase.dbFunc.update(
            window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
            updates
        );
        
        showToast(`✅ Investimento resgatado! ${formatCurrency(rescueAmount)} creditados na sua conta.`, "success");
        renderInvestments();
    } catch (error) {
        console.error("Erro ao resgatar investimento:", error);
        showToast("Erro ao resgatar investimento. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

// Função utilitária para gerar ID único
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
