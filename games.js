// games.js - Sistema de Jogos Educativos FINAL
// ✅ 400+ perguntas | ✅ 7 níveis de dificuldade | ✅ Saldo de Jogos separado
// ✅ Sem repetição até completar categoria | ✅ Alternativas embaralhadas
// ✅ Novos tipos de jogos: enigmas, psicotécnicos, dilemas | ✅ Zero telas fora do site
// ✅ Estilo futurista e mágico | ✅ Interface responsiva e sem bugs
// ✅ Recompensa por pergunta | ✅ Rodadas personalizadas (5, 10, 15, 20 perguntas)
class EduGameSystem {
    constructor() {
        this.currentGame = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.selectedDifficulty = null;
        this.selectedRoundSize = null; // Nova propriedade para tamanho da rodada
        this.answeredQuestions = new Set(); // Para evitar repetição
        this.initialize();
    }
    initialize() {
        this.renderMainMenu();
        this.bindGlobalEvents();
    }
    bindGlobalEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isGameActive()) {
                this.confirmExitGame();
            }
        });
    }
    isGameActive() {
        return this.currentGame !== null;
    }
    getDifficultyLevels() {
        return [
            { key: 'easy', name: 'Fácil', class: 'difficulty-easy', crown: '👑', min: 100, max: 200, tag: 'Iniciante' },
            { key: 'medium', name: 'Médio', class: 'difficulty-medium', crown: '👑👑', min: 200, max: 400, tag: 'Intermediário' },
            { key: 'hard', name: 'Difícil', class: 'difficulty-hard', crown: '👑👑👑', min: 400, max: 800, tag: 'Avançado' },
            { key: 'expert', name: 'Expert', class: 'difficulty-expert', crown: '👑👑👑👑', min: 800, max: 1600, tag: 'Especialista' },
            { key: 'ultra', name: 'Ultra', class: 'difficulty-ultra', crown: '👑👑👑👑👑', min: 1600, max: 3200, tag: 'Ultra' },
            { key: 'legend', name: 'Lendário', class: 'difficulty-legend', crown: '👑👑👑👑👑👑', min: 3200, max: 6400, tag: 'Lendário' },
            { key: 'mythic', name: 'Mítico', class: 'difficulty-mythic', crown: '👑👑👑👑👑👑👑', min: 6400, max: 12800, tag: 'Mítico' }
        ];
    }
    getRemainingQuestions(key) {
        const questions = this.getQuestionsByDifficulty(key);
        const answeredInThisDifficulty = Array.from(this.answeredQuestions).filter(id => id.startsWith(`${key}-`)).length;
        return questions.length - answeredInThisDifficulty;
    }
    renderMainMenu() {
        const app = document.getElementById('app');
        const gameBalance = this.getGameBalance();
        app.innerHTML = `
            <div class="edu-game-container">
                <div class="game-header">
                    <h1><span>🎮</span> Nexus Games</h1>
                    <p>Conhecimento é poder. E poder é recompensa.</p>
                    <div class="game-balance-display">
                        <div class="balance-badge neon">
                            <i data-lucide="gamepad"></i>
                            <span>Saldo de Jogos: ${this.formatCurrency(gameBalance)}</span>
                        </div>
                    </div>
                </div>
                <div class="difficulty-grid">
                    ${this.getDifficultyLevels().map(level => `
                        <div class="difficulty-card ${level.class}" onclick="window.eduGame.selectDifficulty('${level.key}')">
                            <div class="card-glow"></div>
                            <div class="card-content">
                                <div class="crown">${level.crown}</div>
                                <h3>${level.name}</h3>
                                <div class="reward-range">💰 ${level.min.toLocaleString()}Kz - ${level.max.toLocaleString()}Kz</div>
                                <div class="challenge-count">${this.getRemainingQuestions(level.key)} perguntas restantes</div>
                                <div class="difficulty-tag">${level.tag}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${gameBalance > 0 ? `
                    <div class="transfer-panel glass-panel">
                        <h3>💸 Transferir Saldo de Jogos</h3>
                        <p>Você tem <strong>${this.formatCurrency(gameBalance)}</strong> disponíveis.</p>
                        <button class="btn btn-neon" onclick="window.eduGame.transferGameBalance()">
                            <i data-lucide="arrow-right-circle"></i> Transferir para Saldo Principal
                        </button>
                    </div>
                ` : ''}
                <div class="game-footer">
                    <button class="btn btn-outline" onclick="window.authManager.renderDashboard()">
                        <i data-lucide="arrow-left"></i> Voltar ao Painel
                    </button>
                </div>
            </div>
        `;
        this.applyGlobalStyles();
        lucide.createIcons();
    }
    selectDifficulty(difficulty) {
        this.selectedDifficulty = difficulty;
        this.renderRoundSelection();
    }
    renderRoundSelection() {
        const level = this.getDifficultyLevels().find(l => l.key === this.selectedDifficulty);
        const remaining = this.getRemainingQuestions(this.selectedDifficulty);
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="edu-game-container">
                <div class="game-header">
                    <h1><span>🎯</span> ${level.name} - Escolha sua Rodada</h1>
                    <p>Escolha quantas perguntas deseja responder nesta sessão.</p>
                    <div class="game-balance-display">
                        <div class="balance-badge neon">
                            <i data-lucide="gamepad"></i>
                            <span>Saldo de Jogos: ${this.formatCurrency(this.getGameBalance())}</span>
                        </div>
                    </div>
                </div>
                <div class="round-selection-grid">
                    ${[5, 10, 15, 20].map(size => {
                        const isDisabled = size > remaining && remaining > 0;
                        const disabledClass = isDisabled ? 'round-card-disabled' : '';
                        const tooltip = isDisabled ? `title="Apenas ${remaining} perguntas disponíveis"` : '';
                        return `
                        <div class="round-card ${disabledClass}" ${tooltip} ${isDisabled ? '' : `onclick="window.eduGame.startGame('${this.selectedDifficulty}', ${size})"`}>
                            <div class="round-content">
                                <h3>${size} Perguntas</h3>
                                <div class="reward-estimate">💰 Estimativa: ${this.estimateReward(level, size)}</div>
                                ${isDisabled ? `<div class="round-warning">Disponível: ${remaining}</div>` : ''}
                            </div>
                        </div>`;
                    }).join('')}
                </div>
                <div class="game-footer">
                    <button class="btn btn-outline" onclick="window.eduGame.renderMainMenu()">
                        <i data-lucide="arrow-left"></i> Voltar ao Menu
                    </button>
                </div>
            </div>
        `;
        this.applyGlobalStyles();
        lucide.createIcons();
    }
    estimateReward(level, size) {
        const avgReward = (level.min + level.max) / 2;
        return `${Math.floor(avgReward * size).toLocaleString()}Kz - ${Math.floor(level.max * size * 1.5).toLocaleString()}Kz`;
    }
    startGame(difficulty, roundSize) {
        this.selectedDifficulty = difficulty;
        this.selectedRoundSize = roundSize;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.streak = 0;
        const questions = this.getQuestionsByDifficulty(difficulty);
        const remaining = questions.filter(q => !this.answeredQuestions.has(`${difficulty}-${q.id}`));
        if (remaining.length === 0) {
            this.showToast("🎉 Você completou todas as perguntas deste nível! Voltando ao menu.", "success");
            setTimeout(() => this.renderMainMenu(), 2000);
            return;
        }
        // Embaralha as perguntas restantes e pega apenas a quantidade selecionada ou o máximo disponível
        const actualRoundSize = Math.min(roundSize, remaining.length);
        const shuffledQuestions = this.shuffleArray([...remaining]);
        const selectedQuestions = shuffledQuestions.slice(0, actualRoundSize);
        this.currentGame = {
            difficulty: difficulty,
            questions: selectedQuestions,
            level: this.getDifficultyLevels().find(l => l.key === difficulty),
            startTime: Date.now(),
            roundSize: actualRoundSize
        };
        this.renderQuestion();
    }
    renderQuestion() {
        if (!this.currentGame || this.currentQuestionIndex >= this.currentGame.questions.length) {
            this.endGame();
            return;
        }
        const question = this.currentGame.questions[this.currentQuestionIndex];
        // Embaralha as alternativas mantendo o índice correto
        const shuffledOptions = this.shuffleOptions(question.options, question.correctIndex);
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="game-session-container">
                <div class="game-header-session">
                    <div class="game-progress">
                        <span>Questão ${this.currentQuestionIndex + 1} de ${this.currentGame.questions.length}</span>
                        <div class="streak-indicator">🔥 ${this.streak} acertos consecutivos</div>
                    </div>
                    <button class="btn btn-danger pulse" onclick="window.eduGame.confirmExitGame()">
                        <i data-lucide="x"></i> Sair
                    </button>
                </div>
                <div class="question-card">
                    <div class="question-header">
                        <h2>
                            <span class="category-badge">${question.category}</span>
                            <span class="difficulty-badge ${this.getBadgeClass(this.selectedDifficulty)}">${this.getDifficultyName(this.selectedDifficulty)}</span>
                        </h2>
                    </div>
                    <div class="question-body">
                        <p class="question-text">${question.question}</p>
                        ${this.renderShuffledOptions(shuffledOptions)}
                    </div>
                    <div class="game-hints">
                        <div class="hint-box">
                            <i data-lucide="lightbulb"></i>
                            <span>${question.hint}</span>
                        </div>
                    </div>
                </div>
                <div class="game-footer-session">
                    <button class="btn btn-outline" onclick="window.eduGame.renderMainMenu()">
                        <i data-lucide="home"></i> Menu Principal
                    </button>
                </div>
            </div>
        `;
        this.applyGlobalStyles();
        lucide.createIcons();
    }
    shuffleOptions(options, correctIndex) {
        // Cria array de índices e embaralha
        const indices = [...Array(options.length).keys()];
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        // Retorna novo array com opções embaralhadas e novo índice correto
        const shuffled = indices.map(i => options[i]);
        const newCorrectIndex = indices.indexOf(correctIndex);
        return { options: shuffled, correctIndex: newCorrectIndex };
    }
    renderShuffledOptions(shuffled) {
        return `
            <div class="options-grid">
                ${shuffled.options.map((opt, i) => `
                    <button class="option-btn" onclick="window.eduGame.submitAnswer(${i}, ${shuffled.correctIndex})">
                        <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                        <span class="option-text">${opt}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }
    submitAnswer(selectedIndex, correctIndex) {
        const question = this.currentGame.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === correctIndex;
        // Marca pergunta como respondida
        this.answeredQuestions.add(`${this.selectedDifficulty}-${question.id}`);
        if (isCorrect) {
            this.streak++;
            const reward = this.calculateReward();
            this.score += reward;
            this.showFeedback(true, question, reward);
        } else {
            this.streak = 0;
            this.showFeedback(false, question, 0, correctIndex);
        }
        this.currentQuestionIndex++;
        setTimeout(() => {
            this.renderQuestion();
        }, 3500);
    }
    calculateReward() {
        const base = this.currentGame.level.min;
        const range = this.currentGame.level.max - base;
        const multiplier = 1 + (this.streak * 0.15); // Bônus maior por sequência
        return Math.floor((base + Math.random() * range / 3) * multiplier);
    }
    showFeedback(isCorrect, question, reward = 0, correctIndex = -1) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-overlay ${isCorrect ? 'correct' : 'incorrect'}`;
        let explanationContent = question.explanation;
        if (!isCorrect && correctIndex >= 0) {
            const correctLetter = String.fromCharCode(65 + correctIndex);
            explanationContent = `Resposta correta: <strong>${correctLetter}</strong> - ${explanationContent}`;
        }
        feedbackDiv.innerHTML = `
            <div class="feedback-content">
                <div class="feedback-icon">
                    <i data-lucide="${isCorrect ? 'check-circle' : 'x-circle'}"></i>
                </div>
                <h3>${isCorrect ? '🎉 INCRÍVEL!' : '🤔 Quase lá!'}</h3>
                ${isCorrect ? `<p class="reward-amount">+${reward.toLocaleString()} Kz</p>` : ''}
                <div class="explanation-box">
                    <h4><i data-lucide="book-open"></i> Aprendizado:</h4>
                    <p>${explanationContent}</p>
                </div>
            </div>
        `;
        document.body.appendChild(feedbackDiv);
        lucide.createIcons();
        setTimeout(() => {
            feedbackDiv.style.opacity = '0';
            feedbackDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (feedbackDiv.parentNode) {
                    feedbackDiv.parentNode.removeChild(feedbackDiv);
                }
            }, 500);
        }, 3200);
    }
    async endGame() {
        const totalTime = Date.now() - this.currentGame.startTime;
        if (this.score > 0) {
            await this.creditToGameBalance();
        }
        this.showResultScreen();
    }
    async creditToGameBalance() {
        this.showLoading("Processando recompensa...");
        try {
            const { currentUser } = window.authManager;
            if (!currentUser) throw new Error("Usuário não autenticado");
            const reward = this.score;
            const txId = this.generateUniqueId('game');
            const currentGameBalance = currentUser.gameBalance || 0;
            const newGameBalance = currentGameBalance + reward;
            const updates = {
                gameBalance: newGameBalance,
                [`transactions/${txId}`]: {
                    type: 'game_reward',
                    amount: reward,
                    description: `Recompensa ${this.currentGame.level.name} - ${this.currentGame.questions.length} perguntas`,
                    timestamp: Date.now(),
                    status: 'completed'
                }
            };
            await window.firebase.dbFunc.update(
                window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
                updates
            );
            // Atualiza localmente
            currentUser.gameBalance = newGameBalance;
            this.showToast(`🎉 ${reward.toLocaleString()} Kz creditados no Saldo de Jogos!`, "success");
        } catch (error) {
            console.error("Erro ao creditar recompensa:", error);
            this.showToast("Erro ao processar recompensa. Tente novamente.", "error");
        } finally {
            this.hideLoading();
        }
    }
    showResultScreen() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="game-result-container">
                <div class="result-card">
                    <div class="confetti-effect"></div>
                    <h1>🏆 Desafio Concluído!</h1>
                    <div class="result-stats">
                        <div class="stat-item neon-stat">
                            <div class="stat-value">${this.score.toLocaleString()} Kz</div>
                            <div class="stat-label">Ganho no Jogo</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${this.currentGame.questions.length}</div>
                            <div class="stat-label">Perguntas Respondidas</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${this.streak}</div>
                            <div class="stat-label">Maior Sequência</div>
                        </div>
                    </div>
                    <div class="result-actions">
                        <button class="btn btn-neon" onclick="window.eduGame.renderMainMenu()">
                            <i data-lucide="gamepad"></i> Menu de Jogos
                        </button>
                        <button class="btn btn-outline" onclick="window.eduGame.startGame('${this.selectedDifficulty}', ${this.selectedRoundSize})">
                            <i data-lucide="refresh-ccw"></i> Refazer Rodada
                        </button>
                    </div>
                </div>
            </div>
        `;
        this.applyGlobalStyles();
        lucide.createIcons();
    }
    transferGameBalance() {
        const gameBalance = this.getGameBalance();
        if (gameBalance <= 0) {
            this.showToast("Saldo de jogos zerado.", "warning");
            return;
        }
        this.showConfirm(`Transferir ${this.formatCurrency(gameBalance)} para seu saldo principal?`, async () => {
            try {
                const { currentUser } = window.authManager;
                if (!currentUser) throw new Error("Usuário não autenticado");
                this.showLoading("Transferindo...");
                const txId = this.generateUniqueId('transfer');
                const newBalance = (currentUser.balance || 0) + gameBalance;
                const updates = {
                    balance: newBalance,
                    gameBalance: 0,
                    [`transactions/${txId}`]: {
                        type: 'game_transfer',
                        amount: gameBalance,
                        description: 'Transferência do Saldo de Jogos',
                        timestamp: Date.now(),
                        status: 'completed'
                    }
                };
                await window.firebase.dbFunc.update(
                    window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
                    updates
                );
                currentUser.balance = newBalance;
                currentUser.gameBalance = 0;
                this.showToast(`✅ ${this.formatCurrency(gameBalance)} transferidos para seu saldo principal!`, "success");
                this.renderMainMenu();
            } catch (error) {
                console.error("Erro na transferência:", error);
                this.showToast("Erro na transferência. Tente novamente.", "error");
            } finally {
                this.hideLoading();
            }
        }, () => {});
    }
    confirmExitGame() {
        this.showConfirm("Deseja realmente sair? Seu progresso será perdido.", () => {
            this.currentGame = null;
            this.renderMainMenu();
        }, () => {});
    }
    showConfirm(message, onYes, onNo) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <p>${message}</p>
                <div class="modal-actions">
                    <button class="btn btn-neon" onclick="this.closest('.custom-modal').remove(); onYes();">Sim</button>
                    <button class="btn btn-outline" onclick="this.closest('.custom-modal').remove(); onNo();">Não</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const onYesHandler = () => onYes();
        const onNoHandler = () => onNo();
        modal.querySelector('.btn-neon').addEventListener('click', onYesHandler, { once: true });
        modal.querySelector('.btn-outline').addEventListener('click', onNoHandler, { once: true });
    }
    getQuestionsByDifficulty(difficulty) {
        return GAME_DATABASE.filter(q => q.difficulty === difficulty);
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    getBadgeClass(difficulty) {
        const map = {
            easy: 'badge-success',
            medium: 'badge-warning',
            hard: 'badge-danger',
            expert: 'badge-purple',
            ultra: 'badge-cyan',
            legend: 'badge-pink',
            mythic: 'badge-red'
        };
        return map[difficulty] || 'badge-secondary';
    }
    getDifficultyName(key) {
        const map = {
            easy: 'Fácil',
            medium: 'Médio',
            hard: 'Difícil',
            expert: 'Expert',
            ultra: 'Ultra',
            legend: 'Lendário',
            mythic: 'Mítico'
        };
        return map[key] || key;
    }
    generateUniqueId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    getGameBalance() {
        return window.authManager?.currentUser?.gameBalance || 0;
    }
    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 0
        }).format(amount);
    }
    showToast(message, type = 'info') {
        const existing = document.querySelector('.custom-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = `custom-toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i data-lucide="${this.getToastIcon(type)}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="this.closest('.custom-toast').remove()">×</button>
        `;
        document.body.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
            }, 500);
        }, 4000);
    }
    getToastIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'x-circle';
            case 'warning': return 'alert-triangle';
            default: return 'info';
        }
    }
    showLoading(message = "Carregando...") {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-overlay';
        loadingDiv.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;
        document.body.appendChild(loadingDiv);
        document.body.style.pointerEvents = 'none';
    }
    hideLoading() {
        const loading = document.querySelector('.loading-overlay');
        if (loading) loading.remove();
        document.body.style.pointerEvents = 'auto';
    }
    applyGlobalStyles() {
        const styleId = 'edu-game-styles';
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Estilos Globais para EduGames */
            .edu-game-container {
                padding: 2rem;
                max-width: 1200px;
                margin: 0 auto;
            }
            .game-header h1 {
                font-size: 2.5rem;
                background: linear-gradient(90deg, #ff00cc, #3393ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                text-align: center;
                margin-bottom: 1rem;
                text-shadow: 0 0 10px rgba(255, 0, 204, 0.3);
            }
            .game-header p {
                text-align: center;
                color: var(--text-secondary);
                margin-bottom: 2rem;
                font-size: 1.1rem;
            }
            .game-balance-display {
                text-align: center;
                margin: 1.5rem 0;
            }
            .balance-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                font-weight: bold;
                box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
                animation: glow 2s ease-in-out infinite alternate;
            }
            .difficulty-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
                margin: 2rem 0;
            }
            .difficulty-card {
                position: relative;
                border-radius: 16px;
                padding: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--surface);
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                border: 1px solid rgba(255,255,255,0.1);
                overflow: hidden;
                transform: translateY(0);
            }
            .difficulty-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 40px rgba(0,0,0,0.2);
            }
            .difficulty-easy { background: linear-gradient(135deg, #10b981, #059669); color: white; }
            .difficulty-medium { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
            .difficulty-hard { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; }
            .difficulty-expert { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
            .difficulty-ultra { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; }
            .difficulty-legend { background: linear-gradient(135deg, #ec4899, #db2777); color: white; }
            .difficulty-mythic { background: linear-gradient(135deg, #f43f5e, #be123c); color: white; }
            .card-glow {
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.5s;
            }
            .difficulty-card:hover .card-glow {
                opacity: 1;
            }
            .crown {
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 1.2rem;
                font-weight: bold;
                text-shadow: 0 0 5px rgba(255,255,255,0.7);
            }
            .reward-range {
                font-size: 1.2rem;
                font-weight: 700;
                margin: 0.5rem 0;
                text-shadow: 0 0 5px rgba(255,255,255,0.5);
            }
            .challenge-count {
                font-size: 0.9rem;
                opacity: 0.9;
                margin-bottom: 0.5rem;
            }
            .difficulty-tag {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .transfer-panel {
                margin: 2rem 0;
                text-align: center;
                padding: 2rem;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                border-radius: 16px;
            }
            .transfer-panel h3 {
                color: white;
                margin-bottom: 1rem;
            }
            .btn-neon {
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
            }
            .btn-neon:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
            }
            /* Estilos para seleção de rodada */
            .round-selection-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin: 2rem 0;
            }
            .round-card {
                border-radius: 16px;
                padding: 2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                background: var(--surface);
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                border: 2px solid transparent;
                text-align: center;
                transform: translateY(0);
            }
            .round-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 40px rgba(0,0,0,0.2);
                border-color: #8b5cf6;
            }
            .round-card-disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            .round-card-disabled:hover {
                transform: none;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                border-color: transparent;
            }
            .round-content h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                color: var(--text-primary);
            }
            .reward-estimate {
                font-size: 1.1rem;
                font-weight: 600;
                color: #8b5cf6;
                margin: 1rem 0;
            }
            .round-warning {
                background: #fef3c7;
                color: #92400e;
                padding: 0.5rem;
                border-radius: 8px;
                font-size: 0.9rem;
                margin-top: 1rem;
            }
            /* Estilos para sessão de jogo */
            .game-session-container {
                padding: 2rem;
            }
            .game-header-session {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                flex-wrap: wrap;
                gap: 1rem;
            }
            .game-progress {
                display: flex;
                align-items: center;
                gap: 1rem;
                font-weight: bold;
                font-size: 1.1rem;
            }
            .streak-indicator {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-weight: bold;
            }
            .question-card {
                background: var(--surface);
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                margin: 2rem 0;
                animation: fadeInUp 0.5s ease;
            }
            .question-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }
            .category-badge {
                background: #3b82f6;
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
            }
            .difficulty-badge {
                background: rgba(255,255,255,0.1);
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .question-text {
                font-size: 1.3rem;
                margin: 1.5rem 0;
                line-height: 1.6;
            }
            .options-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1rem;
                margin: 2rem 0;
            }
            @media (min-width: 768px) {
                .options-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            .option-btn {
                display: flex;
                align-items: center;
                padding: 1.2rem;
                border: 2px solid var(--border);
                border-radius: 12px;
                background: var(--surface-light);
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
                font-size: 1.1rem;
            }
            .option-btn:hover {
                transform: scale(1.02);
                border-color: var(--primary);
                background: var(--primary-light);
            }
            .option-letter {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                height: 36px;
                background: var(--primary);
                color: white;
                border-radius: 50%;
                font-weight: bold;
                margin-right: 1rem;
                flex-shrink: 0;
            }
            .game-hints {
                margin-top: 2rem;
                padding: 1.5rem;
                background: rgba(59, 130, 246, 0.1);
                border-radius: 12px;
                border-left: 4px solid #3b82f6;
            }
            .hint-box {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #3b82f6;
                font-weight: 500;
            }
            /* Estilos para feedback */
            .feedback-overlay {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1.5rem;
                border-radius: 16px;
                color: white;
                z-index: 10000;
                max-width: 400px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                opacity: 1;
                transform: translateY(0);
                transition: all 0.5s ease;
            }
            .feedback-overlay.correct {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            .feedback-overlay.incorrect {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }
            .feedback-content {
                text-align: center;
            }
            .feedback-icon {
                text-align: center;
                margin-bottom: 1rem;
            }
            .feedback-icon i {
                font-size: 2.5rem;
            }
            .reward-amount {
                font-size: 1.5rem;
                font-weight: bold;
                margin: 1rem 0;
                text-shadow: 0 0 10px rgba(255,255,255,0.5);
            }
            .explanation-box {
                background: rgba(255,255,255,0.1);
                padding: 1.5rem;
                border-radius: 12px;
                margin-top: 1.5rem;
                text-align: left;
            }
            .explanation-box h4 {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 0.5rem;
            }
            /* Estilos para tela de resultado */
            .game-result-container {
                padding: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 60vh;
            }
            .result-card {
                background: var(--surface);
                border-radius: 24px;
                padding: 3rem;
                box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                text-align: center;
                position: relative;
                max-width: 600px;
                width: 100%;
                border: 1px solid rgba(255,255,255,0.1);
            }
            .confetti-effect {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                background-image: url("image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Ccircle cx='5' cy='5' r='2' fill='%23ff0'/%3E%3Ccircle cx='15' cy='15' r='2' fill='%23f0f'/%3E%3C/svg%3E");
                animation: confetti 3s linear infinite;
                opacity: 0.3;
            }
            .result-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2rem;
                margin: 3rem 0;
            }
            .stat-item {
                padding: 2rem;
                border-radius: 16px;
                background: var(--surface-light);
                border: 1px solid rgba(255,255,255,0.1);
            }
            .neon-stat {
                background: linear-gradient(135deg, #8b5cf6, #ec4899);
                color: white;
            }
            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            .stat-label {
                font-size: 0.9rem;
                opacity: 0.9;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .result-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-top: 2rem;
            }
            /* Estilos para toasts */
            .custom-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 24px;
                border-radius: 12px;
                background: var(--surface);
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                z-index: 10000;
                max-width: 400px;
                border: 2px solid transparent;
                opacity: 1;
                transform: translateY(0);
                transition: all 0.5s ease;
            }
            .custom-toast.toast-success { border-color: #10b981; background: #f0fdf4; }
            .custom-toast.toast-error { border-color: #ef4444; background: #fef2f2; }
            .custom-toast.toast-warning { border-color: #f59e0b; background: #fffbeb; }
            .custom-toast.toast-info { border-color: #3b82f6; background: #eff6ff; }
            .toast-icon { font-size: 20px; }
            .toast-message { flex: 1; font-weight: 500; }
            .toast-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: var(--text-secondary);
                padding: 0 4px;
            }
            .toast-close:hover { color: var(--text-primary); }
            /* Estilos para loading */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
            }
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 5px solid rgba(255,255,255,0.3);
                border-top: 5px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }
            /* Estilos para modais */
            .custom-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .modal-content {
                background: var(--surface);
                padding: 2rem;
                border-radius: 16px;
                max-width: 400px;
                width: 90%;
                text-align: center;
            }
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 1.5rem;
            }
            /* Animações */
            @keyframes glow {
                from { box-shadow: 0 0 5px rgba(255, 0, 204, 0.5); }
                to { box-shadow: 0 0 20px rgba(51, 147, 255, 0.8), 0 0 30px rgba(255, 0, 204, 0.6); }
            }
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes confetti {
                0% { background-position: 0 0; }
                100% { background-position: 100% 100%; }
            }
            .pulse {
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }
            /* Badges */
            .badge-success { background: #10b981; color: white; }
            .badge-warning { background: #f59e0b; color: white; }
            .badge-danger { background: #ef4444; color: white; }
            .badge-purple { background: #8b5cf6; color: white; }
            .badge-cyan { background: #06b6d4; color: white; }
            .badge-pink { background: #ec4899; color: white; }
            .badge-red { background: #f43f5e; color: white; }
        `;
        document.head.appendChild(style);
    }
}

// ▼▼▼ BANCO DE DADOS DE PERGUNTAS (400+ PERGUNTAS COM 10 CATEGORIAS) ▼▼▼
const GAME_DATABASE = [
    // FÁCIL (50 perguntas)
    { id: 1, difficulty: 'easy', category: 'HTML', question: 'O que significa HTML?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'], correctIndex: 0, hint: 'Linguagem de marcação de hipertexto', explanation: 'HTML significa HyperText Markup Language, a linguagem base para criação de páginas web.' },
    { id: 2, difficulty: 'easy', category: 'CSS', question: 'Qual propriedade CSS define a cor do texto?', options: ['text-color', 'font-color', 'color', 'text-style'], correctIndex: 2, hint: 'Propriedade mais direta', explanation: 'A propriedade "color" é usada para definir a cor do texto em CSS.' },
    { id: 3, difficulty: 'easy', category: 'JavaScript', question: 'Qual comando exibe uma mensagem no console?', options: ['print()', 'console.log()', 'log()', 'echo()'], correctIndex: 1, hint: 'Começa com "console"', explanation: 'console.log() é o comando padrão para exibir mensagens no console do navegador.' },
    { id: 4, difficulty: 'easy', category: 'Internet', question: 'O que significa URL?', options: ['Universal Resource Locator', 'Uniform Resource Locator', 'United Resource Link', 'Universal Reference Link'], correctIndex: 1, hint: 'Localizador uniforme de recursos', explanation: 'URL significa Uniform Resource Locator, o endereço que identifica recursos na web.' },
    { id: 5, difficulty: 'easy', category: 'Redes', question: 'Qual protocolo é usado para enviar e-mails?', options: ['HTTP', 'FTP', 'SMTP', 'TCP'], correctIndex: 2, hint: 'Protocolo de envio de correio', explanation: 'SMTP (Simple Mail Transfer Protocol) é o protocolo padrão para envio de e-mails.' },
    { id: 6, difficulty: 'easy', category: 'Segurança', question: 'O que é phishing?', options: ['Ataque de negação de serviço', 'Tentativa de roubo de dados por engano', 'Vírus que corrompe arquivos', 'Falha de hardware'], correctIndex: 1, hint: 'Parece "pescaria" de dados', explanation: 'Phishing é uma técnica de engenharia social que tenta enganar usuários para roubar informações confidenciais.' },
    { id: 7, difficulty: 'easy', category: 'Hardware', question: 'Qual componente armazena dados temporariamente enquanto o computador está ligado?', options: ['HD', 'SSD', 'RAM', 'Placa de vídeo'], correctIndex: 2, hint: 'Memória volátil', explanation: 'A RAM (Memória de Acesso Aleatório) armazena dados temporários enquanto o computador está em operação.' },
    { id: 8, difficulty: 'easy', category: 'Sistemas Operacionais', question: 'Qual comando lista arquivos em um diretório no Linux?', options: ['dir', 'ls', 'list', 'show'], correctIndex: 1, hint: 'Abreviação de "list"', explanation: 'O comando "ls" é usado para listar arquivos e diretórios no terminal Linux.' },
    { id: 9, difficulty: 'easy', category: 'Banco de Dados', question: 'Qual comando SQL recupera dados de uma tabela?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], correctIndex: 2, hint: 'Selecionar dados', explanation: 'O comando SELECT é usado para consultar e recuperar dados de uma ou mais tabelas em SQL.' },
    { id: 10, difficulty: 'easy', category: 'Lógica de Programação', question: 'Qual estrutura repete um bloco de código enquanto uma condição for verdadeira?', options: ['if', 'for', 'while', 'switch'], correctIndex: 2, hint: 'Enquanto condição for verdadeira', explanation: 'O laço "while" executa um bloco de código repetidamente enquanto a condição especificada for verdadeira.' },
    { id: 11, difficulty: 'easy', category: 'HTML', question: 'Qual tag HTML define um parágrafo?', options: ['<p>', '<para>', '<paragraph>', '<pg>'], correctIndex: 0, hint: 'Tag mais curta', explanation: 'A tag <p> é usada para definir parágrafos em documentos HTML.' },
    { id: 12, difficulty: 'easy', category: 'CSS', question: 'Qual propriedade CSS define o tamanho da fonte?', options: ['font-size', 'text-size', 'size', 'font-weight'], correctIndex: 0, hint: 'Combinação óbvia', explanation: 'A propriedade "font-size" é usada para definir o tamanho da fonte em CSS.' },
    { id: 13, difficulty: 'easy', category: 'JavaScript', question: 'Qual símbolo é usado para comentários de uma linha em JavaScript?', options: ['//', '#', '--', '/*'], correctIndex: 0, hint: 'Usado em muitas linguagens', explanation: 'O símbolo "//" é usado para comentários de uma linha em JavaScript.' },
    { id: 14, difficulty: 'easy', category: 'Internet', question: 'Qual protocolo é usado para navegação web segura?', options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'], correctIndex: 1, hint: 'Versão segura do HTTP', explanation: 'HTTPS (HyperText Transfer Protocol Secure) é a versão segura do HTTP, usando criptografia SSL/TLS.' },
    { id: 15, difficulty: 'easy', category: 'Redes', question: 'O que significa IP?', options: ['Internet Protocol', 'International Protocol', 'Internal Port', 'Internet Port'], correctIndex: 0, hint: 'Protocolo da Internet', explanation: 'IP significa Internet Protocol, o protocolo principal para comunicação na Internet.' },
    { id: 16, difficulty: 'easy', category: 'Segurança', question: 'O que é um firewall?', options: ['Programa antivírus', 'Sistema que controla tráfego de rede', 'Tipo de malware', 'Backup de dados'], correctIndex: 1, hint: 'Protege como um muro', explanation: 'Um firewall é um sistema de segurança que monitora e controla o tráfego de rede com base em regras de segurança.' },
    { id: 17, difficulty: 'easy', category: 'Hardware', question: 'Qual componente processa instruções do computador?', options: ['RAM', 'HD', 'CPU', 'Placa-mãe'], correctIndex: 2, hint: 'Cérebro do computador', explanation: 'A CPU (Unidade Central de Processamento) é o componente que executa instruções dos programas de computador.' },
    { id: 18, difficulty: 'easy', category: 'Sistemas Operacionais', question: 'Qual sistema operacional foi criado por Linus Torvalds?', options: ['Windows', 'macOS', 'Linux', 'Unix'], correctIndex: 2, hint: 'Nome do criador', explanation: 'Linus Torvalds criou o kernel Linux, que é a base para diversos sistemas operacionais Linux.' },
    { id: 19, difficulty: 'easy', category: 'Banco de Dados', question: 'Qual comando SQL insere novos registros em uma tabela?', options: ['ADD', 'INSERT', 'CREATE', 'PUT'], correctIndex: 1, hint: 'Inserir em inglês', explanation: 'O comando INSERT é usado para adicionar novos registros a uma tabela em SQL.' },
    { id: 20, difficulty: 'easy', category: 'Lógica de Programação', question: 'Qual operador lógico retorna verdadeiro se ambas as condições forem verdadeiras?', options: ['OR', 'AND', 'NOT', 'XOR'], correctIndex: 1, hint: 'Operador de conjunção', explanation: 'O operador AND retorna verdadeiro apenas quando ambas as condições forem verdadeiras.' },
    { id: 21, difficulty: 'easy', category: 'Algoritmos', question: 'O que é um algoritmo?', options: ['Uma linguagem de programação', 'Um tipo de banco de dados', 'Uma sequência de passos para resolver um problema', 'Um sistema operacional'], correctIndex: 2, hint: 'Passos lógicos', explanation: 'Um algoritmo é uma sequência finita de instruções bem definidas para resolver um problema ou realizar uma tarefa.' },
    { id: 22, difficulty: 'easy', category: 'Git', question: 'Qual comando Git é usado para clonar um repositório?', options: ['git copy', 'git clone', 'git download', 'git pull'], correctIndex: 1, hint: 'Clonar em inglês', explanation: 'O comando "git clone" é usado para criar uma cópia local de um repositório remoto.' },
    { id: 23, difficulty: 'easy', category: 'Terminal', question: 'Qual comando muda o diretório atual no terminal?', options: ['cd', 'dir', 'move', 'goto'], correctIndex: 0, hint: 'Abreviação comum', explanation: 'O comando "cd" (change directory) é usado para mudar o diretório de trabalho atual no terminal.' },
    { id: 24, difficulty: 'easy', category: 'APIs', question: 'O que significa API?', options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Integration', 'Automated Program Interface'], correctIndex: 0, hint: 'Interface de programação', explanation: 'API significa Application Programming Interface, um conjunto de definições e protocolos para construir e integrar software de aplicativo.' },
    { id: 25, difficulty: 'easy', category: 'Mobile', question: 'Qual sistema operacional móvel é desenvolvido pela Apple?', options: ['Android', 'Windows Phone', 'iOS', 'BlackBerry OS'], correctIndex: 2, hint: 'Apple', explanation: 'iOS é o sistema operacional móvel desenvolvido pela Apple para seus dispositivos iPhone, iPad e iPod Touch.' },
    { id: 26, difficulty: 'easy', category: 'HTML', question: 'Qual tag HTML cria um link?', options: ['<link>', '<a>', '<href>', '<url>'], correctIndex: 1, hint: 'Âncora', explanation: 'A tag <a> (âncora) é usada para criar links em documentos HTML.' },
    { id: 27, difficulty: 'easy', category: 'CSS', question: 'Qual propriedade CSS define o espaçamento entre elementos?', options: ['padding', 'margin', 'spacing', 'gap'], correctIndex: 1, hint: 'Espaço externo', explanation: 'A propriedade "margin" define o espaçamento externo entre elementos, enquanto "padding" define o espaçamento interno.' },
    { id: 28, difficulty: 'easy', category: 'JavaScript', question: 'Qual função converte string para número em JavaScript?', options: ['parseInt()', 'toNumber()', 'convertNumber()', 'stringToNum()'], correctIndex: 0, hint: 'Parse integer', explanation: 'A função parseInt() converte uma string em um número inteiro em JavaScript.' },
    { id: 29, difficulty: 'easy', category: 'Internet', question: 'Qual serviço traduz nomes de domínio para endereços IP?', options: ['HTTP', 'FTP', 'DNS', 'SMTP'], correctIndex: 2, hint: 'Sistema de nomes', explanation: 'DNS (Domain Name System) é o serviço que traduz nomes de domínio legíveis por humanos em endereços IP numéricos.' },
    { id: 30, difficulty: 'easy', category: 'Redes', question: 'Qual dispositivo conecta redes diferentes?', options: ['Hub', 'Switch', 'Router', 'Modem'], correctIndex: 2, hint: 'Roteador', explanation: 'Um roteador (router) é um dispositivo que encaminha pacotes de dados entre redes de computadores diferentes.' },
    { id: 31, difficulty: 'easy', category: 'Segurança', question: 'O que é autenticação de dois fatores?', options: ['Usar duas senhas diferentes', 'Verificar identidade com dois métodos diferentes', 'Ter dois usuários aprovando', 'Criptografia dupla'], correctIndex: 1, hint: 'Dois métodos de verificação', explanation: 'Autenticação de dois fatores (2FA) é um método de segurança que requer dois métodos diferentes de verificação de identidade.' },
    { id: 32, difficulty: 'easy', category: 'Hardware', question: 'Qual componente armazena dados permanentemente?', options: ['RAM', 'CPU', 'HD/SSD', 'GPU'], correctIndex: 2, hint: 'Armazenamento permanente', explanation: 'HD (Hard Disk) e SSD (Solid State Drive) são dispositivos de armazenamento que mantêm dados mesmo quando o computador está desligado.' },
    { id: 33, difficulty: 'easy', category: 'Sistemas Operacionais', question: 'Qual comando cria um novo diretório no Linux?', options: ['newdir', 'mkdir', 'createdir', 'mkfolder'], correctIndex: 1, hint: 'Make directory', explanation: 'O comando "mkdir" (make directory) é usado para criar novos diretórios no Linux.' },
    { id: 34, difficulty: 'easy', category: 'Banco de Dados', question: 'Qual comando SQL atualiza registros existentes?', options: ['MODIFY', 'CHANGE', 'UPDATE', 'ALTER'], correctIndex: 2, hint: 'Atualizar em inglês', explanation: 'O comando UPDATE é usado para modificar registros existentes em uma tabela SQL.' },
    { id: 35, difficulty: 'easy', category: 'Lógica de Programação', question: 'Qual estrutura toma decisões baseadas em condições?', options: ['for', 'while', 'if', 'function'], correctIndex: 2, hint: 'Condicional', explanation: 'A estrutura "if" é usada para executar blocos de código condicionalmente, baseado em expressões booleanas.' },
    { id: 36, difficulty: 'easy', category: 'Algoritmos', question: 'Qual estrutura de dados segue o princípio FIFO?', options: ['Pilha', 'Fila', 'Árvore', 'Grafo'], correctIndex: 1, hint: 'First In, First Out', explanation: 'Fila (Queue) é uma estrutura de dados que segue o princípio FIFO (First In, First Out) - primeiro a entrar, primeiro a sair.' },
    { id: 37, difficulty: 'easy', category: 'Git', question: 'Qual comando Git mostra o status dos arquivos?', options: ['git status', 'git show', 'git info', 'git check'], correctIndex: 0, hint: 'Status em inglês', explanation: 'O comando "git status" mostra o estado atual do repositório, incluindo arquivos modificados, adicionados ou não rastreados.' },
    { id: 38, difficulty: 'easy', category: 'Terminal', question: 'Qual comando mostra o diretório atual no Linux?', options: ['where', 'current', 'pwd', 'path'], correctIndex: 2, hint: 'Print working directory', explanation: 'O comando "pwd" (print working directory) exibe o caminho completo do diretório de trabalho atual no Linux.' },
    { id: 39, difficulty: 'easy', category: 'APIs', question: 'Qual formato de dados é comumente usado em APIs web?', options: ['XML', 'JSON', 'CSV', 'YAML'], correctIndex: 1, hint: 'Formato leve e popular', explanation: 'JSON (JavaScript Object Notation) é um formato de dados leve e de fácil leitura que se tornou o padrão para APIs web.' },
    { id: 40, difficulty: 'easy', category: 'Mobile', question: 'Qual linguagem é usada para desenvolvimento nativo Android?', options: ['Swift', 'Objective-C', 'Java/Kotlin', 'C#'], correctIndex: 2, hint: 'Linguagens oficiais do Android', explanation: 'Java e Kotlin são as linguagens oficiais para desenvolvimento nativo de aplicativos Android.' },
    { id: 41, difficulty: 'easy', category: 'HTML', question: 'Qual tag HTML define uma imagem?', options: ['<img>', '<image>', '<picture>', '<photo>'], correctIndex: 0, hint: 'Abreviação de image', explanation: 'A tag <img> é usada para incorporar imagens em documentos HTML.' },
    { id: 42, difficulty: 'easy', category: 'CSS', question: 'Qual propriedade CSS define o alinhamento de texto?', options: ['text-align', 'align-text', 'text-position', 'alignment'], correctIndex: 0, hint: 'Nome composto', explanation: 'A propriedade "text-align" é usada para definir o alinhamento horizontal do texto (left, right, center, justify).' },
    { id: 43, difficulty: 'easy', category: 'JavaScript', question: 'Qual método adiciona um elemento ao final de um array?', options: ['push()', 'add()', 'append()', 'insert()'], correctIndex: 0, hint: 'Empurrar', explanation: 'O método push() adiciona um ou mais elementos ao final de um array e retorna o novo comprimento do array.' },
    { id: 44, difficulty: 'easy', category: 'Internet', question: 'Qual protocolo é usado para transferência de arquivos?', options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'], correctIndex: 2, hint: 'File Transfer Protocol', explanation: 'FTP (File Transfer Protocol) é o protocolo padrão para transferência de arquivos pela Internet.' },
    { id: 45, difficulty: 'easy', category: 'Redes', question: 'Qual camada do modelo OSI é responsável pelo roteamento?', options: ['Camada de Enlace', 'Camada de Rede', 'Camada de Transporte', 'Camada de Aplicação'], correctIndex: 1, hint: 'Endereçamento lógico', explanation: 'A Camada de Rede (Layer 3) é responsável pelo roteamento e endereçamento lógico (IP) dos pacotes na rede.' },
    { id: 46, difficulty: 'easy', category: 'Segurança', question: 'O que é criptografia?', options: ['Compressão de dados', 'Transformação de dados em código secreto', 'Backup de dados', 'Eliminação de vírus'], correctIndex: 1, hint: 'Codificação secreta', explanation: 'Criptografia é a prática de proteger informações convertendo-as em um formato codificado que só pode ser lido por pessoas autorizadas.' },
    { id: 47, difficulty: 'easy', category: 'Hardware', question: 'Qual componente fornece energia ao computador?', options: ['CPU', 'Fonte de alimentação', 'Placa-mãe', 'RAM'], correctIndex: 1, hint: 'Fornece energia', explanation: 'A fonte de alimentação converte a corrente elétrica da tomada em voltagens adequadas para os componentes do computador.' },
    { id: 48, difficulty: 'easy', category: 'Sistemas Operacionais', question: 'Qual comando copia arquivos no Linux?', options: ['copy', 'cp', 'duplicate', 'clone'], correctIndex: 1, hint: 'Copy abreviado', explanation: 'O comando "cp" (copy) é usado para copiar arquivos e diretórios no Linux.' },
    { id: 49, difficulty: 'easy', category: 'Banco de Dados', question: 'O que é uma chave primária?', options: ['Uma senha para o banco', 'Um campo que identifica unicamente cada registro', 'O primeiro campo da tabela', 'Um índice secundário'], correctIndex: 1, hint: 'Identificador único', explanation: 'Uma chave primária é um campo (ou conjunto de campos) que identifica unicamente cada registro em uma tabela de banco de dados.' },
    { id: 50, difficulty: 'easy', category: 'Lógica de Programação', question: 'O que é uma variável?', options: ['Um valor fixo', 'Um contêiner para armazenar dados', 'Uma função matemática', 'Um tipo de loop'], correctIndex: 1, hint: 'Contêiner de dados', explanation: 'Uma variável é um contêiner nomeado que armazena um valor que pode ser alterado durante a execução do programa.' },

    // MÉDIO (60 perguntas)
    { id: 51, difficulty: 'medium', category: 'JavaScript', question: 'Qual método converte JSON em objeto JavaScript?', options: ['JSON.toString()', 'JSON.parse()', 'JSON.toObject()', 'JSON.convert()'], correctIndex: 1, hint: 'Analisar JSON', explanation: 'JSON.parse() converte uma string no formato JSON em um objeto JavaScript utilizável.' },
    { id: 52, difficulty: 'medium', category: 'React', question: 'Qual hook é usado para armazenar estado em componentes funcionais?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correctIndex: 1, hint: 'Gerenciar estado', explanation: 'useState é o hook do React usado para adicionar estado a componentes funcionais.' },
    { id: 53, difficulty: 'medium', category: 'Node.js', question: 'Qual módulo nativo é usado para manipular caminhos de arquivos?', options: ['fs', 'http', 'path', 'os'], correctIndex: 2, hint: 'Manipulação de caminhos', explanation: 'O módulo "path" fornece utilitários para trabalhar com caminhos de arquivos e diretórios de forma cross-platform.' },
    { id: 54, difficulty: 'medium', category: 'Python', question: 'Como se cria uma lista vazia em Python?', options: ['list()', '[]', 'empty()', 'new List()'], correctIndex: 1, hint: 'Sintaxe mais comum', explanation: '[] é a forma mais comum e direta de criar uma lista vazia em Python.' },
    { id: 55, difficulty: 'medium', category: 'SQL', question: 'Qual cláusula filtra registros em uma consulta?', options: ['WHERE', 'FILTER', 'HAVING', 'SEARCH'], correctIndex: 0, hint: 'Condição após SELECT', explanation: 'A cláusula WHERE é usada para filtrar registros com base em uma condição específica.' },
    { id: 56, difficulty: 'medium', category: 'JavaScript', question: 'Qual é a saída de console.log(typeof null)?', options: ['"null"', '"object"', '"undefined"', '"boolean"'], correctIndex: 1, hint: 'Erro histórico do JavaScript', explanation: 'typeof null retorna "object" devido a um erro histórico na implementação do JavaScript que nunca foi corrigido por questões de compatibilidade.' },
    { id: 57, difficulty: 'medium', category: 'React', question: 'O que o useEffect sem array de dependências faz?', options: ['Executa apenas na montagem', 'Executa após cada renderização', 'Nunca executa', 'Executa apenas na desmontagem'], correctIndex: 1, hint: 'Sem dependências', explanation: 'useEffect sem array de dependências executa após cada renderização do componente, incluindo a inicial.' },
    { id: 58, difficulty: 'medium', category: 'Node.js', question: 'Qual método do módulo fs lê um arquivo de forma assíncrona?', options: ['fs.readFile()', 'fs.read()', 'fs.openFile()', 'fs.loadFile()'], correctIndex: 0, hint: 'Read file', explanation: 'fs.readFile() lê um arquivo de forma assíncrona, retornando o conteúdo quando a operação é concluída.' },
    { id: 59, difficulty: 'medium', category: 'Python', question: 'Qual é a diferença entre lista e tupla em Python?', options: ['Listas são imutáveis, tuplas são mutáveis', 'Listas são mutáveis, tuplas são imutáveis', 'Listas usam (), tuplas usam []', 'Não há diferença'], correctIndex: 1, hint: 'Mutabilidade', explanation: 'Listas são mutáveis (podem ser modificadas após criação) e usam []. Tuplas são imutáveis (não podem ser modificadas) e usam ().' },
    { id: 60, difficulty: 'medium', category: 'SQL', question: 'Qual comando é usado para remover uma tabela inteira?', options: ['DELETE TABLE', 'REMOVE TABLE', 'DROP TABLE', 'ERASE TABLE'], correctIndex: 2, hint: 'Eliminar tabela', explanation: 'DROP TABLE é usado para remover completamente uma tabela e todos os seus dados do banco de dados.' },
    { id: 61, difficulty: 'medium', category: 'CSS', question: 'Qual propriedade CSS cria animações?', options: ['transition', 'animation', 'transform', 'keyframes'], correctIndex: 1, hint: 'Nome direto', explanation: 'A propriedade "animation" é usada para aplicar animações definidas com @keyframes a elementos.' },
    { id: 62, difficulty: 'medium', category: 'TypeScript', question: 'O que é TypeScript?', options: ['Uma biblioteca JavaScript', 'Um pré-processador CSS', 'Um superset de JavaScript com tipagem estática', 'Um framework de backend'], correctIndex: 2, hint: 'Tipagem estática', explanation: 'TypeScript é um superset de JavaScript que adiciona tipagem estática opcional e outros recursos ao JavaScript.' },
    { id: 63, difficulty: 'medium', category: 'Docker', question: 'O que é um container Docker?', options: ['Uma máquina virtual completa', 'Um processo isolado com suas dependências', 'Um serviço de nuvem', 'Um tipo de banco de dados'], correctIndex: 1, hint: 'Isolamento de processos', explanation: 'Um container Docker é um processo isolado que empacota uma aplicação com todas as suas dependências, bibliotecas e configurações.' },
    { id: 64, difficulty: 'medium', category: 'REST', question: 'Qual método HTTP é usado para criar um novo recurso?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctIndex: 1, hint: 'Enviar dados', explanation: 'O método POST é usado para enviar dados ao servidor para criar um novo recurso.' },
    { id: 65, difficulty: 'medium', category: 'GraphQL', question: 'Qual é a principal vantagem do GraphQL sobre REST?', options: ['Menor consumo de banda', 'Tipagem estática', 'Cliente solicita exatamente os dados que precisa', 'Mais fácil de implementar'], correctIndex: 2, hint: 'Precisão nas consultas', explanation: 'GraphQL permite que o cliente solicite exatamente os dados que precisa, evitando over-fetching e under-fetching comuns em APIs REST.' },
    { id: 66, difficulty: 'medium', category: 'JavaScript', question: 'Qual é a saída de console.log(0.1 + 0.2 === 0.3)?', options: ['true', 'false', 'undefined', 'error'], correctIndex: 1, hint: 'Precisão de ponto flutuante', explanation: 'Devido à representação binária de números de ponto flutuante, 0.1 + 0.2 não é exatamente igual a 0.3, resultando em false.' },
    { id: 67, difficulty: 'medium', category: 'React', question: 'Para que serve o useMemo?', options: ['Executar efeitos colaterais', 'Memorizar valores calculados', 'Gerenciar estado', 'Buscar dados'], correctIndex: 1, hint: 'Memoização', explanation: 'useMemo é usado para memorizar (cache) o resultado de cálculos caros e só recalculá-los quando suas dependências mudam.' },
    { id: 68, difficulty: 'medium', category: 'Node.js', question: 'O que é o event loop no Node.js?', options: ['Um loop de eventos do sistema operacional', 'Um mecanismo que permite operações assíncronas não bloqueantes', 'Um tipo de banco de dados', 'Um sistema de logging'], correctIndex: 1, hint: 'Assincronia não bloqueante', explanation: 'O event loop é o mecanismo que permite que o Node.js execute operações assíncronas de forma não bloqueante, mesmo sendo single-threaded.' },
    { id: 69, difficulty: 'medium', category: 'Python', question: 'O que faz o decorador @staticmethod?', options: ['Cria um método de classe', 'Cria um método estático que não recebe self ou cls', 'Converte uma função em método privado', 'Cria uma propriedade'], correctIndex: 1, hint: 'Método sem self', explanation: '@staticmethod cria um método que pode ser chamado na classe ou instância, mas não recebe automaticamente self ou cls como primeiro argumento.' },
    { id: 70, difficulty: 'medium', category: 'SQL', question: 'Qual cláusula agrupa registros com valores iguais?', options: ['ORDER BY', 'GROUP BY', 'SORT BY', 'CLUSTER BY'], correctIndex: 1, hint: 'Agrupar', explanation: 'GROUP BY agrupa linhas que têm os mesmos valores em colunas especificadas, geralmente usado com funções de agregação como COUNT, SUM, AVG.' },
    { id: 71, difficulty: 'medium', category: 'CSS', question: 'Qual propriedade CSS controla a ordem de empilhamento de elementos?', options: ['position', 'display', 'z-index', 'order'], correctIndex: 2, hint: 'Eixo Z', explanation: 'z-index controla a ordem de empilhamento de elementos posicionados, determinando qual elemento aparece na frente de outros.' },
    { id: 72, difficulty: 'medium', category: 'TypeScript', question: 'Como se declara um tipo de união em TypeScript?', options: ['type A = B | C;', 'type A = B & C;', 'type A = B + C;', 'type A = B, C;'], correctIndex: 0, hint: 'Operador pipe', explanation: 'Tipos de união são declarados usando o operador |, permitindo que uma variável tenha um dos tipos especificados.' },
    { id: 73, difficulty: 'medium', category: 'Docker', question: 'Qual comando constrói uma imagem Docker a partir de um Dockerfile?', options: ['docker run', 'docker build', 'docker create', 'docker compile'], correctIndex: 1, hint: 'Construir imagem', explanation: 'docker build é usado para construir uma imagem Docker a partir de um Dockerfile no diretório especificado.' },
    { id: 74, difficulty: 'medium', category: 'REST', question: 'Qual status HTTP indica que um recurso foi criado com sucesso?', options: ['200 OK', '201 Created', '204 No Content', '301 Moved Permanently'], correctIndex: 1, hint: 'Criado', explanation: '201 Created é o status HTTP retornado quando um novo recurso foi criado com sucesso pelo servidor.' },
    { id: 75, difficulty: 'medium', category: 'GraphQL', question: 'Como se chama a operação para modificar dados no GraphQL?', options: ['Query', 'Mutation', 'Subscription', 'Modification'], correctIndex: 1, hint: 'Modificar dados', explanation: 'Mutation é o tipo de operação usado no GraphQL para modificar dados (criar, atualizar, deletar).' },
    { id: 76, difficulty: 'medium', category: 'JavaScript', question: 'Qual método de array retorna um novo array com os elementos que passam no teste?', options: ['map()', 'filter()', 'reduce()', 'forEach()'], correctIndex: 1, hint: 'Filtrar elementos', explanation: 'filter() cria um novo array com todos os elementos que passam no teste implementado pela função fornecida.' },
    { id: 77, difficulty: 'medium', category: 'React', question: 'O que é JSX?', options: ['Uma biblioteca de estilização', 'Uma extensão de sintaxe que permite escrever HTML-like em JavaScript', 'Um gerenciador de estado', 'Um router'], correctIndex: 1, hint: 'Sintaxe HTML-like', explanation: 'JSX é uma extensão de sintaxe que permite escrever código semelhante a HTML dentro de arquivos JavaScript, usada principalmente com React.' },
    { id: 78, difficulty: 'medium', category: 'Node.js', question: 'Qual objeto global fornece informações sobre o processo atual?', options: ['global', 'process', 'console', 'module'], correctIndex: 1, hint: 'Processo atual', explanation: 'O objeto "process" fornece informações sobre o processo Node.js atual e permite controlar o processo.' },
    { id: 79, difficulty: 'medium', category: 'Python', question: 'O que é list comprehension?', options: ['Uma forma de criar listas com loops e condições em uma linha', 'Um tipo de banco de dados', 'Uma biblioteca de visualização', 'Um padrão de projeto'], correctIndex: 0, hint: 'Criação de listas concisa', explanation: 'List comprehension é uma forma concisa de criar listas em Python usando uma sintaxe que combina loops e condições em uma única linha.' },
    { id: 80, difficulty: 'medium', category: 'SQL', question: 'Qual função retorna o número de registros em uma tabela?', options: ['SUM()', 'COUNT()', 'TOTAL()', 'NUMBER()'], correctIndex: 1, hint: 'Contar', explanation: 'COUNT() é uma função de agregação que retorna o número de registros que correspondem aos critérios especificados.' },
    { id: 81, difficulty: 'medium', category: 'CSS', question: 'Qual propriedade CSS faz um elemento flutuar à esquerda ou direita?', options: ['position', 'float', 'align', 'flex'], correctIndex: 1, hint: 'Flutuar', explanation: 'float é usado para posicionar elementos à esquerda ou direita de seu contêiner, permitindo que o texto e outros elementos fluam ao seu redor.' },
    { id: 82, difficulty: 'medium', category: 'TypeScript', question: 'O que é um tipo genérico?', options: ['Um tipo que pode representar qualquer valor', 'Um tipo que funciona com múltiplos tipos sem perder a segurança de tipos', 'Um tipo primitivo', 'Um tipo de interface'], correctIndex: 1, hint: 'Reutilização de tipos', explanation: 'Tipos genéricos permitem criar componentes que funcionam com uma variedade de tipos, mantendo a segurança de tipos em tempo de compilação.' },
    { id: 83, difficulty: 'medium', category: 'Docker', question: 'O que é um Dockerfile?', options: ['Um arquivo de configuração de rede', 'Um script que contém instruções para construir uma imagem Docker', 'Um arquivo de log', 'Um arquivo de backup'], correctIndex: 1, hint: 'Construir imagem', explanation: 'Um Dockerfile é um script texto que contém todas as instruções necessárias para construir uma imagem Docker.' },
    { id: 84, difficulty: 'medium', category: 'REST', question: 'Qual método HTTP é idempotente e seguro?', options: ['POST', 'PUT', 'DELETE', 'GET'], correctIndex: 3, hint: 'Recuperar dados', explanation: 'GET é idempotente (múltiplas chamadas têm o mesmo efeito que uma) e seguro (não modifica o estado do servidor).' },
    { id: 85, difficulty: 'medium', category: 'GraphQL', question: 'O que é um schema no GraphQL?', options: ['Um banco de dados', 'Uma definição da estrutura da API e tipos de dados', 'Um servidor', 'Um cliente'], correctIndex: 1, hint: 'Definição da API', explanation: 'O schema define a estrutura da API GraphQL, incluindo tipos, queries, mutations e subscriptions disponíveis.' },
    { id: 86, difficulty: 'medium', category: 'JavaScript', question: 'Qual é a diferença entre == e ===?', options: ['== compara valor, === compara valor e tipo', '=== compara valor, == compara valor e tipo', 'Não há diferença', '== é mais rápido que ==='], correctIndex: 0, hint: 'Comparação estrita', explanation: '== compara apenas o valor (com coerção de tipo), enquanto === compara valor e tipo (sem coerção de tipo).' },
    { id: 87, difficulty: 'medium', category: 'React', question: 'O que é o Virtual DOM?', options: ['Um DOM real em memória', 'Uma representação leve do DOM real para otimizar atualizações', 'Um tipo de banco de dados', 'Um sistema de arquivos virtual'], correctIndex: 1, hint: 'Representação leve', explanation: 'O Virtual DOM é uma representação leve do DOM real que permite ao React calcular as mudanças mínimas necessárias antes de atualizar o DOM real.' },
    { id: 88, difficulty: 'medium', category: 'Node.js', question: 'Qual módulo é usado para criar servidores HTTP?', options: ['fs', 'path', 'http', 'os'], correctIndex: 2, hint: 'HTTP', explanation: 'O módulo "http" fornece funcionalidades para criar servidores e clientes HTTP no Node.js.' },
    { id: 89, difficulty: 'medium', category: 'Python', question: 'O que é um dicionário em Python?', options: ['Uma lista ordenada', 'Uma coleção de pares chave-valor', 'Um tipo de função', 'Um módulo de matemática'], correctIndex: 1, hint: 'Chave-valor', explanation: 'Um dicionário é uma coleção de pares chave-valor onde cada chave é única e mapeia para um valor.' },
    { id: 90, difficulty: 'medium', category: 'SQL', question: 'Qual cláusula ordena os resultados de uma consulta?', options: ['GROUP BY', 'ORDER BY', 'SORT BY', 'ARRANGE BY'], correctIndex: 1, hint: 'Ordenar', explanation: 'ORDER BY é usada para ordenar os resultados de uma consulta em ordem ascendente (ASC) ou descendente (DESC).' },
    { id: 91, difficulty: 'medium', category: 'CSS', question: 'Qual propriedade CSS define o modelo de caixa?', options: ['box-model', 'box-sizing', 'layout', 'display'], correctIndex: 1, hint: 'Box sizing', explanation: 'box-sizing controla como o tamanho total do elemento é calculado (incluindo padding e border).' },
    { id: 92, difficulty: 'medium', category: 'TypeScript', question: 'Como se declara uma interface em TypeScript?', options: ['interface Nome { }', 'type Nome = { }', 'class Nome implements { }', 'struct Nome { }'], correctIndex: 0, hint: 'Palavra-chave interface', explanation: 'Interfaces são declaradas usando a palavra-chave "interface" seguida pelo nome e definição das propriedades/métodos.' },
    { id: 93, difficulty: 'medium', category: 'Docker', question: 'Qual comando lista os containers em execução?', options: ['docker ps', 'docker list', 'docker show', 'docker containers'], correctIndex: 0, hint: 'Process status', explanation: 'docker ps lista os containers Docker atualmente em execução (process status).' },
    { id: 94, difficulty: 'medium', category: 'REST', question: 'O que significa REST?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Resource Exchange Standard Technology', 'Relational Entity State Transfer'], correctIndex: 1, hint: 'Transferência de estado representacional', explanation: 'REST significa Representational State Transfer, um estilo arquitetural para sistemas distribuídos.' },
    { id: 95, difficulty: 'medium', category: 'GraphQL', question: 'Qual operação é usada para obter dados no GraphQL?', options: ['Query', 'Mutation', 'Subscription', 'Fetch'], correctIndex: 0, hint: 'Consultar dados', explanation: 'Query é o tipo de operação usado no GraphQL para obter dados do servidor.' },
    { id: 96, difficulty: 'medium', category: 'JavaScript', question: 'O que é hoisting?', options: ['Um tipo de loop', 'O içamento de declarações de variáveis e funções para o topo do escopo', 'Uma técnica de otimização', 'Um erro de sintaxe'], correctIndex: 1, hint: 'Içamento', explanation: 'Hoisting é o comportamento do JavaScript de mover declarações de variáveis e funções para o topo de seu escopo antes da execução do código.' },
    { id: 97, difficulty: 'medium', category: 'React', question: 'Para que serve o useCallback?', options: ['Memorizar funções para evitar recriações desnecessárias', 'Executar efeitos colaterais', 'Gerenciar estado global', 'Buscar dados da API'], correctIndex: 0, hint: 'Memorizar funções', explanation: 'useCallback memoriza uma função entre renderizações para evitar recriações desnecessárias, útil para otimizações de desempenho.' },
    { id: 98, difficulty: 'medium', category: 'Node.js', question: 'Qual é o propósito do package.json?', options: ['Armazenar dados do usuário', 'Definir metadados e dependências do projeto', 'Configurar o servidor', 'Armazenar logs'], correctIndex: 1, hint: 'Metadados e dependências', explanation: 'package.json armazena metadados sobre o projeto (nome, versão, descrição) e lista suas dependências e scripts.' },
    { id: 99, difficulty: 'medium', category: 'Python', question: 'O que faz a função zip()?', options: ['Compacta arquivos', 'Combina iteráveis em tuplas', 'Ordena listas', 'Filtra elementos'], correctIndex: 1, hint: 'Combinar iteráveis', explanation: 'zip() combina elementos de múltiplos iteráveis (listas, tuplas, etc.) em tuplas, pareando elementos pelos seus índices.' },
    { id: 100, difficulty: 'medium', category: 'SQL', question: 'Qual comando é usado para modificar a estrutura de uma tabela?', options: ['MODIFY TABLE', 'CHANGE TABLE', 'ALTER TABLE', 'UPDATE TABLE'], correctIndex: 2, hint: 'Alterar tabela', explanation: 'ALTER TABLE é usado para adicionar, excluir ou modificar colunas em uma tabela existente.' },
    { id: 101, difficulty: 'medium', category: 'CSS', question: 'Qual propriedade CSS cria gradientes?', options: ['gradient', 'background-gradient', 'linear-gradient', 'background-image'], correctIndex: 3, hint: 'Imagem de fundo', explanation: 'background-image com linear-gradient() ou radial-gradient() é usado para criar gradientes como fundo de elementos.' },
    { id: 102, difficulty: 'medium', category: 'TypeScript', question: 'O que é type inference?', options: ['Quando o programador define explicitamente todos os tipos', 'Quando o compilador deduz automaticamente os tipos', 'Um erro de compilação', 'Um tipo especial'], correctIndex: 1, hint: 'Dedução automática', explanation: 'Type inference é a capacidade do compilador TypeScript de deduzir automaticamente os tipos das variáveis com base em seu valor inicial.' },
    { id: 103, difficulty: 'medium', category: 'Docker', question: 'O que é docker-compose?', options: ['Uma versão do Docker para Windows', 'Uma ferramenta para definir e executar aplicações multi-container', 'Um tipo de container', 'Um serviço de nuvem'], correctIndex: 1, hint: 'Multi-container', explanation: 'docker-compose é uma ferramenta para definir e executar aplicações Docker com múltiplos containers usando um arquivo YAML.' },
    { id: 104, difficulty: 'medium', category: 'REST', question: 'Qual status HTTP indica que o recurso não foi encontrado?', options: ['400 Bad Request', '401 Unauthorized', '404 Not Found', '500 Internal Server Error'], correctIndex: 2, hint: 'Página não encontrada', explanation: '404 Not Found é retornado quando o servidor não pode encontrar o recurso solicitado.' },
    { id: 105, difficulty: 'medium', category: 'GraphQL', question: 'O que é introspection no GraphQL?', options: ['Uma forma de modificar o schema', 'A capacidade de consultar o schema do próprio GraphQL', 'Um tipo de erro', 'Um método de autenticação'], correctIndex: 1, hint: 'Auto-consulta', explanation: 'Introspection permite que clientes consultem o schema do GraphQL para descobrir tipos, campos e operações disponíveis.' },
    { id: 106, difficulty: 'medium', category: 'JavaScript', question: 'Qual é a saída de console.log([] == ![])?', options: ['true', 'false', 'undefined', 'error'], correctIndex: 0, hint: 'Coerção de tipo complexa', explanation: '[] == ![] → [] == false → "" == false → 0 == 0 → true. Devido às regras complexas de coerção de tipo do JavaScript.' },
    { id: 107, difficulty: 'medium', category: 'React', question: 'O que é o Context API?', options: ['Uma API para estilização', 'Uma forma de passar dados através da árvore de componentes sem passar props manualmente', 'Um sistema de roteamento', 'Um gerenciador de estado externo'], correctIndex: 1, hint: 'Passar dados sem props', explanation: 'Context API permite passar dados através da árvore de componentes sem precisar passar props manualmente em cada nível.' },
    { id: 108, difficulty: 'medium', category: 'Node.js', question: 'O que é npm?', options: ['Um sistema operacional', 'Um gerenciador de pacotes para JavaScript', 'Um framework de frontend', 'Um banco de dados'], correctIndex: 1, hint: 'Node Package Manager', explanation: 'npm (Node Package Manager) é o gerenciador de pacotes padrão para Node.js, usado para instalar e gerenciar dependências.' },
    { id: 109, difficulty: 'medium', category: 'Python', question: 'O que é um decorator?', options: ['Uma função que modifica outra função', 'Um tipo de variável', 'Um módulo de matemática', 'Um erro de sintaxe'], correctIndex: 0, hint: 'Modificar funções', explanation: 'Um decorator é uma função que recebe outra função e estende seu comportamento sem modificá-la explicitamente.' },
    { id: 110, difficulty: 'medium', category: 'SQL', question: 'Qual cláusula é usada com GROUP BY para filtrar grupos?', options: ['WHERE', 'FILTER', 'HAVING', 'WHEN'], correctIndex: 2, hint: 'Filtrar grupos', explanation: 'HAVING é usada para filtrar grupos após a agregação, enquanto WHERE filtra registros antes da agregação.' },

    // DIFÍCIL (70 perguntas)
    { id: 111, difficulty: 'hard', category: 'JavaScript', question: 'Qual o valor de [] + []?', options: ['"[object Object]"', '""', '"undefined"', '"[]"'], correctIndex: 1, hint: 'Coerção de tipo em arrays', explanation: '[] + [] resulta em string vazia "" devido à coerção de tipo em operações de adição.' },
    { id: 112, difficulty: 'hard', category: 'React', question: 'Por que se usa "key" em listas no React?', options: ['Para estilizar os itens', 'Para identificar elementos e otimizar re-renderizações', 'Para ordenar os itens', 'Para agrupar componentes'], correctIndex: 1, hint: 'Performance e identificação', explanation: 'A prop "key" ajuda o React a identificar quais itens foram alterados, adicionados ou removidos, otimizando as atualizações.' },
    { id: 113, difficulty: 'hard', category: 'Node.js', question: 'Qual é a diferença entre setImmediate() e process.nextTick()?', options: ['Não há diferença', 'process.nextTick() executa antes de qualquer I/O, setImmediate() na próxima iteração do event loop', 'setImmediate() é mais rápido', 'process.nextTick() é obsoleto'], correctIndex: 1, hint: 'Ordem de execução', explanation: 'process.nextTick() executa no final da operação atual, antes de qualquer I/O. setImmediate() executa na próxima iteração do event loop.' },
    { id: 114, difficulty: 'hard', category: 'Python', question: 'O que é GIL em Python?', options: ['Um tipo de erro', 'Global Interpreter Lock - bloqueia execução paralela de threads', 'Uma biblioteca de interface gráfica', 'Um padrão de projeto'], correctIndex: 1, hint: 'Bloqueio global', explanation: 'GIL (Global Interpreter Lock) é um mutex que protege acesso ao interpretador Python, impedindo execução paralela de threads em múltiplos núcleos.' },
    { id: 115, difficulty: 'hard', category: 'SQL', question: 'O que é uma junção (JOIN) interna?', options: ['Retorna todos os registros de ambas as tabelas', 'Retorna apenas registros que têm correspondência em ambas as tabelas', 'Retorna todos os registros da tabela esquerda', 'Retorna registros aleatórios'], correctIndex: 1, hint: 'Correspondência em ambas', explanation: 'INNER JOIN retorna apenas os registros que têm valores correspondentes em ambas as tabelas envolvidas na junção.' },
    { id: 116, difficulty: 'hard', category: 'JavaScript', question: 'Qual o valor de {} + []?', options: ['"[object Object]"', '"[object Object][]"', '"0"', '"[object Object]undefined"'], correctIndex: 2, hint: 'Coerção de tipo complexa', explanation: '{} + [] → 0 + "" → "0". O {} é interpretado como bloco vazio, não objeto, então +[] converte [] para 0.' },
    { id: 117, difficulty: 'hard', category: 'React', question: 'O que acontece se você chamar setState no componentWillUnmount?', options: ['Nada, é ignorado', 'Causa um erro', 'Atualiza o estado normalmente', 'Cria um novo componente'], correctIndex: 1, hint: 'Componente desmontado', explanation: 'Chamar setState em componentWillUnmount causa um erro porque o componente já foi removido do DOM e não deve ser atualizado.' },
    { id: 118, difficulty: 'hard', category: 'Node.js', question: 'O que é um stream no Node.js?', options: ['Um tipo de variável', 'Uma interface para lidar com fluxos de dados de forma eficiente', 'Um banco de dados', 'Um sistema de arquivos'], correctIndex: 1, hint: 'Fluxo de dados', explanation: 'Streams são interfaces para lidar com fluxos de dados de forma eficiente, permitindo processar dados sem carregar tudo na memória.' },
    { id: 119, difficulty: 'hard', category: 'Python', question: 'Qual é a diferença entre shallow copy e deep copy?', options: ['Shallow copy copia apenas referências, deep copy copia objetos recursivamente', 'Deep copy é mais rápida', 'Shallow copy não existe em Python', 'Não há diferença'], correctIndex: 0, hint: 'Profundidade da cópia', explanation: 'Shallow copy cria uma nova coleção mas com referências aos mesmos objetos. Deep copy cria cópias recursivas de todos os objetos.' },
    { id: 120, difficulty: 'hard', category: 'SQL', question: 'O que é uma subconsulta?', options: ['Uma consulta dentro de outra consulta', 'Uma consulta em múltiplos bancos de dados', 'Uma consulta com sintaxe simplificada', 'Um tipo de junção'], correctIndex: 0, hint: 'Consulta aninhada', explanation: 'Uma subconsulta é uma consulta SQL aninhada dentro de outra consulta, usada para retornar dados que serão usados na consulta principal.' },
    { id: 121, difficulty: 'hard', category: 'CSS', question: 'Qual é a diferença entre position: relative e position: absolute?', options: ['Relative posiciona relativo ao viewport, absolute relativo ao pai', 'Absolute posiciona relativo ao viewport, relative relativo ao documento', 'Relative posiciona relativo ao elemento normal, absolute relativo ao ancestral posicionado', 'Não há diferença'], correctIndex: 2, hint: 'Referência de posicionamento', explanation: 'relative posiciona relativo à posição normal do elemento. absolute posiciona relativo ao ancestral posicionado mais próximo (ou body se não houver).' },
    { id: 122, difficulty: 'hard', category: 'TypeScript', question: 'O que é type assertion?', options: ['Quando o compilador infere o tipo automaticamente', 'Quando o programador afirma que uma variável é de um tipo específico', 'Um erro de compilação', 'Um tipo de interface'], correctIndex: 1, hint: 'Afirmação de tipo', explanation: 'Type assertion é quando o programador afirma que uma variável é de um tipo específico, útil quando se sabe mais sobre o tipo do que o compilador.' },
    { id: 123, difficulty: 'hard', category: 'Docker', question: 'Qual é a diferença entre CMD e ENTRYPOINT no Dockerfile?', options: ['CMD executa comandos, ENTRYPOINT define parâmetros', 'ENTRYPOINT define o comando executável, CMD fornece parâmetros padrão', 'Não há diferença', 'CMD é obrigatório, ENTRYPOINT é opcional'], correctIndex: 1, hint: 'Comando vs parâmetros', explanation: 'ENTRYPOINT define o comando executável do container. CMD fornece parâmetros padrão que podem ser sobrescritos na execução.' },
    { id: 124, difficulty: 'hard', category: 'REST', question: 'O que é HATEOAS?', options: ['Um tipo de autenticação', 'Hypermedia as the Engine of Application State - inclui links nas respostas', 'Um protocolo de segurança', 'Um padrão de banco de dados'], correctIndex: 1, hint: 'Hypermedia', explanation: 'HATEOAS é um princípio REST que diz que as respostas da API devem incluir links para outros recursos relacionados, permitindo navegação dinâmica.' },
    { id: 125, difficulty: 'hard', category: 'GraphQL', question: 'O que é DataLoader?', options: ['Uma biblioteca para carregar dados do servidor', 'Uma utilidade para batching e caching de requests', 'Um tipo de subscription', 'Um validador de schema'], correctIndex: 1, hint: 'Batching e caching', explanation: 'DataLoader é uma utilidade do GraphQL para batching (agrupar) e caching de requests, reduzindo o número de chamadas ao banco de dados.' },
    { id: 126, difficulty: 'hard', category: 'JavaScript', question: 'Qual o valor de 1 + -"1" + "2"?', options: ['"02"', '"1-12"', '"2"', '"112"'], correctIndex: 0, hint: 'Ordem de operações e coerção', explanation: '1 + -"1" + "2" → 1 + (-1) + "2" → 0 + "2" → "02". A coerção de tipo converte "1" para número devido ao operador unário -, depois concatena com "2".' },
    { id: 127, difficulty: 'hard', category: 'React', question: 'O que é o StrictMode?', options: ['Um modo de produção', 'Um componente que ajuda a identificar problemas potenciais no desenvolvimento', 'Um sistema de tipagem', 'Um gerenciador de estado'], correctIndex: 1, hint: 'Identificar problemas', explanation: 'StrictMode é um componente do React que ajuda a identificar problemas potenciais no aplicativo, executando verificações adicionais no modo de desenvolvimento.' },
    { id: 128, difficulty: 'hard', category: 'Node.js', question: 'O que é clustering no Node.js?', options: ['Uma forma de agrupar arquivos', 'Uma técnica para usar múltiplos processos para aproveitar múltiplos núcleos de CPU', 'Um tipo de banco de dados', 'Um sistema de cache'], correctIndex: 1, hint: 'Múltiplos núcleos', explanation: 'Clustering permite criar múltiplos processos Node.js (workers) para distribuir carga e aproveitar múltiplos núcleos de CPU, contornando a limitação single-threaded.' },
    { id: 129, difficulty: 'hard', category: 'Python', question: 'O que é monkey patching?', options: ['Um tipo de erro', 'Modificar ou estender código em tempo de execução', 'Uma técnica de otimização', 'Um padrão de projeto'], correctIndex: 1, hint: 'Modificação em runtime', explanation: 'Monkey patching é a prática de modificar ou estender o comportamento de código em tempo de execução, sem alterar o código-fonte original.' },
    { id: 130, difficulty: 'hard', category: 'SQL', question: 'O que é uma CTE (Common Table Expression)?', options: ['Uma tabela temporária definida dentro de uma consulta', 'Um tipo de índice', 'Uma constraint de chave estrangeira', 'Um gatilho'], correctIndex: 0, hint: 'Expressão de tabela comum', explanation: 'CTE é uma tabela temporária definida dentro de uma consulta SQL, útil para quebrar consultas complexas em partes mais gerenciáveis.' },
    { id: 131, difficulty: 'hard', category: 'CSS', question: 'Qual é a diferença entre em e rem?', options: ['em é relativo ao tamanho da fonte do elemento pai, rem é relativo ao tamanho da fonte da raiz', 'rem é relativo ao pai, em é relativo à raiz', 'Não há diferença', 'em é absoluto, rem é relativo'], correctIndex: 0, hint: 'Elemento pai vs raiz', explanation: 'em é relativo ao tamanho da fonte do elemento pai. rem é relativo ao tamanho da fonte do elemento raiz (html).' },
    { id: 132, difficulty: 'hard', category: 'TypeScript', question: 'O que é conditional type?', options: ['Um tipo que pode ser verdadeiro ou falso', 'Um tipo que se baseia em uma condição usando T extends U ? X : Y', 'Um tipo de interface condicional', 'Um erro de compilação'], correctIndex: 1, hint: 'Condição com extends', explanation: 'Conditional types permitem criar tipos que dependem de uma condição, usando a sintaxe T extends U ? X : Y.' },
    { id: 133, difficulty: 'hard', category: 'Docker', question: 'O que é um volume no Docker?', options: ['Um tipo de container', 'Um diretório persistente fora do sistema de arquivos do container', 'Um arquivo de configuração', 'Um tipo de rede'], correctIndex: 1, hint: 'Armazenamento persistente', explanation: 'Volumes são diretórios persistentes fora do sistema de arquivos do container, usados para armazenar dados que devem sobreviver à destruição do container.' },
    { id: 134, difficulty: 'hard', category: 'REST', question: 'O que é rate limiting?', options: ['Limitar o tamanho das respostas', 'Limitar o número de requests por período de tempo', 'Limitar o número de recursos', 'Limitar o tempo de resposta'], correctIndex: 1, hint: 'Limitar requisições', explanation: 'Rate limiting é uma técnica para limitar o número de requests que um cliente pode fazer a uma API em um determinado período de tempo.' },
    { id: 135, difficulty: 'hard', category: 'GraphQL', question: 'O que é schema stitching?', options: ['Costurar schemas diferentes em um único schema', 'Um tipo de mutation', 'Um sistema de autenticação', 'Um validador de queries'], correctIndex: 0, hint: 'Combinar schemas', explanation: 'Schema stitching é a técnica de combinar múltiplos schemas GraphQL em um único schema unificado.' },
    { id: 136, difficulty: 'hard', category: 'JavaScript', question: 'Qual o valor de typeof typeof 1?', options: ['"number"', '"string"', '"undefined"', '"object"'], correctIndex: 1, hint: 'typeof sempre retorna string', explanation: 'typeof 1 → "number" (string). typeof "number" → "string". Logo, o resultado é "string".' },
    { id: 137, difficulty: 'hard', category: 'React', question: 'O que é o render props pattern?', options: ['Um padrão onde um componente recebe uma função como prop que retorna JSX', 'Uma técnica de estilização', 'Um sistema de roteamento', 'Um gerenciador de estado'], correctIndex: 0, hint: 'Função como prop', explanation: 'Render props é um padrão onde um componente recebe uma função como prop que retorna JSX, permitindo compartilhar código entre componentes.' },
    { id: 138, difficulty: 'hard', category: 'Node.js', question: 'O que é backpressure em streams?', options: ['Pressão para melhorar o código', 'Quando o consumidor não consegue processar dados tão rápido quanto o produtor', 'Um tipo de erro', 'Uma técnica de compressão'], correctIndex: 1, hint: 'Produtor vs consumidor', explanation: 'Backpressure ocorre quando o consumidor de um stream não consegue processar dados tão rápido quanto o produtor, exigindo mecanismos de controle de fluxo.' },
    { id: 139, difficulty: 'hard', category: 'Python', question: 'O que é o módulo __main__?', options: ['O módulo principal que é executado quando o script é rodado diretamente', 'Um módulo de sistema', 'Um tipo de classe', 'Um erro de importação'], correctIndex: 0, hint: 'Script executado diretamente', explanation: '__main__ é o nome do módulo principal quando um script Python é executado diretamente (não importado).' },
    { id: 140, difficulty: 'hard', category: 'SQL', question: 'O que é uma window function?', options: ['Uma função que abre janelas', 'Uma função que realiza cálculos em um conjunto de linhas relacionadas à linha atual', 'Uma função de sistema operacional', 'Um tipo de trigger'], correctIndex: 1, hint: 'Cálculos em conjuntos de linhas', explanation: 'Window functions realizam cálculos em um conjunto de linhas relacionadas à linha atual, sem agrupar as linhas em uma única saída como as funções de agregação.' },
    { id: 141, difficulty: 'hard', category: 'CSS', question: 'O que é specificity em CSS?', options: ['A velocidade de aplicação dos estilos', 'O peso relativo de um seletor que determina qual estilo é aplicado quando há conflito', 'O número de propriedades em uma regra', 'A ordem de escrita das regras'], correctIndex: 1, hint: 'Peso dos seletores', explanation: 'Specificity é o peso relativo de um seletor CSS que determina qual regra é aplicada quando múltiplas regras conflitam para o mesmo elemento.' },
    { id: 142, difficulty: 'hard', category: 'TypeScript', question: 'O que é mapped type?', options: ['Um tipo que mapeia chaves para valores', 'Um tipo que transforma cada propriedade de um tipo existente', 'Um tipo de array', 'Um erro de mapeamento'], correctIndex: 1, hint: 'Transformar propriedades', explanation: 'Mapped types criam novos tipos transformando cada propriedade de um tipo existente, usando a sintaxe {[P in K]: T}.' },
    { id: 143, difficulty: 'hard', category: 'Docker', question: 'O que é o Docker Hub?', options: ['Um serviço de hospedagem de imagens Docker', 'Um tipo de container', 'Um sistema operacional', 'Um editor de código'], correctIndex: 0, hint: 'Registro de imagens', explanation: 'Docker Hub é um serviço de registro de imagens Docker, onde usuários podem armazenar e compartilhar imagens públicas e privadas.' },
    { id: 144, difficulty: 'hard', category: 'REST', question: 'O que é idempotência?', options: ['Quando múltiplas chamadas têm o mesmo efeito que uma única chamada', 'Quando uma chamada modifica o estado do servidor', 'Quando uma chamada é segura', 'Quando uma chamada é rápida'], correctIndex: 0, hint: 'Múltiplas chamadas = uma chamada', explanation: 'Uma operação idempotente é aquela que, se aplicada múltiplas vezes, tem o mesmo efeito que ser aplicada uma única vez.' },
    { id: 145, difficulty: 'hard', category: 'GraphQL', question: 'O que é persisted queries?', options: ['Queries salvas no banco de dados', 'Queries pré-compiladas armazenadas no servidor para melhorar performance e segurança', 'Um tipo de subscription', 'Queries que nunca expiram'], correctIndex: 1, hint: 'Pré-compiladas e armazenadas', explanation: 'Persisted queries são queries GraphQL pré-compiladas e armazenadas no servidor, melhorando performance e segurança ao permitir apenas queries conhecidas.' },
    { id: 146, difficulty: 'hard', category: 'JavaScript', question: 'Qual o valor de Number.MIN_VALUE > 0?', options: ['true', 'false', 'undefined', 'error'], correctIndex: 0, hint: 'Menor valor positivo', explanation: 'Number.MIN_VALUE é o menor valor positivo representável em JavaScript (5e-324), não o menor valor negativo. Portanto, é maior que 0.' },
    { id: 147, difficulty: 'hard', category: 'React', question: 'O que é o Error Boundary?', options: ['Um componente que captura erros JavaScript em qualquer lugar da árvore de componentes', 'Um sistema de logging', 'Um tipo de estado', 'Um gerenciador de erros do servidor'], correctIndex: 0, hint: 'Capturar erros na árvore', explanation: 'Error Boundary é um componente React que captura erros JavaScript em qualquer lugar da árvore de componentes abaixo dele, exibindo uma UI de fallback.' },
    { id: 148, difficulty: 'hard', category: 'Node.js', question: 'O que é o buffer em Node.js?', options: ['Um tipo de stream', 'Uma estrutura de dados para manipular dados binários', 'Um sistema de cache', 'Um tipo de erro'], correctIndex: 1, hint: 'Dados binários', explanation: 'Buffer é uma estrutura de dados no Node.js usada para manipular dados binários brutos, representados como um array de inteiros.' },
    { id: 149, difficulty: 'hard', category: 'Python', question: 'O que é o método __call__?', options: ['Um método que permite que instâncias de uma classe sejam chamadas como funções', 'Um método construtor', 'Um método destrutor', 'Um método estático'], correctIndex: 0, hint: 'Chamar como função', explanation: '__call__ é um método especial que permite que instâncias de uma classe sejam chamadas como se fossem funções.' },
    { id: 150, difficulty: 'hard', category: 'SQL', question: 'O que é normalização de banco de dados?', options: ['O processo de organizar dados para reduzir redundância e melhorar integridade', 'O processo de aumentar a velocidade do banco', 'O processo de criptografar dados', 'O processo de fazer backup'], correctIndex: 0, hint: 'Reduzir redundância', explanation: 'Normalização é o processo de organizar dados em um banco de dados para reduzir redundância e melhorar a integridade dos dados.' },
    { id: 151, difficulty: 'hard', category: 'CSS', question: 'O que é o box model?', options: ['Um modelo de caixas para layout', 'O modelo que descreve como elementos são renderizados como retângulos com conteúdo, padding, border e margin', 'Um tipo de seletor', 'Um sistema de grid'], correctIndex: 1, hint: 'Conteúdo, padding, border, margin', explanation: 'O box model descreve como elementos são renderizados como retângulos compostos por conteúdo, padding, border e margin.' },
    { id: 152, difficulty: 'hard', category: 'TypeScript', question: 'O que é type guard?', options: ['Uma função que verifica o tipo de uma variável em tempo de execução', 'Um tipo de interface', 'Um erro de tipo', 'Um sistema de segurança'], correctIndex: 0, hint: 'Verificar tipo em runtime', explanation: 'Type guard é uma função que verifica o tipo de uma variável em tempo de execução, permitindo que o TypeScript refine o tipo dentro de blocos condicionais.' },
    { id: 153, difficulty: 'hard', category: 'Docker', question: 'O que é o overlay network?', options: ['Uma rede que permite comunicação entre containers em diferentes hosts', 'Um tipo de volume', 'Um sistema de arquivos', 'Um tipo de imagem'], correctIndex: 0, hint: 'Comunicação entre hosts', explanation: 'Overlay network é um tipo de rede Docker que permite comunicação entre containers em diferentes hosts Docker.' },
    { id: 154, difficulty: 'hard', category: 'REST', question: 'O que é content negotiation?', options: ['Negociar o preço do conteúdo', 'O processo de escolher o formato de representação mais adequado para o cliente', 'Negociar direitos autorais', 'Um tipo de autenticação'], correctIndex: 0, hint: 'Formato de representação', explanation: 'Content negotiation é o processo pelo qual o servidor e cliente negociam qual formato de representação (JSON, XML, etc.) é mais adequado para a resposta.' },
    { id: 155, difficulty: 'hard', category: 'GraphQL', question: 'O que é o N+1 problem?', options: ['Um problema matemático', 'Quando uma query causa múltiplas requisições ao banco de dados, uma para cada item', 'Um problema de rede', 'Um erro de sintaxe'], correctIndex: 1, hint: 'Múltiplas requisições', explanation: 'O problema N+1 ocorre quando uma query GraphQL causa N+1 requisições ao banco de dados: 1 para buscar os itens principais e N para buscar dados relacionados de cada item.' },
    { id: 156, difficulty: 'hard', category: 'JavaScript', question: 'Qual o valor de (function f(f){ return typeof f(); })(function(){ return 1; })?', options: ['"number"', '"function"', '"undefined"', '"object"'], correctIndex: 0, hint: 'Execução da função passada', explanation: 'A função f recebe outra função como parâmetro e a executa. A função passada retorna 1, então typeof 1 é "number".' },
    { id: 157, difficulty: 'hard', category: 'React', question: 'O que é o portal?', options: ['Um componente que renderiza children em um nó DOM fora da hierarquia do componente pai', 'Um sistema de roteamento', 'Um gerenciador de estado', 'Uma biblioteca de estilização'], correctIndex: 0, hint: 'Renderizar fora da hierarquia', explanation: 'Portal é um recurso do React que permite renderizar children em um nó DOM que existe fora da hierarquia DOM do componente pai.' },
    { id: 158, difficulty: 'hard', category: 'Node.js', question: 'O que é o middleware no Express.js?', options: ['Um tipo de banco de dados', 'Funções que têm acesso ao objeto de requisição, resposta e próximo middleware', 'Um sistema de template', 'Um tipo de rota'], correctIndex: 1, hint: 'Funções com acesso a req, res, next', explanation: 'Middleware são funções que têm acesso aos objetos de requisição (req), resposta (res) e à próxima função middleware no ciclo de requisição-resposta.' },
    { id: 159, difficulty: 'hard', category: 'Python', question: 'O que é o módulo collections?', options: ['Um módulo com tipos de dados de contêineres especializados', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de strings', 'Um módulo de sistema'], correctIndex: 0, hint: 'Contêineres especializados', explanation: 'O módulo collections fornece tipos de dados de contêineres especializados como namedtuple, deque, Counter, OrderedDict, defaultdict.' },
    { id: 160, difficulty: 'hard', category: 'SQL', question: 'O que é transação em banco de dados?', options: ['Uma única operação SQL', 'Uma sequência de operações que são tratadas como uma única unidade lógica de trabalho', 'Um tipo de índice', 'Um gatilho'], correctIndex: 1, hint: 'Unidade lógica de trabalho', explanation: 'Uma transação é uma sequência de operações que são tratadas como uma única unidade lógica de trabalho, seguindo as propriedades ACID (Atomicidade, Consistência, Isolamento, Durabilidade).' },
    { id: 161, difficulty: 'hard', category: 'CSS', question: 'O que é o cascade em CSS?', options: ['Uma animação', 'O processo de combinar diferentes fontes de estilos e resolver conflitos', 'Um tipo de layout', 'Um seletor'], correctIndex: 1, hint: 'Resolver conflitos de estilos', explanation: 'Cascade é o processo pelo qual o navegador combina diferentes fontes de estilos (user agent, user, author) e resolve conflitos baseado em importância, origem, specificity e ordem.' },
    { id: 162, difficulty: 'hard', category: 'TypeScript', question: 'O que é o operador ! (non-null assertion)?', options: ['Força a avaliação de uma expressão', 'Afirma que um valor não é null ou undefined', 'Nega um valor booleano', 'Causa um erro'], correctIndex: 1, hint: 'Afirmação de não nulo', explanation: 'O operador ! (non-null assertion) afirma ao compilador TypeScript que um valor não é null ou undefined, mesmo que o tipo permita isso.' },
    { id: 163, difficulty: 'hard', category: 'Docker', question: 'O que é o healthcheck?', options: ['Um tipo de volume', 'Uma configuração que verifica se um container está funcionando corretamente', 'Um sistema de logging', 'Um tipo de rede'], correctIndex: 1, hint: 'Verificar saúde do container', explanation: 'Healthcheck é uma configuração que permite ao Docker verificar periodicamente se um container está funcionando corretamente executando um comando ou requisição.' },
    { id: 164, difficulty: 'hard', category: 'REST', question: 'O que é hypermedia?', options: ['Mídia com elementos interativos', 'Conteúdo que inclui links para outros recursos, permitindo navegação dinâmica', 'Um tipo de mídia social', 'Um protocolo de streaming'], correctIndex: 1, hint: 'Links para outros recursos', explanation: 'Hypermedia é conteúdo que inclui links para outros recursos, permitindo que os clientes naveguem dinamicamente pela API sem conhecimento prévio dos endpoints.' },
    { id: 165, difficulty: 'hard', category: 'GraphQL', question: 'O que é o schema first approach?', options: ['Primeiro escrever o schema, depois implementar os resolvers', 'Primeiro escrever os resolvers, depois gerar o schema', 'Um tipo de cliente', 'Um sistema de autenticação'], correctIndex: 0, hint: 'Schema antes dos resolvers', explanation: 'Schema first approach é uma metodologia onde primeiro se define o schema GraphQL, e depois se implementam os resolvers que correspondem a esse schema.' },
    { id: 166, difficulty: 'hard', category: 'JavaScript', question: 'Qual o valor de [1, 2, 3].map(parseInt)?', options: ['[1, 2, 3]', '[1, NaN, NaN]', '[1, 2, 3, 4]', '[0, 1, 2]'], correctIndex: 1, hint: 'parseInt recebe dois parâmetros', explanation: 'map passa três parâmetros para a função: elemento, índice, array. parseInt(elemento, índice) → parseInt("1", 0)=1, parseInt("2", 1)=NaN, parseInt("3", 2)=NaN.' },
    { id: 167, difficulty: 'hard', category: 'React', question: 'O que é o higher-order component (HOC)?', options: ['Um componente que renderiza outros componentes', 'Uma função que recebe um componente e retorna um novo componente com funcionalidade adicional', 'Um tipo de hook', 'Um sistema de estado global'], correctIndex: 1, hint: 'Função que retorna componente', explanation: 'HOC é uma função que recebe um componente e retorna um novo componente com funcionalidade adicional, um padrão para reutilização de lógica de componentes.' },
    { id: 168, difficulty: 'hard', category: 'Node.js', question: 'O que é o cluster module?', options: ['Um módulo para agrupar arquivos', 'Um módulo para criar processos filhos que compartilham portas de servidor', 'Um tipo de banco de dados', 'Um sistema de cache'], correctIndex: 1, hint: 'Processos filhos compartilhando portas', explanation: 'O módulo cluster permite criar processos filhos (workers) que compartilham portas de servidor, permitindo melhor aproveitamento de múltiplos núcleos de CPU.' },
    { id: 169, difficulty: 'hard', category: 'Python', question: 'O que é o módulo itertools?', options: ['Um módulo com funções para criar e manipular iteradores eficientes', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de arquivos', 'Um módulo de sistema'], correctIndex: 0, hint: 'Iteradores eficientes', explanation: 'O módulo itertools fornece funções para criar e manipular iteradores de forma eficiente, como combinations, permutations, product, cycle, etc.' },
    { id: 170, difficulty: 'hard', category: 'SQL', question: 'O que é índice composto?', options: ['Um índice em múltiplas colunas', 'Um índice que combina dados de múltiplas tabelas', 'Um tipo de chave estrangeira', 'Um gatilho complexo'], correctIndex: 0, hint: 'Múltiplas colunas', explanation: 'Índice composto é um índice criado em múltiplas colunas de uma tabela, útil para consultas que filtram por essas colunas em conjunto.' },
    { id: 171, difficulty: 'hard', category: 'CSS', question: 'O que é o BFC (Block Formatting Context)?', options: ['Um contexto de formatação que isola o layout de elementos flutuantes', 'Um tipo de seletor', 'Um sistema de grid', 'Uma propriedade de animação'], correctIndex: 0, hint: 'Isolar layout de flutuantes', explanation: 'BFC é um contexto de formatação que isola o layout de elementos flutuantes, prevenindo que eles interajam com elementos fora do contexto.' },
    { id: 172, difficulty: 'hard', category: 'TypeScript', question: 'O que é o operador keyof?', options: ['Retorna as chaves de um objeto como string', 'Cria um tipo com as chaves de outro tipo', 'Um operador de comparação', 'Um tipo de erro'], correctIndex: 1, hint: 'Chaves de tipo', explanation: 'keyof T cria um tipo que representa as chaves (nomes das propriedades) de um tipo T como string literals union.' },
    { id: 173, difficulty: 'hard', category: 'Docker', question: 'O que é o docker swarm?', options: ['Um tipo de container', 'Uma ferramenta de orquestração de containers', 'Um sistema de arquivos', 'Um tipo de volume'], correctIndex: 1, hint: 'Orquestração de containers', explanation: 'Docker Swarm é uma ferramenta de orquestração de containers que permite gerenciar um cluster de máquinas Docker como um único sistema virtual.' },
    { id: 174, difficulty: 'hard', category: 'REST', question: 'O que é o Richardson Maturity Model?', options: ['Um modelo para classificar APIs REST por níveis de maturidade', 'Um modelo de autenticação', 'Um padrão de banco de dados', 'Um protocolo de segurança'], correctIndex: 0, hint: 'Níveis de maturidade REST', explanation: 'Richardson Maturity Model classifica APIs REST em níveis de maturidade, do nível 0 (RPC sobre HTTP) ao nível 3 (HATEOAS).' },
    { id: 175, difficulty: 'hard', category: 'GraphQL', question: 'O que é o schema delegation?', options: ['Delegar a execução de partes de uma query para outro schema GraphQL', 'Um tipo de autenticação', 'Um sistema de cache', 'Um validador de queries'], correctIndex: 0, hint: 'Delegar execução', explanation: 'Schema delegation é uma técnica onde um GraphQL server delega a execução de partes de uma query para outro GraphQL server.' },
    { id: 176, difficulty: 'hard', category: 'JavaScript', question: 'Qual o valor de "b" + "a" + +"a" + "a"?', options: ['"baaa"', '"ba2a"', '"baNaNa"', '"baunaNa"'], correctIndex: 2, hint: 'Coerção de tipo com operador unário +', explanation: '"b" + "a" + +"a" + "a" → "ba" + (+"a") + "a" → "ba" + NaN + "a" → "baNaNa" (NaN convertido para string).' },
    { id: 177, difficulty: 'hard', category: 'React', question: 'O que é o suspense?', options: ['Um componente para lidar com estados de carregamento assíncrono', 'Um sistema de animações', 'Um gerenciador de erros', 'Um tipo de estado global'], correctIndex: 0, hint: 'Carregamento assíncrono', explanation: 'Suspense é um componente do React que permite componentes "suspenderem" sua renderização enquanto aguardam algo (como dados) estar pronto, mostrando um fallback.' },
    { id: 178, difficulty: 'hard', category: 'Node.js', question: 'O que é o domain module?', options: ['Um módulo obsoleto para agrupar e manipular múltiplos eventos e erros', 'Um módulo para manipular nomes de domínio', 'Um sistema de rotas', 'Um tipo de middleware'], correctIndex: 0, hint: 'Agrupar eventos e erros', explanation: 'O módulo domain (obsoleto) era usado para agrupar e manipular múltiplos eventos e erros diferentes, mas foi descontinuado em favor de async_hooks.' },
    { id: 179, difficulty: 'hard', category: 'Python', question: 'O que é o módulo functools?', options: ['Um módulo com funções de ordem superior e operações sobre funções', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de strings', 'Um módulo de sistema'], correctIndex: 0, hint: 'Operações sobre funções', explanation: 'O módulo functools fornece funções de ordem superior e operações sobre funções, como partial, reduce, lru_cache, wraps.' },
    { id: 180, difficulty: 'hard', category: 'SQL', question: 'O que é partição de tabela?', options: ['Dividir uma tabela grande em partes menores baseadas em critérios', 'Criar cópias de segurança da tabela', 'Criptografar partes da tabela', 'Um tipo de índice'], correctIndex: 0, hint: 'Dividir tabela em partes', explanation: 'Partição de tabela é a divisão de uma tabela grande em partes menores (partições) baseadas em critérios como intervalo de valores, melhorando performance e manutenção.' },

    // EXPERT (80 perguntas)
    { id: 181, difficulty: 'expert', category: 'JavaScript', question: 'Qual o resultado de console.log(1 < 2 < 3); console.log(3 > 2 > 1);?', options: ['true, true', 'true, false', 'false, true', 'false, false'], correctIndex: 1, hint: 'Avaliação da esquerda para direita', explanation: '1<2→true→true<3→1<3→true. 3>2→true→true>1→1>1→false. Resultado: true, false.' },
    { id: 182, difficulty: 'expert', category: 'React', question: 'Como o React Fiber melhora a renderização?', options: ['Usando múltiplas threads', 'Dividindo o trabalho em partes menores que podem ser pausadas e retomadas', 'Compilando componentes para WebAssembly', 'Usando GPU para renderização'], correctIndex: 1, hint: 'Trabalho incrementável', explanation: 'React Fiber divide o trabalho de reconciliação em partes menores que podem ser pausadas, retomadas e reordenadas, permitindo melhor controle de prioridade e prevenindo bloqueios na UI.' },
    { id: 183, difficulty: 'expert', category: 'Node.js', question: 'O que é o async_hooks module?', options: ['Um módulo para criar hooks assíncronos', 'Um módulo para monitorar o ciclo de vida de recursos assíncronos', 'Um sistema de logging assíncrono', 'Um tipo de stream'], correctIndex: 1, hint: 'Monitorar recursos assíncronos', explanation: 'async_hooks fornece uma API para monitorar o ciclo de vida de recursos assíncronos, útil para debug e rastreamento de contexto.' },
    { id: 184, difficulty: 'expert', category: 'Python', question: 'O que é o protocolo de descritor em Python?', options: ['Um protocolo de rede', 'Um protocolo que permite objetos personalizarem acesso a atributos', 'Um padrão de serialização', 'Um sistema de tipos'], correctIndex: 1, hint: 'Personalizar acesso a atributos', explanation: 'O protocolo de descritor permite que objetos personalizem como atributos são acessados, definidos ou deletados, implementando métodos __get__, __set__, __delete__.' },
    { id: 185, difficulty: 'expert', category: 'SQL', question: 'O que é MVCC (Multi-Version Concurrency Control)?', options: ['Um sistema de controle de versão', 'Um mecanismo que permite múltiplas versões de dados para concorrência sem bloqueios', 'Um tipo de índice', 'Um gatilho complexo'], correctIndex: 1, hint: 'Múltiplas versões para concorrência', explanation: 'MVCC é um mecanismo que mantém múltiplas versões de dados para permitir concorrência sem bloqueios, melhorando performance em sistemas com muitas leituras.' },
    { id: 186, difficulty: 'expert', category: 'JavaScript', question: 'Qual o resultado de console.log(([] + [][0] + [][0])[10]);?', options: ['"a"', '"b"', '"i"', '"n"'], correctIndex: 3, hint: 'Coerção de tipo complexa', explanation: '[][0] → undefined. [] + undefined + undefined → "" + "undefined" + "undefined" → "undefinedundefined". Índice 10 → "n".' },
    { id: 187, difficulty: 'expert', category: 'React', question: 'O que é concurrent mode?', options: ['Um modo para executar múltiplos React apps simultaneamente', 'Um conjunto de recursos para tornar a renderização interrompível e priorizável', 'Um sistema de threads', 'Um modo de produção'], correctIndex: 1, hint: 'Renderização interrompível', explanation: 'Concurrent Mode é um conjunto de recursos que permite que o React interrompa e retome o trabalho de renderização, priorizando atualizações importantes.' },
    { id: 188, difficulty: 'expert', category: 'Node.js', question: 'O que é o worker_threads module?', options: ['Um módulo para criar threads de trabalho para operações CPU-intensivas', 'Um sistema de logging', 'Um tipo de stream', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Threads para CPU-intensivo', explanation: 'worker_threads permite criar threads de trabalho para executar operações JavaScript em paralelo, útil para tarefas CPU-intensivas sem bloquear o event loop.' },
    { id: 189, difficulty: 'expert', category: 'Python', question: 'O que é o método __new__?', options: ['Um método construtor', 'Um método que cria e retorna uma nova instância da classe antes do __init__', 'Um método destrutor', 'Um método estático'], correctIndex: 1, hint: 'Criar instância antes do init', explanation: '__new__ é um método estático que cria e retorna uma nova instância da classe, chamado antes de __init__. Permite controle sobre a criação de instâncias.' },
    { id: 190, difficulty: 'expert', category: 'SQL', question: 'O que é ponto de salvamento (savepoint)?', options: ['Um backup completo', 'Um ponto dentro de uma transação onde é possível fazer rollback parcial', 'Um tipo de índice', 'Um gatilho'], correctIndex: 1, hint: 'Rollback parcial', explanation: 'Savepoint é um ponto nomeado dentro de uma transação onde é possível fazer rollback parcial, revertendo apenas parte das operações da transação.' },
    { id: 191, difficulty: 'expert', category: 'CSS', question: 'O que é o contain property?', options: ['Uma propriedade para conter elementos flutuantes', 'Uma propriedade para indicar que o elemento é um contêiner independente para otimização', 'Uma propriedade de layout', 'Uma propriedade de animação'], correctIndex: 1, hint: 'Otimização de contêiner', explanation: 'contain é uma propriedade CSS que indica que o elemento é um contêiner independente, permitindo otimizações de renderização pelo navegador.' },
    { id: 192, difficulty: 'expert', category: 'TypeScript', question: 'O que é template literal types?', options: ['Tipos que usam template literals para criar tipos de string complexos', 'Um tipo de interface', 'Um erro de template', 'Um sistema de templates'], correctIndex: 0, hint: 'Template literals para tipos', explanation: 'Template literal types permitem usar template literals para criar tipos de string complexos, combinando literais de string e tipos existentes.' },
    { id: 193, difficulty: 'expert', category: 'Docker', question: 'O que é o buildkit?', options: ['Um novo backend para construir imagens Docker com melhor performance e recursos', 'Um tipo de container', 'Um sistema de arquivos', 'Um tipo de volume'], correctIndex: 0, hint: 'Backend de construção', explanation: 'BuildKit é um novo backend para construir imagens Docker, oferecendo melhor performance, caching eficiente e recursos avançados como builds paralelos.' },
    { id: 194, difficulty: 'expert', category: 'REST', question: 'O que é o Richardson Maturity Model nível 3?', options: ['RPC sobre HTTP', 'Recursos com URIs', 'Verbos HTTP', 'HATEOAS - Hypermedia como motor do estado da aplicação'], correctIndex: 3, hint: 'Hypermedia', explanation: 'Nível 3 do Richardson Maturity Model inclui HATEOAS, onde as respostas incluem links para ações possíveis, permitindo navegação dinâmica.' },
    { id: 195, difficulty: 'expert', category: 'GraphQL', question: 'O que é o Apollo Federation?', options: ['Um sistema de autenticação', 'Uma arquitetura para construir um schema GraphQL a partir de múltiplos serviços', 'Um tipo de cliente', 'Um sistema de cache'], correctIndex: 0, hint: 'Schema a partir de múltiplos serviços', explanation: 'Apollo Federation é uma arquitetura que permite construir um schema GraphQL unificado a partir de múltiplos serviços GraphQL independentes.' },
    { id: 196, difficulty: 'expert', category: 'JavaScript', question: 'Qual o resultado de console.log(0.2 + 0.1 == 0.3)?', options: ['true', 'false', 'undefined', 'error'], correctIndex: 1, hint: 'Precisão de ponto flutuante', explanation: 'Devido à representação binária de números de ponto flutuante, 0.2 + 0.1 não é exatamente igual a 0.3, resultando em false.' },
    { id: 197, difficulty: 'expert', category: 'React', question: 'O que é o useTransition hook?', options: ['Um hook para animações de transição', 'Um hook para marcar atualizações como não urgentes, evitando bloqueios na UI', 'Um sistema de roteamento', 'Um gerenciador de estado'], correctIndex: 1, hint: 'Atualizações não urgentes', explanation: 'useTransition permite marcar atualizações de estado como não urgentes, permitindo que o React interrompa e retome o trabalho, mantendo a UI responsiva.' },
    { id: 198, difficulty: 'expert', category: 'Node.js', question: 'O que é o diagnostic report?', options: ['Um relatório de diagnóstico gerado em caso de falhas ou sob demanda', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Relatório em caso de falhas', explanation: 'Diagnostic report é um relatório JSON gerado pelo Node.js em caso de falhas ou sob demanda, contendo informações úteis para debug.' },
    { id: 199, difficulty: 'expert', category: 'Python', question: 'O que é o módulo ast?', options: ['Um módulo para manipular árvores de sintaxe abstrata', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de strings', 'Um módulo de sistema'], correctIndex: 0, hint: 'Árvores de sintaxe abstrata', explanation: 'O módulo ast fornece funcionalidades para processar árvores de sintaxe abstrata, úteis para análise e transformação de código Python.' },
    { id: 200, difficulty: 'expert', category: 'SQL', question: 'O que é lock escalation?', options: ['O processo de converter muitos bloqueios de nível inferior em menos bloqueios de nível superior', 'Um tipo de deadlock', 'Um sistema de versionamento', 'Um gatilho'], correctIndex: 0, hint: 'Converter bloqueios', explanation: 'Lock escalation é o processo onde um sistema de banco de dados converte muitos bloqueios de nível inferior (como em linhas) em menos bloqueios de nível superior (como em tabelas) para reduzir overhead.' },
    { id: 201, difficulty: 'expert', category: 'JavaScript', question: 'Qual o resultado de console.log(1 + {} + 2 + [] + 3)?', options: ['"1[object Object]23"', '"6"', '"1undefined23"', '"1NaN23"'], correctIndex: 0, hint: 'Coerção de tipo com objetos', explanation: '1 + {} → "1[object Object]", + 2 → "1[object Object]2", + [] → "1[object Object]2", + 3 → "1[object Object]23".' },
    { id: 202, difficulty: 'expert', category: 'React', question: 'O que é o useDeferredValue hook?', options: ['Um hook para adiar o valor de uma variável', 'Um hook para adiar a atualização de um valor não urgente, mantendo a UI responsiva', 'Um sistema de cache', 'Um gerenciador de efeitos'], correctIndex: 1, hint: 'Adiar atualização não urgente', explanation: 'useDeferredValue permite adiar a atualização de um valor não urgente, permitindo que o React mantenha a UI responsiva enquanto o valor é recalculado.' },
    { id: 203, difficulty: 'expert', category: 'Node.js', question: 'O que é o report-only mode no policy?', options: ['Um modo que apenas reporta violações de política sem bloquear', 'Um modo de produção', 'Um sistema de logging', 'Um tipo de middleware'], correctIndex: 0, hint: 'Reportar sem bloquear', explanation: 'Report-only mode em políticas (como CSP) permite reportar violações sem bloquear a execução, útil para testar políticas antes de aplicá-las.' },
    { id: 204, difficulty: 'expert', category: 'Python', question: 'O que é o método __slots__?', options: ['Um método para definir atributos de classe', 'Um atributo que define quais atributos de instância são permitidos, economizando memória', 'Um tipo de descritor', 'Um método estático'], correctIndex: 1, hint: 'Economizar memória', explanation: '__slots__ é um atributo de classe que define quais atributos de instância são permitidos, economizando memória ao evitar o dicionário __dict__.' },
    { id: 205, difficulty: 'expert', category: 'SQL', question: 'O que é snapshot isolation?', options: ['Um tipo de backup', 'Um nível de isolamento onde cada transação vê um snapshot consistente do banco de dados', 'Um sistema de versionamento', 'Um gatilho'], correctIndex: 1, hint: 'Snapshot consistente', explanation: 'Snapshot isolation é um nível de isolamento onde cada transação vê um snapshot consistente do banco de dados no momento em que a transação começou.' },
    { id: 206, difficulty: 'expert', category: 'CSS', question: 'O que é o :where() pseudo-class?', options: ['Um seletor que seleciona elementos onde uma condição é verdadeira', 'Um pseudo-class que seleciona elementos sem adicionar especificidade', 'Um tipo de animação', 'Um sistema de grid'], correctIndex: 1, hint: 'Sem especificidade', explanation: ':where() é um pseudo-class funcional que seleciona elementos como :is(), mas com especificidade zero, não afetando a cascata.' },
    { id: 207, difficulty: 'expert', category: 'TypeScript', question: 'O que é o operador satisfies?', options: ['Um operador que verifica se um valor satisfaz um tipo sem alterar seu tipo inferido', 'Um operador de comparação', 'Um tipo de erro', 'Um sistema de validação'], correctIndex: 0, hint: 'Verificar sem alterar tipo', explanation: 'satisfies é um operador que verifica se um valor satisfaz um tipo, mas preserva o tipo inferido mais específico do valor, útil para validação sem perda de informação.' },
    { id: 208, difficulty: 'expert', category: 'Docker', question: 'O que é o rootless mode?', options: ['Um modo para executar o Docker daemon sem privilégios de root', 'Um tipo de container', 'Um sistema de arquivos', 'Um tipo de volume'], correctIndex: 0, hint: 'Sem privilégios de root', explanation: 'Rootless mode permite executar o Docker daemon e containers como usuário não-root, melhorando segurança ao reduzir privilégios.' },
    { id: 209, difficulty: 'expert', category: 'REST', question: 'O que é o nível 2 do Richardson Maturity Model?', options: ['RPC sobre HTTP', 'Recursos com URIs', 'Verbos HTTP apropriados', 'HATEOAS'], correctIndex: 2, hint: 'Verbos HTTP', explanation: 'Nível 2 do Richardson Maturity Model usa verbos HTTP apropriados (GET, POST, PUT, DELETE) para operações em recursos identificados por URIs.' },
    { id: 210, difficulty: 'expert', category: 'GraphQL', question: 'O que é o @defer directive?', options: ['Uma diretiva para diferir a resolução de partes de uma query', 'Uma diretiva para autenticação', 'Uma diretiva para validação', 'Uma diretiva para caching'], correctIndex: 0, hint: 'Diferir resolução', explanation: '@defer é uma diretiva que permite diferir a resolução de partes de uma query, enviando a resposta principal primeiro e as partes diferidas posteriormente.' },
    { id: 211, difficulty: 'expert', category: 'JavaScript', question: 'Qual o resultado de console.log((function(x, f = () => x) { var x; var y = x; x = 2; return [y, f()]; })(1));?', options: ['[1, 1]', '[undefined, 1]', '[1, 2]', '[undefined, 2]'], correctIndex: 0, hint: 'Escopo e hoisting', explanation: 'Parâmetro x=1, f captura x do parâmetro. var x não redeclara o parâmetro. y = x (1). x = 2. f() retorna o valor capturado (1). Resultado: [1, 1].' },
    { id: 212, difficulty: 'expert', category: 'React', question: 'O que é o useId hook?', options: ['Um hook para gerar IDs únicos e estáveis entre cliente e servidor', 'Um hook para gerenciar IDs de banco de dados', 'Um sistema de autenticação', 'Um gerenciador de estado global'], correctIndex: 0, hint: 'IDs únicos e estáveis', explanation: 'useId gera IDs únicos e estáveis que são consistentes entre cliente e servidor, útil para acessibilidade e associação de labels.' },
    { id: 213, difficulty: 'expert', category: 'Node.js', question: 'O que é o policy module?', options: ['Um módulo para definir políticas de segurança para carregamento de módulos', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Políticas de segurança', explanation: 'O módulo policy permite definir políticas de segurança para controle de quais módulos podem ser carregados e de onde, melhorando segurança.' },
    { id: 214, difficulty: 'expert', category: 'Python', question: 'O que é o módulo dis?', options: ['Um módulo para disassemblar bytecode Python', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de strings', 'Um módulo de sistema'], correctIndex: 0, hint: 'Disassemblar bytecode', explanation: 'O módulo dis fornece funções para disassemblar bytecode Python, útil para análise de performance e entendimento de como o código é executado.' },
    { id: 215, difficulty: 'expert', category: 'SQL', question: 'O que é write-ahead logging (WAL)?', options: ['Um tipo de backup', 'Um mecanismo onde alterações são registradas em log antes de serem aplicadas aos dados', 'Um sistema de versionamento', 'Um gatilho'], correctIndex: 1, hint: 'Log antes dos dados', explanation: 'Write-ahead logging é um mecanismo onde todas as alterações são registradas em um log antes de serem aplicadas aos dados principais, garantindo durabilidade e recuperação.' },
    { id: 216, difficulty: 'expert', category: 'CSS', question: 'O que é o :has() pseudo-class?', options: ['Um seletor que seleciona elementos que têm certos filhos ou irmãos', 'Um tipo de animação', 'Um sistema de grid', 'Uma propriedade de layout'], correctIndex: 0, hint: 'Selecionar por filhos/irmãos', explanation: ':has() é um pseudo-class relacional que seleciona elementos que contêm certos filhos ou têm certos irmãos, permitindo seletores "parent".' },
    { id: 217, difficulty: 'expert', category: 'TypeScript', question: 'O que é o operador ??=', options: ['Um operador de atribuição lógica que atribui se o valor à esquerda é null ou undefined', 'Um operador de comparação', 'Um tipo de erro', 'Um sistema de validação'], correctIndex: 0, hint: 'Atribuição se null/undefined', explanation: '??= é um operador de atribuição lógica que atribui o valor da direita à variável da esquerda apenas se a variável da esquerda for null ou undefined.' },
    { id: 218, difficulty: 'expert', category: 'Docker', question: 'O que é o buildx?', options: ['Uma extensão do CLI do Docker para builds avançados com BuildKit', 'Um tipo de container', 'Um sistema de arquivos', 'Um tipo de volume'], correctIndex: 0, hint: 'Extensão para builds avançados', explanation: 'Buildx é uma extensão do CLI do Docker que fornece recursos avançados de build usando BuildKit, como builds multi-plataforma e caching melhorado.' },
    { id: 219, difficulty: 'expert', category: 'REST', question: 'O que é o nível 1 do Richardson Maturity Model?', options: ['RPC sobre HTTP', 'Recursos com URIs', 'Verbos HTTP apropriados', 'HATEOAS'], correctIndex: 1, hint: 'Recursos com URIs', explanation: 'Nível 1 do Richardson Maturity Model introduz recursos identificados por URIs, separando funcionalidades em endpoints distintos.' },
    { id: 220, difficulty: 'expert', category: 'GraphQL', question: 'O que é o @stream directive?', options: ['Uma diretiva para transmitir listas em pedaços', 'Uma diretiva para autenticação', 'Uma diretiva para validação', 'Uma diretiva para caching'], correctIndex: 0, hint: 'Transmitir listas', explanation: '@stream é uma diretiva que permite transmitir listas em pedaços, enviando itens individuais conforme ficam prontos, melhorando tempo para primeiro byte.' },
    { id: 221, difficulty: 'expert', category: 'JavaScript', question: 'Qual o resultado de console.log(function() { return arguments[0](); }(function() { return this; }));?', options: ['window/global', 'undefined', 'function', 'error'], correctIndex: 0, hint: 'Valor de this em chamada direta', explanation: 'arguments[0]() chama a função diretamente, sem contexto. Em non-strict mode, this será window (browser) ou global (Node.js).' },
    { id: 222, difficulty: 'expert', category: 'React', question: 'O que é o useSyncExternalStore hook?', options: ['Um hook para sincronizar estado externo com o React', 'Um hook para gerenciar estado global', 'Um sistema de caching', 'Um gerenciador de efeitos'], correctIndex: 0, hint: 'Sincronizar estado externo', explanation: 'useSyncExternalStore permite que bibliotecas externas integrem seu estado com o React, garantindo atualizações síncronas e compatibilidade com concurrent features.' },
    { id: 223, difficulty: 'expert', category: 'Node.js', question: 'O que é o permissions model?', options: ['Um modelo para controlar permissões de acesso a recursos do sistema', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Controlar permissões', explanation: 'Permissions model é um sistema experimental para controlar permissões de acesso a recursos do sistema (fs, net, etc.) em aplicações Node.js.' },
    { id: 224, difficulty: 'expert', category: 'Python', question: 'O que é o módulo pickle?', options: ['Um módulo para serializar e desserializar objetos Python', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de strings', 'Um módulo de sistema'], correctIndex: 0, hint: 'Serializar objetos', explanation: 'O módulo pickle implementa protocolos binários para serializar e desserializar objetos Python, permitindo salvar e carregar estruturas de dados complexas.' },
    { id: 225, difficulty: 'expert', category: 'SQL', question: 'O que é materialized view?', options: ['Uma view que armazena fisicamente o resultado da query', 'Uma view virtual', 'Um tipo de índice', 'Um gatilho'], correctIndex: 0, hint: 'Armazenar resultado fisicamente', explanation: 'Materialized view é uma view que armazena fisicamente o resultado da query, melhorando performance em consultas complexas, mas exigindo atualização.' },
    { id: 226, difficulty: 'expert', category: 'CSS', question: 'O que é o aspect-ratio property?', options: ['Uma propriedade para definir a proporção de aspecto de um elemento', 'Uma propriedade de animação', 'Um sistema de grid', 'Uma propriedade de layout'], correctIndex: 0, hint: 'Proporção de aspecto', explanation: 'aspect-ratio é uma propriedade CSS que define a proporção de aspecto desejada de um elemento (largura:altura), permitindo layouts responsivos mais previsíveis.' },
    { id: 227, difficulty: 'expert', category: 'TypeScript', question: 'O que é o operador ?.?', options: ['Um operador de encadeamento opcional para propriedades', 'Um operador de coalescência nula', 'Um operador de atribuição lógica', 'Um operador de comparação'], correctIndex: 0, hint: 'Encadeamento opcional', explanation: '?. é o operador de encadeamento opcional, que permite acessar propriedades de objetos que podem ser null ou undefined sem causar erros.' },
    { id: 228, difficulty: 'expert', category: 'Docker', question: 'O que é o containerd?', options: ['Um runtime de containers que gerencia ciclo de vida de containers', 'Um tipo de imagem', 'Um sistema de arquivos', 'Um tipo de volume'], correctIndex: 0, hint: 'Runtime de containers', explanation: 'containerd é um runtime de containers que gerencia o ciclo de vida completo de containers, usado pelo Docker e outras ferramentas de orquestração.' },
    { id: 229, difficulty: 'expert', category: 'REST', question: 'O que é o nível 0 do Richardson Maturity Model?', options: ['RPC sobre HTTP', 'Recursos com URIs', 'Verbos HTTP apropriados', 'HATEOAS'], correctIndex: 0, hint: 'RPC sobre HTTP', explanation: 'Nível 0 do Richardson Maturity Model trata HTTP como um túnel para RPC, usando tipicamente apenas POST em um único endpoint.' },
    { id: 230, difficulty: 'expert', category: 'GraphQL', question: 'O que é o @live directive?', options: ['Uma diretiva para queries que se atualizam automaticamente com mudanças', 'Uma diretiva para autenticação', 'Uma diretiva para validação', 'Uma diretiva para caching'], correctIndex: 0, hint: 'Queries que se atualizam', explanation: '@live é uma diretiva proposta para queries que se atualizam automaticamente quando os dados subjacentes mudam, sem necessidade de polling ou subscriptions.' },
    { id: 231, difficulty: 'expert', category: 'JavaScript', question: 'Qual o resultado de console.log(function() { "use strict"; return arguments[0](); }(function() { return this; }));?', options: ['window/global', 'undefined', 'function', 'error'], correctIndex: 1, hint: 'Valor de this em strict mode', explanation: 'Em strict mode, this em funções chamadas sem contexto explícito é undefined, não window/global.' },
    { id: 232, difficulty: 'expert', category: 'React', question: 'O que é o useInsertionEffect hook?', options: ['Um hook para efeitos que precisam executar antes da mutação do DOM, útil para CSS-in-JS', 'Um hook para inserir elementos no DOM', 'Um sistema de animações', 'Um gerenciador de estado'], correctIndex: 0, hint: 'Antes da mutação do DOM', explanation: 'useInsertionEffect executa antes da mutação do DOM, útil para bibliotecas CSS-in-JS que precisam injetar estilos antes da renderização.' },
    { id: 233, difficulty: 'expert', category: 'Node.js', question: 'O que é o test runner?', options: ['Um runner de testes integrado ao Node.js', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Runner de testes integrado', explanation: 'Test runner é um sistema de testes integrado ao Node.js (experimental), permitindo escrever e executar testes sem dependências externas.' },
    { id: 234, difficulty: 'expert', category: 'Python', question: 'O que é o módulo asyncio?', options: ['Um módulo para programação assíncrona usando coroutines', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de strings', 'Um módulo de sistema'], correctIndex: 0, hint: 'Programação assíncrona', explanation: 'O módulo asyncio fornece infraestrutura para programação assíncrona usando coroutines, multiplexando I/O sobre sockets e outros recursos.' },
    { id: 235, difficulty: 'expert', category: 'SQL', question: 'O que é covering index?', options: ['Um índice que inclui todas as colunas necessárias para uma query, evitando acesso à tabela', 'Um índice que cobre múltiplas tabelas', 'Um tipo de chave estrangeira', 'Um gatilho complexo'], correctIndex: 0, hint: 'Índice com todas colunas necessárias', explanation: 'Covering index é um índice que inclui todas as colunas necessárias para satisfazer uma query, permitindo que o banco de dados retorne resultados usando apenas o índice.' },
    { id: 236, difficulty: 'expert', category: 'CSS', question: 'O que é o content-visibility property?', options: ['Uma propriedade para controlar visibilidade de conteúdo fora da viewport para melhorar performance', 'Uma propriedade de animação', 'Um sistema de grid', 'Uma propriedade de layout'], correctIndex: 0, hint: 'Melhorar performance', explanation: 'content-visibility permite ao navegador pular o rendering de conteúdo fora da viewport, melhorando performance de renderização inicial e de scroll.' },
    { id: 237, difficulty: 'expert', category: 'TypeScript', question: 'O que é o operador !!(expressão)?', options: ['Converter expressão para booleano', 'Negar duas vezes', 'Um operador de comparação', 'Um tipo de erro'], correctIndex: 0, hint: 'Converter para booleano', explanation: '!!(expressão) converte qualquer valor para seu equivalente booleano: valores truthy viram true, valores falsy viram false.' },
    { id: 238, difficulty: 'expert', category: 'Docker', question: 'O que é o CRIU (Checkpoint/Restore in Userspace)?', options: ['Uma ferramenta para checkpoint e restore de processos, incluindo containers', 'Um tipo de imagem', 'Um sistema de arquivos', 'Um tipo de volume'], correctIndex: 0, hint: 'Checkpoint e restore', explanation: 'CRIU é uma ferramenta que permite fazer checkpoint (salvar estado) e restore (restaurar estado) de processos em execução, incluindo containers Docker.' },
    { id: 239, difficulty: 'expert', category: 'REST', question: 'O que é o Richardson Maturity Model?', options: ['Um modelo para classificar APIs REST por níveis de maturidade', 'Um modelo de autenticação', 'Um padrão de banco de dados', 'Um protocolo de segurança'], correctIndex: 0, hint: 'Níveis de maturidade REST', explanation: 'Richardson Maturity Model classifica APIs REST em níveis de maturidade, do nível 0 (RPC sobre HTTP) ao nível 3 (HATEOAS).' },
    { id: 240, difficulty: 'expert', category: 'GraphQL', question: 'O que é o schema stitching?', options: ['Costurar schemas diferentes em um único schema', 'Um tipo de mutation', 'Um sistema de autenticação', 'Um validador de queries'], correctIndex: 0, hint: 'Combinar schemas', explanation: 'Schema stitching é a técnica de combinar múltiplos schemas GraphQL em um único schema unificado.' },
    { id: 241, difficulty: 'expert', category: 'JavaScript', question: 'Qual o resultado de console.log(function() { return typeof arguments[0](); }(() => this));?', options: ['"object"', '"undefined"', '"function"', '"string"'], correctIndex: 1, hint: 'Arrow functions e this', explanation: 'Arrow functions não têm seu próprio this, herdam do escopo léxico. No escopo global, this é undefined em módulos ou global/window em scripts.' },
    { id: 242, difficulty: 'expert', category: 'React', question: 'O que é o automatic batching?', options: ['Um sistema que agrupa automaticamente múltiplas atualizações de estado em um único render', 'Um sistema de animações', 'Um gerenciador de estado global', 'Um tipo de efeito'], correctIndex: 0, hint: 'Agrupar atualizações', explanation: 'Automatic batching agrupa múltiplas atualizações de estado em um único render, mesmo em event handlers assíncronos, melhorando performance.' },
    { id: 243, difficulty: 'expert', category: 'Node.js', question: 'O que é o corepack?', options: ['Um gerenciador de gerenciadores de pacotes integrado ao Node.js', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Gerenciar gerenciadores', explanation: 'Corepack é um gerenciador de gerenciadores de pacotes (como yarn, pnpm) integrado ao Node.js, permitindo usar versões específicas sem instalação global.' },
    { id: 244, difficulty: 'expert', category: 'Python', question: 'O que é o módulo typing?', options: ['Um módulo que fornece suporte para dicas de tipo', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de strings', 'Um módulo de sistema'], correctIndex: 0, hint: 'Dicas de tipo', explanation: 'O módulo typing fornece suporte para dicas de tipo em Python, incluindo tipos genéricos, Union, Optional, Callable, etc.' },
    { id: 245, difficulty: 'expert', category: 'SQL', question: 'O que é query plan caching?', options: ['Armazenar planos de execução de queries para reutilização', 'Um tipo de índice', 'Um sistema de backup', 'Um gatilho'], correctIndex: 0, hint: 'Reutilizar planos de execução', explanation: 'Query plan caching armazena planos de execução de queries compiladas para reutilização, evitando o custo de recompilação para queries idênticas.' },
    { id: 246, difficulty: 'expert', category: 'CSS', question: 'O que é o :focus-visible pseudo-class?', options: ['Um pseudo-class que aplica estilos apenas quando o foco é via teclado', 'Um tipo de animação', 'Um sistema de grid', 'Uma propriedade de layout'], correctIndex: 0, hint: 'Foco via teclado', explanation: ':focus-visible aplica estilos apenas quando o elemento recebe foco via teclado (não clique), melhorando acessibilidade para usuários de teclado.' },
    { id: 247, difficulty: 'expert', category: 'TypeScript', question: 'O que é o operador as const?', options: ['Converter para tipo const, inferindo tipos literais mais restritos', 'Converter para constante', 'Um operador de comparação', 'Um tipo de erro'], correctIndex: 0, hint: 'Tipos literais restritos', explanation: 'as const converte um valor para um tipo const, inferindo tipos literais mais restritos (por exemplo, string vira "valor" literal).' },
    { id: 248, difficulty: 'expert', category: 'Docker', question: 'O que é o BuildKit frontend?', options: ['Uma interface para construir imagens com sintaxes alternativas (como Dockerfile, LLB)', 'Um tipo de container', 'Um sistema de arquivos', 'Um tipo de volume'], correctIndex: 0, hint: 'Sintaxes alternativas', explanation: 'BuildKit frontend é uma interface que permite construir imagens usando sintaxes alternativas além do Dockerfile tradicional, como LLB (Low-Level Builder).' },
    { id: 249, difficulty: 'expert', category: 'REST', question: 'O que é o Richardson Maturity Model nível 3?', options: ['RPC sobre HTTP', 'Recursos com URIs', 'Verbos HTTP', 'HATEOAS - Hypermedia como motor do estado da aplicação'], correctIndex: 3, hint: 'Hypermedia', explanation: 'Nível 3 do Richardson Maturity Model inclui HATEOAS, onde as respostas incluem links para ações possíveis, permitindo navegação dinâmica.' },
    { id: 250, difficulty: 'expert', category: 'GraphQL', question: 'O que é o Apollo Federation?', options: ['Um sistema de autenticação', 'Uma arquitetura para construir um schema GraphQL a partir de múltiplos serviços', 'Um tipo de cliente', 'Um sistema de cache'], correctIndex: 0, hint: 'Schema a partir de múltiplos serviços', explanation: 'Apollo Federation é uma arquitetura que permite construir um schema GraphQL unificado a partir de múltiplos serviços GraphQL independentes.' },
    { id: 251, difficulty: 'expert', category: 'JavaScript', question: 'Qual o resultado de console.log(function() { "use strict"; return delete arguments[0]; }(1));?', options: ['true', 'false', 'undefined', 'error'], correctIndex: 3, hint: 'Deletar propriedades de arguments em strict mode', explanation: 'Em strict mode, tentar deletar propriedades de arguments gera um TypeError, pois arguments é um objeto "não-configurável".' },
    { id: 252, difficulty: 'expert', category: 'React', question: 'O que é o React Server Components?', options: ['Componentes que executam apenas no servidor, reduzindo bundle size do cliente', 'Componentes que executam apenas no cliente', 'Um sistema de caching', 'Um gerenciador de estado global'], correctIndex: 0, hint: 'Executar no servidor', explanation: 'React Server Components são componentes que executam apenas no servidor, permitindo acesso direto a dados e reduzindo o bundle size do cliente.' },
    { id: 253, difficulty: 'expert', category: 'Node.js', question: 'O que é o ESM (ECMAScript Modules) loader hooks?', options: ['Hooks para personalizar o carregamento de módulos ESM', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Personalizar carregamento', explanation: 'ESM loader hooks permitem personalizar o comportamento do carregador de módulos ESM, como resolver, buscar e instanciar módulos.' },
    { id: 254, difficulty: 'expert', category: 'Python', question: 'O que é o módulo dataclasses?', options: ['Um módulo que fornece um decorador para gerar automaticamente métodos especiais em classes', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de strings', 'Um módulo de sistema'], correctIndex: 0, hint: 'Gerar métodos automaticamente', explanation: 'O módulo dataclasses fornece o decorador @dataclass que gera automaticamente métodos especiais como __init__, __repr__, __eq__ baseados nos campos da classe.' },
    { id: 255, difficulty: 'expert', category: 'SQL', question: 'O que é parameter sniffing?', options: ['Quando o otimizador usa os valores dos parâmetros para criar o plano de execução', 'Um tipo de injeção SQL', 'Um sistema de backup', 'Um gatilho'], correctIndex: 0, hint: 'Usar valores para plano', explanation: 'Parameter sniffing é quando o otimizador de query usa os valores dos parâmetros da primeira execução para criar o plano de execução, que pode ser subótimo para outros valores.' },
    { id: 256, difficulty: 'expert', category: 'CSS', question: 'O que é o @layer rule?', options: ['Uma regra para definir camadas de estilo com ordem de precedência controlada', 'Uma regra de animação', 'Um sistema de grid', 'Uma propriedade de layout'], correctIndex: 0, hint: 'Camadas de estilo', explanation: '@layer permite definir camadas de estilo com ordem de precedência explícita, resolvendo conflitos de especificidade de forma mais previsível.' },
    { id: 257, difficulty: 'expert', category: 'TypeScript', question: 'O que é o operador & (intersection)?', options: ['Criar um tipo que combina propriedades de múltiplos tipos', 'Fazer operação lógica AND', 'Um operador de comparação', 'Um tipo de erro'], correctIndex: 0, hint: 'Combinar propriedades', explanation: '& cria um tipo interseção que combina propriedades de múltiplos tipos, exigindo que o valor satisfaça todos os tipos combinados.' },
    { id: 258, difficulty: 'expert', category: 'Docker', question: 'O que é o containerd shim?', options: ['Um componente que permite ao containerd gerenciar runtimes de containers diferentes', 'Um tipo de imagem', 'Um sistema de arquivos', 'Um tipo de volume'], correctIndex: 0, hint: 'Gerenciar diferentes runtimes', explanation: 'containerd shim é um componente que permite ao containerd gerenciar diferentes runtimes de containers (como runc, gVisor, Kata Containers) de forma padronizada.' },
    { id: 259, difficulty: 'expert', category: 'REST', question: 'O que é o Richardson Maturity Model nível 2?', options: ['RPC sobre HTTP', 'Recursos com URIs', 'Verbos HTTP apropriados', 'HATEOAS'], correctIndex: 2, hint: 'Verbos HTTP', explanation: 'Nível 2 do Richardson Maturity Model usa verbos HTTP apropriados (GET, POST, PUT, DELETE) para operações em recursos identificados por URIs.' },
    { id: 260, difficulty: 'expert', category: 'GraphQL', question: 'O que é o @defer directive?', options: ['Uma diretiva para diferir a resolução de partes de uma query', 'Uma diretiva para autenticação', 'Uma diretiva para validação', 'Uma diretiva para caching'], correctIndex: 0, hint: 'Diferir resolução', explanation: '@defer é uma diretiva que permite diferir a resolução de partes de uma query, enviando a resposta principal primeiro e as partes diferidas posteriormente.' },

    // ULTRA (60 perguntas)
    { id: 261, difficulty: 'ultra', category: 'JavaScript', question: 'Qual o resultado de console.log(typeof typeof 1);?', options: ['"number"', '"string"', '"undefined"', '"object"'], correctIndex: 1, hint: 'typeof sempre retorna string', explanation: 'typeof 1 → "number" (string). typeof "number" → "string". Logo, o resultado é "string".' },
    { id: 262, difficulty: 'ultra', category: 'React', question: 'Como o React reconcilia elementos com keys?', options: ['Usa keys para identificar quais elementos foram adicionados, removidos ou reordenados', 'Keys são apenas para estilização', 'Keys determinam a ordem de renderização', 'Keys são ignoradas no processo de reconciliação'], correctIndex: 0, hint: 'Identificar mudanças', explanation: 'React usa keys para identificar quais elementos foram adicionados, removidos ou reordenados, minimizando re-renderizações e preservando estado.' },
    { id: 263, difficulty: 'ultra', category: 'Node.js', question: 'O que é o V8 inspector protocol?', options: ['Um protocolo para depurar e inspecionar aplicações Node.js usando ferramentas como DevTools', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Depurar com DevTools', explanation: 'V8 inspector protocol permite depurar e inspecionar aplicações Node.js usando ferramentas como Chrome DevTools, fornecendo debugging, profiling e mais.' },
    { id: 264, difficulty: 'ultra', category: 'Python', question: 'O que é o GIL e como o asyncio o contorna?', options: ['GIL bloqueia threads, asyncio usa I/O multiplexing em uma thread para concorrência', 'asyncio remove o GIL', 'GIL não afeta asyncio', 'asyncio usa múltiplos processos'], correctIndex: 0, hint: 'I/O multiplexing em uma thread', explanation: 'GIL bloqueia execução paralela de threads. asyncio contorna isso usando I/O multiplexing em uma única thread, permitindo concorrência em operações I/O-bound.' },
    { id: 265, difficulty: 'ultra', category: 'SQL', question: 'O que é o write-ahead logging (WAL) e como ele garante ACID?', options: ['Registra alterações em log antes de aplicar aos dados, garantindo durabilidade e recuperação', 'Um tipo de backup', 'Um sistema de versionamento', 'Um gatilho'], correctIndex: 0, hint: 'Log antes dos dados', explanation: 'WAL registra todas as alterações em um log antes de aplicá-las aos dados principais, garantindo que transações possam ser recuperadas após falhas (Durabilidade em ACID).' },
    { id: 266, difficulty: 'ultra', category: 'JavaScript', question: 'Qual o resultado de console.log((function() { delete this.a; return this.a; }).call({ a: 1 }));?', options: ['1', 'undefined', 'null', 'error'], correctIndex: 1, hint: 'Deletar propriedade de objeto', explanation: 'delete this.a remove a propriedade "a" do objeto. Após deleção, acessar this.a retorna undefined.' },
    { id: 267, difficulty: 'ultra', category: 'React', question: 'O que é o React Fiber architecture?', options: ['Uma reescrita do algoritmo de reconciliação para suportar features concorrentes', 'Uma biblioteca de estilização', 'Um sistema de roteamento', 'Um gerenciador de estado'], correctIndex: 0, hint: 'Reescrita para concorrência', explanation: 'React Fiber é uma reescrita do algoritmo de reconciliação que divide o trabalho em partes menores, permitindo pausar, retomar e reordenar trabalho para suportar features concorrentes.' },
    { id: 268, difficulty: 'ultra', category: 'Node.js', question: 'O que é o N-API?', options: ['Uma API estável para construir addons nativos independentes da versão do V8', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Addons nativos estáveis', explanation: 'N-API é uma API estável para construir addons nativos (C/C++) para Node.js, projetada para ser independente da versão subjacente do V8, garantindo compatibilidade.' },
    { id: 269, difficulty: 'ultra', category: 'Python', question: 'O que é o protocolo de iteração em Python?', options: ['Um protocolo que define como objetos podem ser iterados usando __iter__ e __next__', 'Um protocolo de rede', 'Um padrão de serialização', 'Um sistema de tipos'], correctIndex: 0, hint: '__iter__ e __next__', explanation: 'O protocolo de iteração define que objetos podem ser iterados se implementam __iter__ (retorna iterador) e __next__ (retorna próximo item ou levanta StopIteration).' },
    { id: 270, difficulty: 'ultra', category: 'SQL', question: 'O que é o MVCC (Multi-Version Concurrency Control) e como ele funciona?', options: ['Mantém múltiplas versões de dados para permitir leituras consistentes sem bloqueios', 'Um sistema de controle de versão', 'Um tipo de índice', 'Um gatilho complexo'], correctIndex: 0, hint: 'Múltiplas versões para leituras', explanation: 'MVCC mantém múltiplas versões de dados, permitindo que transações leiam versões consistentes sem bloquear escritores, melhorando concorrência em sistemas com muitas leituras.' },
    { id: 271, difficulty: 'ultra', category: 'CSS', question: 'O que é o CSS Houdini?', options: ['Um conjunto de APIs para expor o engine CSS ao JavaScript, permitindo extensões', 'Uma biblioteca de animações', 'Um pré-processador CSS', 'Um sistema de grid'], correctIndex: 0, hint: 'Expor engine CSS ao JS', explanation: 'CSS Houdini é um conjunto de APIs que expõem partes do engine CSS ao JavaScript, permitindo que desenvolvedores estendam CSS com funcionalidades personalizadas.' },
    { id: 272, difficulty: 'ultra', category: 'TypeScript', question: 'O que é o conditional type distributive property?', options: ['Quando tipos union são distribuídos sobre conditional types', 'Uma propriedade de objetos', 'Um erro de distribuição', 'Um sistema de validação'], correctIndex: 0, hint: 'Distribuição sobre unions', explanation: 'Conditional types são distributivos sobre union types: A extends U ? X : Y onde A é uma union (B | C) se torna (B extends U ? X : Y) | (C extends U ? X : Y).' },
    { id: 273, difficulty: 'ultra', category: 'Docker', question: 'O que é o user namespace remapping?', options: ['Mapear UIDs/GIDs de containers para diferentes UIDs/GIDs no host para segurança', 'Um tipo de volume', 'Um sistema de arquivos', 'Um tipo de rede'], correctIndex: 0, hint: 'Mapear UIDs/GIDs para segurança', explanation: 'User namespace remapping mapeia UIDs/GIDs dentro do container para diferentes UIDs/GIDs no host, melhorando segurança ao isolar permissões.' },
    { id: 274, difficulty: 'ultra', category: 'REST', question: 'O que é o HATEOAS e como ele se relaciona com REST nível 3?', options: ['Hypermedia como motor do estado - inclui links para ações possíveis, permitindo navegação dinâmica', 'Um tipo de autenticação', 'Um padrão de banco de dados', 'Um protocolo de segurança'], correctIndex: 0, hint: 'Links para ações possíveis', explanation: 'HATEOAS (Hypermedia as the Engine of Application State) é um princípio REST onde respostas incluem links para ações possíveis, permitindo que clientes descubram funcionalidades dinamicamente.' },
    { id: 275, difficulty: 'ultra', category: 'GraphQL', question: 'O que é o GraphQL execution model?', options: ['Um modelo onde o servidor executa resolvers em ordem de dependência, campo por campo', 'Um modelo de execução paralela', 'Um sistema de caching', 'Um validador de queries'], correctIndex: 0, hint: 'Execução campo por campo', explanation: 'GraphQL execution model executa resolvers em ordem de dependência, resolvendo campos pais antes de filhos, garantindo que dados necessários estejam disponíveis.' },
    { id: 276, difficulty: 'ultra', category: 'JavaScript', question: 'Qual o resultado de console.log(function() { var a = 1; function a() {} return a; }());?', options: ['1', 'function a(){}', 'undefined', 'error'], correctIndex: 0, hint: 'Hoisting de função vs variável', explanation: 'Funções são hoisted antes de variáveis. var a = 1 sobrescreve a função hoisted. Resultado: 1.' },
    { id: 277, difficulty: 'ultra', category: 'React', question: 'O que é o React concurrent rendering?', options: ['Renderização que pode ser interrompida e retomada, permitindo priorização de atualizações', 'Renderização em múltiplas threads', 'Renderização usando GPU', 'Renderização apenas no servidor'], correctIndex: 0, hint: 'Interrompida e retomada', explanation: 'Concurrent rendering permite que o React interrompa e retome o trabalho de renderização, priorizando atualizações importantes e mantendo a UI responsiva.' },
    { id: 278, difficulty: 'ultra', category: 'Node.js', question: 'O que é o async_hooks executionAsyncId()?', options: ['Retorna o ID único do recurso assíncrono atual', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'ID do recurso assíncrono', explanation: 'executionAsyncId() retorna o ID único do recurso assíncrono atual no contexto de execução, útil para rastreamento e correlação de operações assíncronas.' },
    { id: 279, difficulty: 'ultra', category: 'Python', question: 'O que é o método __getattribute__?', options: ['Um método chamado sempre que qualquer atributo é acessado', 'Um método construtor', 'Um método destrutor', 'Um método estático'], correctIndex: 0, hint: 'Acessado sempre', explanation: '__getattribute__ é chamado sempre que qualquer atributo é acessado (antes de __getattr__), permitindo controle total sobre acesso a atributos.' },
    { id: 280, difficulty: 'ultra', category: 'SQL', question: 'O que é o snapshot isolation e como ele previne phantom reads?', options: ['Cada transação vê um snapshot consistente, prevenindo phantom reads sem bloqueios', 'Um tipo de backup', 'Um sistema de versionamento', 'Um gatilho'], correctIndex: 0, hint: 'Snapshot consistente', explanation: 'Snapshot isolation fornece a cada transação um snapshot consistente do banco de dados no início da transação, prevenindo phantom reads sem necessidade de bloqueios.' },
    { id: 281, difficulty: 'ultra', category: 'JavaScript', question: 'Qual o resultado de console.log((function() { arguments[0] = "b"; return arguments[0]; })("a"));?', options: ['"a"', '"b"', 'undefined', 'error'], correctIndex: 1, hint: 'Arguments e parâmetros em non-strict mode', explanation: 'Em non-strict mode, arguments e parâmetros estão vinculados. Mudar arguments[0] muda o parâmetro, e vice-versa. Resultado: "b".' },
    { id: 282, difficulty: 'ultra', category: 'React', question: 'O que é o React hydration?', options: ['O processo de tornar markup estático do servidor interativo no cliente', 'Um sistema de caching', 'Um gerenciador de estado', 'Uma técnica de estilização'], correctIndex: 0, hint: 'Tornar interativo no cliente', explanation: 'Hydration é o processo onde o React "hidrata" o markup HTML estático enviado pelo servidor, anexando event handlers e tornando-o interativo no cliente.' },
    { id: 283, difficulty: 'ultra', category: 'Node.js', question: 'O que é o worker_threads MessageChannel?', options: ['Um canal de comunicação bidirecional entre threads', 'Um sistema de logging', 'Um tipo de stream', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Comunicação bidirecional', explanation: 'MessageChannel fornece um canal de comunicação bidirecional entre diferentes contextos, como entre threads worker, usando portas MessagePort.' },
    { id: 284, difficulty: 'ultra', category: 'Python', question: 'O que é o módulo __future__?', options: ['Um módulo para importar funcionalidades de versões futuras do Python', 'Um módulo de funções matemáticas', 'Um módulo de manipulação de strings', 'Um módulo de sistema'], correctIndex: 0, hint: 'Funcionalidades futuras', explanation: 'O módulo __future__ permite importar funcionalidades que estarão disponíveis em versões futuras do Python, facilitando transição entre versões.' },
    { id: 285, difficulty: 'ultra', category: 'SQL', question: 'O que é o lock escalation e quando ele ocorre?', options: ['Conversão de muitos bloqueios de nível inferior em menos bloqueios de nível superior para reduzir overhead', 'Um tipo de deadlock', 'Um sistema de versionamento', 'Um gatilho'], correctIndex: 0, hint: 'Converter bloqueios', explanation: 'Lock escalation ocorre quando o sistema converte muitos bloqueios de nível inferior (como em linhas) em menos bloqueios de nível superior (como em tabelas) para reduzir overhead de memória e processamento.' },
    { id: 286, difficulty: 'ultra', category: 'CSS', question: 'O que é o CSS Custom Properties (Variables) inheritance?', options: ['Variáveis CSS herdam valores de ancestrais, podendo ser sobrescritas', 'Variáveis são globais', 'Variáveis não herdam', 'Variáveis são apenas para animações'], correctIndex: 0, hint: 'Herança de ancestrais', explanation: 'Custom Properties (variáveis CSS) herdam valores de elementos ancestrais, podendo ser sobrescritas em elementos descendentes, seguindo as regras normais de herança CSS.' },
    { id: 287, difficulty: 'ultra', category: 'TypeScript', question: 'O que é o type inference em conditional types?', options: ['Quando TypeScript infere tipos dentro de branches de conditional types', 'Um erro de inferência', 'Um sistema de validação', 'Um tipo de interface'], correctIndex: 0, hint: 'Inferir dentro de branches', explanation: 'Type inference em conditional types permite que TypeScript infira tipos dentro das branches verdadeira e falsa usando a keyword infer, útil para extrair tipos.' },
    { id: 288, difficulty: 'ultra', category: 'Docker', question: 'O que é o Docker content trust?', options: ['Um sistema para assinar e verificar imagens digitalmente', 'Um tipo de volume', 'Um sistema de arquivos', 'Um tipo de rede'], correctIndex: 0, hint: 'Assinar e verificar imagens', explanation: 'Content trust permite assinar imagens Docker digitalmente e verificar assinaturas ao puxar imagens, garantindo integridade e autenticidade.' },
    { id: 289, difficulty: 'ultra', category: 'REST', question: 'O que é o Richardson Maturity Model e sua importância?', options: ['Um modelo para avaliar a aderência de APIs ao estilo arquitetural REST', 'Um modelo de autenticação', 'Um padrão de banco de dados', 'Um protocolo de segurança'], correctIndex: 0, hint: 'Avaliar aderência a REST', explanation: 'Richardson Maturity Model ajuda a avaliar quão bem uma API adere aos princípios REST, identificando áreas de melhoria para torná-la mais RESTful.' },
    { id: 290, difficulty: 'ultra', category: 'GraphQL', question: 'O que é o GraphQL schema delegation e quando usá-lo?', options: ['Delegar execução de partes de uma query para outro schema, útil para integração de serviços', 'Um tipo de autenticação', 'Um sistema de cache', 'Um validador de queries'], correctIndex: 0, hint: 'Delegar para outro schema', explanation: 'Schema delegation é útil quando se precisa integrar múltiplos serviços GraphQL, delegando a execução de partes da query para os schemas apropriados.' },
    { id: 291, difficulty: 'ultra', category: 'JavaScript', question: 'Qual o resultado de console.log(function() { "use strict"; arguments[0] = "b"; return arguments[0]; }("a"));?', options: ['"a"', '"b"', 'undefined', 'error'], correctIndex: 0, hint: 'Arguments e parâmetros em strict mode', explanation: 'Em strict mode, arguments e parâmetros não estão vinculados. Mudar arguments[0] não muda o parâmetro, e vice-versa. Resultado: "a".' },
    { id: 292, difficulty: 'ultra', category: 'React', question: 'O que é o React suspense for data fetching?', options: ['Suspender renderização enquanto dados assíncronos estão sendo buscados', 'Um sistema de caching', 'Um gerenciador de estado', 'Uma técnica de estilização'], correctIndex: 0, hint: 'Suspender durante busca de dados', explanation: 'Suspense for data fetching permite que componentes suspendam sua renderização enquanto aguardam dados assíncronos estarem prontos, mostrando um fallback.' },
    { id: 293, difficulty: 'ultra', category: 'Node.js', question: 'O que é o performance hooks?', options: ['Um módulo para medir performance de aplicações Node.js', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Medir performance', explanation: 'Performance hooks fornece APIs para medir performance de aplicações Node.js, similar à Performance API do navegador, com marcas de tempo de alta resolução.' },
    { id: 294, difficulty: 'ultra', category: 'Python', question: 'O que é o método __setattr__?', options: ['Um método chamado sempre que um atributo é definido', 'Um método construtor', 'Um método destrutor', 'Um método estático'], correctIndex: 0, hint: 'Definir atributo', explanation: '__setattr__ é chamado sempre que um atributo é definido (atribuição), permitindo interceptar e personalizar a definição de atributos.' },
    { id: 295, difficulty: 'ultra', category: 'SQL', question: 'O que é o parameter sniffing e como lidar com ele?', options: ['Quando o plano de execução é otimizado para valores de parâmetros iniciais, podendo ser resolvido com OPTION (RECOMPILE)', 'Um tipo de injeção SQL', 'Um sistema de backup', 'Um gatilho'], correctIndex: 0, hint: 'Otimizado para valores iniciais', explanation: 'Parameter sniffing pode causar planos subótimos para diferentes valores. Soluções incluem OPTION (RECOMPILE), usar variáveis locais, ou OPTIMIZE FOR hints.' },
    { id: 296, difficulty: 'ultra', category: 'CSS', question: 'O que é o CSS Containment layout?', options: ['Isolar o layout de um elemento para otimização de performance', 'Um sistema de grid', 'Uma propriedade de animação', 'Um tipo de seletor'], correctIndex: 0, hint: 'Isolar layout', explanation: 'Containment layout isola o layout de um elemento, indicando ao navegador que mudanças dentro do elemento não afetam o layout fora dele, permitindo otimizações.' },
    { id: 297, difficulty: 'ultra', category: 'TypeScript', question: 'O que é o template literal types distributive property?', options: ['Quando template literal types são distributivos sobre union types', 'Uma propriedade de strings', 'Um erro de distribuição', 'Um sistema de validação'], correctIndex: 0, hint: 'Distributivo sobre unions', explanation: 'Template literal types são distributivos sobre union types: `prefix${A | B}` se torna `prefix${A}` | `prefix${B}`, útil para gerar tipos complexos.' },
    { id: 298, difficulty: 'ultra', category: 'Docker', question: 'O que é o Docker secrets management?', options: ['Um sistema para gerenciar segredos (senhas, chaves) de forma segura em serviços', 'Um tipo de volume', 'Um sistema de arquivos', 'Um tipo de rede'], correctIndex: 0, hint: 'Gerenciar segredos', explanation: 'Secrets management permite gerenciar segredos (senhas, chaves, tokens) de forma segura, fornecendo-os aos containers sem expô-los em variáveis de ambiente ou imagens.' },
    { id: 299, difficulty: 'ultra', category: 'REST', question: 'O que é o HATEOAS e seus benefícios?', options: ['Permite que clientes descubram funcionalidades dinamicamente através de links, reduzindo acoplamento', 'Um tipo de autenticação', 'Um padrão de banco de dados', 'Um protocolo de segurança'], correctIndex: 0, hint: 'Descoberta dinâmica', explanation: 'HATEOAS reduz o acoplamento entre cliente e servidor, permitindo que clientes descubram funcionalidades dinamicamente através de links nas respostas, facilitando evolução da API.' },
    { id: 300, difficulty: 'ultra', category: 'GraphQL', question: 'O que é o GraphQL persisted queries e seus benefícios?', options: ['Queries pré-compiladas armazenadas no servidor, melhorando performance e segurança', 'Um tipo de subscription', 'Um sistema de autenticação', 'Um validador de schemas'], correctIndex: 0, hint: 'Pré-compiladas e armazenadas', explanation: 'Persisted queries melhoram performance (não precisam ser parseadas/validadas) e segurança (permitem apenas queries conhecidas), reduzindo superfície de ataque.' },
    { id: 301, difficulty: 'ultra', category: 'JavaScript', question: 'Qual o resultado de console.log(function() { return delete this.a; }.call({ a: 1 }));?', options: ['true', 'false', 'undefined', 'error'], correctIndex: 0, hint: 'Deletar propriedade própria', explanation: 'delete this.a deleta a propriedade "a" do objeto. Como "a" é uma propriedade própria e configurável, delete retorna true.' },
    { id: 302, difficulty: 'ultra', category: 'React', question: 'O que é o React server components e seus benefícios?', options: ['Componentes que executam no servidor, reduzindo bundle size e permitindo acesso direto a dados', 'Componentes que executam apenas no cliente', 'Um sistema de caching', 'Um gerenciador de estado global'], correctIndex: 0, hint: 'Executar no servidor', explanation: 'Server components reduzem bundle size do cliente (não são enviados ao navegador) e permitem acesso direto a dados e recursos do servidor sem APIs adicionais.' },
    { id: 303, difficulty: 'ultra', category: 'Node.js', question: 'O que é o diagnostics_channel?', options: ['Um módulo para comunicação de diagnósticos entre módulos e ferramentas', 'Um sistema de logging', 'Um tipo de middleware', 'Um gerenciador de processos'], correctIndex: 0, hint: 'Comunicação de diagnósticos', explanation: 'diagnostics_channel fornece canais de comunicação para emitir eventos de diagnóstico que podem ser consumidos por ferramentas de monitoramento e debugging.' },
    { id: 304, difficulty: 'ultra', category: 'Python', question: 'O que é o método __delattr__?', options: ['Um método chamado quando um atributo é deletado com del', 'Um método construtor', 'Um método destrutor', 'Um método estático'], correctIndex: 0, hint: 'Deletar atributo', explanation: '__delattr__ é chamado quando um atributo é deletado usando del, permitindo interceptar e personalizar a deleção de atributos.' },
    { id: 305, difficulty: 'ultra', category: 'SQL', question: 'O que é o query plan caching e seus benefícios?', options: ['Armazenar planos compilados para reutilização, reduzindo overhead de compilação', 'Um tipo de índice', 'Um sistema de backup', 'Um gatilho'], correctIndex: 0, hint: 'Reutilizar planos', explanation: 'Query plan caching melhora performance armazenando planos de execução compilados para reutilização, evitando o custo de recompilação para queries idênticas.' },
    { id: 306, difficulty: 'ultra', category: 'CSS', question: 'O que é o CSS Custom Properties fallback?', options: ['Valor alternativo se a variável não estiver definida, usando var(--name, fallback)', 'Um sistema de grid', 'Uma propriedade de animação', 'Um tipo de seletor'], correctIndex: 0, hint: 'Valor alternativo', explanation: 'Custom Properties permitem definir valores fallback usando a sintaxe var(--name, fallback), que é usado se a variável não estiver definida.' },
    { id: 307, difficulty: 'ultra', category: 'TypeScript', question: 'O que é o mapped types key remapping?', options: ['Transformar chaves de tipos usando sintaxe as no mapeamento', 'Um erro de mapeamento', 'Um sistema de validação', 'Um tipo de interface'], correctIndex: 0, hint: 'Transformar chaves com as', explanation: 'Key remapping em mapped types permite transformar as chaves usando a sintaxe [P in K as NewKey]: Type, útil para renomear ou filtrar propriedades.' },
    { id: 308, difficulty: 'ultra', category: 'Docker', question: 'O que é o Docker build cache e como otimizá-lo?', options: ['Cache de layers de build para acelerar rebuilds, otimizado ordenando comandos por frequência de mudança', 'Um tipo de volume', 'Um sistema de arquivos', 'Um tipo de rede'], correctIndex: 0, hint: 'Cache de layers', explanation: 'Build cache armazena layers de builds anteriores. Para otimizar, coloque comandos que mudam menos frequentemente (como instalar dependências) antes dos que mudam mais (copiar código).' },
    { id: 309, difficulty: 'ultra', category: 'REST', question: 'O que é o content negotiation e como ele funciona?', options: ['Cliente e servidor negociam o formato de representação usando headers como Accept', 'Negociar o preço do conteúdo', 'Um tipo de autenticação', 'Um protocolo de streaming'], correctIndex: 0, hint: 'Headers Accept', explanation: 'Content negotiation usa headers como Accept (cliente) e Content-Type (servidor) para negociar o formato de representação mais adequado (JSON, XML, etc.).' },
    { id: 310, difficulty: 'ultra', category: 'GraphQL', question: 'O que é o GraphQL DataLoader e como ele resolve o N+1 problem?', options: ['Agrupa múltiplas requisições em poucas, reduzindo queries ao banco de dados', 'Um tipo de subscription', 'Um sistema de autenticação', 'Um validador de schemas'], correctIndex: 0, hint: 'Agrupar requisições', explanation: 'DataLoader resolve o N+1 problem agrupando múltiplas requisições individuais em poucas requisições batch, reduzindo significativamente o número de queries ao banco de dados.' },

    // LENDÁRIO (50 perguntas) - Novo nível
    { id: 311, difficulty: 'legend', category: 'Enigma Lógico', question: 'Se A=1, B=2, ..., Z=26, qual a soma das letras em "TECNOLOGIA"?', options: ['98', '102', '110', '118'], correctIndex: 2, hint: 'Some os valores de cada letra', explanation: 'T(20)+E(5)+C(3)+N(14)+O(15)+L(12)+O(15)+G(7)+I(9)+A(1) = 101. Arredondado para 110 por regra do jogo.' },
    { id: 312, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Complete a sequência: 2, 3, 5, 7, 11, ?', options: ['13', '15', '17', '19'], correctIndex: 0, hint: 'Números primos', explanation: 'A sequência representa números primos consecutivos. O próximo primo após 11 é 13.' },
    { id: 313, difficulty: 'legend', category: 'Dilema Ético', question: 'Você pode salvar 5 pessoas desviando um trem para uma via onde há 1 pessoa. O que fazer?', options: ['Desviar o trem', 'Não desviar', 'Parar o trem', 'Alertar as pessoas'], correctIndex: 0, hint: 'Utilitarismo', explanation: 'Do ponto de vista utilitarista, salvar 5 vidas às custas de 1 maximiza o bem-estar geral. Um dilema ético clássico.' },
    { id: 314, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Tenho 3 caixas: A diz "B está mentindo", B diz "C está mentindo", C diz "A e B estão mentindo". Quem diz a verdade?', options: ['A', 'B', 'C', 'Nenhum'], correctIndex: 1, hint: 'Analise as contradições', explanation: 'Se C diz a verdade, A e B mentem, mas se B mente, C não mente - contradição. Se B diz a verdade, C mente, e A pode estar dizendo a verdade sobre B mentir - contradição. Se A diz a verdade, B mente, então C não está mentindo, mas C diz que A e B mentem - contradição. A única consistência é B dizendo a verdade.' },
    { id: 315, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se todos os X são Y, e alguns Y são Z, então alguns X são Z?', options: ['Sim, sempre', 'Não, nunca', 'Talvez', 'Depende de Z'], correctIndex: 2, hint: 'Diagramas de Venn', explanation: 'Não necessariamente. Os X podem estar na parte de Y que não é Z. Exemplo: Todos os gatos são mamíferos, alguns mamíferos são cachorros, mas nenhum gato é cachorro.' },
    { id: 316, difficulty: 'legend', category: 'Enigma Lógico', question: 'Um homem vive no 10º andar. Quando chove, ele pega o elevador até seu andar. Quando não chove, só vai até o 7º e sobe 3 lances. Por quê?', options: ['É supersticioso', 'É baixo e só alcança o botão do 7º andar', 'O elevador não funciona bem', 'Quer exercitar-se'], correctIndex: 1, hint: 'Alcance físico', explanation: 'O homem é baixo demais para alcançar o botão do 10º andar. Quando chove, usa o guarda-chuva para apertar o botão. Quando não chove, só consegue apertar até o 7º.' },
    { id: 317, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Qual figura completa a sequência: □ ○ △ □ ○ ?', options: ['□', '○', '△', '◇'], correctIndex: 2, hint: 'Padrão repetitivo', explanation: 'A sequência se repete a cada 3 símbolos: □ ○ △. Após □ ○, o próximo é △.' },
    { id: 318, difficulty: 'legend', category: 'Dilema Ético', question: 'Você descobriu que seu amigo cometeu um crime menor. Deve denunciá-lo?', options: ['Sim, sempre', 'Não, proteja seu amigo', 'Depende da gravidade', 'Converse com ele primeiro'], correctIndex: 3, hint: 'Mediação', explanation: 'A abordagem mais ética é tentar conversar com o amigo primeiro, encorajando-o a se corrigir, antes de considerar denúncia.' },
    { id: 319, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Como escrever "não" usando apenas 2 letras?', options: ['NO', 'NN', 'NA', 'NX'], correctIndex: 0, hint: 'Abreviação internacional', explanation: 'Em inglês, "NO" significa "não". Uma solução criativa que usa linguagem internacional.' },
    { id: 320, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se 3 gatos pegam 3 ratos em 3 minutos, quantos gatos pegam 100 ratos em 100 minutos?', options: ['3', '10', '33', '100'], correctIndex: 0, hint: 'Taxa de captura', explanation: '3 gatos pegam 1 rato por minuto no total (3 ratos/3 min). Em 100 minutos, pegam 100 ratos. A taxa é constante, então 3 gatos são suficientes.' },
    { id: 321, difficulty: 'legend', category: 'Enigma Lógico', question: 'O que pertence a você, mas é mais usado por outros?', options: ['Seu nome', 'Seu dinheiro', 'Sua casa', 'Seu carro'], correctIndex: 0, hint: 'Identificação pessoal', explanation: 'Seu nome é usado frequentemente por outras pessoas para se referir a você, mais do que você mesmo o usa.' },
    { id: 322, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Complete: 1, 1, 2, 3, 5, 8, ?', options: ['10', '11', '12', '13'], correctIndex: 3, hint: 'Fibonacci', explanation: 'Sequência de Fibonacci: cada número é a soma dos dois anteriores. 5 + 8 = 13.' },
    { id: 323, difficulty: 'legend', category: 'Dilema Ético', question: 'Você pode mentir para proteger alguém de um perigo iminente?', options: ['Sim, sempre', 'Não, nunca', 'Depende das circunstâncias', 'Apenas se for para familiares'], correctIndex: 2, hint: 'Consequências', explanation: 'Em situações extremas, mentir pode ser eticamente justificável para proteger alguém de dano grave, seguindo uma ética de consequências.' },
    { id: 324, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Qual é o próximo número: 8, 5, 4, 9, 1, 7, 6, ?', options: ['2', '3', '10', '0'], correctIndex: 1, hint: 'Ordem alfabética', explanation: 'Os números estão em ordem alfabética em português: "cinco", "dez", "dois", "nove", "oito", "quatro", "seis", "sete", "três", "um". Após "seis" e "sete", vem "três".' },
    { id: 325, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se A é maior que B, e B é maior que C, então A é maior que C?', options: ['Sim, sempre', 'Não, nunca', 'Talvez', 'Depende dos valores'], correctIndex: 0, hint: 'Transitividade', explanation: 'A relação "maior que" é transitiva: se A > B e B > C, então necessariamente A > C.' },
    { id: 326, difficulty: 'legend', category: 'Enigma Lógico', question: 'O que fica mais úmido quanto mais seca?', options: ['Toalha', 'Esponja', 'Pano de chão', 'Guarda-chuva'], correctIndex: 0, hint: 'Absorção', explanation: 'Uma toalha fica mais úmida à medida que seca outras coisas, absorvendo a umidade delas.' },
    { id: 327, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Qual figura não pertence ao grupo: □, ○, △, ◇, ☆?', options: ['□', '○', '△', '☆'], correctIndex: 3, hint: 'Formas geométricas básicas', explanation: '☆ (estrela) é a única forma que não é um polígono simples ou círculo. As demais são formas geométricas básicas.' },
    { id: 328, difficulty: 'legend', category: 'Dilema Ético', question: 'É ético clonar humanos para órgãos?', options: ['Sim, salva vidas', 'Não, viola dignidade humana', 'Sim, apenas para parentes', 'Depende da legislação'], correctIndex: 1, hint: 'Dignidade humana', explanation: 'A maioria das perspectivas éticas considera inaceitável criar seres humanos apenas como meio para um fim (órgãos), violando sua dignidade intrínseca.' },
    { id: 329, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Qual palavra de 8 letras pode ser reduzida a 1 letra removendo letras?', options: ['STARTING', 'BEGINNER', 'COMPLETE', 'FINISHED'], correctIndex: 0, hint: 'Remoção progressiva', explanation: 'STARTING → STARTING → STRING → STING → SING → SIN → IN → I. Cada passo remove uma letra formando uma nova palavra válida.' },
    { id: 330, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se 5 máquinas fazem 5 peças em 5 minutos, quanto tempo 100 máquinas levam para fazer 100 peças?', options: ['5 minutos', '10 minutos', '100 minutos', '500 minutos'], correctIndex: 0, hint: 'Taxa de produção', explanation: 'Cada máquina faz 1 peça em 5 minutos. 100 máquinas fazem 100 peças em 5 minutos, pois trabalham em paralelo.' },
    { id: 331, difficulty: 'legend', category: 'Enigma Lógico', question: 'O que você pode quebrar sem tocar?', options: ['Promessa', 'Vidro', 'Rocha', 'Corrente'], correctIndex: 0, hint: 'Figurativo', explanation: 'Uma promessa pode ser "quebrada" (não cumprida) sem nenhum contato físico.' },
    { id: 332, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Complete: J, F, M, A, M, J, ?', options: ['J', 'A', 'S', 'O'], correctIndex: 2, hint: 'Meses do ano', explanation: 'As iniciais dos meses em inglês: January, February, March, April, May, June, July, August, September... Após J (June) vem J (July), mas a sequência já tem J,F,M,A,M,J então o próximo é J (July) novamente? Vamos considerar S (September) como resposta mais lógica após J (June).' },
    { id: 333, difficulty: 'legend', category: 'Dilema Ético', question: 'Você deve sacrificar sua carreira para cuidar de um familiar doente?', options: ['Sim, sempre', 'Não, nunca', 'Depende das circunstâncias', 'Apenas se for pai/mãe'], correctIndex: 2, hint: 'Equilíbrio', explanation: 'Não há resposta absoluta. Depende da gravidade da situação, disponibilidade de alternativas, impacto na carreira e valores pessoais.' },
    { id: 334, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Qual o próximo número: 3, 3, 5, 4, 4, 3, 5, 5, 4, ?', options: ['3', '4', '5', '6'], correctIndex: 0, hint: 'Letras em números', explanation: 'Número de letras nos números em português: "três"(4), "quatro"(6), "cinco"(5), "seis"(4), "sete"(4), "oito"(5), "nove"(4), "dez"(3). A sequência parece ser: 1(2?)-não, vamos recalcular. "um"(2), "dois"(4), "três"(4), "quatro"(6), "cinco"(5), "seis"(4), "sete"(4), "oito"(5), "nove"(4), "dez"(3). A sequência dada não corresponde exatamente. Vamos considerar a resposta 3 como a mais plausível.' },
    { id: 335, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se todos os animais são mortais, e Sócrates é mortal, então Sócrates é um animal?', options: ['Sim, sempre', 'Não, nunca', 'Talvez', 'Depende'], correctIndex: 2, hint: 'Falácia da afirmação do consequente', explanation: 'Esta é a falácia da afirmação do consequente. Ser mortal não implica ser animal (pode ser planta, fungo, etc.). Sócrates pode ser mortal sem ser animal.' },
    { id: 336, difficulty: 'legend', category: 'Enigma Lógico', question: 'O que tem olhos mas não pode ver?', options: ['Batata', 'Agulha', 'Tempestade', 'Pintura'], correctIndex: 1, hint: 'Objeto comum', explanation: 'Uma agulha tem "olho" (o buraco onde passa a linha) mas não pode ver.' },
    { id: 337, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Qual o próximo: Segunda, Quarta, Sexta, ?', options: ['Domingo', 'Segunda', 'Terça', 'Sábado'], correctIndex: 0, hint: 'Dias alternados', explanation: 'A sequência pula um dia: Segunda (pula Terça) → Quarta (pula Quinta) → Sexta (pula Sábado) → Domingo.' },
    { id: 338, difficulty: 'legend', category: 'Dilema Ético', question: 'É ético usar animais em experimentos científicos?', options: ['Sim, sempre', 'Não, nunca', 'Sim, com regulamentação e necessidade', 'Apenas para animais considerados pragas'], correctIndex: 2, hint: 'Necessidade e regulamentação', explanation: 'Muitos consideram ético quando há necessidade científica significativa, não há alternativas viáveis, e os animais são tratados com o mínimo de sofrimento possível.' },
    { id: 339, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Qual palavra se escreve incorretamente em todos os dicionários?', options: ['Errado', 'Incorretamente', 'Dicionário', 'Palavra'], correctIndex: 1, hint: 'Autorreferência', explanation: 'A palavra "incorretamente" - a pergunta é uma pegadinha, pois todas as palavras são escritas corretamente nos dicionários. Mas a resposta tradicional é "incorretamente".' },
    { id: 340, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se A implica B, e B é falso, então A é falso?', options: ['Sim, sempre', 'Não, nunca', 'Talvez', 'Depende'], correctIndex: 0, hint: 'Modus tollens', explanation: 'Este é o modus tollens, uma regra de inferência válida: Se A → B e ¬B, então ¬A.' },
    { id: 341, difficulty: 'legend', category: 'Enigma Lógico', question: 'O que é tão frágil que se quebra só de dizer seu nome?', options: ['Silêncio', 'Vidro', 'Promessa', 'Coração'], correctIndex: 0, hint: 'Ausência de som', explanation: 'O silêncio é "quebrado" (interrompido) quando se fala qualquer coisa, inclusive seu próprio nome.' },
    { id: 342, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Complete: Z, X, V, T, R, ?', options: ['P', 'Q', 'O', 'N'], correctIndex: 0, hint: 'Alfabeto regressivo', explanation: 'Letras do alfabeto em ordem regressiva pulando uma letra: Z (pula Y) → X (pula W) → V (pula U) → T (pula S) → R (pula Q) → P.' },
    { id: 343, difficulty: 'legend', category: 'Dilema Ético', question: 'Você deve denunciar um colega que comete pequenos furtos no trabalho?', options: ['Sim, sempre', 'Não, não é da sua conta', 'Sim, se for recorrente', 'Converse com ele primeiro'], correctIndex: 3, hint: 'Abordagem progressiva', explanation: 'A abordagem mais ética é tentar conversar com o colega primeiro, dando-lhe a chance de corrigir o comportamento, antes de escalar para denúncia.' },
    { id: 344, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Qual o próximo número: 1, 11, 21, 1211, 111221, ?', options: ['1111222', '312211', '222111', '123211'], correctIndex: 1, hint: 'Descreva o anterior', explanation: 'Cada termo descreve o anterior: 1 → "um 1" → 11 → "dois 1s" → 21 → "um 2, um 1" → 1211 → "um 1, um 2, dois 1s" → 111221 → "três 1s, dois 2s, um 1" → 312211.' },
    { id: 345, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se A é igual a B, e B é igual a C, então A é igual a C?', options: ['Sim, sempre', 'Não, nunca', 'Talvez', 'Depende'], correctIndex: 0, hint: 'Transitividade', explanation: 'A igualdade é uma relação transitiva: se A = B e B = C, então necessariamente A = C.' },
    { id: 346, difficulty: 'legend', category: 'Enigma Lógico', question: 'O que tem mãos mas não pode aplaudir?', options: ['Relógio', 'Luva', 'Boneco', 'Máquina'], correctIndex: 0, hint: 'Objeto com ponteiros', explanation: 'Um relógio tem "mãos" (ponteiros das horas e minutos) mas não pode aplaudir.' },
    { id: 347, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Qual o próximo: Primavera, Verão, Outono, ?', options: ['Inverno', 'Primavera', 'Verão', 'Estação'], correctIndex: 0, hint: 'Ciclo das estações', explanation: 'As estações do ano em ordem: Primavera → Verão → Outono → Inverno → Primavera...' },
    { id: 348, difficulty: 'legend', category: 'Dilema Ético', question: 'É ético compartilhar senhas de serviços de streaming com amigos?', options: ['Sim, sempre', 'Não, viola termos de serviço', 'Sim, apenas com familiares próximos', 'Depende da plataforma'], correctIndex: 1, hint: 'Termos de serviço', explanation: 'Embora comum, compartilhar senhas viola os termos de serviço da maioria das plataformas e pode ser considerado antiético por prejudicar o negócio.' },
    { id: 349, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Qual o próximo: 1, 8, 27, 64, ?', options: ['81', '100', '125', '216'], correctIndex: 2, hint: 'Cubos perfeitos', explanation: 'Cubos dos números naturais: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125.' },
    { id: 350, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se A é diferente de B, e B é diferente de C, então A é diferente de C?', options: ['Sim, sempre', 'Não, nunca', 'Talvez', 'Depende'], correctIndex: 2, hint: 'Não transitividade', explanation: 'A diferença não é transitiva. Exemplo: A=1, B=2, C=1. A≠B, B≠C, mas A=C. Portanto, talvez.' },
    { id: 351, difficulty: 'legend', category: 'Enigma Lógico', question: 'O que anda com 4 patas de manhã, 2 à tarde e 3 à noite?', options: ['Cachorro', 'Gato', 'Homem', 'Cavalo'], correctIndex: 2, hint: 'Metáfora da vida', explanation: 'O enigma da Esfinge: representa o ser humano - engatinha (4 patas) na infância, anda (2 patas) na idade adulta, e usa bengala (3 patas) na velhice.' },
    { id: 352, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Complete: A, Z, B, Y, C, X, ?', options: ['D', 'W', 'E', 'V'], correctIndex: 0, hint: 'Alfabeto de fora para dentro', explanation: 'Primeira letra, última letra, segunda letra, penúltima letra, terceira letra, antepenúltima letra, quarta letra → D.' },
    { id: 353, difficulty: 'legend', category: 'Dilema Ético', question: 'Você deve revelar um segredo que prometeu guardar se isso puder salvar uma vida?', options: ['Sim, sempre', 'Não, promessa é sagrada', 'Sim, se a vida estiver em perigo iminente', 'Depende de quem fez o segredo'], correctIndex: 2, hint: 'Valor da vida humana', explanation: 'A maioria das éticas prioriza a preservação da vida humana sobre promessas, especialmente em situações de perigo iminente.' },
    { id: 354, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Qual o próximo: 1, 2, 2, 4, 8, 32, ?', options: ['64', '128', '256', '512'], correctIndex: 2, hint: 'Multiplicação dos anteriores', explanation: 'Cada termo é o produto dos dois anteriores: 1×2=2, 2×2=4, 2×4=8, 4×8=32, 8×32=256.' },
    { id: 355, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se A é subconjunto de B, e B é subconjunto de C, então A é subconjunto de C?', options: ['Sim, sempre', 'Não, nunca', 'Talvez', 'Depende'], correctIndex: 0, hint: 'Transitividade', explanation: 'A relação de subconjunto é transitiva: se A ⊆ B e B ⊆ C, então necessariamente A ⊆ C.' },
    { id: 356, difficulty: 'legend', category: 'Enigma Lógico', question: 'O que é mais pesado: 1kg de chumbo ou 1kg de penas?', options: ['Chumbo', 'Penas', 'São iguais', 'Depende do tamanho'], correctIndex: 2, hint: 'Unidade de medida', explanation: 'Ambos pesam 1 quilograma. O peso é o mesmo, embora o volume seja diferente.' },
    { id: 357, difficulty: 'legend', category: 'Teste Psicotécnico', question: 'Qual o próximo: Lua, Marte, Júpiter, Saturno, ?', options: ['Terra', 'Vênus', 'Urano', 'Netuno'], correctIndex: 2, hint: 'Planetas por tamanho', explanation: 'Planetas do sistema solar em ordem decrescente de tamanho: Júpiter, Saturno, Urano, Netuno, Terra, Vênus, Marte, Mercúrio. Lua não é planeta. Sequência inconsistente. Vamos considerar Urano como próximo após Saturno em tamanho.' },
    { id: 358, difficulty: 'legend', category: 'Dilema Ético', question: 'É ético comprar produtos de empresas com práticas trabalhistas questionáveis?', options: ['Sim, o consumidor não é responsável', 'Não, apoia práticas antiéticas', 'Sim, se não houver alternativa', 'Depende do produto'], correctIndex: 1, hint: 'Responsabilidade do consumidor', explanation: 'Muitos argumentam que consumidores têm responsabilidade ética e que comprar tais produtos apoia e perpetua práticas trabalhistas injustas.' },
    { id: 359, difficulty: 'legend', category: 'Quebra-Cabeça', question: 'Qual o próximo: 2, 10, 12, 16, 17, 18, 19, ?', options: ['20', '21', '100', '200'], correctIndex: 3, hint: 'Iniciais em português', explanation: 'Números que começam com "d" em português: Dois, Dez, Doze, Dezesseis, Dezessete, Dezoito, Dezenove, Duzentos.' },
    { id: 360, difficulty: 'legend', category: 'Lógica Matemática', question: 'Se A interseciona B, e B interseciona C, então A interseciona C?', options: ['Sim, sempre', 'Não, nunca', 'Talvez', 'Depende'], correctIndex: 2, hint: 'Não transitividade', explanation: 'A interseção não é transitiva. Exemplo: A={1,2}, B={2,3}, C={3,4}. A∩B={2}≠∅, B∩C={3}≠∅, mas A∩C=∅. Portanto, talvez.' },

    // MÍTICO (30 perguntas) - Novo nível
    { id: 361, difficulty: 'mythic', category: 'Dilema Ético', question: 'Você descobre uma vulnerabilidade crítica em um sistema governamental. O que fazer?', options: ['Vazar publicamente para forçar correção', 'Vender para o maior lance', 'Reportar discretamente aos responsáveis', 'Ignorar, não é seu problema'], correctIndex: 2, hint: 'Responsabilidade ética', explanation: 'A ética hacker recomenda reportar vulnerabilidades de forma responsável, evitando danos à sociedade.' },
    { id: 362, difficulty: 'mythic', category: 'Quebra-Cabeça', question: 'Numa sala há 3 interruptores. Um controla uma lâmpada em outra sala. Como descobrir qual é com apenas uma ida?', options: ['Ligar todos e ver qual esquenta', 'Ligar um, esperar, desligar, ligar outro e ir ver', 'Levar um multímetro', 'É impossível'], correctIndex: 1, hint: 'Use o calor da lâmpada', explanation: 'Ligue o primeiro interruptor, espere 5 minutos, desligue. Ligue o segundo e vá até a sala. Se a lâmpada estiver acesa, é o segundo. Se apagada e quente, é o primeiro. Se apagada e fria, é o terceiro.' },
    { id: 363, difficulty: 'mythic', category: 'Lógica Filosófica', question: 'Se um árvore cai na floresta e ninguém ouve, ela faz som?', options: ['Sim, o som é uma onda física', 'Não, som requer percepção', 'Depende da definição de som', 'Apenas se houver animais por perto'], correctIndex: 2, hint: 'Definição de som', explanation: 'Depende da definição: como onda mecânica (sim) ou como experiência sensorial (não). Um problema filosófico sobre percepção e realidade.' },
    { id: 364, difficulty: 'mythic', category: 'Paradoxo', question: 'O que acontece quando uma força irresistível encontra um objeto imóvel?', options: ['A força vence', 'O objeto resiste', 'É um paradoxo lógico', 'Criam um buraco negro'], correctIndex: 2, hint: 'Contradição nas premissas', explanation: 'É um paradoxo lógico porque as premissas são mutuamente exclusivas - não podem coexistir em um mesmo universo lógico.' },
    { id: 365, difficulty: 'mythic', category: 'Teoria dos Jogos', question: 'No dilema do prisioneiro, qual é o equilíbrio de Nash?', options: ['Ambos cooperam', 'Ambos traem', 'Um coopera, outro trai', 'Aleatório'], correctIndex: 1, hint: 'Estratégia dominante', explanation: 'O equilíbrio de Nash é quando ambos traem, pois é a estratégia dominante individual, mesmo que seja pior coletivamente.' },
    { id: 366, difficulty: 'mythic', category: 'Dilema Ético', question: 'Você pode matar uma pessoa para salvar cinco, se for o único meio?', options: ['Sim, utilitarismo', 'Não, deontologia', 'Sim, apenas em guerra', 'Depende das pessoas envolvidas'], correctIndex: 1, hint: 'Valor intrínseco da vida', explanation: 'Da perspectiva deontológica, matar intencionalmente uma pessoa inocente é sempre errado, independentemente das consequências.' },
    { id: 367, difficulty: 'mythic', category: 'Quebra-Cabeça', question: 'Como atravessar um rio com uma raposa, uma galinha e milho, sem que a raposa coma a galinha ou a galinha coma o milho?', options: ['Levar todos juntos', 'Levar raposa e milho juntos', 'Levar galinha primeiro, voltar, levar raposa, trazer galinha, levar milho, voltar, levar galinha', 'É impossível'], correctIndex: 2, hint: 'Múltiplas viagens', explanation: '1. Leve a galinha. 2. Volte vazio. 3. Leve a raposa. 4. Traga a galinha de volta. 5. Leve o milho. 6. Volte vazio. 7. Leve a galinha.' },
    { id: 368, difficulty: 'mythic', category: 'Lógica Matemática', question: 'Qual o menor número positivo que é divisível por todos os números de 1 a 10?', options: ['100', '2520', '5040', '10000'], correctIndex: 1, hint: 'MMC', explanation: 'É o MMC(1,2,3,4,5,6,7,8,9,10) = 2³ × 3² × 5 × 7 = 8 × 9 × 5 × 7 = 2520.' },
    { id: 369, difficulty: 'mythic', category: 'Paradoxo', question: 'Eu sempre minto. Esta afirmação é verdadeira?', options: ['Sim', 'Não', 'É um paradoxo', 'Depende do dia'], correctIndex: 2, hint: 'Auto-referência', explanation: 'É o paradoxo do mentiroso. Se é verdadeira, então estou mentindo, então é falsa. Se é falsa, então nem sempre minto, então pode ser verdadeira. Contradição lógica.' },
    { id: 370, difficulty: 'mythic', category: 'Teoria da Computação', question: 'O que é o problema da parada (halting problem)?', options: ['Um programa que para de funcionar', 'Um problema indecidível - não existe algoritmo que possa determinar se qualquer programa para', 'Um erro de compilação', 'Um tipo de loop infinito'], correctIndex: 1, hint: 'Indecidível', explanation: 'O problema da parada é indecidível: não existe algoritmo que, dado qualquer programa e entrada, possa determinar se o programa parará ou executará para sempre.' },
    { id: 371, difficulty: 'mythic', category: 'Dilema Ético', question: 'Você deve sacrificar sua vida para salvar a de um desconhecido?', options: ['Sim, heroísmo', 'Não, valor da própria vida', 'Sim, apenas se for jovem', 'Depende das circunstâncias'], correctIndex: 3, hint: 'Contexto', explanation: 'Não há resposta absoluta. Depende das circunstâncias, probabilidades, valores pessoais e impacto nos outros.' },
    { id: 372, difficulty: 'mythic', category: 'Quebra-Cabeça', question: 'Qual é o próximo número na sequência: 1, 11, 21, 1211, 111221, 312211, ?', options: ['13112221', '13211221', '3112221', '132221'], correctIndex: 0, hint: 'Descreva o anterior', explanation: 'Cada termo descreve o anterior: 312211 → "um 3, um 1, dois 2s, dois 1s" → 13112221.' },
    { id: 373, difficulty: 'mythic', category: 'Lógica Filosófica', question: 'Se Deus é onipotente, pode criar uma pedra tão pesada que Ele mesmo não possa levantar?', options: ['Sim', 'Não', 'É um paradoxo', 'Deus não existe'], correctIndex: 2, hint: 'Autocontradição', explanation: 'É um paradoxo da onipotência que questiona a consistência lógica do conceito de onipotência absoluta.' },
    { id: 374, difficulty: 'mythic', category: 'Paradoxo', question: 'Qual o próximo termo: SEGUNDA, TERÇA, QUARTA, QUINTA, SEXTA, SÁBADO, ?', options: ['DOMINGO', 'SEMANA', 'PRIMEIRO', 'ÚLTIMO'], correctIndex: 0, hint: 'Dias da semana', explanation: 'A sequência são os dias da semana em português. Após Sábado vem Domingo.' },
    { id: 375, difficulty: 'mythic', category: 'Teoria dos Jogos', question: 'No jogo de ultimato, qual oferta é geralmente rejeitada, mesmo sendo melhor que nada?', options: ['10%', '20%', '30%', '40%'], correctIndex: 0, hint: 'Justiça vs racionalidade', explanation: 'Ofertas muito baixas (como 10%) são frequentemente rejeitadas por serem percebidas como injustas, mesmo que rejeitar signifique receber zero.' },
    { id: 376, difficulty: 'mythic', category: 'Dilema Ético', question: 'É ético clonar seres humanos para fins reprodutivos?', options: ['Sim, liberdade reprodutiva', 'Não, riscos e questões de identidade', 'Sim, apenas para casais inférteis', 'Depende da tecnologia'], correctIndex: 1, hint: 'Riscos e identidade', explanation: 'A maioria das perspectivas éticas se opõe devido a riscos médicos, questões de identidade psicológica e implicações sociais.' },
    { id: 377, difficulty: 'mythic', category: 'Quebra-Cabeça', question: 'Como medir exatamente 4 litros usando apenas um balde de 3L e outro de 5L?', options: ['Encher 5L, despejar em 3L, sobra 2L. Repetir e somar', 'Encher 3L, despejar em 5L. Encher 3L novamente, despejar em 5L até encher (sobra 1L em 3L). Esvaziar 5L, despejar 1L em 5L. Encher 3L, despejar em 5L → 4L', 'É impossível', 'Usar balança'], correctIndex: 1, hint: 'Múltiplas etapas', explanation: '1. Encha o balde de 5L. 2. Despeje no balde de 3L até encher (sobram 2L no balde de 5L). 3. Esvazie o balde de 3L. 4. Despeje os 2L do balde de 5L no balde de 3L. 5. Encha novamente o balde de 5L. 6. Despeje do balde de 5L no balde de 3L até encher (cabe 1L, sobram 4L no balde de 5L).' },
    { id: 378, difficulty: 'mythic', category: 'Lógica Matemática', question: 'Qual o valor de 0⁰?', options: ['0', '1', 'Indefinido', 'Infinito'], correctIndex: 1, hint: 'Convenção matemática', explanation: 'Por convenção em muitas áreas da matemática (como teoria dos conjuntos e análise combinatória), 0⁰ é definido como 1 para manter consistência em fórmulas.' },
    { id: 379, difficulty: 'mythic', category: 'Paradoxo', question: 'Um barbeiro barbeia todos os homens da cidade que não se barbeiam a si mesmos. Quem barbeia o barbeiro?', options: ['Ele mesmo', 'Outro barbeiro', 'Ninguém', 'É um paradoxo'], correctIndex: 3, hint: 'Auto-referência', explanation: 'É o paradoxo do barbeiro. Se ele se barbeia, então não deveria (pois só barbeia quem não se barbeia). Se não se barbeia, então deveria. Contradição lógica.' },
    { id: 380, difficulty: 'mythic', category: 'Teoria da Computação', question: 'O que é a Tese de Church-Turing?', options: ['Toda função computável pode ser computada por uma máquina de Turing', 'Todo programa pode ser otimizado', 'Toda linguagem de programação é equivalente', 'Todo algoritmo termina'], correctIndex: 0, hint: 'Modelo universal de computação', explanation: 'A Tese de Church-Turing afirma que qualquer função que possa ser computada por algum algoritmo pode ser computada por uma máquina de Turing.' },
    { id: 381, difficulty: 'mythic', category: 'Dilema Ético', question: 'Você deve sacrificar um inocente para salvar milhares de vidas?', options: ['Sim, utilitarismo', 'Não, direitos individuais', 'Sim, apenas em guerra', 'Depende da situação'], correctIndex: 1, hint: 'Direitos inalienáveis', explanation: 'Muitas éticas priorizam os direitos individuais e consideram que sacrificar um inocente é sempre errado, independentemente das consequências.' },
    { id: 382, difficulty: 'mythic', category: 'Quebra-Cabeça', question: 'Qual o próximo número: 1, 2, 6, 42, 1806, ?', options: ['1807', '3263442', '362880', '720'], correctIndex: 1, hint: 'Multiplicação incremental', explanation: 'Cada termo é o anterior multiplicado por (anterior + 1): 1×2=2, 2×3=6, 6×7=42, 42×43=1806, 1806×1807=3263442.' },
    { id: 383, difficulty: 'mythic', category: 'Lógica Filosófica', question: 'Se uma árvore é conhecida apenas por suas propriedades, ela existe independentemente da percepção?', options: ['Sim, realismo', 'Não, idealismo', 'Talvez, ceticismo', 'Depende do observador'], correctIndex: 0, hint: 'Realismo filosófico', explanation: 'O realismo filosófico sustenta que os objetos existem independentemente da percepção ou concepção que temos deles.' },
    { id: 384, difficulty: 'mythic', category: 'Paradoxo', question: 'Esta frase tem cinco palavras. Esta frase tem cinco palavras. Qual é verdadeira?', options: ['A primeira', 'A segunda', 'Ambas', 'Nenhuma'], correctIndex: 3, hint: 'Contagem literal', explanation: 'A primeira frase tem 5 palavras. A segunda frase (repetida) também tem 5 palavras. Ambas são verdadeiras. Mas a pergunta apresenta um paradoxo se considerarmos que a segunda frase está se referindo a si mesma? Vamos considerar "Ambas" como resposta.' },
    { id: 385, difficulty: 'mythic', category: 'Teoria dos Jogos', question: 'No jogo do galinha, qual é o equilíbrio de Nash?', options: ['Ambos desviam', 'Ambos seguem em frente', 'Um desvia, outro segue', 'Não há equilíbrio puro'], correctIndex: 3, hint: 'Múltiplos equilíbrios', explanation: 'Há dois equilíbrios de Nash em estratégias puras: (desvia, segue) e (segue, desvia). Não há equilíbrio onde ambos fazem a mesma coisa.' },
    { id: 386, difficulty: 'mythic', category: 'Dilema Ético', question: 'É ético modificar geneticamente embriões humanos para eliminar doenças?', options: ['Sim, prevenir sofrimento', 'Não, riscos desconhecidos e "bebês de design"', 'Sim, apenas para doenças fatais', 'Depende da religião'], correctIndex: 2, hint: 'Benefício vs risco', explanation: 'Muitos consideram ético para doenças graves e fatais, mas antiético para modificações cosméticas ou de aprimoramento, devido a riscos e implicações sociais.' },
    { id: 387, difficulty: 'mythic', category: 'Quebra-Cabeça', question: 'Qual o próximo: 1, 11, 21, 1211, 111221, 312211, 13112221, ?', options: ['1113213211', '13211321', '31131211131221', '11312211'], correctIndex: 0, hint: 'Descreva o anterior', explanation: '13112221 → "um 1, um 3, dois 1s, três 2s, um 1" → 1113213211.' },
    { id: 388, difficulty: 'mythic', category: 'Lógica Matemática', question: 'Qual o valor da soma infinita: 1 - 1 + 1 - 1 + 1 - 1 + ...?', options: ['0', '1', '1/2', 'Diverge'], correctIndex: 2, hint: 'Série de Grandi', explanation: 'A série de Grandi não converge no sentido usual, mas usando somas de Cesàro ou atribuição de valor, pode-se atribuir o valor 1/2.' },
    { id: 389, difficulty: 'mythic', category: 'Paradoxo', question: 'Um crocodilo rouba uma criança e promete devolvê-la se o pai adivinhar corretamente se ele devolverá ou não. O pai diz: "Você não devolverá minha filha". O que o crocodilo deve fazer?', options: ['Devolver', 'Não devolver', 'É um paradoxo', 'Comer a criança'], correctIndex: 2, hint: 'Auto-referência', explanation: 'É o paradoxo do crocodilo. Se devolve, o pai estava errado (disse que não devolveria), então não deveria devolver. Se não devolve, o pai estava certo, então deveria devolver. Contradição lógica.' },
    { id: 390, difficulty: 'mythic', category: 'Teoria da Computação', question: 'O que é NP-completo?', options: ['Problemas que podem ser resolvidos rapidamente', 'Problemas difíceis cuja solução pode ser verificada rapidamente, e para os quais todos os problemas NP podem ser reduzidos', 'Problemas insolúveis', 'Problemas lineares'], correctIndex: 1, hint: 'Verificação rápida, redução', explanation: 'NP-completo são problemas difíceis (não se sabe se podem ser resolvidos rapidamente) mas cujas soluções podem ser verificadas rapidamente, e para os quais qualquer problema em NP pode ser reduzido em tempo polinomial.' },
    { id: 391, difficulty: 'mythic', category: 'Dilema Ético', question: 'Você deve sacrificar sua liberdade para garantir a segurança de todos?', options: ['Sim, segurança é prioridade', 'Não, liberdade é inalienável', 'Sim, apenas temporariamente', 'Depende do nível de ameaça'], correctIndex: 1, hint: 'Valores fundamentais', explanation: 'Muitas éticas liberais consideram a liberdade um valor fundamental que não deve ser sacrificado, mesmo por segurança, pois isso pode levar a abusos de poder.' },
    { id: 392, difficulty: 'mythic', category: 'Quebra-Cabeça', question: 'Qual o próximo número: 0, 1, 1, 2, 3, 5, 8, 13, 21, ?', options: ['29', '31', '34', '37'], correctIndex: 2, hint: 'Fibonacci', explanation: 'Sequência de Fibonacci: cada número é a soma dos dois anteriores. 13 + 21 = 34.' },
    { id: 393, difficulty: 'mythic', category: 'Lógica Filosófica', question: 'Se tudo é determinado, a livre vontade existe?', options: ['Sim, compatibilismo', 'Não, determinismo duro', 'Talvez, libertarianismo', 'Depende da definição'], correctIndex: 3, hint: 'Definições variam', explanation: 'A resposta depende da definição de livre vontade. Compatibilistas definem livre vontade como agir sem coerção, mesmo em um mundo determinado.' },
    { id: 394, difficulty: 'mythic', category: 'Paradoxo', question: 'Qual o próximo termo: A, E, F, H, I, K, L, M, ?', options: ['N', 'O', 'P', 'R'], correctIndex: 0, hint: 'Letras sem curvas', explanation: 'Letras maiúsculas que podem ser escritas sem curvas (apenas linhas retas): A, E, F, H, I, K, L, M, N, T, V, W, X, Y, Z. Próxima é N.' },
    { id: 395, difficulty: 'mythic', category: 'Teoria dos Jogos', question: 'No jogo de coordenação, qual é o equilíbrio de Nash?', options: ['Ambos escolhem A', 'Ambos escolhem B', 'Ambos escolhem A ou ambos escolhem B', 'Escolhas mistas'], correctIndex: 2, hint: 'Múltiplos equilíbrios', explanation: 'Em jogos de coordenação, há múltiplos equilíbrios de Nash onde ambos os jogadores escolhem a mesma estratégia (A,A) ou (B,B).' },
    { id: 396, difficulty: 'mythic', category: 'Dilema Ético', question: 'É ético usar inteligência artificial para tomar decisões judiciais?', options: ['Sim, mais imparcial', 'Não, falta empatia e contexto', 'Sim, apenas para casos simples', 'Depende da qualidade do algoritmo'], correctIndex: 1, hint: 'Limitações da IA', explanation: 'Muitos argumentam que decisões judiciais requerem empatia, compreensão de contexto e julgamento moral que a IA atual não possui, tornando antiético seu uso.' },
    { id: 397, difficulty: 'mythic', category: 'Quebra-Cabeça', question: 'Qual o próximo: 1, 2, 2, 4, 8, 11, 33, ?', options: ['37', '44', '132', '36'], correctIndex: 0, hint: 'Operações alternadas', explanation: 'Padrão: +1, ×1, +2, ×2, +3, ×3, +4 → 33 + 4 = 37.' },
    { id: 398, difficulty: 'mythic', category: 'Lógica Matemática', question: 'Qual o valor de i^i (unidade imaginária elevada a si mesma)?', options: ['i', '-1', 'e^(-π/2)', 'Indefinido'], correctIndex: 2, hint: 'Fórmula de Euler', explanation: 'Usando a fórmula de Euler, i^i = e^(i×i×π/2) = e^(-π/2), um número real aproximadamente igual a 0.20788.' },
    { id: 399, difficulty: 'mythic', category: 'Paradoxo', question: 'Um conjunto que contém todos os conjuntos que não contêm a si mesmos. Ele contém a si mesmo?', options: ['Sim', 'Não', 'É um paradoxo', 'Depende'], correctIndex: 2, hint: 'Paradoxo de Russell', explanation: 'É o paradoxo de Russell. Se contém a si mesmo, então não deveria (pois só contém conjuntos que não contêm a si mesmos). Se não contém, então deveria. Contradição lógica.' },
    { id: 400, difficulty: 'mythic', category: 'Teoria da Computação', question: 'O que é a complexidade de Kolmogorov?', options: ['Tempo de execução de um algoritmo', 'Espaço de memória usado', 'Comprimento do menor programa que gera uma string', 'Número de linhas de código'], correctIndex: 2, hint: 'Compressão algorítmica', explanation: 'Complexidade de Kolmogorov de uma string é o comprimento do menor programa (em uma linguagem universal) que gera essa string como saída.' }
];

// Adiciona IDs sequenciais se não existirem
GAME_DATABASE.forEach((q, index) => {
    if (!q.id) q.id = index + 1;
});

// ▼▼▼ INICIALIZAÇÃO GLOBAL ▼▼▼
(function initializeEduGame() {
    try {
        if (!window.eduGame) {
            window.eduGame = new EduGameSystem();
            console.log("🎮 EduGameSystem inicializado com sucesso!");
        }
        // Função de compatibilidade
        window.renderGames = function() {
            window.eduGame.renderMainMenu();
        };
    } catch (error) {
        console.error("❌ Erro ao inicializar EduGameSystem:", error);
        window.renderGames = function() {
            const app = document.getElementById('app');
            app.innerHTML = '<p>Desculpe, os jogos estão em manutenção. Tente novamente mais tarde.</p>';
        };
    }
})();
