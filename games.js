const QUIZ_CONFIG = {
    questionsToAsk: 10,
    baseRewardPerCorrectAnswer: 100
};

// Carrega perguntas de um arquivo JSON externo
async function fetchQuizQuestions() {
    try {
        const response = await fetch('perguntas.json');
        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        
        // Embaralha as perguntas
        return data.sort(() => Math.random() - 0.5);
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        
        // Perguntas fallback com respostas aleatórias
        return [
            {
                question: "O que é um orçamento?",
                options: ["Um tipo de investimento", "Um plano de gastos", "Um cartão de crédito", "Um imposto"],
                correct: 1,
                difficulty: "fácil"
            },
            {
                question: "Qual é a melhor forma de começar a poupar?",
                options: ["Esperar ter muito dinheiro", "Definir metas e poupar mensalmente", "Pedir empréstimos", "Gastar tudo e depois poupar"],
                correct: 1,
                difficulty: "fácil"
            },
            {
                question: "O que significa juro composto?",
                options: ["Juros calculados apenas sobre o capital inicial", "Juros sobre juros acumulados", "Taxa fixa de juros", "Desconto em compras"],
                correct: 1,
                difficulty: "médio"
            },
            {
                question: "Por que diversificar investimentos?",
                options: ["Para aumentar o risco", "Para reduzir o risco", "Para complicar a carteira", "Para pagar mais impostos"],
                correct: 1,
                difficulty: "médio"
            },
            {
                question: "O que é uma emergência financeira?",
                options: ["Uma promoção no shopping", "Um imprevisto que exige dinheiro imediato", "Um aumento de salário", "Um feriado prolongado"],
                correct: 1,
                difficulty: "fácil"
            },
            {
                question: "Qual é o principal objetivo de um fundo de emergência?",
                options: ["Investir em ações", "Cobrir despesas inesperadas", "Comprar um carro novo", "Fazer uma viagem"],
                correct: 1,
                difficulty: "fácil"
            },
            {
                question: "O que é inflação?",
                options: ["Aumento geral dos preços", "Diminuição dos preços", "Aumento dos salários", "Redução dos impostos"],
                correct: 0,
                difficulty: "médio"
            },
            {
                question: "Qual é a vantagem de investir a longo prazo?",
                options: ["Menos risco", "Maior potencial de crescimento", "Retornos garantidos", "Liquidez imediata"],
                correct: 1,
                difficulty: "difícil"
            },
            {
                question: "O que é CDI?",
                options: ["Certificado de Depósito Interbancário", "Certificado de Depósito Internacional", "Certificado de Depósito Individual", "Certificado de Depósito Inflacionário"],
                correct: 0,
                difficulty: "difícil"
            },
            {
                question: "Qual é a principal função do Banco Central?",
                options: ["Fazer empréstimos para empresas", "Controlar a inflação e a política monetária", "Gerenciar contas de clientes", "Vender produtos financeiros"],
                correct: 1,
                difficulty: "difícil"
            }
        ];
    }
}

function renderGames() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel">
                <h3>Jogos & Recompensas</h3>
                <p style="margin-bottom: 2rem; color: var(--text-secondary);">Teste os seus conhecimentos financeiros e ganhe prémios!</p>
                <div class="quick-actions-grid">
                    <div class="action-btn" style="cursor: pointer;" onclick="startQuizGame()">
                        <i data-lucide="help-circle"></i>
                        <span>Quiz Financeiro</span>
                        <small>Ganhe até ${formatCurrency(QUIZ_CONFIG.questionsToAsk * QUIZ_CONFIG.baseRewardPerCorrectAnswer * 3)}</small>
                    </div>
                    <div class="action-btn" style="cursor: pointer;" onclick="startPuzzleGame()">
                        <i data-lucide="puzzle"></i>
                        <span>Enigma Financeiro</span>
                        <small>Resolva enigmas e ganhe recompensas</small>
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

async function startQuizGame() {
    const questions = await fetchQuizQuestions();
    if (questions.length === 0) {
        showToast("Não foi possível carregar as perguntas do quiz.", "error");
        return;
    }
    
    // Selecionar perguntas aleatórias
    const selectedQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(QUIZ_CONFIG.questionsToAsk, questions.length));
    
    let currentQuestionIndex = 0;
    let score = 0;
    
    function showQuestion() {
        if (currentQuestionIndex >= selectedQuestions.length) {
            endQuiz();
            return;
        }
        
        const question = selectedQuestions[currentQuestionIndex];
        
        // Embaralhar as opções mantendo o índice correto
        const shuffledOptions = shuffleOptions(question.options, question.correct);
        
        const optionsHtml = shuffledOptions.map((option, index) => 
            `<button class="quiz-option" onclick="selectAnswer(${index}, ${shuffledOptions.correctIndex})">${option}</button>`
        ).join('');
        
        const content = `
            <div class="quiz-modal-content">
                <div class="quiz-progress">
                    <span>Pergunta ${currentQuestionIndex + 1} de ${selectedQuestions.length}</span>
                    <div class="quiz-score">Pontuação: ${score}</div>
                </div>
                <h3>${question.question}</h3>
                <div class="quiz-difficulty">Dificuldade: ${question.difficulty}</div>
                <div class="quiz-options">
                    ${optionsHtml}
                </div>
            </div>
        `;
        
        createModal(
            { text: 'Quiz Financeiro', icon: 'help-circle' },
            content,
            []
        );
    }
    
    window.selectAnswer = function(selectedIndex, correctIndex) {
        const question = selectedQuestions[currentQuestionIndex];
        const isCorrect = selectedIndex === correctIndex;
        
        if (isCorrect) {
            // Calcular pontuação baseada na dificuldade
            let points = QUIZ_CONFIG.baseRewardPerCorrectAnswer;
            if (question.difficulty === "médio") points *= 1.5;
            if (question.difficulty === "difícil") points *= 2;
            
            // Bônus por respostas consecutivas corretas
            const bonusMultiplier = Math.min(1.5, 1 + (score / 5000));
            points = Math.round(points * bonusMultiplier);
            
            score += points;
            
            showToast(`Correto! +${formatCurrency(points)}`, "success");
        } else {
            showToast("Resposta incorreta. Tente estudar mais!", "error");
        }
        
        currentQuestionIndex++;
        document.querySelector(".modal-overlay")?.remove();
        setTimeout(showQuestion, 1500);
    };
    
    function endQuiz() {
        // Calcular recompensa final
        const finalReward = score;
        
        showLoading();
        try {
            // Atualizar saldo de jogos
            const { currentUser } = window.authManager;
            const updates = {
                gameBalance: (currentUser.gameBalance || 0) + finalReward,
                [`transactions/${generateUniqueId('tx')}`]: {
                    type: 'game_win',
                    amount: finalReward,
                    description: `Prêmio do Quiz Financeiro`,
                    timestamp: Date.now(),
                    status: 'completed'
                }
            };
            
            window.firebase.dbFunc.update(
                window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
                updates
            ).then(() => {
                const content = `
                    <div class="quiz-result">
                        <h3>Parabéns! Você completou o Quiz Financeiro</h3>
                        <div class="result-score">
                            <span>Pontuação final:</span>
                            <strong>${score} pontos</strong>
                        </div>
                        <div class="result-reward">
                            <span>Recompensa:</span>
                            <strong>${formatCurrency(finalReward)}</strong>
                        </div>
                        <p>Seu saldo de jogos foi atualizado. Você pode resgatá-lo a qualquer momento na Dashboard!</p>
                    </div>
                `;
                
                createModal(
                    { text: 'Resultado do Quiz', icon: 'award' },
                    content,
                    [
                        { text: 'Ok', class: 'btn-primary', icon: 'check', onclick: 'document.querySelector(".modal-overlay").remove(); renderGames();' }
                    ]
                );
            }).catch(error => {
                console.error("Erro ao salvar resultado do quiz:", error);
                showToast("Erro ao salvar resultado. Tente novamente.", "error");
            });
        } catch (error) {
            console.error("Erro ao salvar resultado do quiz:", error);
            showToast("Erro ao salvar resultado. Tente novamente.", "error");
        } finally {
            hideLoading();
        }
    }
    
    showQuestion();
}

// Função para embaralhar opções mantendo o índice correto
function shuffleOptions(options, correctIndex) {
    // Criar array de índices
    const indices = options.map((_, i) => i);
    
    // Embaralhar índices
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Criar novo array de opções embaralhadas
    const shuffledOptions = indices.map(i => options[i]);
    
    // Encontrar o novo índice da resposta correta
    const newCorrectIndex = indices.indexOf(correctIndex);
    
    // Adicionar propriedade com o índice correto
    shuffledOptions.correctIndex = newCorrectIndex;
    
    return shuffledOptions;
}

// Jogo de enigma
function startPuzzleGame() {
    const puzzles = [
        {
            title: "O Mistério do Investimento",
            description: "Você tem R$10.000 para investir. Se aplicar em um fundo que rende 10% ao ano, quanto terá após 3 anos?",
            options: ["R$12.100", "R$13.310", "R$11.000", "R$15.000"],
            correct: 1,
            reward: 500
        },
        {
            title: "O Enigma da Dívida",
            description: "Se você tem uma dívida de R$5.000 com juros de 5% ao mês, quanto pagará após 2 meses se não fizer nenhum pagamento?",
            options: ["R$5.250", "R$5.512,50", "R$6.000", "R$5.750"],
            correct: 1,
            reward: 600
        },
        {
            title: "O Desafio da Poupança",
            description: "Se você poupa R$500 por mês durante 2 anos, quanto terá no final, considerando juros de 1% ao mês?",
            options: ["R$12.000", "R$13.486,50", "R$11.500", "R$14.200"],
            correct: 1,
            reward: 700
        }
    ];
    
    let currentPuzzleIndex = 0;
    let totalReward = 0;
    
    function showPuzzle() {
        if (currentPuzzleIndex >= puzzles.length) {
            endPuzzleGame();
            return;
        }
        
        const puzzle = puzzles[currentPuzzleIndex];
        
        // Embaralhar as opções
        const shuffledOptions = shuffleOptions(puzzle.options, puzzle.correct);
        
        const optionsHtml = shuffledOptions.map((option, index) => 
            `<button class="quiz-option" onclick="selectPuzzleAnswer(${index}, ${shuffledOptions.correctIndex}, ${puzzle.reward})">${option}</button>`
        ).join('');
        
        const content = `
            <div class="quiz-modal-content">
                <div class="quiz-progress">
                    <span>Enigma ${currentPuzzleIndex + 1} de ${puzzles.length}</span>
                    <div class="quiz-score">Recompensa acumulada: ${formatCurrency(totalReward)}</div>
                </div>
                <h3>${puzzle.title}</h3>
                <p class="puzzle-description">${puzzle.description}</p>
                <div class="quiz-options">
                    ${optionsHtml}
                </div>
            </div>
        `;
        
        createModal(
            { text: 'Enigma Financeiro', icon: 'puzzle' },
            content,
            []
        );
    }
    
    window.selectPuzzleAnswer = function(selectedIndex, correctIndex, reward) {
        const isCorrect = selectedIndex === correctIndex;
        
        if (isCorrect) {
            totalReward += reward;
            showToast(`Correto! +${formatCurrency(reward)}`, "success");
        } else {
            showToast("Resposta incorreta. Tente novamente!", "error");
        }
        
        currentPuzzleIndex++;
        document.querySelector(".modal-overlay")?.remove();
        setTimeout(showPuzzle, 1500);
    };
    
    function endPuzzleGame() {
        showLoading();
        try {
            // Atualizar saldo de jogos
            const { currentUser } = window.authManager;
            const updates = {
                gameBalance: (currentUser.gameBalance || 0) + totalReward,
                [`transactions/${generateUniqueId('tx')}`]: {
                    type: 'game_win',
                    amount: totalReward,
                    description: `Prêmio do Enigma Financeiro`,
                    timestamp: Date.now(),
                    status: 'completed'
                }
            };
            
            window.firebase.dbFunc.update(
                window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
                updates
            ).then(() => {
                const content = `
                    <div class="quiz-result">
                        <h3>Parabéns! Você completou todos os Enigmas Financeiros</h3>
                        <div class="result-score">
                            <span>Recompensa total:</span>
                            <strong>${formatCurrency(totalReward)}</strong>
                        </div>
                        <p>Seu saldo de jogos foi atualizado. Você pode resgatá-lo a qualquer momento na Dashboard!</p>
                    </div>
                `;
                
                createModal(
                    { text: 'Resultado do Enigma', icon: 'award' },
                    content,
                    [
                        { text: 'Ok', class: 'btn-primary', icon: 'check', onclick: 'document.querySelector(".modal-overlay").remove(); renderGames();' }
                    ]
                );
            }).catch(error => {
                console.error("Erro ao salvar resultado do enigma:", error);
                showToast("Erro ao salvar resultado. Tente novamente.", "error");
            });
        } catch (error) {
            console.error("Erro ao salvar resultado do enigma:", error);
            showToast("Erro ao salvar resultado. Tente novamente.", "error");
        } finally {
            hideLoading();
        }
    }
    
    showPuzzle();
}

// Função utilitária para gerar ID único
function generateUniqueId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}