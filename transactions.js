function renderTransactions() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel" style="margin-bottom: 20px;">
                <h3>Nova Transferência</h3>
                <form id="transfer-form" class="auth-form" style="flex-direction: row; gap: 20px; align-items: flex-end;">
                    <div class="input-group" style="flex: 3;">
                        <label for="recipient-key">PIX (email) ou IBAN do Destinatário</label>
                        <div style="position: relative;">
                            <input type="text" id="recipient-key" placeholder="Digite a chave PIX ou IBAN" required>
                            <button type="button" id="copy-iban-btn" class="copy-btn" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: none;" title="Copiar seu IBAN">
                                <i data-lucide="copy"></i>
                            </button>
                            <button type="button" id="copy-pix-btn" class="copy-btn" style="position: absolute; right: 45px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: none;" title="Copiar sua chave PIX">
                                <i data-lucide="copy"></i>
                            </button>
                        </div>
                        <div id="recipient-info" style="margin-top: 5px; font-size: 0.9rem; color: var(--text-secondary);">Digite um email ou IBAN para verificar</div>
                    </div>
                    <div class="input-group" style="flex: 1;">
                        <label for="transfer-amount">Valor</label>
                        <input type="number" id="transfer-amount" min="1" step="0.01" placeholder="0.00" required>
                    </div>
                    <button type="submit" class="btn btn-primary" id="send-btn" disabled>
                        <i data-lucide="send"></i> Enviar
                    </button>
                </form>
            </div>
            <div class="glass-panel">
                <h3>Histórico de Transações</h3>
                <div class="transaction-list" id="transaction-list">
                    <p style="text-align: center; padding: 20px; color: var(--text-secondary);">A carregar histórico...</p>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
    
    // Configurar botões de cópia
    setupCopyButtons();
    
    document.getElementById('recipient-key').addEventListener('input', handleRecipientValidation);
    document.getElementById('transfer-form').addEventListener('submit', handleTransfer);
    renderTransactionList();
}

function setupCopyButtons() {
    const { currentUser } = window.authManager;
    
    // Botão de cópia de IBAN
    const copyIbanBtn = document.getElementById('copy-iban-btn');
    if (copyIbanBtn && currentUser?.iban) {
        copyIbanBtn.style.display = 'block';
        copyIbanBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(currentUser.iban);
                showToast("IBAN copiado para a área de transferência!", "success");
            } catch (err) {
                showToast("Erro ao copiar IBAN. Tente novamente.", "error");
            }
        });
    }
    
    // Botão de cópia de PIX
    const copyPixBtn = document.getElementById('copy-pix-btn');
    if (copyPixBtn && currentUser?.email) {
        copyPixBtn.style.display = 'block';
        copyPixBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(currentUser.email);
                showToast("Chave PIX copiada para a área de transferência!", "success");
            } catch (err) {
                showToast("Erro ao copiar chave PIX. Tente novamente.", "error");
            }
        });
    }
}

async function handleRecipientValidation() {
    const input = document.getElementById('recipient-key');
    const infoDiv = document.getElementById('recipient-info');
    const sendBtn = document.getElementById('send-btn');
    
    const value = input.value.trim();
    if (!value) {
        infoDiv.textContent = "Digite um email ou IBAN para verificar";
        infoDiv.style.color = "var(--text-secondary)";
        sendBtn.disabled = true;
        return;
    }
    
    showLoading();
    try {
        let foundUser = null;
        let recipientType = '';
        
        // Verifica se é um email (PIX)
        if (value.includes('@')) {
            const email = value.toLowerCase();
            const usersRef = window.firebase.dbFunc.ref(window.firebase.db, 'users');
            const snapshot = await window.firebase.dbFunc.get(usersRef);
            
            if (snapshot.exists()) {
                const users = snapshot.val();
                for (const [uid, userData] of Object.entries(users)) {
                    if (userData.email === email && uid !== window.authManager.currentUser.uid) {
                        foundUser = userData;
                        recipientType = 'PIX';
                        break;
                    }
                }
            }
        } 
        // Verifica se é um IBAN
        else if (value.startsWith('AO06')) {
            const usersRef = window.firebase.dbFunc.ref(window.firebase.db, 'users');
            const snapshot = await window.firebase.dbFunc.get(usersRef);
            
            if (snapshot.exists()) {
                const users = snapshot.val();
                for (const [uid, userData] of Object.entries(users)) {
                    if (userData.iban === value && uid !== window.authManager.currentUser.uid) {
                        foundUser = userData;
                        recipientType = 'IBAN';
                        break;
                    }
                }
            }
        }
        
        if (foundUser) {
            infoDiv.innerHTML = `✓ <strong>${foundUser.username}</strong> - Aurora Bank (${recipientType})`;
            infoDiv.style.color = "var(--success)";
            sendBtn.disabled = false;
        } else {
            infoDiv.textContent = "Usuário não encontrado na Aurora Bank";
            infoDiv.style.color = "var(--error)";
            sendBtn.disabled = true;
        }
    } catch (error) {
        console.error("Erro ao validar destinatário:", error);
        infoDiv.textContent = "Erro ao verificar destinatário. Tente novamente.";
        infoDiv.style.color = "var(--error)";
        sendBtn.disabled = true;
    } finally {
        hideLoading();
    }
}

async function handleTransfer(e) {
    e.preventDefault();
    const recipientKey = document.getElementById('recipient-key').value.trim();
    const amount = parseFloat(document.getElementById('transfer-amount').value);
    const { currentUser } = window.authManager;
    
    if (!recipientKey || !amount || amount <= 0) {
        showToast("Por favor, preencha todos os campos corretamente.", "error");
        return;
    }
    
    if (amount > currentUser.balance) {
        showToast("Saldo insuficiente para esta transferência.", "error");
        return;
    }
    
    // Verificar limites de transferência
    const today = new Date().toDateString();
    const todayTransfers = Object.values(currentUser.transactions || {})
        .filter(t => t.type === 'transfer_out' && new Date(t.timestamp).toDateString() === today)
        .reduce((sum, t) => sum + t.amount, 0);
    
    if (todayTransfers + amount > 50000) {
        showToast(`Limite diário de transferências excedido. Limite: ${formatCurrency(50000)}`, "error");
        return;
    }
    
    if (amount > 25000) {
        showToast(`Valor máximo por transferência: ${formatCurrency(25000)}`, "error");
        return;
    }
    
    showLoading();
    try {
        let recipientUid = null;
        let recipientEmail = null;
        let recipientIban = null;
        
        // Determinar se é PIX (email) ou IBAN
        if (recipientKey.includes('@')) {
            recipientEmail = recipientKey.toLowerCase();
        } else if (recipientKey.startsWith('AO06')) {
            recipientIban = recipientKey;
        }
        
        // Buscar usuário pelo email ou IBAN
        const usersRef = window.firebase.dbFunc.ref(window.firebase.db, 'users');
        const snapshot = await window.firebase.dbFunc.get(usersRef);
        
        if (snapshot.exists()) {
            const users = snapshot.val();
            for (const [uid, userData] of Object.entries(users)) {
                if ((recipientEmail && userData.email === recipientEmail) || 
                    (recipientIban && userData.iban === recipientIban)) {
                    if (uid !== currentUser.uid) {
                        recipientUid = uid;
                        recipientEmail = userData.email;
                        recipientIban = userData.iban;
                        break;
                    }
                }
            }
        }
        
        if (!recipientUid) {
            showToast("Destinatário não encontrado.", "error");
            return;
        }
        
        // Gerar IDs de transação
        const senderTxId = generateUniqueId('tx');
        const recipientTxId = generateUniqueId('tx');
        const timestamp = Date.now();
        
        // Atualizar dados do remetente
        const senderUpdate = {
            [`transactions/${senderTxId}`]: {
                type: 'transfer_out',
                amount: amount,
                recipient: recipientEmail || recipientIban,
                recipientName: recipientEmail ? recipientEmail.split('@')[0] : recipientIban,
                timestamp: timestamp,
                status: 'completed'
            },
            balance: currentUser.balance - amount
        };
        
        // Atualizar dados do destinatário
        const recipientRef = window.firebase.dbFunc.ref(window.firebase.db, `users/${recipientUid}`);
        const recipientSnapshot = await window.firebase.dbFunc.get(recipientRef);
        if (!recipientSnapshot.exists()) {
            throw new Error("Destinatário não encontrado");
        }
        
        const recipientData = recipientSnapshot.val();
        const recipientUpdate = {
            [`transactions/${recipientTxId}`]: {
                type: 'transfer_in',
                amount: amount,
                sender: currentUser.email,
                senderName: currentUser.username,
                timestamp: timestamp,
                status: 'completed'
            },
            balance: (recipientData.balance || 0) + amount
        };
        
        // Executar atualizações em lote
        const updates = {};
        updates[`users/${currentUser.uid}`] = senderUpdate;
        updates[`users/${recipientUid}`] = recipientUpdate;
        
        await window.firebase.dbFunc.update(window.firebase.dbFunc.ref(window.firebase.db), updates);
        
        showToast(`Transferência de ${formatCurrency(amount)} realizada com sucesso!`, "success");
        document.getElementById('transfer-form').reset();
        document.getElementById('recipient-info').textContent = "Digite um email ou IBAN para verificar";
        document.getElementById('send-btn').disabled = true;
        renderTransactionList();
    } catch (error) {
        console.error("Erro ao realizar transferência:", error);
        showToast("Erro ao realizar transferência. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

function renderTransactionList() {
    const { currentUser } = window.authManager;
    const transactionList = document.getElementById('transaction-list');
    
    if (!transactionList) return;
    
    const transactions = Object.values(currentUser.transactions || {}).sort((a, b) => b.timestamp - a.timestamp);
    
    if (transactions.length === 0) {
        transactionList.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--text-secondary);">Nenhuma transação encontrada.</p>';
        return;
    }
    
    transactionList.innerHTML = transactions.map(tx => {
        const date = new Date(tx.timestamp).toLocaleDateString('pt-AO');
        const time = new Date(tx.timestamp).toLocaleTimeString('pt-AO');
        const isIncome = tx.type.includes('in') || tx.type.includes('win') || tx.type === 'investment_return';
        const amountClass = isIncome ? 'positive' : 'negative';
        const icon = isIncome ? 'arrow-down-right' : 'arrow-up-right';
        const prefix = isIncome ? '+' : '-';
        
        let description = '';
        let recipientOrSender = '';
        
        switch(tx.type) {
            case 'transfer_out':
                description = `Transferência para ${tx.recipientName || tx.recipient}`;
                recipientOrSender = tx.recipient;
                break;
            case 'transfer_in':
                description = `Transferência de ${tx.senderName || tx.sender}`;
                recipientOrSender = tx.sender;
                break;
            case 'card_payment':
                description = `Pagamento com cartão ${tx.cardType || 'Onyx'}`;
                break;
            case 'investment':
                description = `Investimento em ${tx.planName}`;
                break;
            case 'investment_return':
                description = `Rendimento de investimento`;
                break;
            case 'game_win':
                description = `Prêmio do Quiz Financeiro`;
                break;
            case 'purchase':
                description = `Compra na Loja Aurora`;
                break;
            case 'game_redeem':
                description = `Resgate de saldo de jogos`;
                break;
            default:
                description = tx.description || 'Transação';
        }
        
        return `
            <div class="transaction-item">
                <div class="tx-icon ${isIncome ? 'incoming' : 'outgoing'}">
                    <i data-lucide="${icon}"></i>
                </div>
                <div class="tx-details">
                    <h4>${description}</h4>
                    <p>${date} às ${time}</p>
                    ${recipientOrSender ? `<p class="tx-subtitle">${recipientOrSender}</p>` : ''}
                </div>
                <div class="tx-amount ${amountClass}">
                    ${prefix}${formatCurrency(tx.amount)}
                </div>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

// Função utilitária para gerar ID único
function generateUniqueId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}