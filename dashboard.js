function renderDashboard() {
    const { currentUser } = window.authManager;
    const app = document.getElementById('app');
    
    const transactions = Object.values(currentUser.transactions || {});
    const totalSpent = transactions.filter(t => t.type.includes('out') || t.type === 'card_payment').reduce((sum, t) => sum + t.amount, 0);
    const totalEarned = transactions.filter(t => t.type.includes('in') || t.type === 'game_win').reduce((sum, t) => sum + t.amount, 0);

    app.innerHTML = `
        <div class="page-container dashboard-grid">
            <div class="dash-card-large glass-panel">
                <div class="stat-card">
                    <span class="label"><i data-lucide="wallet"></i> Saldo Principal</span>
                    <h2 class="value">${formatCurrency(currentUser.balance)}</h2>
                    <button class="btn btn-outline copy-btn" onclick="copyToClipboard('${currentUser.balance}', 'Saldo principal')">
                        <i data-lucide="copy"></i> Copiar
                    </button>
                </div>
            </div>
            <div class="dash-card glass-panel">
                <div class="stat-card">
                    <span class="label"><i data-lucide="gamepad-2"></i> Saldo de Jogos</span>
                    <h2 class="value">${formatCurrency(currentUser.gameBalance || 0)}</h2>
                    ${(currentUser.gameBalance || 0) > 0 ? '<button class="btn btn-secondary" id="redeem-btn" style="margin-top: 10px;"><i data-lucide="arrow-down-to-line"></i> Resgatar</button>' : ''}
                </div>
            </div>
             <div class="dash-card glass-panel">
                <div class="stat-card">
                    <span class="label"><i data-lucide="trending-up"></i> Total Gasto (Mês)</span>
                    <h2 class="value negative">${formatCurrency(totalSpent)}</h2>
                </div>
            </div>
            <div class="dash-card glass-panel">
                 <div class="stat-card">
                    <span class="label"><i data-lucide="trending-down"></i> Total Ganho (Mês)</span>
                    <h2 class="value positive">${formatCurrency(totalEarned)}</h2>
                </div>
            </div>
            <div class="dash-card-full glass-panel">
                <h3>Atividade Recente</h3>
                <canvas id="activityChart"></canvas>
            </div>
            <div class="dash-card-full glass-panel">
                <h3>Ações Rápidas</h3>
                <div class="quick-actions-grid">
                    <a href="#transactions" class="action-btn">
                        <i data-lucide="arrow-right-left"></i>
                        <span>Transferir</span>
                    </a>
                    <a href="#cards" class="action-btn">
                        <i data-lucide="credit-card"></i>
                        <span>Meus Cartões</span>
                    </a>
                    <a href="#investments" class="action-btn">
                        <i data-lucide="bar-chart-2"></i>
                        <span>Investir</span>
                    </a>
                    <a href="#store" class="action-btn">
                        <i data-lucide="shopping-cart"></i>
                        <span>Loja Aurora</span>
                    </a>
                    <a href="#games" class="action-btn">
                        <i data-lucide="play-circle"></i>
                        <span>Jogar & Ganhar</span>
                    </a>
                    <a href="#settings" class="action-btn">
                        <i data-lucide="settings"></i>
                        <span>Configurações</span>
                    </a>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
    
    document.getElementById('redeem-btn')?.addEventListener('click', handleRedeem);

    const ctx = document.getElementById('activityChart').getContext('2d');
    const recentTxs = transactions.slice(-10);
    if (window.chartInstance) window.chartInstance.destroy();
    window.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: recentTxs.map(t => new Date(t.timestamp).toLocaleDateString('pt-AO')),
            datasets: [{
                label: 'Valor da Transação',
                data: recentTxs.map(t => t.type.includes('in') || t.type.includes('win') ? t.amount : -t.amount),
                borderColor: (context) => context.raw >= 0 ? 'rgba(46, 160, 67, 1)' : 'rgba(248, 81, 73, 1)',
                backgroundColor: (context) => context.raw >= 0 ? 'rgba(46, 160, 67, 0.2)' : 'rgba(248, 81, 73, 0.2)',
                borderWidth: 2, tension: 0.4, fill: true
            }]
        },
        options: { 
            responsive: true, 
            scales: { 
                y: { 
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value).replace('A$', '');
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(Math.abs(context.raw))}`;
                        }
                    }
                }
            }
        }
    });
}

function handleRedeem() {
    const { currentUser } = window.authManager;
    const gameBalance = currentUser.gameBalance || 0;
    
    if (gameBalance <= 0) {
        showToast("Você não tem saldo de jogos para resgatar.", "info");
        return;
    }
    
    showLoading();
    try {
        // Transferir saldo de jogos para saldo principal
        const updates = {
            balance: (currentUser.balance || 0) + gameBalance,
            gameBalance: 0,
            [`transactions/${generateUniqueId('tx')}`]: {
                type: 'game_redeem',
                amount: gameBalance,
                description: 'Resgate de saldo de jogos',
                timestamp: Date.now(),
                status: 'completed'
            }
        };
        
        window.firebase.dbFunc.update(
            window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
            updates
        ).then(() => {
            showToast(`Saldo de jogos de ${formatCurrency(gameBalance)} resgatado com sucesso!`, "success");
            renderDashboard();
        }).catch(error => {
            console.error("Erro ao resgatar saldo de jogos:", error);
            showToast("Erro ao resgatar saldo de jogos. Tente novamente.", "error");
        });
    } catch (error) {
        console.error("Erro ao resgatar saldo de jogos:", error);
        showToast("Erro ao resgatar saldo de jogos. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

function copyToClipboard(text, description) {
    navigator.clipboard.writeText(text.toString())
        .then(() => {
            showToast(`${description} copiado para a área de transferência!`, "success");
        })
        .catch(err => {
            showToast("Erro ao copiar. Tente novamente.", "error");
        });
}

// Função utilitária para gerar ID único
function generateUniqueId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}