const INVESTMENT_PLANS = {
    conservador: { 
        name: 'Fundo Conservador', 
        risk: 'Baixo', 
        monthlyRate: { min: 0.004, max: 0.008 },
        description: 'Investimento de baixo risco com retornos estáveis',
        color: '#3b82f6'
    },
    moderado: { 
        name: 'Fundo Moderado', 
        risk: 'Médio', 
        monthlyRate: { min: 0.009, max: 0.015 },
        description: 'Equilíbrio entre risco e retorno',
        color: '#f59e0b'
    },
    agressivo: { 
        name: 'Fundo Agressivo', 
        risk: 'Alto', 
        monthlyRate: { min: -0.01, max: 0.03 },
        description: 'Alto potencial de retorno com maior risco',
        color: '#ef4444'
    }
};

function renderInvestments() {
    const { currentUser } = window.authManager;
    const app = document.getElementById('app');
    const userInvestments = Object.entries(currentUser.investments || {});

    app.innerHTML = `
        <div class="page-container">
             <div class="glass-panel" style="margin-bottom: 20px;">
                <h3>Investir</h3>
                <p style="margin-bottom: 1rem; color: var(--text-secondary);">Escolha um fundo de investimento que se alinhe com o seu perfil de risco.</p>
                <div class="quick-actions-grid">
                ${Object.entries(INVESTMENT_PLANS).map(([key, plan]) => `
                    <div class="action-btn investment-plan" style="cursor: pointer; background: linear-gradient(135deg, ${plan.color} 0%, ${shadeColor(plan.color, -20)} 100%); color: white;" onclick="openInvestmentModal('${key}')">
                        <div class="plan-header">
                            <i data-lucide="briefcase"></i>
                            <h4>${plan.name}</h4>
                        </div>
                        <div class="plan-details">
                            <p><strong>Risco:</strong> ${plan.risk}</p>
                            <p><strong>Rendimento Esperado:</strong> ${plan.monthlyRate.min > 0 ? '+' : ''}${(plan.monthlyRate.min * 100).toFixed(1)}% a ${(plan.monthlyRate.max * 100).toFixed(1)}% ao mês</p>
                            <p class="plan-description">${plan.description}</p>
                        </div>
                    </div>
                `).join('')}
                </div>
            </div>
            <div class="glass-panel">
                <h3>Meus Investimentos</h3>
                ${userInvestments.length > 0 ? `
                    <div class="transaction-list">
                    ${userInvestments.map(([id, inv]) => renderInvestmentItem(id, inv)).join('')}
                    </div>
                ` : `
                    <div class="no-investments">
                        <i data-lucide="briefcase" style="font-size: 48px; margin-bottom: 1rem; color: var(--text-secondary);"></i>
                        <p>Você ainda não tem investimentos ativos.</p>
                        <p style="margin-top: 1rem; color: var(--text-secondary);">Comece investindo em um dos nossos fundos!</p>
                    </div>
                `}
            </div>
        </div>
    `;
    lucide.createIcons();
}

function openInvestmentModal(planKey) {
    const plan = INVESTMENT_PLANS[planKey];
    if (!plan) {
        showToast("Plano de investimento inválido.", "error");
        return;
    }
    
    const content = `
        <div class="investment-modal-content">
            <div class="plan-header" style="background: linear-gradient(135deg, ${plan.color} 0%, ${shadeColor(plan.color, -20)} 100%); color: white; padding: 1rem; border-radius: 8px 8px 0 0; margin: -1.5rem -1.5rem 1rem -1.5rem;">
                <i data-lucide="briefcase"></i>
                <h3>${plan.name}</h3>
            </div>
            <div class="plan-details">
                <p><strong>Risco:</strong> ${plan.risk}</p>
                <p><strong>Rendimento Esperado:</strong> ${plan.monthlyRate.min > 0 ? '+' : ''}${(plan.monthlyRate.min * 100).toFixed(1)}% a ${(plan.monthlyRate.max * 100).toFixed(1)}% ao mês</p>
                <p><strong>Descrição:</strong> ${plan.description}</p>
                <p style="margin-top: 1rem; font-weight: 600;">Invista seu dinheiro e veja-o crescer com o tempo. Os rendimentos são creditados mensalmente.</p>
            </div>
            <div class="input-group" style="margin-top: 1rem;">
                <label for="investment-amount">Valor do Investimento (mínimo A$ 1.000,00)</label>
                <input type="number" id="investment-amount" min="1000" step="100" placeholder="Digite o valor" required>
            </div>
            <div class="investment-info" style="margin-top: 1rem; padding: 1rem; background: var(--surface-light); border-radius: 8px;">
                <h4 style="margin-bottom: 0.5rem;">Informações Importantes:</h4>
                <ul style="margin: 0; padding-left: 1.5rem;">
                    <li>Os rendimentos são calculados mensalmente</li>
                    <li>Você pode resgatar seu investimento a qualquer momento</li>
                    <li>O valor atual pode variar conforme o desempenho do fundo</li>
                </ul>
            </div>
        </div>
    `;
    
    createModal(
        { text: 'Investir', icon: 'trending-up' },
        content,
        [
            { text: 'Cancelar', class: 'btn-secondary', icon: 'x', onclick: 'document.querySelector(".modal-overlay").remove()' },
            { text: 'Investir', class: 'btn btn-primary', style: `background: ${plan.color};`, icon: 'dollar-sign', onclick: `handleInvest('${planKey}')` }
        ]
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
        
        // Calcular valor inicial com base no desempenho do fundo
        const randomRate = plan.monthlyRate.min + Math.random() * (plan.monthlyRate.max - plan.monthlyRate.min);
        const currentValue = amount * (1 + randomRate);
        
        // Criar o investimento
        const investmentData = {
            id: investmentId,
            planKey: planKey,
            planName: plan.name,
            amount: amount,
            startDate: timestamp,
            lastUpdate: timestamp,
            currentValue: currentValue,
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
                status: 'completed'
            }
        };
        
        await window.firebase.dbFunc.update(
            window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
            updates
        );
        
        document.querySelector(".modal-overlay")?.remove();
        showToast(`Investimento de ${formatCurrency(amount)} em ${plan.name} realizado com sucesso!`, "success");
        renderInvestments();
    } catch (error) {
        console.error("Erro ao realizar investimento:", error);
        showToast("Erro ao realizar investimento. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

function renderInvestmentItem(id, inv) {
    const plan = INVESTMENT_PLANS[inv.planKey];
    const startDate = new Date(inv.startDate).toLocaleDateString('pt-AO');
    const months = Math.floor((Date.now() - inv.startDate) / (30 * 24 * 60 * 60 * 1000));
    const growth = ((inv.currentValue / inv.amount) - 1) * 100;
    const color = inv.color || '#3b82f6';
    
    return `
        <div class="transaction-item investment-item" style="border-left: 4px solid ${color};">
            <div class="tx-icon incoming" style="background: ${color}20; color: ${color};">
                <i data-lucide="briefcase"></i>
            </div>
            <div class="tx-details">
                <h4>${inv.planName}</h4>
                <p><strong>Iniciado em:</strong> ${startDate}</p>
                <p><strong>Período:</strong> ${months} mês(es)</p>
                <p><strong>Valor inicial:</strong> ${formatCurrency(inv.amount)}</p>
                <p><strong>Valor atual:</strong> ${formatCurrency(inv.currentValue)}</p>
                <p class="growth-indicator ${growth >= 0 ? 'positive' : 'negative'}">
                    <strong>Rendimento:</strong> ${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%
                </p>
                <p><strong>Risco:</strong> ${inv.risk}</p>
            </div>
            <div class="tx-actions">
                <button class="btn btn-secondary" onclick="handleRescueInvestment('${id}')">
                    <i data-lucide="dollar-sign"></i> Resgatar
                </button>
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
    
    showLoading();
    try {
        // Calcular valor de resgate (valor atual)
        const rescueAmount = investment.currentValue;
        
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
        
        showToast(`Investimento resgatado com sucesso! ${formatCurrency(rescueAmount)} creditados na sua conta.`, "success");
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