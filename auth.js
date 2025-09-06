class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authListenerUnsubscribe = null;
        this.dbListenerUnsubscribe = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        if (!window.firebase || !window.firebase.auth) {
            console.error("Firebase não está disponível");
            return;
        }

        const { auth } = window.firebase;
        
        // Configurar listener de autenticação
        this.authListenerUnsubscribe = window.firebase.authFunc.onAuthStateChanged(auth, async (user) => {
            hideLoading();
            
            // Limpar listener anterior do banco de dados
            if (this.dbListenerUnsubscribe) {
                this.dbListenerUnsubscribe();
                this.dbListenerUnsubscribe = null;
            }

            if (user) {
                try {
                    const userRef = window.firebase.dbFunc.ref(window.firebase.db, `users/${user.uid}`);
                    const snapshot = await window.firebase.dbFunc.get(userRef);
                    
                    if (snapshot.exists()) {
                        this.currentUser = { uid: user.uid, email: user.email, ...snapshot.val() };
                        
                        // Configurar listener em tempo real para atualizações
                        this.dbListenerUnsubscribe = window.firebase.dbFunc.onValue(userRef, (snap) => {
                            if (snap.exists()) {
                                this.currentUser = { ...this.currentUser, ...snap.val() };
                                this.renderPage();
                            }
                        }, (error) => {
                            console.error("Erro no listener do banco de dados:", error);
                            this.loadUserData();
                        });
                        
                        this.updateUI(true);
                        this.renderPage();
                        this.initialized = true;
                    } else {
                        // Usuário autenticado mas sem dados - logout
                        await this.logout();
                        showToast("Conta não encontrada. Por favor, registre-se novamente.", "error");
                    }
                } catch (error) {
                    console.error("Erro ao carregar dados do usuário:", error);
                    hideLoading();
                    showToast("Erro ao carregar seus dados. Tente novamente.", "error");
                    await this.logout();
                }
            } else {
                this.currentUser = null;
                this.updateUI(false);
                this.renderAuthScreen();
                this.initialized = true;
            }
        });
        
        // Timeout de segurança
        setTimeout(() => {
            hideLoading();
            if (!this.currentUser && !this.initialized) {
                this.renderAuthScreen();
                this.initialized = true;
            }
        }, 10000);
    }

    updateUI(isLoggedIn) {
        const navbar = document.getElementById('navbar');
        const aiHelpFab = document.getElementById('ai-help-fab');
        const logoutBtn = document.getElementById('logoutBtn');
        const themeToggle = document.getElementById('theme-toggle');
        
        if (navbar) navbar.classList.toggle('hidden', !isLoggedIn);
        if (aiHelpFab) aiHelpFab.classList.toggle('hidden', !isLoggedIn);
        if (logoutBtn) logoutBtn.classList.toggle('hidden', !isLoggedIn);
        if (themeToggle) themeToggle.classList.toggle('hidden', !isLoggedIn);
        
        if (!isLoggedIn && window.location.hash !== '#') {
            window.location.hash = '#';
        }
    }
    
    async login(username, password) {
        showLoading();
        try {
            const email = `${username.toLowerCase().trim().replace(/\s/g, '_')}@aurora.capital`;
            await window.firebase.authFunc.signInWithEmailAndPassword(window.firebase.auth, email, password);
            
            // Aguardar um momento para garantir que o estado seja atualizado
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error("Erro de login:", error);
            hideLoading();
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                showToast("Credenciais inválidas. Tente novamente.", "error");
            } else {
                showToast("Erro ao fazer login. Tente novamente.", "error");
            }
        }
    }

    async register(username, password, gender) {
        showLoading();
        try {
            // Validar entrada
            if (!username || !password) {
                throw new Error("Nome de usuário e senha são obrigatórios");
            }
            
            if (password.length < 6) {
                throw new Error("auth/weak-password");
            }
            
            const email = `${username.toLowerCase().trim().replace(/\s/g, '_')}@aurora.capital`;
            const cred = await window.firebase.authFunc.createUserWithEmailAndPassword(window.firebase.auth, email, password);
            const { user } = cred;
            
            // Gerar IBAN único
            const iban = this.generateUniqueIBAN();
            
            // Gerar dados do usuário
            const userData = {
                username, 
                gender, 
                balance: 10000,
                gameBalance: 0, 
                level: 1, 
                xp: 0,
                iban: iban,
                pixKeys: [email],
                email: email,
                avatar: `https://api.dicebear.com/7.x/${gender === 'male' ? 'adventurer' : 'miniavs'}/svg?seed=${username}`,
                createdAt: window.firebase.dbFunc.serverTimestamp(),
                cards: { 
                    onyx: { 
                        acquiredAt: window.firebase.dbFunc.serverTimestamp(),
                        cardId: this.generateUniqueId('card'),
                        cardType: 'onyx',
                        cardNumber: this.generateCardNumber(user.uid, 'onyx'),
                        expiryDate: this.generateExpiryDate(),
                        cvv: this.generateCVV()
                    } 
                },
                products: {},
                investments: {},
                transactions: {
                    [this.generateUniqueId('tx')]: {
                        type: 'welcome_bonus',
                        amount: 10000,
                        description: 'Bônus de boas-vindas',
                        timestamp: Date.now(),
                        status: 'completed'
                    }
                }
            };
            
            // Salvar no banco de dados
            await window.firebase.dbFunc.set(window.firebase.dbFunc.ref(window.firebase.db, `users/${user.uid}`), userData);
            
            // Aguardar um momento para garantir que o estado seja atualizado
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            showToast(`Bem-vindo, ${username}! Você recebeu um bônus de boas-vindas de ${formatCurrency(10000)}.`, "success");
        } catch (error) {
            console.error("Erro de registro:", error);
            hideLoading();
            if (error.code === 'auth/email-already-in-use') {
                showToast('Este nome de utilizador já existe.', 'error');
            } else if (error.code === 'auth/weak-password') {
                showToast('A senha deve ter pelo menos 6 caracteres.', 'error');
            } else {
                showToast('Erro ao criar conta. Tente novamente.', 'error');
            }
        }
    }

    async logout() {
        try {
            await window.firebase.authFunc.signOut(window.firebase.auth);
            if (this.dbListenerUnsubscribe) {
                this.dbListenerUnsubscribe();
                this.dbListenerUnsubscribe = null;
            }
            this.currentUser = null;
            this.initialized = false;
            hideLoading();
            window.location.hash = '#';
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            showToast("Erro ao fazer logout. Tente novamente.", "error");
        }
    }

    renderPage() {
        if (!this.currentUser) {
            this.renderAuthScreen();
            return;
        }
        
        const hash = window.location.hash || '#dashboard';
        
        // Roteamento
        switch(hash) {
            case '#dashboard':
                renderDashboard();
                break;
            case '#transactions':
                renderTransactions();
                break;
            case '#cards':
                renderCards();
                break;
            case '#investments':
                renderInvestments();
                break;
            case '#store':
                renderStore();
                break;
            case '#my-products':
                renderMyProducts();
                break;
            case '#games':
                renderGames();
                break;
            case '#settings':
                renderSettings();
                break;
            default:
                renderDashboard();
                window.location.hash = '#dashboard';
        }
        
        // Atualizar navegação ativa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === hash);
        });
    }

    renderAuthScreen() {
        const app = document.getElementById('app');
        if (!app) return;
        
        app.innerHTML = `
            <div class="auth-container">
                <div class="glass-panel auth-form-container">
                    <div class="nav-logo" style="justify-content: center; margin-bottom: 2rem;">
                        <i data-lucide="zap"></i><h1>AURORA</h1>
                    </div>
                    <form id="auth-form" class="auth-form">
                        <div class="input-group">
                            <i data-lucide="user"></i>
                            <input type="text" id="auth-username" placeholder="Nome de utilizador" required>
                        </div>
                        <div class="input-group">
                            <i data-lucide="lock"></i>
                            <input type="password" id="auth-password" placeholder="Palavra-passe" required minlength="6">
                        </div>
                        <div class="gender-selection" id="gender-selection" style="display: none; margin-bottom: 1rem;">
                            <label>Género para Avatar:</label>
                            <div class="gender-options">
                                <label><input type="radio" name="gender" value="male" checked> Masculino</label>
                                <label><input type="radio" name="gender" value="female"> Feminino</label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary" id="auth-submit-btn">Entrar</button>
                        <p style="text-align: center; margin-top: 1rem;">
                            <a href="#" id="auth-toggle-link">Não tem conta? Registe-se</a>
                        </p>
                    </form>
                </div>
                <div class="auth-footer">
                    <p>© 2025 Aurora Capital Bank. Todos os direitos reservados.</p>
                </div>
            </div>
        `;
        lucide.createIcons();
        this.setupAuthForms();
        hideLoading();
    }
    
    setupAuthForms() {
        const form = document.getElementById('auth-form');
        const toggleLink = document.getElementById('auth-toggle-link');
        const genderSelection = document.getElementById('gender-selection');
        const submitBtn = document.getElementById('auth-submit-btn');
        let isLogin = true;

        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isLogin = !isLogin;
            genderSelection.style.display = isLogin ? 'none' : 'flex';
            submitBtn.textContent = isLogin ? 'Entrar' : 'Criar Conta';
            toggleLink.textContent = isLogin ? 'Não tem conta? Registe-se' : 'Já tem conta? Entre';
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('auth-username').value;
            const password = document.getElementById('auth-password').value;
            
            if (!username || !password) {
                showToast("Por favor, preencha todos os campos.", "error");
                return;
            }
            
            if (password.length < 6) {
                showToast("A senha deve ter pelo menos 6 caracteres.", "error");
                return;
            }
            
            if (isLogin) {
                await this.login(username, password);
            } else {
                const gender = document.querySelector('input[name="gender"]:checked').value;
                await this.register(username, password, gender);
            }
        });
    }

    // Utilitários
    generateUniqueId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    generateIBAN() {
        return `AO06${Date.now().toString().slice(-10)}${Math.random().toString().slice(2, 13)}`;
    }

    async generateUniqueIBAN() {
        let iban;
        let isUnique = false;
        
        while (!isUnique) {
            iban = this.generateIBAN();
            const usersRef = window.firebase.dbFunc.ref(window.firebase.db, 'users');
            const snapshot = await window.firebase.dbFunc.get(usersRef);
            
            if (!snapshot.exists()) {
                isUnique = true;
            } else {
                const users = snapshot.val();
                isUnique = !Object.values(users).some(user => user.iban === iban);
            }
        }
        
        return iban;
    }

    generateCardNumber(uid, cardType) {
        const seed = (uid + cardType).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const part1 = 4000 + (seed % 1000); // VISA starts with 4
        const part2 = (seed * 1234 % 9999).toString().padStart(4, '0');
        const part3 = (seed * 5678 % 9999).toString().padStart(4, '0');
        const part4 = (seed * 9101 % 9999).toString().padStart(4, '0');
        return `${part1} ${part2} ${part3} ${part4}`;
    }

    generateCVV() {
        return Math.floor(100 + Math.random() * 900).toString();
    }

    generateExpiryDate() {
        const now = new Date();
        const year = now.getFullYear() + 4;
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${month}/${year.toString().slice(2)}`;
    }

    async loadUserData() {
        if (!this.currentUser || !this.currentUser.uid) return;
        
        try {
            const userRef = window.firebase.dbFunc.ref(window.firebase.db, `users/${this.currentUser.uid}`);
            const snapshot = await window.firebase.dbFunc.get(userRef);
            
            if (snapshot.exists()) {
                this.currentUser = { ...this.currentUser, ...snapshot.val() };
                this.renderPage();
            } else {
                await this.logout();
                showToast("Dados da conta não encontrados.", "error");
            }
        } catch (error) {
            console.error("Erro ao recarregar dados do usuário:", error);
            showToast("Erro ao carregar seus dados. Tente atualizar a página.", "error");
        }
    }
}

// Instância global
window.authManager = new AuthManager();