// ┌─────────────────────────────────────────────────────────────────────┐
// │                          CONFIGURAÇÃO DO QUIZ                       │
// └─────────────────────────────────────────────────────────────────────┘
const QUIZ_CONFIG = {
    questionsToAsk: 10,
    categoryValues: {
        "Básico Financeiro": 100,
        "Orçamento Pessoal": 150,
        "Poupança": 200,
        "Cartões e Crédito": 250,
        "Contas Bancárias": 300,
        "Transferências": 350,
        "Juros Simples": 400,
        "Juros Compostos": 500,
        "Inflação": 600,
        "Investimentos Básicos": 700,
        "Fundos de Investimento": 800,
        "Ações e Bolsa": 1000,
        "Risco e Diversificação": 1500,
        "Impostos": 2000,
        "Seguros": 2500,
        "Planejamento Financeiro": 5000,
        "Economia Angolana": 10000,
        "Banco Nacional de Angola": 50000,
        "Mercados Globais": 100000,
        "Mestre das Finanças": 1000000
    }
};

// Estado global do quiz
let QUIZ_STATE = {
    questions: [],
    currentIndex: 0,
    score: 0,
    selectedQuestions: []
};

// ┌─────────────────────────────────────────────────────────────────────┐
// │                      CARREGAMENTO DE PERGUNTAS                      │
// └─────────────────────────────────────────────────────────────────────┘
async function loadQuizQuestions() {
    try {
        console.log("🔍 Tentando carregar perguntas.json...");
        const response = await fetch('perguntas.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const rawData = await response.json();
        const validQuestions = (Array.isArray(rawData) ? rawData : []).filter(q =>
            q?.question &&
            Array.isArray(q.options) &&
            q.options.length >= 2 &&
            typeof q.correct === 'number' &&
            q.correct >= 0 && q.correct < q.options.length &&
            q.category &&
            typeof q.category === 'string'
        );

        if (validQuestions.length > 0) {
            console.log(`✅ perguntas.json carregado com sucesso! Total: ${validQuestions.length} perguntas.`);
            return validQuestions;
        } else {
            throw new Error("Nenhuma pergunta válida no JSON");
        }
    } catch (error) {
        console.warn("⚠️ Usando banco de perguntas embutido (fallback).");
        return generateEmbeddedQuestions();
    }
}

// ┌─────────────────────────────────────────────────────────────────────┐
// │                  BANCO DE 400+ PERGUNTAS EMBUTIDAS                  │
// └─────────────────────────────────────────────────────────────────────┘
function generateEmbeddedQuestions() {
    const questions = [];

    // Categoria 1: Básico Financeiro (100 Kz)
    [
        { q: "O que é um orçamento?", o: ["Um tipo de investimento", "Um plano de gastos", "Um cartão de crédito", "Um imposto"], c: 1 },
        { q: "Qual é o principal objetivo de poupar dinheiro?", o: ["Gastar mais", "Ter segurança financeira", "Impressionar amigos", "Comprar roupas"], c: 1 },
        { q: "O que significa 'renda'?", o: ["Dinheiro que você deve", "Dinheiro que você ganha", "Dinheiro que você perde", "Dinheiro emprestado"], c: 1 },
        { q: "O que é despesa?", o: ["Dinheiro que você recebe", "Dinheiro que você gasta", "Dinheiro que você investe", "Dinheiro que você esconde"], c: 1 },
        { q: "Qual é a melhor forma de controlar seus gastos?", o: ["Ignorar as contas", "Usar planilha ou app", "Pedir dinheiro emprestado", "Gastar tudo no final do mês"], c: 1 },
        { q: "O que é patrimônio?", o: ["Tudo que você deve", "Tudo que você possui", "Seu salário mensal", "Seu cartão de crédito"], c: 1 },
        { q: "Qual é a diferença entre ativo e passivo?", o: ["Ativo gera dívida, passivo gera renda", "Ativo gera renda, passivo gera dívida", "São a mesma coisa", "Nenhuma das anteriores"], c: 1 },
        { q: "O que é fluxo de caixa?", o: ["Dinheiro entrando e saindo", "Saldo no banco", "Investimentos", "Empréstimos"], c: 1 },
        { q: "Por que é importante ter metas financeiras?", o: ["Para gastar mais", "Para direcionar suas ações", "Para impressionar o chefe", "Para comprar mais roupas"], c: 1 },
        { q: "O que é capital de giro?", o: ["Dinheiro para emergências", "Dinheiro para operações diárias", "Dinheiro emprestado", "Dinheiro perdido"], c: 1 },
        { q: "O que é liquidez?", o: ["Capacidade de transformar ativo em dinheiro", "Capacidade de contrair dívidas", "Capacidade de investir", "Capacidade de poupar"], c: 0 },
        { q: "O que é endividamento?", o: ["Ter muitos investimentos", "Ter muitas dívidas", "Ter muito dinheiro", "Ter muitos amigos"], c: 1 },
        { q: "Qual é a primeira regra das finanças pessoais?", o: ["Gastar mais que ganha", "Gastar menos que ganha", "Nunca poupar", "Sempre pedir empréstimo"], c: 1 },
        { q: "O que é margem de lucro?", o: ["Diferença entre custo e venda", "Total de vendas", "Total de despesas", "Total de impostos"], c: 0 },
        { q: "O que é ponto de equilíbrio?", o: ["Quando lucro = prejuízo", "Quando receita = despesa", "Quando investimento = retorno", "Quando dívida = patrimônio"], c: 1 },
        { q: "O que é ROI?", o: ["Retorno sobre investimento", "Risco de operação", "Receita operacional", "Reserva obrigatória"], c: 0 },
        { q: "O que é custo de oportunidade?", o: ["O que você ganha ao escolher algo", "O que você perde ao escolher algo", "O custo de um produto", "O preço de venda"], c: 1 },
        { q: "O que é alavancagem financeira?", o: ["Usar dívida para aumentar retorno", "Usar poupança para investir", "Usar cartão para comprar", "Usar dinheiro vivo"], c: 0 },
        { q: "O que é balanço patrimonial?", o: ["Relatório de receitas e despesas", "Relatório de ativos e passivos", "Relatório de investimentos", "Relatório de dívidas"], c: 1 },
        { q: "O que é demonstrativo de resultados?", o: ["Mostra lucro ou prejuízo", "Mostra patrimônio", "Mostra dívidas", "Mostra investimentos"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Básico Financeiro" }));

    // Categoria 2: Orçamento Pessoal (150 Kz)
    [
        { q: "Qual percentual ideal para poupança no orçamento?", o: ["5%", "10%", "20%", "50%"], c: 2 },
        { q: "O que é regra 50/30/20?", o: ["50% necessidades, 30% desejos, 20% poupança", "50% poupança, 30% necessidades, 20% desejos", "50% desejos, 30% poupança, 20% necessidades", "Nenhuma das anteriores"], c: 0 },
        { q: "Qual é a primeira despesa que deve ser paga?", o: ["Lazer", "Poupança", "Contas fixas", "Cartão de crédito"], c: 1 },
        { q: "O que é orçamento zero?", o: ["Dinheiro que sobra", "Cada Kz tem um destino", "Orçamento sem controle", "Orçamento negativo"], c: 1 },
        { q: "Como lidar com despesas imprevistas?", o: ["Ignorar", "Ter fundo de emergência", "Pedir empréstimo", "Vender ativos"], c: 1 },
        { q: "Qual ferramenta é melhor para orçamento?", o: ["Planilha Excel", "App de finanças", "Caderno de anotações", "Todas as anteriores"], c: 3 },
        { q: "Por que revisar o orçamento mensalmente?", o: ["Para gastar mais", "Para ajustar às mudanças", "Para ignorar dívidas", "Para impressionar amigos"], c: 1 },
        { q: "O que é envelope de gastos?", o: ["Dinheiro em envelopes por categoria", "Cartão de crédito", "Conta bancária", "Investimento"], c: 0 },
        { q: "Qual é o maior erro em orçamento?", o: ["Não ter um", "Ter muitas categorias", "Ser muito rígido", "Ser muito flexível"], c: 0 },
        { q: "Como lidar com gastos emocionais?", o: ["Comprar mais", "Identificar gatilhos", "Ignorar", "Pedir ajuda"], c: 1 },
        { q: "O que é custo fixo?", o: ["Muda todo mês", "É sempre o mesmo", "Só existe em empresas", "Não existe"], c: 1 },
        { q: "O que é custo variável?", o: ["Muda conforme uso", "É sempre o mesmo", "Só existe em casa", "Não existe"], c: 0 },
        { q: "Qual é a melhor forma de reduzir gastos?", o: ["Cortar tudo", "Analisar e cortar o supérfluo", "Pedir desconto", "Ignorar"], c: 1 },
        { q: "O que é superávit?", o: ["Gastos > Receitas", "Receitas > Gastos", "Receitas = Gastos", "Nenhuma das anteriores"], c: 1 },
        { q: "O que é déficit?", o: ["Gastos > Receitas", "Receitas > Gastos", "Receitas = Gastos", "Nenhuma das anteriores"], c: 0 },
        { q: "Como calcular seu orçamento ideal?", o: ["Receita - Despesas = Meta", "Despesas - Receita = Meta", "Receita + Despesas = Meta", "Nenhuma das anteriores"], c: 0 },
        { q: "Qual é o impacto de pequenos gastos diários?", o: ["Nenhum", "Acumulam e viram grandes", "Só afetam ricos", "Só afetam pobres"], c: 1 },
        { q: "Por que incluir lazer no orçamento?", o: ["Para se sentir culpado", "Para evitar gastos impulsivos", "Para gastar mais", "Para impressionar"], c: 1 },
        { q: "O que é meta SMART?", o: ["Específica, Mensurável, Atingível, Relevante, Temporal", "Simples, Moderna, Atraente, Rápida, Temporária", "Segura, Moderada, Acessível, Rígida, Tradicional", "Nenhuma das anteriores"], c: 0 },
        { q: "Qual é o primeiro passo para sair do vermelho?", o: ["Fazer mais dívidas", "Parar de fazer novas dívidas", "Pedir aumento", "Mudar de emprego"], c: 1 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Orçamento Pessoal" }));

    // Categoria 3: Poupança (200 Kz)
    [
        { q: "Qual é o objetivo do fundo de emergência?", o: ["Investir em ações", "Cobrir imprevistos", "Comprar carro", "Fazer viagem"], c: 1 },
        { q: "Quanto ter no fundo de emergência?", o: ["1 salário", "3-6 salários", "10 salários", "20 salários"], c: 1 },
        { q: "Onde guardar fundo de emergência?", o: ["Ações", "Poupança ou CDB DI", "Criptomoedas", "Tesouro Direto"], c: 1 },
        { q: "Qual é o erro mais comum na poupança?", o: ["Poupar demais", "Não começar", "Poupar pouco", "Poupar no lugar errado"], c: 1 },
        { q: "Como automação ajuda a poupar?", o: ["Dificulta", "Facilita e garante disciplina", "Aumenta gastos", "Reduz renda"], c: 1 },
        { q: "O que é poupança automática?", o: ["Transferência programada", "Depósito manual", "Cartão de crédito", "Empréstimo"], c: 0 },
        { q: "Qual percentual ideal para poupar?", o: ["1%", "5%", "10%", "20%"], c: 3 },
        { q: "Poupança é investimento?", o: ["Sim, sempre", "Não, é reserva", "Só se for muito dinheiro", "Depende do banco"], c: 1 },
        { q: "Qual é o risco de não poupar?", o: ["Nenhum", "Ficar vulnerável a imprevistos", "Ganhar mais dinheiro", "Ter mais lazer"], c: 1 },
        { q: "Como motivar-se a poupar?", o: ["Visualizar metas", "Ignorar objetivos", "Gastar mais", "Pedir empréstimo"], c: 0 },
        { q: "O que é juros sobre juros?", o: ["Juros simples", "Juros compostos", "Juros fixos", "Juros variáveis"], c: 1 },
        { q: "Qual é o poder dos juros compostos?", o: ["Reduzir dívidas", "Multiplicar riqueza", "Aumentar gastos", "Reduzir renda"], c: 1 },
        { q: "Qual é o melhor momento para começar a poupar?", o: ["Amanhã", "Mês que vem", "Quando tiver mais dinheiro", "Hoje"], c: 3 },
        { q: "Como lidar com imprevistos sem fundo?", o: ["Ignorar", "Usar cartão ou empréstimo", "Vender ativos", "Pedir ajuda"], c: 1 },
        { q: "Qual é o impacto da inflação na poupança?", o: ["Aumenta poder de compra", "Reduz poder de compra", "Não afeta", "Dobra o valor"], c: 1 },
        { q: "O que é CDI?", o: ["Certificado de Depósito Interbancário", "Certificado de Depósito Internacional", "Certificado de Depósito Individual", "Certificado de Depósito Inflacionário"], c: 0 },
        { q: "O que é Selic?", o: ["Taxa básica de juros", "Imposto sobre renda", "Taxa de câmbio", "Taxa de inflação"], c: 0 },
        { q: "Qual é a relação entre CDI e poupança?", o: ["CDI sempre menor", "CDI sempre maior", "Variável", "Não existe"], c: 1 },
        { q: "O que é liquidez diária?", o: ["Resgate em 30 dias", "Resgate imediato", "Resgate em 1 ano", "Sem resgate"], c: 1 },
        { q: "Qual é o erro de deixar dinheiro na conta corrente?", o: ["Perder juros", "Ganhar juros", "Aumentar segurança", "Reduzir gastos"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Poupança" }));

    // Categoria 4: Cartões e Crédito (250 Kz)
    [
        { q: "Qual é o principal risco do cartão de crédito?", o: ["Ter limite alto", "Parcelar compras", "Não pagar o valor total", "Usar em compras online"], c: 2 },
        { q: "O que é rotativo do cartão?", o: ["Parcelamento sem juros", "Dívida com juros altíssimos", "Cashback", "Programa de milhas"], c: 1 },
        { q: "Qual é a melhor forma de usar cartão de crédito?", o: ["Comprar o que quiser", "Usar como controle de gastos e pagar integral", "Parcelar tudo", "Usar para emergências"], c: 1 },
        { q: "O que é anuidade?", o: ["Taxa anual do cartão", "Juros mensais", "Tarifa de saque", "Imposto sobre compras"], c: 0 },
        { q: "Como evitar juros no cartão?", o: ["Pagar só o mínimo", "Pagar o valor total", "Parcelar compras", "Não usar o cartão"], c: 1 },
        { q: "O que é score de crédito?", o: ["Nota baseada no histórico de pagamentos", "Saldo em conta", "Renda mensal", "Patrimônio"], c: 0 },
        { q: "Como melhorar seu score?", o: ["Pagar contas em dia", "Fazer muitas dívidas", "Não usar cartão", "Pedir muitos empréstimos"], c: 0 },
        { q: "O que é cashback?", o: ["Desconto na compra", "Devolução de parte do valor gasto", "Parcelamento sem juros", "Milhas aéreas"], c: 1 },
        { q: "Qual é o perigo de ter vários cartões?", o: ["Aumentar score", "Perder controle dos gastos", "Ganhar mais cashback", "Ter mais benefícios"], c: 1 },
        { q: "O que fazer ao perder o cartão?", o: ["Esperar aparecer", "Bloquear imediatamente", "Continuar usando", "Pedir outro igual"], c: 1 },
        { q: "O que é limite de crédito?", o: ["Valor máximo para saque", "Valor máximo para compras", "Valor do saldo", "Valor do empréstimo"], c: 1 },
        { q: "Como aumentar seu limite?", o: ["Pedir aumento", "Usar bem e pagar em dia", "Fazer dívidas", "Não usar o cartão"], c: 1 },
        { q: "O que é fatura do cartão?", o: ["Extrato bancário", "Resumo das compras do mês", "Contrato do cartão", "Extrato de investimentos"], c: 1 },
        { q: "Quando vence a fatura?", o: ["Todo dia 1", "Data fixa definida pelo banco", "Quando quiser pagar", "No final do mês"], c: 1 },
        { q: "O que é parcelamento sem juros?", o: ["Promoção da loja", "Cobrança de juros escondidos", "Isenção total de juros", "Desconto na compra"], c: 2 },
        { q: "Qual é o IOF no cartão?", o: ["Imposto sobre compras nacionais", "Imposto sobre compras internacionais", "Taxa de manutenção", "Juros do rotativo"], c: 1 },
        { q: "O que é proteção de preço?", o: ["Seguro contra roubo", "Devolução da diferença se preço cair", "Desconto na compra", "Cashback dobrado"], c: 1 },
        { q: "O que é programa de fidelidade?", o: ["Acumular pontos para trocar por benefícios", "Parcelamento sem juros", "Isenção de anuidade", "Aumento de limite"], c: 0 },
        { q: "Como escolher o melhor cartão?", o: ["Pelo design", "Pelos benefícios e custos", "Pela bandeira", "Pelo banco"], c: 1 },
        { q: "O que é cartão pré-pago?", o: ["Cartão com limite de crédito", "Cartão que usa saldo carregado", "Cartão de débito", "Cartão empresarial"], c: 1 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Cartões e Crédito" }));

    // Categoria 5: Contas Bancárias (300 Kz)
    [
        { q: "Qual é a diferença entre conta corrente e poupança?", o: ["Corrente rende mais, poupança não", "Poupança rende, corrente é para movimentação", "São iguais", "Corrente é só para empresas"], c: 1 },
        { q: "O que é TED?", o: ["Transferência entre bancos, até 25 mil", "Transferência entre bancos, acima de 25 mil", "Transferência no mesmo banco", "Saque em dinheiro"], c: 1 },
        { q: "O que é DOC?", o: ["Transferência entre bancos, processada no dia útil seguinte", "Transferência instantânea", "Saque em caixa eletrônico", "Depósito em envelope"], c: 0 },
        { q: "O que é PIX?", o: ["Sistema de transferência instantânea 24/7", "Cartão de crédito virtual", "Tipo de investimento", "Seguro bancário"], c: 0 },
        { q: "Qual é o limite do PIX?", o: ["Não tem limite", "Definido pelo banco e usuário", "Sempre 1.000 Kz", "Sempre 1.000.000 Kz"], c: 1 },
        { q: "O que é tarifa de manutenção?", o: ["Cobrança mensal por manter a conta", "Juros sobre saldo", "Taxa por transferência", "Imposto sobre renda"], c: 0 },
        { q: "Como evitar tarifas?", o: ["Fazer mais transações", "Manter saldo mínimo ou usar pacote", "Fechar a conta", "Usar só dinheiro vivo"], c: 1 },
        { q: "O que é extrato?", o: ["Lista de transações da conta", "Contrato bancário", "Saldo de investimentos", "Extrato de cartão"], c: 0 },
        { q: "O que é saldo disponível?", o: ["Dinheiro que pode ser usado", "Dinheiro bloqueado", "Dinheiro em investimentos", "Dinheiro em cartão"], c: 0 },
        { q: "O que é saldo total?", o: ["Disponível + bloqueado + investimentos", "Só o disponível", "Só o bloqueado", "Só os investimentos"], c: 0 },
        { q: "O que é cheque especial?", o: ["Empréstimo automático com juros altos", "Cheque pré-datado", "Cartão de crédito", "Poupança automática"], c: 0 },
        { q: "Qual é o risco do cheque especial?", o: ["Juros baixos", "Juros altíssimos", "Não tem risco", "Desconto no salário"], c: 1 },
        { q: "O que é conta digital?", o: ["Conta só pelo app, sem tarifas", "Conta só para empresas", "Conta conjunta", "Conta em dólar"], c: 0 },
        { q: "O que é biometria bancária?", o: ["Senha numérica", "Reconhecimento por digital ou face", "Assinatura digital", "Token físico"], c: 1 },
        { q: "O que é token?", o: ["Dispositivo ou app que gera senhas", "Cartão de débito", "Cheque", "Extrato"], c: 0 },
        { q: "O que é internet banking?", o: ["Acesso à conta pela internet", "Transferência internacional", "Investimento automático", "Seguro de vida"], c: 0 },
        { q: "O que é mobile banking?", o: ["Acesso à conta pelo celular", "Caixa eletrônico", "Agência física", "Cartão de crédito"], c: 0 },
        { q: "Como proteger sua conta online?", o: ["Usar senha fraca", "Não compartilhar dados e usar 2FA", "Salvar senha no navegador", "Usar Wi-Fi público"], c: 1 },
        { q: "O que é chargeback?", o: ["Estorno de compra contestada", "Depósito automático", "Transferência reversa", "Saque bloqueado"], c: 0 },
        { q: "O que é portabilidade de conta?", o: ["Mudar de banco mantendo dados", "Fechar conta", "Abrir conta conjunta", "Mudar de agência"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Contas Bancárias" }));

    // Categoria 6: Transferências (350 Kz)
    [
        { q: "Qual é a vantagem do PIX?", o: ["É lento", "É instantâneo e gratuito", "Só funciona em bancos grandes", "Tem taxa alta"], c: 1 },
        { q: "O que é chave PIX?", o: ["Senha de 6 dígitos", "CPF, email, telefone ou chave aleatória", "Número da conta", "Agência bancária"], c: 1 },
        { q: "Quantas chaves PIX pode ter?", o: ["1", "5", "10", "Ilimitadas"], c: 1 },
        { q: "O que é horário de funcionamento do PIX?", o: ["Só em dias úteis", "24 horas por dia, 7 dias por semana", "Só das 8h às 18h", "Só aos sábados"], c: 1 },
        { q: "Qual é o limite do PIX para pessoas físicas?", o: ["Sempre 1.000 Kz", "Definido pelo banco e usuário", "Sempre 1.000.000 Kz", "Não existe"], c: 1 },
        { q: "O que é comprovante de transferência?", o: ["Print da tela", "Documento com dados da transação", "Email do banco", "SMS de confirmação"], c: 1 },
        { q: "Como cancelar uma transferência?", o: ["Sempre pode cancelar", "Só se não for processada", "Nunca pode cancelar", "Só em agência"], c: 1 },
        { q: "O que fazer se transferir para a pessoa errada?", o: ["Ignorar", "Tentar contato e pedir devolução", "Processar judicialmente", "Reclamar no banco"], c: 1 },
        { q: "O que é TED agendado?", o: ["Transferência para outro banco em data futura", "Transferência instantânea", "PIX agendado", "DOC com prioridade"], c: 0 },
        { q: "Qual é o prazo do DOC?", o: ["Instantâneo", "Até 1 dia útil", "Até 3 dias úteis", "Até 5 dias úteis"], c: 1 },
        { q: "O que é transferência entre contas do mesmo banco?", o: ["TED", "DOC", "PIX", "Transferência interna"], c: 3 },
        { q: "Qual é mais barato: TED, DOC ou PIX?", o: ["TED", "DOC", "PIX", "Todos iguais"], c: 2 },
        { q: "O que é comprovante de pagamento?", o: ["Recibo da transação", "Contrato", "Extrato", "Fatura"], c: 0 },
        { q: "Como confirmar se a transferência foi feita?", o: ["Pelo saldo", "Pelo extrato ou comprovante", "Pelo email", "Pelo SMS"], c: 1 },
        { q: "O que é estorno de transferência?", o: ["Devolução do valor", "Confirmação da transferência", "Bloqueio da conta", "Multa por atraso"], c: 0 },
        { q: "O que é transferência internacional?", o: ["Entre contas no mesmo país", "Entre contas em países diferentes", "Entre bancos diferentes", "Entre agências"], c: 1 },
        { q: "O que é SWIFT?", o: ["Código de banco internacional", "Tipo de transferência", "Moeda estrangeira", "Taxa bancária"], c: 0 },
        { q: "O que é câmbio na transferência internacional?", o: ["Conversão de moeda", "Taxa fixa", "Desconto", "Bônus"], c: 0 },
        { q: "Qual é o imposto sobre transferência internacional?", o: ["IOF", "IRS", "IVA", "ISS"], c: 0 },
        { q: "O que é tempo de compensação?", o: ["Tempo para dinheiro sair da conta", "Tempo para dinheiro entrar na conta destino", "Tempo para aprovar transferência", "Tempo para gerar comprovante"], c: 1 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Transferências" }));

    // Categoria 7: Juros Simples (400 Kz)
    [
        { q: "Qual é a fórmula de juros simples?", o: ["J = C * i * t", "J = C * (1+i)^t", "J = C + i + t", "J = C / i * t"], c: 0 },
        { q: "O que é capital (C) nos juros?", o: ["Tempo", "Taxa", "Valor inicial", "Valor final"], c: 2 },
        { q: "O que é taxa (i) nos juros?", o: ["Valor inicial", "Percentual aplicado", "Tempo", "Valor final"], c: 1 },
        { q: "O que é tempo (t) nos juros?", o: ["Valor inicial", "Taxa", "Período de aplicação", "Valor final"], c: 2 },
        { q: "Se aplico 100.000 Kz a 5% ao mês por 3 meses, qual juro simples?", o: ["5.000 Kz", "15.000 Kz", "15.762 Kz", "10.000 Kz"], c: 1 },
        { q: "Qual é a diferença entre juros simples e compostos?", o: ["Simples calcula só sobre capital inicial", "Compostos calculam só sobre capital inicial", "São iguais", "Simples é mais caro"], c: 0 },
        { q: "Quando usar juros simples?", o: ["Empréstimos de curto prazo", "Investimentos de longo prazo", "Financiamentos imobiliários", "Aposentadoria"], c: 0 },
        { q: "O que é montante em juros simples?", o: ["Só os juros", "Capital + juros", "Só o capital", "Taxa + tempo"], c: 1 },
        { q: "Fórmula do montante em juros simples?", o: ["M = C * i * t", "M = C + J", "M = C * (1+i*t)", "M = C / (1+i*t)"], c: 2 },
        { q: "Se M = 120.000 Kz, C = 100.000 Kz, t = 4 meses, qual taxa mensal?", o: ["2%", "5%", "10%", "15%"], c: 1 },
        { q: "Se J = 20.000 Kz, C = 100.000 Kz, i = 4% am, qual tempo?", o: ["2 meses", "5 meses", "10 meses", "20 meses"], c: 1 },
        { q: "Se J = 15.000 Kz, i = 3% am, t = 5 meses, qual capital?", o: ["50.000 Kz", "100.000 Kz", "150.000 Kz", "200.000 Kz"], c: 1 },
        { q: "Qual é o juro simples de 50.000 Kz a 2% am por 6 meses?", o: ["2.000 Kz", "5.000 Kz", "6.000 Kz", "10.000 Kz"], c: 2 },
        { q: "O que é proporcionalidade em juros simples?", o: ["Juros crescem linearmente com tempo", "Juros crescem exponencialmente", "Juros diminuem com tempo", "Juros são fixos"], c: 0 },
        { q: "Qual é o juro simples anual equivalente a 1% am?", o: ["10%", "12%", "15%", "18%"], c: 1 },
        { q: "Qual é o juro simples mensal equivalente a 24% aa?", o: ["1%", "2%", "3%", "4%"], c: 1 },
        { q: "Se aplico 200.000 Kz a 1,5% am por 8 meses, qual montante?", o: ["224.000 Kz", "240.000 Kz", "250.000 Kz", "260.000 Kz"], c: 0 },
        { q: "O que é capitalização simples?", o: ["Mesmo que juros simples", "Mesmo que juros compostos", "Não existe", "Tipo de investimento"], c: 0 },
        { q: "Qual é a desvantagem dos juros simples?", o: ["Não remunera juros sobre juros", "Tem juros muito altos", "É ilegal", "Só serve para bancos"], c: 0 },
        { q: "Em que situações os juros simples são usados em Angola?", o: ["Financiamentos curtos, empréstimos pessoais", "Investimentos de longo prazo", "Aposentadoria", "Tesouro Direto"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Juros Simples" }));

    // Categoria 8: Juros Compostos (500 Kz)
    [
        { q: "Qual é a fórmula de juros compostos?", o: ["M = C * i * t", "M = C * (1+i)^t", "M = C + i + t", "M = C / i * t"], c: 1 },
        { q: "O que é 'capitalização' em juros compostos?", o: ["Adicionar juros ao capital", "Retirar juros", "Pagar juros", "Ignorar juros"], c: 0 },
        { q: "Por que juros compostos são chamados de 'milagre'?", o: ["Crescimento exponencial", "Crescimento linear", "São fáceis de calcular", "São ilegais"], c: 0 },
        { q: "Se aplico 100.000 Kz a 10% am por 3 meses, qual montante?", o: ["130.000 Kz", "133.100 Kz", "140.000 Kz", "150.000 Kz"], c: 1 },
        { q: "Qual é a diferença entre juros simples e compostos em 10% aa por 10 anos?", o: ["Simples: 100%, Compostos: 159%", "São iguais", "Simples é maior", "Compostos são menores"], c: 0 },
        { q: "O que é período de capitalização?", o: ["Tempo entre adição de juros ao capital", "Tempo total do investimento", "Taxa de juros", "Valor inicial"], c: 0 },
        { q: "Qual é mais vantajoso: juros mensais ou anuais?", o: ["Anuais", "Mensais (mais capitalizações)", "São iguais", "Depende do banco"], c: 1 },
        { q: "Se aplico 50.000 Kz a 2% am por 12 meses, qual montante?", o: ["60.000 Kz", "63.412 Kz", "65.000 Kz", "70.000 Kz"], c: 1 },
        { q: "Qual é o montante de 200.000 Kz a 1% am por 24 meses?", o: ["240.000 Kz", "253.947 Kz", "260.000 Kz", "270.000 Kz"], c: 1 },
        { q: "Como calcular tempo em juros compostos?", o: ["t = log(M/C) / log(1+i)", "t = (M-C)/(C*i)", "t = M / (C*i)", "t = C * i * M"], c: 0 },
        { q: "Como calcular taxa em juros compostos?", o: ["i = (M/C)^(1/t) - 1", "i = (M-C)/(C*t)", "i = M / (C*t)", "i = C * t * M"], c: 0 },
        { q: "Se M = 161.051 Kz, C = 100.000 Kz, t = 5 meses, qual taxa mensal?", o: ["5%", "10%", "15%", "20%"], c: 1 },
        { q: "Se M = 134.010 Kz, i = 3% am, t = 10 meses, qual capital?", o: ["100.000 Kz", "110.000 Kz", "120.000 Kz", "130.000 Kz"], c: 0 },
        { q: "Qual é o poder dos juros compostos a longo prazo?", o: ["Transforma pequenos valores em grandes fortunas", "Não tem impacto", "Só serve para ricos", "É perigoso"], c: 0 },
        { q: "O que é 'anualmente', 'mensalmente', 'diariamente' em juros?", o: ["Frequência de capitalização", "Valor do investimento", "Taxa de juros", "Tempo total"], c: 0 },
        { q: "Qual é o montante de 1.000.000 Kz a 0,5% am por 60 meses?", o: ["1.300.000 Kz", "1.348.850 Kz", "1.400.000 Kz", "1.500.000 Kz"], c: 1 },
        { q: "Por que começar a investir cedo com juros compostos?", o: ["Menos tempo = menos juros", "Mais tempo = mais capitalizações", "Não faz diferença", "Só se tiver muito dinheiro"], c: 1 },
        { q: "Qual é o erro de não reinvestir os juros?", o: ["Perder o efeito exponencial", "Ganhar mais dinheiro", "Reduzir risco", "Aumentar liquidez"], c: 0 },
        { q: "Como juros compostos afetam dívidas?", o: ["Aumentam explosivamente", "Diminuem com tempo", "Ficam constantes", "Desaparecem"], c: 0 },
        { q: "Qual é a lição de Albert Einstein sobre juros compostos?", o: ["É a oitava maravilha do mundo", "É uma fraude", "Só serve para bancos", "É ilegal"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Juros Compostos" }));

    // Categoria 9: Inflação (600 Kz)
    [
        { q: "O que é inflação?", o: ["Queda geral de preços", "Aumento geral de preços", "Aumento de salários", "Redução de impostos"], c: 1 },
        { q: "Qual é o órgão que mede inflação em Angola?", o: ["Banco Nacional de Angola", "INE - Instituto Nacional de Estatística", "Ministério das Finanças", "Bolsa de Valores"], c: 1 },
        { q: "Qual índice mede inflação em Angola?", o: ["IPC - Índice de Preços ao Consumidor", "IGP-M", "INPC", "SELIC"], c: 0 },
        { q: "Como inflação afeta seu poder de compra?", o: ["Aumenta", "Diminui", "Não afeta", "Dobra"], c: 1 },
        { q: "Qual é a meta de inflação do BNA?", o: ["0%", "5%", "10%", "15%"], c: 1 },
        { q: "O que é inflação alta?", o: ["Acima de 10% ao ano", "Acima de 50% ao ano", "Acima de 100% ao ano", "Acima de 1000% ao ano"], c: 0 },
        { q: "O que é hiperinflação?", o: ["Inflação acima de 50% ao mês", "Inflação de 1% ao ano", "Deflação", "Estagnação"], c: 0 },
        { q: "Como se proteger da inflação?", o: ["Guardar dinheiro em casa", "Investir em ativos que rendam acima da inflação", "Gastar tudo", "Pedir empréstimo"], c: 1 },
        { q: "Qual investimento protege contra inflação?", o: ["Poupança", "Tesouro IPCA+", "CDB prefixado", "Conta corrente"], c: 1 },
        { q: "O que é deflação?", o: ["Aumento de preços", "Queda de preços", "Estabilidade de preços", "Aumento de salários"], c: 1 },
        { q: "Qual é o impacto da inflação nos juros?", o: ["Juros reais = juros nominais - inflação", "Juros reais = juros nominais + inflação", "Não há relação", "Juros caem com inflação"], c: 0 },
        { q: "O que é juro real?", o: ["Juro nominal + inflação", "Juro nominal - inflação", "Juro fixo", "Juro variável"], c: 1 },
        { q: "Se rendimento é 10% e inflação 6%, qual juro real?", o: ["2%", "4%", "6%", "10%"], c: 1 },
        { q: "Por que inflação é ruim para poupadores?", o: ["Dinheiro perde valor", "Dinheiro ganha valor", "Não afeta", "Aumenta salário"], c: 0 },
        { q: "Como inflação afeta salários?", o: ["Aumenta poder de compra", "Reduz poder de compra se não reajustado", "Dobra salário", "Não afeta"], c: 1 },
        { q: "O que é indexação?", o: ["Correção automática por inflação", "Congelamento de preços", "Aumento de impostos", "Redução de salários"], c: 0 },
        { q: "Qual é o impacto da inflação na dívida?", o: ["Beneficia devedor", "Beneficia credor", "Não afeta", "Dobra a dívida"], c: 0 },
        { q: "O que é âncora cambial?", o: ["Usar moeda estrangeira para controlar inflação", "Aumentar exportações", "Reduzir importações", "Aumentar juros"], c: 0 },
        { q: "Qual política combate inflação?", o: ["Aumentar gastos públicos", "Aumentar juros e reduzir gastos", "Imprimir mais dinheiro", "Reduzir impostos"], c: 1 },
        { q: "Qual foi a inflação média em Angola na última década?", o: ["<5%", "5-10%", "10-20%", ">20%"], c: 3 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Inflação" }));

    // Categoria 10: Investimentos Básicos (700 Kz)
    [
        { q: "Qual é o primeiro passo para investir?", o: ["Escolher o investimento mais arriscado", "Definir objetivo e perfil de risco", "Copiar amigos", "Investir tudo em ações"], c: 1 },
        { q: "O que é perfil de risco?", o: ["Conservador, moderado, agressivo", "Rico, pobre, classe média", "Jovem, adulto, idoso", "Empregado, desempregado, aposentado"], c: 0 },
        { q: "O que é liquidez em investimentos?", o: ["Facilidade de transformar em dinheiro", "Rentabilidade", "Segurança", "Prazo"], c: 0 },
        { q: "O que é rentabilidade?", o: ["Retorno sobre o investimento", "Risco do investimento", "Prazo do investimento", "Liquidez"], c: 0 },
        { q: "O que é risco em investimentos?", o: ["Possibilidade de perder dinheiro", "Garantia de lucro", "Prazo fixo", "Liquidez alta"], c: 0 },
        { q: "Qual é a relação risco x retorno?", o: ["Maior risco = maior retorno esperado", "Maior risco = menor retorno", "Não há relação", "Só risco baixo tem retorno"], c: 0 },
        { q: "O que é diversificação?", o: ["Investir tudo em um lugar", "Espalhar investimentos para reduzir risco", "Copiar o banco", "Investir só em poupança"], c: 1 },
        { q: "Qual é o investimento mais seguro?", o: ["Ações", "Criptomoedas", "Tesouro Direto", "CDB de banco grande"], c: 3 },
        { q: "O que é Tesouro Direto?", o: ["Empréstimo ao governo", "Empréstimo a empresas", "Compra de imóveis", "Fundo de ações"], c: 0 },
        { q: "O que é CDB?", o: ["Certificado de Depósito Bancário", "Certificado de Depósito do Banco", "Certificado de Depósito Brasileiro", "Certificado de Depósito de Bônus"], c: 0 },
        { q: "O que é LCI/LCA?", o: ["Investimento isento de IR para pessoa física", "Investimento com alto risco", "Fundo de ações", "Criptomoeda"], c: 0 },
        { q: "O que é previdência privada?", o: ["Seguro de vida", "Investimento de longo prazo com benefícios fiscais", "Conta corrente", "Cartão de crédito"], c: 1 },
        { q: "O que é fundo de investimento?", o: ["Dinheiro aplicado em vários ativos por um gestor", "Conta poupança", "Empréstimo", "Seguro"], c: 0 },
        { q: "O que é COE?", o: ["Certificado de Operações Estruturadas", "Investimento com retorno atrelado a índices", "Conta Online Especial", "Cartão Ouro Empresarial"], c: 1 },
        { q: "O que é investimento de renda fixa?", o: ["Retorno pré-definido", "Retorno variável", "Sem risco", "Só para ricos"], c: 0 },
        { q: "O que é investimento de renda variável?", o: ["Retorno pré-definido", "Retorno incerto, atrelado a mercado", "Sem risco", "Só para pobres"], c: 1 },
        { q: "Qual é o prazo ideal para investimentos?", o: ["Sempre curto", "Depende do objetivo", "Sempre longo", "Sempre médio"], c: 1 },
        { q: "O que é come-cotas?", o: ["Antecipação do IR em fundos", "Taxa de administração", "Taxa de performance", "Taxa de custódia"], c: 0 },
        { q: "O que é taxa de administração?", o: ["Cobrada pelo gestor do fundo", "Imposto do governo", "Taxa de corretagem", "Taxa de custódia"], c: 0 },
        { q: "O que é taxa de performance?", o: ["Cobrada só se superar benchmark", "Cobrada sempre", "Isenta de IR", "Só para fundos de renda fixa"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Investimentos Básicos" }));

    // Categoria 11: Fundos de Investimento (800 Kz)
    [
        { q: "O que é um fundo de investimento?", o: ["Clube onde vários investidores juntam dinheiro", "Conta poupança", "Empréstimo bancário", "Seguro de vida"], c: 0 },
        { q: "Quem é o gestor de um fundo?", o: ["Responsável por escolher os investimentos", "Dono do banco", "Cliente", "Auditor"], c: 0 },
        { q: "O que é cota de fundo?", o: ["Unidade de participação no fundo", "Ação da empresa", "Moeda estrangeira", "Título público"], c: 0 },
        { q: "Como é calculado o valor da cota?", o: ["Patrimônio líquido / número de cotas", "Preço de mercado", "Fixado pelo banco", "Aleatório"], c: 0 },
        { q: "O que é fundo de renda fixa?", o: ["Aplica em títulos de renda fixa", "Aplica em ações", "Aplica em imóveis", "Aplica em commodities"], c: 0 },
        { q: "O que é fundo multimercado?", o: ["Aplica em vários tipos de ativos", "Só em ações", "Só em renda fixa", "Só em dólar"], c: 0 },
        { q: "O que é fundo de ações?", o: ["Aplica principalmente em ações", "Aplica em títulos públicos", "Aplica em imóveis", "Aplica em ouro"], c: 0 },
        { q: "O que é fundo imobiliário?", o: ["Aplica em imóveis ou títulos ligados a imóveis", "Aplica em ações de bancos", "Aplica em commodities", "Aplica em criptomoedas"], c: 0 },
        { q: "O que é fundo cambial?", o: ["Protege contra variação do dólar/euro", "Protege contra inflação", "Protege contra juros", "Protege contra ações"], c: 0 },
        { q: "O que é benchmark?", o: ["Índice de referência para comparar desempenho", "Taxa de administração", "Taxa de performance", "Valor da cota"], c: 0 },
        { q: "O que é taxa de administração?", o: ["Cobrada pelo gestor, geralmente ao ano", "Cobrada só se der lucro", "Isenta de IR", "Cobrada por transação"], c: 0 },
        { q: "O que é taxa de performance?", o: ["Cobrada só se superar o benchmark", "Cobrada sempre", "Isenta de IR", "Cobrada mensalmente"], c: 0 },
        { q: "O que é come-cotas?", o: ["Antecipação semestral do IR", "Taxa de saque", "Taxa de entrada", "Taxa de saída"], c: 0 },
        { q: "Qual é a tributação de fundos de renda fixa?", o: ["Regressiva de 22,5% a 15%", "Fixa de 15%", "Isenta", "20% fixo"], c: 0 },
        { q: "Qual é a tributação de fundos de ações?", o: ["15% sobre lucro", "22,5% fixo", "Isenta", "Regressiva"], c: 0 },
        { q: "O que é prazo de resgate?", o: ["Tempo para receber o dinheiro após solicitação", "Tempo mínimo de investimento", "Tempo para aplicar", "Tempo para escolher o fundo"], c: 0 },
        { q: "O que é liquidez diária?", o: ["Resgate em D+1", "Resgate em 30 dias", "Resgate em 180 dias", "Sem resgate"], c: 0 },
        { q: "O que é liquidez imediata?", o: ["Resgate no mesmo dia", "Resgate em 1 dia útil", "Resgate em 5 dias", "Resgate em 30 dias"], c: 0 },
        { q: "O que é fundo exclusivo?", o: ["Para um único investidor ou grupo fechado", "Aberto a todos", "Só para bancos", "Só para empresas"], c: 0 },
        { q: "O que é regulamentado pela CMVM em Angola?", o: ["Fundos de investimento", "Cartões de crédito", "Contas correntes", "Seguros"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Fundos de Investimento" }));

    // Categoria 12: Ações e Bolsa (1.000 Kz)
    [
        { q: "O que é uma ação?", o: ["Pedacinho de uma empresa", "Empréstimo ao governo", "Moeda estrangeira", "Título de dívida"], c: 0 },
        { q: "O que é bolsa de valores?", o: ["Local (físico ou virtual) onde se negociam ações", "Banco comercial", "Casa de câmbio", "Seguradora"], c: 0 },
        { q: "Qual é a bolsa de valores de Angola?", o: ["Bodiva - Bolsa de Dívida e Valores de Angola", "BM&F Bovespa", "NYSE", "NASDAQ"], c: 0 },
        { q: "O que é dividendo?", o: ["Parte do lucro distribuída aos acionistas", "Juros do empréstimo", "Taxa de corretagem", "Imposto sobre ações"], c: 0 },
        { q: "O que é DY (Dividend Yield)?", o: ["Dividendo por ação / preço da ação", "Lucro da empresa", "Valor de mercado", "Patrimônio líquido"], c: 0 },
        { q: "O que é valuation?", o: ["Método de precificar uma empresa", "Nome do corretor", "Tipo de ação", "Taxa de corretagem"], c: 0 },
        { q: "O que é P/L (Price to Earnings)?", o: ["Preço da ação / lucro por ação", "Patrimônio / Lucro", "Preço / Valor patrimonial", "Lucro / Prejuízo"], c: 0 },
        { q: "O que é P/VP (Price to Book Value)?", o: ["Preço da ação / valor patrimonial por ação", "Preço / Lucro", "Patrimônio / Lucro", "Lucro / Prejuízo"], c: 0 },
        { q: "O que é day trade?", o: ["Comprar e vender no mesmo dia", "Investir por anos", "Comprar e esquecer", "Vender a descoberto"], c: 0 },
        { q: "O que é swing trade?", o: ["Operações de alguns dias a semanas", "Operações de segundos", "Investimento de anos", "Apenas compra"], c: 0 },
        { q: "O que é análise fundamentalista?", o: ["Analisar demonstrações financeiras da empresa", "Analisar gráficos de preço", "Copiar outros investidores", "Jogar dados"], c: 0 },
        { q: "O que é análise técnica?", o: ["Analisar gráficos e indicadores de preço", "Analisar balanço patrimonial", "Analisar lucros", "Analisar gestores"], c: 0 },
        { q: "O que é home broker?", o: ["Plataforma online para operar na bolsa", "Casa do corretor", "Banco físico", "Seguradora"], c: 0 },
        { q: "O que é corretora?", o: ["Empresa que intermediária compra e venda de ações", "Empresa que emite ações", "Banco comercial", "Seguradora"], c: 0 },
        { q: "O que é custódia?", o: ["Guarda dos ativos pelo banco ou corretora", "Compra de ações", "Venda de ações", "Análise de empresas"], c: 0 },
        { q: "O que é emolumentos?", o: ["Taxas cobradas pela bolsa", "Taxas da corretora", "Imposto de renda", "Dividendos"], c: 0 },
        { q: "O que é taxa de corretagem?", o: ["Cobrada pela corretora por operação", "Cobrada pela bolsa", "Imposto federal", "Dividendo"], c: 0 },
        { q: "O que é IR sobre ações?", o: ["15% sobre lucros de day trade, 20% sobre swing trade", "Isento", "10% fixo", "25% fixo"], c: 0 },
        { q: "O que é venda a descoberto?", o: ["Vender ações que não se possui", "Vender ações da própria carteira", "Comprar ações", "Guardar ações"], c: 0 },
        { q: "O que é IPO?", o: ["Oferta pública inicial de ações", "Investimento privado", "Oferta de debêntures", "Oferta de fundos"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Ações e Bolsa" }));

    // Categoria 13: Risco e Diversificação (1.500 Kz)
    [
        { q: "O que é risco sistêmico?", o: ["Risco que afeta todo o mercado", "Risco de uma empresa específica", "Risco de liquidez", "Risco cambial"], c: 0 },
        { q: "O que é risco não-sistêmico?", o: ["Risco específico de uma empresa ou setor", "Risco de inflação", "Risco de juros", "Risco cambial"], c: 0 },
        { q: "Como reduzir risco não-sistêmico?", o: ["Diversificando investimentos", "Investindo tudo em uma ação", "Guardando dinheiro em casa", "Usando só poupança"], c: 0 },
        { q: "O que é correlação entre ativos?", o: ["Medida de como os preços se movem juntos", "Diferença de preços", "Média de preços", "Volatilidade"], c: 0 },
        { q: "Qual é o objetivo da diversificação?", o: ["Reduzir risco sem reduzir retorno esperado", "Aumentar risco", "Reduzir retorno", "Copiar o mercado"], c: 0 },
        { q: "O que é alocação de ativos?", o: ["Distribuição de investimentos entre classes de ativos", "Escolha de uma única ação", "Compra de moeda estrangeira", "Investimento em ouro"], c: 0 },
        { q: "O que é rebalanceamento?", o: ["Ajustar a carteira para manter alocação original", "Comprar mais do que subiu", "Vender tudo", "Mudar de corretora"], c: 0 },
        { q: "O que é risco de liquidez?", o: ["Dificuldade de vender o ativo rapidamente", "Risco de inflação", "Risco de crédito", "Risco cambial"], c: 0 },
        { q: "O que é risco de crédito?", o: ["Emissor não pagar", "Mercado cair", "Moeda desvalorizar", "Juros subirem"], c: 0 },
        { q: "O que é risco cambial?", o: ["Variação da moeda estrangeira", "Variação de juros", "Variação de inflação", "Variação de ações"], c: 0 },
        { q: "O que é risco de inflação?", o: ["Perda de poder de compra", "Perda de principal", "Perda de liquidez", "Perda de crédito"], c: 0 },
        { q: "O que é VaR (Value at Risk)?", o: ["Perda máxima esperada em certo período e confiança", "Valor total investido", "Valor de mercado", "Valor patrimonial"], c: 0 },
        { q: "O que é volatilidade?", o: ["Medida de oscilação de preços", "Média de preços", "Preço mínimo", "Preço máximo"], c: 0 },
        { q: "O que é drawdown?", o: ["Queda de valor de pico a vale", "Alta de valor", "Média móvel", "Volatilidade"], c: 0 },
        { q: "O que é hedge?", o: ["Proteção contra riscos", "Aumento de riscos", "Venda de ativos", "Compra de ativos"], c: 0 },
        { q: "O que é seguro de perdas?", o: ["Não existe em investimentos", "Garantia de lucro", "Proteção total", "Opções de venda"], c: 0 },
        { q: "Qual ativo tem maior risco?", o: ["Poupança", "CDB", "Ações", "Tesouro Direto"], c: 2 },
        { q: "Qual ativo tem menor risco?", o: ["Criptomoedas", "Ações de startups", "Tesouro Selic", "Fundos multimercado"], c: 2 },
        { q: "O que é concentração de risco?", o: ["Investir tudo em um só ativo", "Diversificar bem", "Usar hedge", "Rebalancear"], c: 0 },
        { q: "Qual é a regra básica de diversificação?", o: ["Não coloque todos os ovos na mesma cesta", "Invista tudo em ações", "Use só poupança", "Copie o vizinho"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Risco e Diversificação" }));

    // Categoria 14: Impostos (2.000 Kz)
    [
        { q: "Qual é o imposto sobre rendimentos de investimentos em Angola?", o: ["Imposto sobre o Rendimento do Trabalho", "Imposto Industrial", "Imposto sobre a Aplicação de Capitais", "IVA"], c: 2 },
        { q: "Qual é a alíquota padrão do IRT em Angola?", o: ["0%", "5%", "10%", "15%"], c: 2 },
        { q: "O que é IVA em Angola?", o: ["Imposto sobre o Valor Acrescentado", "Imposto sobre Renda", "Imposto Industrial", "Imposto de Selo"], c: 0 },
        { q: "Qual é a taxa de IVA normal em Angola?", o: ["5%", "10%", "14%", "20%"], c: 2 },
        { q: "O que é imposto de selo?", o: ["Cobrado sobre contratos, documentos e transações", "Cobrado sobre salários", "Cobrado sobre vendas", "Cobrado sobre importações"], c: 0 },
        { q: "O que é IRS em Angola?", o: ["Não existe, é IRT", "Imposto sobre Rendimento de Singulares", "Imposto sobre Renda", "Imposto sobre Serviços"], c: 0 },
        { q: "O que é IRC em Angola?", o: ["Imposto sobre o Rendimento das Pessoas Coletivas", "Imposto sobre Renda de Singulares", "Imposto sobre Serviços", "Imposto sobre Vendas"], c: 0 },
        { q: "Quem paga IRT em Angola?", o: ["Pessoas singulares com rendimentos", "Só empresas", "Só estrangeiros", "Só bancos"], c: 0 },
        { q: "Quem paga IRC em Angola?", o: ["Pessoas coletivas (empresas)", "Pessoas singulares", "Só bancos", "Só estrangeiros"], c: 0 },
        { q: "O que é retenção na fonte?", o: ["Imposto descontado diretamente na origem do pagamento", "Imposto pago depois", "Imposto anual", "Imposto municipal"], c: 0 },
        { q: "O que é declaração de rendimentos?", o: ["Documento onde se informa rendimentos e impostos", "Contrato de trabalho", "Extrato bancário", "Fatura"], c: 0 },
        { q: "O que é dedução à coleta?", o: ["Valor que reduz o imposto a pagar", "Valor que aumenta o imposto", "Taxa fixa", "Multa"], c: 0 },
        { q: "O que é crédito fiscal?", o: ["Valor que pode ser abatido do imposto devido", "Empréstimo do governo", "Doação", "Bônus"], c: 0 },
        { q: "O que é isenção fiscal?", o: ["Não pagar imposto em determinada situação", "Pagar imposto dobrado", "Adiar imposto", "Parcelar imposto"], c: 0 },
        { q: "O que é elisão fiscal?", o: ["Uso legal de brechas na lei para reduzir impostos", "Sonegação", "Fraude", "Evasão"], c: 0 },
        { q: "O que é evasão fiscal?", o: ["Ocultar rendimentos ilegalmente", "Planejamento tributário", "Isenção legal", "Crédito fiscal"], c: 0 },
        { q: "O que é sonegação fiscal?", o: ["Crime de não declarar ou ocultar rendimentos", "Planejamento tributário", "Isenção", "Dedução"], c: 0 },
        { q: "Qual é a multa por sonegação fiscal em Angola?", o: ["Até 200% do imposto devido", "Fixa de 1.000 Kz", "Não existe", "Apenas advertência"], c: 0 },
        { q: "O que é planejamento tributário?", o: ["Organizar atividades dentro da lei para pagar menos impostos", "Sonegar", "Fraudar", "Ocultar"], c: 0 },
        { q: "Quem fiscaliza impostos em Angola?", o: ["Administração Geral Tributária (AGT)", "Banco Nacional de Angola", "Ministério da Justiça", "Polícia Nacional"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Impostos" }));

    // Categoria 15: Seguros (2.500 Kz)
    [
        { q: "Qual é o princípio básico do seguro?", o: ["Mutualismo - rateio de riscos", "Lucro máximo", "Garantia de sinistro", "Investimento garantido"], c: 0 },
        { q: "O que é prêmio de seguro?", o: ["Valor pago pelo segurado", "Valor pago pela seguradora", "Valor do sinistro", "Valor do bem"], c: 0 },
        { q: "O que é sinistro?", o: ["Evento que dá direito à indenização", "Pagamento do prêmio", "Contratação do seguro", "Cancelamento"], c: 0 },
        { q: "O que é franquia?", o: ["Valor que o segurado paga antes da indenização", "Valor total da indenização", "Valor do prêmio", "Valor do bem"], c: 0 },
        { q: "O que é indenização?", o: ["Valor pago pela seguradora ao segurado", "Valor do prêmio", "Valor da franquia", "Valor do contrato"], c: 0 },
        { q: "O que é seguro de vida?", o: ["Paga ao beneficiário em caso de morte ou invalidez", "Paga sempre", "Paga só se ficar rico", "Paga só se viajar"], c: 0 },
        { q: "O que é seguro de saúde?", o: ["Cobre despesas médicas", "Cobre viagens", "Cobre carro", "Cobre casa"], c: 0 },
        { q: "O que é seguro automóvel?", o: ["Cobre danos ao carro e terceiros", "Cobre só o motorista", "Cobre só passageiros", "Cobre só roubo"], c: 0 },
        { q: "O que é cobertura de responsabilidade civil?", o: ["Paga danos causados a terceiros", "Paga danos ao segurado", "Paga multas", "Paga IPVA"], c: 0 },
        { q: "O que é seguro residencial?", o: ["Cobre danos à casa e bens", "Cobre só incêndio", "Cobre só roubo", "Cobre só alagamento"], c: 0 },
        { q: "O que é seguro de viagem?", o: ["Cobre despesas médicas e outros imprevistos no exterior", "Cobre só passagem", "Cobre só hospedagem", "Cobre só compras"], c: 0 },
        { q: "O que é carência?", o: ["Período inicial sem cobertura", "Período de pagamento", "Período de indenização", "Período de cancelamento"], c: 0 },
        { q: "O que é vigência do seguro?", o: ["Período de validade da cobertura", "Período de pagamento", "Período de carência", "Período de sinistro"], c: 0 },
        { q: "O que é averbação?", o: ["Atualização da apólice com novas informações", "Cancelamento do seguro", "Pagamento do prêmio", "Recebimento da indenização"], c: 0 },
        { q: "O que é apólice?", o: ["Contrato de seguro", "Recibo de pagamento", "Comprovante de sinistro", "Nota fiscal"], c: 0 },
        { q: "O que é corretor de seguros?", o: ["Intermediário entre segurado e seguradora", "Dono da seguradora", "Segurado", "Beneficiário"], c: 0 },
        { q: "O que é SUSEP em Angola?", o: ["Não existe, é INSEG", "Superintendência de Seguros", "Ministério das Finanças", "Banco Central"], c: 0 },
        { q: "O que é INSEG em Angola?", o: ["Instituto Nacional de Seguros", "Banco Central", "Ministério da Saúde", "Polícia de Trânsito"], c: 0 },
        { q: "Qual é o órgão regulador de seguros em Angola?", o: ["INSEG - Instituto Nacional de Seguros", "BNA", "AGT", "CMVM"], c: 0 },
        { q: "Por que contratar um seguro?", o: ["Transferir risco financeiro", "Gastar dinheiro", "Impressionar amigos", "Obter desconto"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Seguros" }));

    // Categoria 16: Planejamento Financeiro (5.000 Kz)
    [
        { q: "Qual é o primeiro passo do planejamento financeiro?", o: ["Definir objetivos claros", "Comprar ações", "Abrir conta em banco", "Fazer empréstimo"], c: 0 },
        { q: "O que é objetivo SMART?", o: ["Específico, Mensurável, Atingível, Relevante, Temporal", "Simples, Moderno, Atraente, Rápido, Temporário", "Seguro, Moderado, Acessível, Rígido, Tradicional", "Nenhuma das anteriores"], c: 0 },
        { q: "Qual é a regra 50/30/20?", o: ["50% necessidades, 30% desejos, 20% poupança/investimento", "50% poupança, 30% necessidades, 20% desejos", "50% desejos, 30% poupança, 20% necessidades", "Nenhuma das anteriores"], c: 0 },
        { q: "O que é orçamento zero?", o: ["Cada Kz tem um destino", "Dinheiro que sobra", "Orçamento sem controle", "Orçamento negativo"], c: 0 },
        { q: "Qual é a importância do fundo de emergência?", o: ["Cobrir imprevistos sem se endividar", "Investir em ações", "Comprar carro", "Fazer viagem"], c: 0 },
        { q: "Quanto ter no fundo de emergência?", o: ["1 salário", "3-6 salários", "10 salários", "20 salários"], c: 1 },
        { q: "O que é independência financeira?", o: ["Renda passiva >= despesas", "Ter muito dinheiro", "Ser milionário", "Não trabalhar"], c: 0 },
        { q: "O que é aposentadoria planejada?", o: ["Acumular patrimônio para viver sem trabalhar", "Contar só com INSS", "Trabalhar até morrer", "Viver de filhos"], c: 0 },
        { q: "O que é renda passiva?", o: ["Dinheiro que entra sem trabalho ativo", "Salário", "Hora extra", "Bônus"], c: 0 },
        { q: "O que é renda ativa?", o: ["Dinheiro recebido por trabalho", "Aluguel", "Dividendos", "Juros"], c: 0 },
        { q: "Qual é a importância de revisar o planejamento?", o: ["Ajustar às mudanças de vida", "Gastar mais", "Ignorar dívidas", "Impressionar amigos"], c: 0 },
        { q: "O que é sucessão patrimonial?", o: ["Planejar a transferência de bens após morte", "Vender todos os bens", "Doar tudo", "Esconder bens"], c: 0 },
        { q: "O que é testamento?", o: ["Documento que define herança", "Contrato de trabalho", "Extrato bancário", "Fatura"], c: 0 },
        { q: "O que é inventário?", o: ["Processo de partilha de bens após morte", "Lista de compras", "Extrato bancário", "Declaração de imposto"], c: 0 },
        { q: "O que é holding familiar?", o: ["Empresa para organizar patrimônio familiar", "Conta conjunta", "Seguro de vida", "Fundo de pensão"], c: 0 },
        { q: "O que é educação financeira?", o: ["Aprender a gerir dinheiro com sabedoria", "Curso de contabilidade", "Curso de economia", "Curso de administração"], c: 0 },
        { q: "Qual é o erro mais comum em planejamento?", o: ["Não ter um plano", "Ter plano muito detalhado", "Seguir o plano", "Revisar o plano"], c: 0 },
        { q: "Como lidar com imprevistos financeiros?", o: ["Ter fundo de emergência", "Ignorar", "Pedir empréstimo", "Vender ativos"], c: 0 },
        { q: "Qual é o impacto de metas claras?", o: ["Aumenta chances de sucesso", "Diminui motivação", "Cria estresse", "Não afeta"], c: 0 },
        { q: "Qual profissional ajuda em planejamento financeiro?", o: ["Planejador Financeiro Certificado", "Corretor de imóveis", "Advogado tributário", "Contador"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Planejamento Financeiro" }));

    // Categoria 17: Economia Angolana (10.000 Kz)
    [
        { q: "Qual é a moeda oficial de Angola?", o: ["Kwanza (Kz)", "Dólar", "Euro", "Rand"], c: 0 },
        { q: "Qual é o código ISO do Kwanza?", o: ["AOA", "KZ", "ANG", "KWZ"], c: 0 },
        { q: "Qual é o órgão emissor da moeda em Angola?", o: ["Banco Nacional de Angola", "Ministério das Finanças", "Tesouro Nacional", "Bolsa de Valores"], c: 0 },
        { q: "Qual é o principal produto de exportação de Angola?", o: ["Petróleo", "Diamantes", "Café", "Pescado"], c: 0 },
        { q: "Qual é o segundo produto de exportação de Angola?", o: ["Diamantes", "Petróleo", "Café", "Gás natural"], c: 0 },
        { q: "Qual é o principal parceiro comercial de Angola?", o: ["China", "Portugal", "EUA", "África do Sul"], c: 0 },
        { q: "Qual é o PIB de Angola (estimativa 2023)?", o: ["USD 90 bilhões", "USD 10 bilhões", "USD 500 bilhões", "USD 1 trilhão"], c: 0 },
        { q: "Qual é a taxa de inflação em Angola (2023)?", o: ["Acima de 20%", "5%", "2%", "0%"], c: 0 },
        { q: "Qual é a taxa de desemprego em Angola?", o: ["Acima de 30%", "5%", "10%", "15%"], c: 0 },
        { q: "Qual é o principal desafio da economia angolana?", o: ["Dependência do petróleo", "Falta de mão de obra", "Excesso de exportações", "Baixa inflação"], c: 0 },
        { q: "O que é diversificação econômica?", o: ["Reduzir dependência do petróleo", "Aumentar produção de petróleo", "Importar mais", "Exportar menos"], c: 0 },
        { q: "Qual é o papel do BNA na economia?", o: ["Controlar inflação e emitir moeda", "Fazer empréstimos para empresas", "Gerir contas de clientes", "Vender produtos"], c: 0 },
        { q: "O que é política monetária?", o: ["Controle da oferta de moeda e juros", "Controle de impostos", "Controle de gastos públicos", "Controle de salários"], c: 0 },
        { q: "O que é política fiscal?", o: ["Decisões sobre impostos e gastos públicos", "Decisões sobre juros", "Decisões sobre câmbio", "Decisões sobre exportações"], c: 0 },
        { q: "Qual é o orçamento de Estado?", o: ["Plano anual de receitas e despesas do governo", "Saldo do BNA", "PIB do país", "Exportações totais"], c: 0 },
        { q: "O que é dívida pública?", o: ["Dívida do governo", "Dívida das empresas", "Dívida das famílias", "Dívida dos bancos"], c: 0 },
        { q: "Qual é o órgão de estatísticas em Angola?", o: ["INE - Instituto Nacional de Estatística", "BNA", "Ministério das Finanças", "Bolsa de Valores"], c: 0 },
        { q: "O que é balança comercial?", o: ["Exportações - Importações", "PIB - Dívida", "Receitas - Despesas", "Investimentos - Poupança"], c: 0 },
        { q: "O que é déficit público?", o: ["Gastos > Receitas do governo", "Receitas > Gastos", "Exportações > Importações", "Importações > Exportações"], c: 0 },
        { q: "Qual é o potencial de crescimento de Angola?", o: ["Alto, com diversificação", "Baixo, só petróleo", "Nenhum", "Só com ajuda externa"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Economia Angolana" }));

    // Categoria 18: Banco Nacional de Angola (50.000 Kz)
    [
        { q: "Qual é a função principal do BNA?", o: ["Garantir estabilidade da moeda e sistema financeiro", "Fazer empréstimos para empresas", "Gerir contas de clientes", "Vender produtos financeiros"], c: 0 },
        { q: "Quem nomeia o Governador do BNA?", o: ["Presidente da República", "Assembleia Nacional", "Primeiro-Ministro", "Conselho de Ministros"], c: 0 },
        { q: "O que é taxa de juro de referência do BNA?", o: ["Taxa básica que influencia toda a economia", "Taxa de juros de empréstimos", "Taxa de câmbio", "Taxa de inflação"], c: 0 },
        { q: "O que é reserva obrigatória?", o: ["Percentual dos depósitos que bancos devem manter no BNA", "Reserva de ouro", "Reserva de dólares", "Reserva de petróleo"], c: 0 },
        { q: "Qual é o objetivo da reserva obrigatória?", o: ["Controlar oferta de moeda", "Aumentar lucros dos bancos", "Reduzir impostos", "Aumentar exportações"], c: 0 },
        { q: "O que é política cambial?", o: ["Gestão da taxa de câmbio", "Gestão de juros", "Gestão de impostos", "Gestão de gastos"], c: 0 },
        { q: "O que é leilão de divisas?", o: ["Mecanismo para vender dólares a bancos", "Leilão de imóveis", "Leilão de carros", "Leilão de petróleo"], c: 0 },
        { q: "O que é regulação prudencial?", o: ["Normas para garantir solidez dos bancos", "Normas para aumentar lucros", "Normas para reduzir impostos", "Normas para aumentar salários"], c: 0 },
        { q: "O que é supervisão bancária?", o: ["Fiscalização das instituições financeiras", "Fiscalização das empresas", "Fiscalização do governo", "Fiscalização dos clientes"], c: 0 },
        { q: "O que é liquidez no sistema bancário?", o: ["Capacidade dos bancos de honrar compromissos", "Lucro dos bancos", "Patrimônio dos bancos", "Número de agências"], c: 0 },
        { q: "O que é solvência bancária?", o: ["Capacidade de pagar dívidas de longo prazo", "Capacidade de abrir agências", "Capacidade de contratar", "Capacidade de vender produtos"], c: 0 },
        { q: "O que é sistema de pagamentos?", o: ["Conjunto de regras e meios para transferir dinheiro", "Sistema de empréstimos", "Sistema de seguros", "Sistema de câmbio"], c: 0 },
        { q: "Qual é o papel do BNA no sistema de pagamentos?", o: ["Operar e regular o sistema", "Só fiscalizar", "Só emitir moeda", "Só controlar inflação"], c: 0 },
        { q: "O que é lastro cambial?", o: ["Reservas internacionais que dão confiança à moeda", "Estoque de petróleo", "Estoque de diamantes", "Estoque de café"], c: 0 },
        { q: "O que é emissão de moeda?", o: ["Imprimir e colocar dinheiro em circulação", "Destruir dinheiro", "Congelar dinheiro", "Empréstimo de dinheiro"], c: 0 },
        { q: "O que é recolha de moeda?", o: ["Retirar dinheiro de circulação", "Imprimir dinheiro", "Distribuir dinheiro", "Empréstimo de dinheiro"], c: 0 },
        { q: "O que é política de juros do BNA?", o: ["Definir taxas para controlar inflação e crescimento", "Definir salários", "Definir preços", "Definir impostos"], c: 0 },
        { q: "O que é autonomia do BNA?", o: ["Liberdade para tomar decisões técnicas sem interferência política", "Submissão ao governo", "Submissão ao parlamento", "Submissão aos bancos"], c: 0 },
        { q: "Qual é o impacto de decisões do BNA na economia?", o: ["Afeta inflação, câmbio, crédito e crescimento", "Só afeta bancos", "Só afeta governo", "Não afeta"], c: 0 },
        { q: "Como o BNA combate a inflação?", o: ["Aumentando juros e reduzindo oferta de moeda", "Imprimindo mais dinheiro", "Reduzindo impostos", "Aumentando gastos"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Banco Nacional de Angola" }));

    // Categoria 19: Mercados Globais (100.000 Kz)
    [
        { q: "O que é globalização financeira?", o: ["Integração dos mercados financeiros mundiais", "Isolamento econômico", "Protecionismo", "Autarquia"], c: 0 },
        { q: "O que é dólar americano?", o: ["Moeda de reserva global", "Moeda de Angola", "Moeda da China", "Moeda da UE"], c: 0 },
        { q: "O que é euro?", o: ["Moeda oficial da zona do euro", "Moeda dos EUA", "Moeda da China", "Moeda do Japão"], c: 0 },
        { q: "O que é FMI?", o: ["Fundo Monetário Internacional", "Federação Mundial de Investimentos", "Fundo de Moedas Internacionais", "Federação de Moedas Internacionais"], c: 0 },
        { q: "O que é Banco Mundial?", o: ["Instituição que financia projetos de desenvolvimento", "Banco comercial", "Banco central global", "Corretora internacional"], c: 0 },
        { q: "O que é crise financeira global?", o: ["Colapso sistêmico que afeta vários países", "Crise local", "Crise de um banco", "Crise de uma empresa"], c: 0 },
        { q: "O que é contágio financeiro?", o: ["Crise que se espalha de um país para outros", "Crescimento econômico", "Estabilidade financeira", "Cooperação internacional"], c: 0 },
        { q: "O que é risco país?", o: ["Risco de calote ou instabilidade em um país", "Risco de uma empresa", "Risco de um banco", "Risco de um setor"], c: 0 },
        { q: "O que é rating de país?", o: ["Nota que mede risco de investir no país", "Nota de empresas", "Nota de bancos", "Nota de governos estaduais"], c: 0 },
        { q: "O que é spread de CDS?", o: ["Indicador de risco de calote de um país", "Spread bancário", "Spread cambial", "Spread de inflação"], c: 0 },
        { q: "O que é carry trade?", o: ["Tomar empréstimo em moeda de juros baixos para investir em juros altos", "Investir em ações", "Comprar imóveis", "Vender a descoberto"], c: 0 },
        { q: "O que é hedge cambial?", o: ["Proteger-se contra variação de moeda estrangeira", "Apostar na variação", "Ignorar a variação", "Aumentar exposição"], c: 0 },
        { q: "O que é commodity?", o: ["Produto primário negociado globalmente (petróleo, ouro, soja)", "Produto industrializado", "Serviço financeiro", "Ativo digital"], c: 0 },
        { q: "O que é índice global (S&P 500, Dow Jones)?", o: ["Cesta de ações que representa mercado", "Índice de inflação", "Índice de juros", "Índice cambial"], c: 0 },
        { q: "O que é ADR?", o: ["Ação de empresa estrangeira negociada nos EUA", "Ação de empresa americana", "Bônus do governo", "Fundo de investimento"], c: 0 },
        { q: "O que é BDR?", o: ["Brazilian Depositary Receipt - ação estrangeira no Brasil", "Angolan Depositary Receipt", "Bond Depositary Receipt", "Bank Depositary Receipt"], c: 0 },
        { q: "O que é investimento estrangeiro direto?", o: ["Compra de ativos produtivos no exterior", "Compra de ações", "Compra de títulos", "Empréstimo"], c: 0 },
        { q: "O que é investimento estrangeiro em carteira?", o: ["Compra de ações e títulos no exterior", "Compra de fábricas", "Compra de terras", "Compra de empresas"], c: 0 },
        { q: "O que é balança de pagamentos?", o: ["Registro de todas transações com exterior", "Balanço de um banco", "Balanço do governo", "Balanço de empresa"], c: 0 },
        { q: "O que é conta-corrente na balança de pagamentos?", o: ["Registra comércio, serviços e rendas", "Registra investimentos", "Registra empréstimos", "Registra reservas"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Mercados Globais" }));

    // Categoria 20: Mestre das Finanças (1.000.000 Kz)
    [
        { q: "Qual é a fórmula de Black-Scholes?", o: ["Para precificar opções", "Para precificar ações", "Para precificar imóveis", "Para precificar commodities"], c: 0 },
        { q: "O que é CAPM?", o: ["Capital Asset Pricing Model - relaciona risco e retorno", "Modelo de precificação de imóveis", "Modelo de gestão de risco", "Modelo de fluxo de caixa"], c: 0 },
        { q: "O que é WACC?", o: ["Custo médio ponderado de capital", "Lucro líquido", "Receita operacional", "Margem de lucro"], c: 0 },
        { q: "O que é EBITDA?", o: ["Lucro antes de juros, impostos, depreciação e amortização", "Lucro líquido", "Receita bruta", "Patrimônio líquido"], c: 0 },
        { q: "O que é fluxo de caixa descontado?", o: ["Método de valuation baseado em fluxos futuros", "Método de precificação por múltiplos", "Método de precificação por ativos", "Método de precificação por mercado"], c: 0 },
        { q: "O que é alavancagem financeira?", o: ["Usar dívida para aumentar retorno sobre patrimônio", "Usar patrimônio para reduzir dívida", "Usar derivativos para hedge", "Usar opções para especulação"], c: 0 },
        { q: "O que é derivativo?", o: ["Ativo cujo valor deriva de outro ativo", "Ativo primário", "Moeda estrangeira", "Título de dívida"], c: 0 },
        { q: "O que é opção de compra (call)?", o: ["Direito de comprar ativo a preço fixo", "Obrigação de comprar", "Direito de vender", "Obrigação de vender"], c: 0 },
        { q: "O que é opção de venda (put)?", o: ["Direito de vender ativo a preço fixo", "Obrigação de vender", "Direito de comprar", "Obrigação de comprar"], c: 0 },
        { q: "O que é futuro?", o: ["Contrato para comprar/vender ativo em data futura a preço fixo", "Opção", "Ação", "Título"], c: 0 },
        { q: "O que é swap?", o: ["Troca de fluxos financeiros entre partes", "Venda de ativos", "Compra de ativos", "Empréstimo"], c: 0 },
        { q: "O que é arbitragem?", o: ["Explorar diferença de preços em mercados diferentes", "Especulação", "Hedge", "Investimento de longo prazo"], c: 0 },
        { q: "O que é market maker?", o: ["Agente que fornece liquidez comprando e vendendo", "Investidor passivo", "Gestor de fundos", "Corretor"], c: 0 },
        { q: "O que é short selling?", o: ["Vender ativos que não se possui", "Comprar ativos", "Manter ativos", "Alugar ativos"], c: 0 },
        { q: "O que é algoritmo de trading?", o: ["Programa que executa operações automaticamente", "Planilha de cálculo", "Relatório financeiro", "Contrato"], c: 0 },
        { q: "O que é high frequency trading?", o: ["Operações em milissegundos com algoritmos", "Investimento de longo prazo", "Day trade manual", "Swing trade"], c: 0 },
        { q: "O que é risco de modelo?", o: ["Erro por usar modelo matemático inadequado", "Risco de mercado", "Risco de crédito", "Risco operacional"], c: 0 },
        { q: "O que é risco operacional?", o: ["Perdas por falhas em processos, pessoas ou sistemas", "Risco de mercado", "Risco de crédito", "Risco de liquidez"], c: 0 },
        { q: "O que é Basileia III?", o: ["Acordo internacional para fortalecer bancos", "Acordo comercial", "Acordo cambial", "Acordo fiscal"], c: 0 },
        { q: "O que é Solvência II?", o: ["Regulamentação para seguradoras na UE", "Regulamentação para bancos", "Regulamentação para fundos", "Regulamentação para corretoras"], c: 0 }
    ].forEach(p => questions.push({ question: p.q, options: p.o, correct: p.c, category: "Mestre das Finanças" }));

    console.log(`✅ Banco embutido: ${questions.length} perguntas carregadas.`);
    return questions;
}

// ┌─────────────────────────────────────────────────────────────────────┐
// │                         RENDERIZAÇÃO DO JOGO                        │
// └─────────────────────────────────────────────────────────────────────┘
function renderGames() {
    const maxReward = Object.values(QUIZ_CONFIG.categoryValues).reduce((a, b) => a + b, 0);
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel">
                <h3>Jogos & Recompensas</h3>
                <p style="margin-bottom: 2rem; color: var(--text-secondary);">Teste os seus conhecimentos financeiros e ganhe Kwanzas!</p>
                <div class="quick-actions-grid">
                    <div class="action-btn" style="cursor: pointer;" onclick="startQuizGame()">
                        <i data-lucide="help-circle"></i>
                        <span>Quiz Financeiro</span>
                        <small>Ganhe até ${formatCurrency(maxReward)}</small>
                    </div>
                    <div class="action-btn" style="cursor: pointer;" onclick="startPuzzleGame()">
                        <i data-lucide="puzzle"></i>
                        <span>Enigma Financeiro</span>
                        <small>Resolva enigmas e ganhe Kwanzas</small>
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// ┌─────────────────────────────────────────────────────────────────────┐
// │                     INÍCIO DO QUIZ FINANCEIRO                       │
// └─────────────────────────────────────────────────────────────────────┘
async function startQuizGame() {
    showLoading();
    const allQuestions = await loadQuizQuestions();
    hideLoading();

    if (!allQuestions || allQuestions.length === 0) {
        showToast("Não foi possível carregar as perguntas.", "error");
        return;
    }

    // Agrupa por categoria
    const byCategory = {};
    allQuestions.forEach(q => {
        if (!byCategory[q.category]) byCategory[q.category] = [];
        byCategory[q.category].push(q);
    });

    // Seleciona 1 pergunta por categoria (até 10)
    const selectedQuestions = [];
    const categories = Object.keys(byCategory);
    
    // Embaralha categorias
    shuffleArray(categories);
    
    // Pega 1 de cada até completar 10
    for (let i = 0; i < Math.min(10, categories.length); i++) {
        const category = categories[i];
        if (byCategory[category].length > 0) {
            // Embaralha perguntas da categoria
            const shuffled = shuffleArray(byCategory[category]);
            selectedQuestions.push(shuffled[0]);
        }
    }

    // Se ainda faltar, completa com aleatórias
    while (selectedQuestions.length < 10 && allQuestions.length > 0) {
        const randomQ = allQuestions[Math.floor(Math.random() * allQuestions.length)];
        if (!selectedQuestions.includes(randomQ)) {
            selectedQuestions.push(randomQ);
        }
    }

    // Embaralha seleção final
    shuffleArray(selectedQuestions);

    QUIZ_STATE = {
        questions: allQuestions,
        currentIndex: 0,
        score: 0,
        selectedQuestions: selectedQuestions
    };

    showQuestion();
}

// ┌─────────────────────────────────────────────────────────────────────┐
// │                       EXIBIÇÃO DA PERGUNTA                          │
// └─────────────────────────────────────────────────────────────────────┘
function showQuestion() {
    if (QUIZ_STATE.currentIndex >= QUIZ_STATE.selectedQuestions.length) {
        endQuiz();
        return;
    }

    const question = QUIZ_STATE.selectedQuestions[QUIZ_STATE.currentIndex];
    const shuffled = shuffleOptions(question.options, question.correct);
    const reward = QUIZ_CONFIG.categoryValues[question.category] || 100;

    const optionsHtml = shuffled.options.map((option, index) =>
        `<button class="quiz-option" onclick="handleQuizAnswer(${index}, ${shuffled.correctIndex})">${option}</button>`
    ).join('');

    const content = `
        <div class="quiz-modal-content">
            <div class="quiz-progress">
                <span>Pergunta ${QUIZ_STATE.currentIndex + 1} de ${QUIZ_STATE.selectedQuestions.length}</span>
                <div class="quiz-score">Pontuação: ${formatCurrency(QUIZ_STATE.score)}</div>
            </div>
            <h3>${question.question}</h3>
            <div class="quiz-difficulty">Categoria: ${question.category} — Valor: ${formatCurrency(reward)}</div>
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

// ┌─────────────────────────────────────────────────────────────────────┐
// │                       RESPOSTA DO USUÁRIO                           │
// └─────────────────────────────────────────────────────────────────────┘
function handleQuizAnswer(selectedIndex, correctIndex) {
    const question = QUIZ_STATE.selectedQuestions[QUIZ_STATE.currentIndex];
    const isCorrect = selectedIndex === correctIndex;
    const reward = QUIZ_CONFIG.categoryValues[question.category] || 100;

    if (isCorrect) {
        QUIZ_STATE.score += reward;
        showToast(`✅ Correto! +${formatCurrency(reward)}`, "success");
    } else {
        showToast(`❌ Incorreto. A resposta correta era: ${question.options[question.correct]}`, "error");
    }

    QUIZ_STATE.currentIndex++;
    document.querySelector(".modal-overlay")?.remove();
    setTimeout(showQuestion, 1500);
}

// ┌─────────────────────────────────────────────────────────────────────┐
// │                      FINALIZAÇÃO DO QUIZ                            │
// └─────────────────────────────────────────────────────────────────────┘
async function endQuiz() {
    showLoading();
    const { currentUser } = window.authManager;
    const finalReward = QUIZ_STATE.score;

    if (!currentUser || !currentUser.uid) {
        hideLoading();
        showToast("Usuário não autenticado.", "error");
        return;
    }

    try {
        const userRef = window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`);

        // Busca dados atuais
        const snapshot = await window.firebase.dbFunc.get(userRef);
        if (!snapshot.exists()) {
            throw new Error("Usuário não encontrado");
        }

        // Atualiza saldo de jogos
        const userData = snapshot.val();
        const newGameBalance = (userData.gameBalance || 0) + finalReward;

        await window.firebase.dbFunc.update(userRef, {
            gameBalance: newGameBalance
        });

        // Registra transação
        const txId = generateUniqueId('tx');
        const transactionRef = window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}/transactions/${txId}`);
        
        await window.firebase.dbFunc.set(transactionRef, {
            type: 'game_win',
            amount: finalReward,
            description: 'Prêmio do Quiz Financeiro',
            timestamp: Date.now(),
            status: 'completed'
        });

        hideLoading();
        showToast(`🎉 +${formatCurrency(finalReward)} creditados no seu saldo de jogos!`, "success");

        const content = `
            <div class="quiz-result">
                <h3>Parabéns! Você completou o Quiz Financeiro</h3>
                <div class="result-score">
                    <span>Pontuação final:</span>
                    <strong>${formatCurrency(QUIZ_STATE.score)}</strong>
                </div>
                <div class="result-reward">
                    <span>Recompensa creditada:</span>
                    <strong>${formatCurrency(finalReward)}</strong>
                </div>
                <p>Seu saldo de jogos foi atualizado. Resgate na Dashboard!</p>
            </div>
        `;

        createModal(
            { text: 'Resultado do Quiz', icon: 'award' },
            content,
            [
                { text: 'Jogar Novamente', class: 'btn-secondary', icon: 'refresh-cw', onclick: 'startQuizGame(); document.querySelector(".modal-overlay").remove();' },
                { text: 'Voltar', class: 'btn-primary', icon: 'home', onclick: 'renderGames(); document.querySelector(".modal-overlay").remove();' }
            ]
        );

    } catch (error) {
        hideLoading();
        console.error("Erro ao salvar recompensa:", error);
        showToast(`Erro: ${error.message || "Falha ao creditar recompensa"}`, "error");
    }
}

// ┌─────────────────────────────────────────────────────────────────────┐
// │                      JOGO DE ENIGMA (OPCIONAL)                      │
// └─────────────────────────────────────────────────────────────────────┘
function startPuzzleGame() {
    const puzzles = [
        { title: "O Mistério do Investimento", description: "Você tem 100.000 Kz para investir. Se aplicar em um fundo que rende 10% ao ano, quanto terá após 3 anos?", options: ["121.000 Kz", "133.100 Kz", "110.000 Kz", "150.000 Kz"], correct: 1, reward: 5000 },
        { title: "O Enigma da Dívida", description: "Se você tem uma dívida de 50.000 Kz com juros de 5% ao mês, quanto pagará após 2 meses se não fizer nenhum pagamento?", options: ["52.500 Kz", "55.125 Kz", "60.000 Kz", "57.500 Kz"], correct: 1, reward: 6000 },
        { title: "O Desafio da Poupança", description: "Se você poupa 5.000 Kz por mês durante 2 anos, quanto terá no final, considerando juros de 1% ao mês?", options: ["120.000 Kz", "134.865 Kz", "115.000 Kz", "142.000 Kz"], correct: 1, reward: 7000 }
    ];

    let currentPuzzleIndex = 0;
    let totalReward = 0;

    function showPuzzle() {
        if (currentPuzzleIndex >= puzzles.length) {
            endPuzzleGame();
            return;
        }

        const puzzle = puzzles[currentPuzzleIndex];
        const shuffled = shuffleOptions(puzzle.options, puzzle.correct);

        const optionsHtml = shuffled.options.map((option, index) =>
            `<button class="quiz-option" onclick="handlePuzzleAnswer(${index}, ${shuffled.correctIndex}, ${puzzle.reward})">${option}</button>`
        ).join('');

        const content = `
            <div class="quiz-modal-content">
                <div class="quiz-progress">
                    <span>Enigma ${currentPuzzleIndex + 1} de ${puzzles.length}</span>
                    <div class="quiz-score">Recompensa: ${formatCurrency(totalReward)}</div>
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

    window.handlePuzzleAnswer = async function(selectedIndex, correctIndex, reward) {
        const isCorrect = selectedIndex === correctIndex;
        if (isCorrect) {
            totalReward += reward;
            showToast(`✅ Correto! +${formatCurrency(reward)}`, "success");
        } else {
            showToast("❌ Incorreto. Tente novamente!", "error");
        }
        currentPuzzleIndex++;
        document.querySelector(".modal-overlay")?.remove();
        setTimeout(showPuzzle, 1500);
    };

    async function endPuzzleGame() {
        showLoading();
        const { currentUser } = window.authManager;

        if (!currentUser || !currentUser.uid) {
            hideLoading();
            showToast("Usuário não autenticado.", "error");
            return;
        }

        try {
            const userRef = window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`);
            const snapshot = await window.firebase.dbFunc.get(userRef);
            if (!snapshot.exists()) throw new Error("Usuário não encontrado");

            const newGameBalance = (snapshot.val().gameBalance || 0) + totalReward;
            await window.firebase.dbFunc.update(userRef, { gameBalance: newGameBalance });

            const txId = generateUniqueId('tx');
            const transactionRef = window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}/transactions/${txId}`);
            await window.firebase.dbFunc.set(transactionRef, {
                type: 'game_win',
                amount: totalReward,
                description: 'Prêmio do Enigma Financeiro',
                timestamp: Date.now(),
                status: 'completed'
            });

            hideLoading();
            showToast(`🎉 +${formatCurrency(totalReward)} creditados!`, "success");

            const content = `
                <div class="quiz-result">
                    <h3>Parabéns! Você resolveu todos os Enigmas!</h3>
                    <div class="result-reward">
                        <span>Recompensa total:</span>
                        <strong>${formatCurrency(totalReward)}</strong>
                    </div>
                    <p>Saldo de jogos atualizado. Resgate na Dashboard!</p>
                </div>
            `;

            createModal(
                { text: 'Resultado do Enigma', icon: 'award' },
                content,
                [
                    { text: 'Jogar Novamente', class: 'btn-secondary', icon: 'refresh-cw', onclick: 'startPuzzleGame(); document.querySelector(".modal-overlay").remove();' },
                    { text: 'Voltar', class: 'btn-primary', icon: 'home', onclick: 'renderGames(); document.querySelector(".modal-overlay").remove();' }
                ]
            );

        } catch (error) {
            hideLoading();
            console.error("Erro:", error);
            showToast(`Erro: ${error.message}`, "error");
        }
    }

    showPuzzle();
}

// ┌─────────────────────────────────────────────────────────────────────┐
// │                      FUNÇÕES AUXILIARES                             │
// └─────────────────────────────────────────────────────────────────────┘
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function shuffleOptions(options, correctIndex) {
    const indices = [...Array(options.length).keys()];
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const shuffledOptions = indices.map(i => options[i]);
    const newCorrectIndex = indices.indexOf(correctIndex);
    return { options: shuffledOptions, correctIndex: newCorrectIndex };
}

function generateUniqueId(prefix) {
    const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return id.replace(/[.#$\/[\]]/g, '_');
}
