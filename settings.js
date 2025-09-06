function renderSettings() {
    const { currentUser } = window.authManager;
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel" style="margin-bottom: 20px;">
                <h3>Configurações de Conta</h3>
                <div class="settings-section">
                    <h4><i data-lucide="user"></i> Informações Pessoais</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Nome de Usuário</label>
                            <span>${currentUser.username}</span>
                        </div>
                        <div class="info-item">
                            <label>Chave PIX</label>
                            <div class="copy-container">
                                <span>${currentUser.email}</span>
                                <button class="copy-btn" onclick="copyToClipboard('${currentUser.email}', 'Chave PIX')">
                                    <i data-lucide="copy"></i>
                                </button>
                            </div>
                        </div>
                        <div class="info-item">
                            <label>IBAN</label>
                            <div class="copy-container">
                                <span>${currentUser.iban}</span>
                                <button class="copy-btn" onclick="copyToClipboard('${currentUser.iban}', 'IBAN')">
                                    <i data-lucide="copy"></i>
                                </button>
                            </div>
                        </div>
                        <div class="info-item">
                            <label>Data de Criação</label>
                            <span>${new Date(currentUser.createdAt).toLocaleDateString('pt-AO')}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="glass-panel" style="margin-bottom: 20px;">
                <h3>Segurança</h3>
                <form id="change-password-form" class="auth-form" style="gap: 1rem;">
                    <div class="input-group">
                        <i data-lucide="lock"></i>
                        <input type="password" id="current-password" placeholder="Palavra-passe Atual" required>
                    </div>
                    <div class="input-group">
                        <i data-lucide="key"></i>
                        <input type="password" id="new-password" placeholder="Nova Palavra-passe" required minlength="6">
                    </div>
                    <button type="submit" class="btn btn-secondary">
                        <i data-lucide="refresh-cw"></i> Alterar Palavra-passe
                    </button>
                </form>
            </div>
            
            <div class="glass-panel" style="margin-bottom: 20px;">
                <h3>Aparência</h3>
                <div class="settings-section">
                    <div class="theme-toggle-container">
                        <label for="theme-toggle">Tema</label>
                        <div class="theme-toggle">
                            <input type="checkbox" id="theme-toggle" class="theme-switch">
                            <label for="theme-toggle" class="theme-slider">
                                <span class="theme-label light">Claro</span>
                                <span class="theme-label dark">Escuro</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="glass-panel">
                <h3>Zona de Perigo</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">Esta ação é irreversível e irá apagar todos os seus dados.</p>
                <button class="btn btn-primary" style="background: var(--error);" id="delete-account-btn">
                    <i data-lucide="trash-2"></i> Apagar a Minha Conta
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
    document.getElementById('change-password-form').addEventListener('submit', handleChangePassword);
    document.getElementById('delete-account-btn').addEventListener('click', handleDeleteAccountPrompt);
    
    // Configurar toggle de tema
    setupThemeToggle();
}

async function handleChangePassword(e) {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    
    if (newPassword.length < 6) {
        showToast("A nova palavra-passe deve ter pelo menos 6 caracteres.", "error");
        return;
    }
    
    showLoading();
    try {
        const { auth, authFunc } = window.firebase;
        const user = auth.currentUser;
        
        // Reautentica o usuário
        const credential = window.firebase.authFunc.EmailAuthProvider.credential(user.email, currentPassword);
        await authFunc.reauthenticateWithCredential(user, credential);
        
        // Altera a senha
        await authFunc.updatePassword(user, newPassword);
        
        showToast("Palavra-passe alterada com sucesso!", "success");
        document.getElementById('change-password-form').reset();
    } catch (error) {
        console.error("Erro ao alterar palavra-passe:", error);
        if (error.code === 'auth/wrong-password') {
            showToast("Palavra-passe atual incorreta.", "error");
        } else {
            showToast("Erro ao alterar palavra-passe. Tente novamente.", "error");
        }
    } finally {
        hideLoading();
    }
}

function handleDeleteAccountPrompt() {
    createModal(
        { text: 'Confirmar Exclusão de Conta', icon: 'alert-triangle' },
        `
        <div class="delete-warning">
            <i data-lucide="alert-triangle" style="font-size: 48px; color: var(--error); margin-bottom: 1rem;"></i>
            <h3>Atenção!</h3>
            <p>Tem a certeza que deseja apagar a sua conta? Esta ação é <strong>irreversível</strong> e todos os seus dados serão permanentemente apagados.</p>
            <p>Você perderá acesso a:</p>
            <ul>
                <li>Seu saldo e histórico de transações</li>
                <li>Seus cartões e investimentos</li>
                <li>Seus produtos adquiridos</li>
                <li>Seu progresso nos jogos</li>
            </ul>
            <p>Esta ação não pode ser desfeita.</p>
        </div>
        <div class="input-group" style="margin-top: 1rem;">
            <label for="confirm-password">Digite a sua palavra-passe para confirmar:</label>
            <input type="password" id="confirm-password" placeholder="Digite sua senha" required>
        </div>
        `,
        [
            { text: 'Cancelar', class: 'btn-secondary', icon: 'x', onclick: 'document.querySelector(".modal-overlay").remove()' },
            { text: 'Apagar Conta', class: 'btn btn-primary', style: 'background: var(--error);', icon: 'trash-2', onclick: 'confirmDeleteAccount()' }
        ]
    );
}

async function confirmDeleteAccount() {
    const password = document.getElementById('confirm-password').value;
    if (!password) {
        showToast("Por favor, digite a sua palavra-passe.", "error");
        return;
    }
    
    showLoading();
    try {
        const { auth, authFunc } = window.firebase;
        const user = auth.currentUser;
        
        // Reautentica o usuário
        const credential = window.firebase.authFunc.EmailAuthProvider.credential(user.email, password);
        await authFunc.reauthenticateWithCredential(user, credential);
        
        // Remove os dados do usuário do banco de dados
        await window.firebase.dbFunc.remove(window.firebase.dbFunc.ref(window.firebase.db, `users/${user.uid}`));
        
        // Remove a conta de autenticação
        await user.delete();
        
        showToast("Conta apagada com sucesso.", "success");
        // Redireciona para a página de login após um breve delay
        setTimeout(() => {
            window.location.hash = '#';
        }, 1500);
    } catch (error) {
        console.error("Erro ao apagar conta:", error);
        if (error.code === 'auth/wrong-password') {
            showToast("Palavra-passe incorreta.", "error");
        } else {
            showToast("Erro ao apagar conta. Tente novamente.", "error");
        }
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

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Aplicar tema atual
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-theme');
        themeToggle.checked = false;
    }
    
    // Configurar listener para mudanças
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            showToast("Tema escuro ativado!", "info");
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            showToast("Tema claro ativado!", "info");
        }
    });
}

// Função utilitária para gerar ID único
function generateUniqueId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}