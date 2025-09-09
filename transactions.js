function renderTransactions() {
    const app = document.getElementById('app');
    if (!app) return;

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
    setupCopyButtons();

    const recipientInput = document.getElementById('recipient-key');
    const transferForm = document.getElementById('transfer-form');

    if (recipientInput) {
        recipientInput.addEventListener('input', handleRecipientValidation);
    }

    if (transferForm) {
        transferForm.addEventListener('submit', handleTransfer);
    }

    renderTransactionList();
}

function setupCopyButtons() {
    const { currentUser } = window.authManager || {};

    if (!currentUser) {
        console.warn("Nenhum usuário logado para configurar botões de cópia.");
        return;
    }

    const copyIbanBtn = document.getElementById('copy-iban-btn');
    if (copyIbanBtn && currentUser.iban) {
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

    const copyPixBtn = document.getElementById('copy-pix-btn');
    if (copyPixBtn && currentUser.email) {
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

    if (!input || !infoDiv || !sendBtn) return;

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
        // Verifica se é um IBAN (assumindo formato AO06...)
        else if (/^AO06/.test(value)) {
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

    const recipientKeyInput = document.getElementById('recipient-key');
    const amountInput = document.getElementById('transfer-amount');
    const sendBtn = document.getElementById('send-btn');
    const { currentUser } = window.authManager || {};

    if (!recipientKeyInput || !amountInput || !currentUser) {
        showToast("Erro interno: elementos não encontrados.", "error");
        return;
    }

    const recipientKey = recipientKeyInput.value.trim();
    const amount = parseFloat(amountInput.value);

    // Validações básicas
    if (!recipientKey) {
        showToast("Por favor, insira a chave PIX ou IBAN do destinatário.", "error");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        showToast("Por favor, insira um valor válido maior que zero.", "error");
        return;
    }

    if (amount > currentUser.balance) {
        showToast("Saldo insuficiente para esta transferência.", "error");
        return;
    }

    // ✅ LIMITE DIÁRIO ATUALIZADO PARA 100.000.000 Kz
    const DAILY_TRANSFER_LIMIT = 100000000; // 100 milhões de Kz
    const MAX_SINGLE_TRANSFER = 100000000; // Mantido conforme original

    const today = new Date().toDateString();
    const todayTransfers = Object.values(currentUser.transactions || {})
        .filter(t => t.type === 'transfer_out' && new Date(t.timestamp).toDateString() === today)
        .reduce((sum, t) => sum + t.amount, 0);

    if (todayTransfers + amount > DAILY_TRANSFER_LIMIT) {
        showToast(`Limite diário de transferências excedido. Limite: ${formatCurrency(DAILY_TRANSFER_LIMIT)}`, "error");
        return;
    }

    if (amount > MAX_SINGLE_TRANSFER) {
        showToast(`Valor máximo por transferência: ${formatCurrency(MAX_SINGLE_TRANSFER)}`, "error");
        return;
    }

    showLoading();
    try {
        let recipientUid = null;
        let recipientEmail = null;
        let recipientIban = null;

        // Determinar tipo de chave
        if (recipientKey.includes('@')) {
            recipientEmail = recipientKey.toLowerCase();
        } else if (/^AO06/.test(recipientKey)) {
            recipientIban = recipientKey;
        } else {
            showToast("Formato inválido. Use um email ou IBAN válido.", "error");
            return;
        }

        // Buscar destinatário
        const usersRef = window.firebase.dbFunc.ref(window.firebase.db, 'users');
        const snapshot = await window.firebase.dbFunc.get(usersRef);

        if (!snapshot.exists()) {
            throw new Error("Banco de dados de usuários não disponível.");
        }

        const users = snapshot.val();
        for (const [uid, userData] of Object.entries(users)) {
            if (uid === currentUser.uid) continue; // Evitar auto-transferência

            if ((recipientEmail && userData.email === recipientEmail) ||
                (recipientIban && userData.iban === recipientIban)) {
                recipientUid = uid;
                recipientEmail = userData.email;
                recipientIban = userData.iban;
                break;
            }
        }

        if (!recipientUid) {
            showToast("Destinatário não encontrado na Aurora Bank.", "error");
            return;
        }

        // Gerar IDs únicos sanitizados
        const senderTxId = generateUniqueId('tx');
        const recipientTxId = generateUniqueId('tx');
        const timestamp = Date.now();

        // Preparar atualizações em lote
        const updates = {};

        // Transação de saída para o remetente
        updates[`users/${currentUser.uid}/transactions/${senderTxId}`] = {
            type: 'transfer_out',
            amount: amount,
            recipient: recipientEmail || recipientIban,
            recipientName: recipientEmail ? recipientEmail.split('@')[0] : recipientIban,
            timestamp: timestamp,
            status: 'completed'
        };

        // Atualizar saldo do remetente
        updates[`users/${currentUser.uid}/balance`] = currentUser.balance - amount;

        // Obter dados atuais do destinatário para atualizar saldo
        const recipientRef = window.firebase.dbFunc.ref(window.firebase.db, `users/${recipientUid}`);
        const recipientSnapshot = await window.firebase.dbFunc.get(recipientRef);

        if (!recipientSnapshot.exists()) {
            throw new Error("Destinatário não encontrado no momento da transferência.");
        }

        const recipientData = recipientSnapshot.val();

        // Transação de entrada para o destinatário
        updates[`users/${recipientUid}/transactions/${recipientTxId}`] = {
            type: 'transfer_in',
            amount: amount,
            sender: currentUser.email,
            senderName: currentUser.username,
            timestamp: timestamp,
            status: 'completed'
        };

        // Atualizar saldo do destinatário
        updates[`users/${recipientUid}/balance`] = (recipientData.balance || 0) + amount;

        // Executar todas as atualizações em lote
        await window.firebase.dbFunc.update(window.firebase.dbFunc.ref(window.firebase.db), updates);

        // Feedback de sucesso
        showToast(`Transferência de ${formatCurrency(amount)} realizada com sucesso!`, "success");

        // Resetar formulário
        document.getElementById('transfer-form').reset();
        const recipientInfo = document.getElementById('recipient-info');
        if (recipientInfo) {
            recipientInfo.textContent = "Digite um email ou IBAN para verificar";
            recipientInfo.style.color = "var(--text-secondary)";
        }
        if (sendBtn) sendBtn.disabled = true;

        // Atualizar lista de transações
        renderTransactionList();

    } catch (error) {
        console.error("Erro ao realizar transferência:", error);
        showToast("Erro ao realizar transferência. Tente novamente.", "error");
    } finally {
        hideLoading();
    }
}

function renderTransactionList() {
    const { currentUser } = window.authManager || {};
    const transactionList = document.getElementById('transaction-list');

    if (!transactionList) return;

    if (!currentUser) {
        transactionList.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--text-secondary);">Nenhum usuário logado.</p>';
        return;
    }

    const transactions = Object.values(currentUser.transactions || {})
        .sort((a, b) => b.timestamp - a.timestamp);

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

// Função utilitária para gerar ID único — SANITIZADO
function generateUniqueId(prefix) {
    const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    // Remove caracteres inválidos do Firebase
    return id.replace(/[.#$\/[\]]/g, '_');
}
