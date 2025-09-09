const STORE_PRODUCTS = [
    {
        id: 'course_html',
        name: 'Curso de HTML5 do Zero',
        price: 1999.99,
        icon: 'code',
        category: 'tecnologia',
        description: 'Aprenda a estrutura básica de páginas web com HTML5. Ideal para iniciantes.'
    },
    {
        id: 'course_css',
        name: 'Curso de CSS3 Moderno',
        price: 2499.99,
        icon: 'palette',
        category: 'tecnologia',
        description: 'Domine estilos, layouts responsivos e animações com CSS3.'
    },
    {
        id: 'course_js',
        name: 'Curso de JavaScript Essencial',
        price: 3999.99,
        icon: 'cpu',
        category: 'tecnologia',
        description: 'Aprenda lógica de programação e interatividade para a web com JS.'
    },
    {
        id: 'course_python',
        name: 'Curso de Python para Iniciantes',
        price: 4999.99,
        icon: 'terminal',
        category: 'tecnologia',
        description: 'Domine a linguagem mais amigável e poderosa para automação e dados.'
    },
    {
        id: 'course_csharp',
        name: 'Curso de C# e .NET Básico',
        price: 5999.99,
        icon: 'csharp',
        category: 'tecnologia',
        description: 'Entre no mundo da Microsoft: aprenda C# para desktop, web e jogos.'
    },
    {
        id: 'course_react',
        name: 'Curso de React.js do Zero',
        price: 6999.99,
        icon: 'layout',
        category: 'tecnologia',
        description: 'Construa interfaces modernas e dinâmicas com a biblioteca mais usada do mundo.'
    },
    {
        id: 'course_nodejs',
        name: 'Curso de Node.js para Backend',
        price: 6499.99,
        icon: 'server',
        category: 'tecnologia',
        description: 'Crie servidores e APIs usando JavaScript no backend com Node.js.'
    },
    {
        id: 'course_sql',
        name: 'Curso de SQL e Bancos de Dados',
        price: 4499.99,
        icon: 'database',
        category: 'tecnologia',
        description: 'Aprenda a manipular dados com SQL, a linguagem universal de bancos de dados.'
    },
    {
        id: 'course_git',
        name: 'Curso de Git e GitHub',
        price: 2999.99,
        icon: 'git-branch',
        category: 'tecnologia',
        description: 'Controle de versão essencial para qualquer desenvolvedor moderno.'
    },
    {
        id: 'course_figma',
        name: 'Curso de Figma para Designers',
        price: 3499.99,
        icon: 'edit',
        category: 'design',
        description: 'Crie protótipos e interfaces incríveis com a ferramenta líder de UI/UX.'
    },
    {
        id: 'course_docker',
        name: 'Curso de Docker para Devs',
        price: 5499.99,
        icon: 'box',
        category: 'tecnologia',
        description: 'Containerize suas aplicações e simplifique seu ambiente de desenvolvimento.'
    },
    {
        id: 'course_linux',
        name: 'Curso de Linux para Programadores',
        price: 3999.99,
        icon: 'terminal',
        category: 'tecnologia',
        description: 'Domine o terminal, comandos e servidores Linux — essencial para qualquer dev.'
    },
    {
        id: 'course_aws',
        name: 'Curso de AWS Básico',
        price: 7999.99,
        icon: 'cloud',
        category: 'tecnologia',
        description: 'Introdução aos serviços em nuvem da Amazon — o padrão do mercado.'
    },
    {
        id: 'course_restapi',
        name: 'Curso de APIs REST com Node.js',
        price: 5999.99,
        icon: 'globe',
        category: 'tecnologia',
        description: 'Aprenda a criar e consumir APIs REST — a espinha dorsal da web moderna.'
    },
    {
        id: 'course_typescript',
        name: 'Curso de TypeScript para Profissionais',
        price: 6999.99,
        icon: 'code',
        category: 'tecnologia',
        description: 'JavaScript com superpoderes: tipos, interfaces e escalabilidade.'
    },
    {
        id: 'course_flutter',
        name: 'Curso de Flutter para Apps',
        price: 7499.99,
        icon: 'smartphone',
        category: 'tecnologia',
        description: 'Crie apps nativos para Android e iOS com uma única base de código.'
    },
    {
        id: 'course_arduino',
        name: 'Curso de Arduino e IoT',
        price: 5999.99,
        icon: 'zap',
        category: 'tecnologia',
        description: 'Introdução à eletrônica e Internet das Coisas com projetos práticos.'
    },
    {
        id: 'course_data_science',
        name: 'Curso de Ciência de Dados com Python',
        price: 8999.99,
        icon: 'bar-chart-2',
        category: 'tecnologia',
        description: 'Aprenda análise de dados, pandas, matplotlib e fundamentos de DS.'
    },
    {
        id: 'course_machine_learning',
        name: 'Curso de Machine Learning Básico',
        price: 9999.99,
        icon: 'brain',
        category: 'tecnologia',
        description: 'Introdução prática aos algoritmos de aprendizado de máquina com Python.'
    },
    {
        id: 'course_cybersecurity',
        name: 'Curso de Segurança da Informação',
        price: 8499.99,
        icon: 'shield',
        category: 'tecnologia',
        description: 'Fundamentos de segurança, criptografia, ataques e defesas cibernéticas.'
    }
];

function renderStore() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel">
                <div class="store-header">
                    <h3>Loja Aurora</h3>
                    <p style="margin-bottom: 2rem; color: var(--text-secondary);">Use o seu saldo para adquirir produtos e serviços exclusivos.</p>
                    
                    <div class="store-controls">
                        <div class="search-box">
                            <i data-lucide="search"></i>
                            <input type="text" id="product-search" placeholder="Buscar produtos...">
                        </div>
                        <select id="product-category" class="category-filter">
                            <option value="all">Todas as categorias</option>
                            <option value="tecnologia">Tecnologia</option>
                            <option value="design">Design</option>
                        </select>
                    </div>
                </div>
                
                <div class="products-grid" id="products-grid">
                    ${STORE_PRODUCTS.map(product => renderProductCard(product)).join('')}
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
    setupProductFilters();
}

function renderMyProducts() {
    const { currentUser } = window.authManager || {};
    const app = document.getElementById('app');
    if (!app || !currentUser) return;

    const userProducts = Object.values(currentUser.products || {});

    app.innerHTML = `
        <div class="page-container">
            <div class="glass-panel">
                <h3>Meus Produtos Adquiridos</h3>
                ${userProducts.length > 0 ? `
                    <div class="transaction-list">
                    ${userProducts.map(p => {
                        const productDetails = STORE_PRODUCTS.find(sp => sp.id === p.productId);
                        return `
                            <div class="transaction-item">
                                <div class="tx-icon incoming">
                                    <i data-lucide="${productDetails?.icon || 'package'}"></i>
                                </div>
                                <div class="tx-details">
                                    <h4>${productDetails?.name || 'Produto não encontrado'}</h4>
                                    <p>Adquirido em: ${new Date(p.acquiredAt).toLocaleDateString('pt-AO')}</p>
                                    <p>${productDetails?.description || ''}</p>
                                </div>
                                <div class="tx-actions">
                                    <button class="btn btn-outline" onclick="accessProduct('${p.productId}')">
                                        <i data-lucide="play"></i> Acessar
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                    </div>
                ` : `
                    <div class="no-products" style="text-align: center; padding: 3rem 1rem;">
                        <i data-lucide="package" style="font-size: 48px; margin-bottom: 1rem; color: var(--text-secondary);"></i>
                        <h4>Você ainda não adquiriu nenhum produto.</h4>
                        <p style="margin-top: 1rem; color: var(--text-secondary);">Visite nossa loja para encontrar conteúdos que podem transformar sua carreira!</p>
                        <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="renderStore()">
                            <i data-lucide="shopping-cart"></i> Ir para a Loja
                        </button>
                    </div>
                `}
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-header">
                <i data-lucide="${product.icon}"></i>
                <span class="product-category">${capitalizeFirst(product.category)}</span>
            </div>
            <h4 class="product-title">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${formatCurrency(product.price)}</div>
            <button class="btn btn-primary" onclick="handleBuyProduct('${product.id}')">
                <i data-lucide="shopping-cart"></i> Comprar
            </button>
        </div>
    `;
}

function setupProductFilters() {
    const searchInput = document.getElementById('product-search');
    const categorySelect = document.getElementById('product-category');
    const productsGrid = document.getElementById('products-grid');
    
    if (!searchInput || !categorySelect || !productsGrid) return;

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const categoryFilter = categorySelect.value;

        const productCards = productsGrid.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productName = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const productCategory = card.dataset.category;

            const matchesSearch = !searchTerm || productName.includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || productCategory === categoryFilter;

            card.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
        });
    }

    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
}

function handleBuyProduct(productId) {
    const { currentUser } = window.authManager || {};
    if (!currentUser) {
        showToast("Você precisa estar logado para comprar produtos.", "error");
        return;
    }

    const product = STORE_PRODUCTS.find(p => p.id === productId);
    if (!product) {
        showToast("Produto não encontrado.", "error");
        return;
    }

    if (currentUser.balance < product.price) {
        showToast("Saldo insuficiente para adquirir este produto.", "error");
        return;
    }

    showLoading();
    const productIdKey = generateUniqueId('prod');
    const timestamp = Date.now();

    const updates = {
        [`products/${productIdKey}`]: {
            productId: productId,
            acquiredAt: timestamp
        },
        balance: currentUser.balance - product.price,
        [`transactions/${generateUniqueId('tx')}`]: {
            type: 'purchase',
            amount: product.price,
            description: `Compra de ${product.name}`,
            productId: productId,
            timestamp: timestamp,
            status: 'completed'
        }
    };

    window.firebase.dbFunc.update(
        window.firebase.dbFunc.ref(window.firebase.db, `users/${currentUser.uid}`),
        updates
    ).then(() => {
        showToast(`${product.name} adquirido com sucesso!`, "success");
        renderMyProducts(); // Atualiza automaticamente para mostrar o produto comprado
    }).catch(error => {
        console.error("Erro ao adquirir produto:", error);
        showToast("Erro ao adquirir produto. Tente novamente.", "error");
    }).finally(() => {
        hideLoading();
    });
}

function accessProduct(productId) {
    const product = STORE_PRODUCTS.find(p => p.id === productId);
    if (!product) {
        showToast("Produto não encontrado.", "error");
        return;
    }

    let guideContent = getFreeLearningGuide(productId);

    createModal(
        { text: `Acessar ${product.name}`, icon: product.icon },
        `
        <div class="product-access-modal" style="padding: 1.5rem; max-width: 600px;">
            <div class="access-header" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                <i data-lucide="${product.icon}" style="font-size: 2rem;"></i>
                <h3 style="margin: 0;">${product.name}</h3>
            </div>
            <div class="access-content" style="background: var(--surface); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border);">
                <h4 style="margin-top: 0; color: var(--text-primary);">🎉 Parabéns por sua aquisição!</h4>
                <p style="color: var(--text-secondary);">Você não precisa gastar mais nada. Segue seu roteiro gratuito e exclusivo:</p>
                <div style="margin: 1.5rem 0; padding: 1rem; background: var(--background); border-radius: 8px; border-left: 4px solid var(--primary);">
                    ${guideContent}
                </div>
                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem;">
                    💡 Dica Aurora: mantenha um caderno de estudos e pratique diariamente. Em 30 dias você verá resultados!
                </p>
            </div>
        </div>
        `,
        [
            {
                text: 'Fechar',
                class: 'btn-primary',
                icon: 'x',
                onclick: 'document.querySelector(".modal-overlay")?.remove();'
            }
        ]
    );

    lucide.createIcons();
}

function getFreeLearningGuide(productId) {
    const guides = {
        course_html: `
            <strong>📌 Roteiro Gratuito para Aprender HTML5:</strong>
            <ol>
                <li>📚 Comece pelo <strong>Curso Gratuito da W3Schools</strong>: <a href="https://www.w3schools.com/html/" target="_blank" style="color: var(--primary);">w3schools.com/html</a></li>
                <li>🎯 Pratique com desafios no <strong>freeCodeCamp</strong>: <a href="https://www.freecodecamp.org/learn/responsive-web-design/" target="_blank" style="color: var(--primary);">freecodecamp.org</a></li>
                <li>🧪 Crie seu primeiro site: abra o Notepad (ou VS Code) e salve como <code>index.html</code>.</li>
                <li>🚀 Projeto final: monte uma página de currículo com suas informações.</li>
            </ol>
            <p>✅ Você não precisa pagar nada. Tudo isso é 100% gratuito e de alta qualidade.</p>
        `,

        course_css: `
            <strong>📌 Roteiro Gratuito para Aprender CSS3:</strong>
            <ol>
                <li>📚 Estude o guia completo da <strong>MDN Web Docs</strong>: <a href="https://developer.mozilla.org/pt-BR/docs/Web/CSS" target="_blank" style="color: var(--primary);">MDN CSS</a></li>
                <li>🎨 Pratique layouts com <strong>CSS Grid Garden</strong>: <a href="https://cssgridgarden.com/" target="_blank" style="color: var(--primary);">cssgridgarden.com</a></li>
                <li>📱 Aprenda responsividade com media queries — teste em diferentes tamanhos de tela.</li>
                <li>🚀 Projeto final: estilize seu site HTML anterior com cores, fontes e layout moderno.</li>
            </ol>
            <p>✅ Ferramentas gratuitas: VS Code, navegador moderno e muita criatividade!</p>
        `,

        course_js: `
            <strong>📌 Roteiro Gratuito para Aprender JavaScript:</strong>
            <ol>
                <li>📚 Curso interativo da <strong>freeCodeCamp</strong>: <a href="https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" target="_blank" style="color: var(--primary);">JS Algorithms</a></li>
                <li>🧠 Entenda lógica com <strong>Codecademy (versão free)</strong>: <a href="https://www.codecademy.com/learn/introduction-to-javascript" target="_blank" style="color: var(--primary);">codecademy.com</a></li>
                <li>🛠️ Use o console do navegador (F12) para testar seus códigos em tempo real.</li>
                <li>🚀 Projeto final: crie uma calculadora ou jogo da velha simples.</li>
            </ol>
            <p>✅ Tudo online, sem instalação obrigatória, e 100% gratuito.</p>
        `,

        course_python: `
            <strong>📌 Roteiro Gratuito para Aprender Python:</strong>
            <ol>
                <li>🐍 Comece pelo tutorial oficial: <a href="https://docs.python.org/pt-br/3/tutorial/" target="_blank" style="color: var(--primary);">docs.python.org</a></li>
                <li>🎯 Curso prático da <strong>freeCodeCamp no YouTube</strong>: "Python for Beginners - Full Course"</li>
                <li>💻 Instale o Python e use o IDLE ou VS Code com extensão Python.</li>
                <li>🚀 Projeto final: crie um script que organiza seus arquivos automaticamente.</li>
            </ol>
            <p>✅ Python é open-source e gratuito para sempre. Aproveite!</p>
        `,

        course_csharp: `
            <strong>📌 Roteiro Gratuito para Aprender C#:</strong>
            <ol>
                <li>📖 Microsoft Learn: <a href="https://learn.microsoft.com/pt-br/dotnet/csharp/" target="_blank" style="color: var(--primary);">C# Guide</a></li>
                <li>🧪 Use o <strong>.NET SDK</strong> gratuito da Microsoft.</li>
                <li>💻 Escreva código no <strong>Visual Studio Community</strong> (gratuito).</li>
                <li>🚀 Projeto final: crie um sistema de cadastro simples em console.</li>
            </ol>
            <p>✅ Toda a stack .NET é open-source e gratuita para estudantes e devs.</p>
        `,

        course_react: `
            <strong>📌 Roteiro Gratuito para Aprender React:</strong>
            <ol>
                <li>⚛️ Siga a <strong>Documentação Oficial</strong>: <a href="https://pt-br.react.dev/learn" target="_blank" style="color: var(--primary);">react.dev</a></li>
                <li>🛠️ Use o <strong>CodeSandbox</strong> para praticar sem instalar nada: <a href="https://codesandbox.io/" target="_blank" style="color: var(--primary);">codesandbox.io</a></li>
                <li>📚 Faça o tutorial "Scrimba React" no YouTube.</li>
                <li>🚀 Projeto final: crie uma lista de tarefas (To-Do List) com hooks.</li>
            </ol>
            <p>✅ React é open-source. Você só precisa de um navegador e vontade de aprender!</p>
        `,

        course_nodejs: `
            <strong>📌 Roteiro Gratuito para Aprender Node.js:</strong>
            <ol>
                <li>🌐 Comece com a <strong>Documentação Oficial</strong>: <a href="https://nodejs.org/pt-br/docs/" target="_blank" style="color: var(--primary);">nodejs.org</a></li>
                <li>📚 Curso da <strong>freeCodeCamp: Back End Development</strong></li>
                <li>🧪 Instale o Node.js e use o NPM (já vem junto).</li>
                <li>🚀 Projeto final: crie uma API REST simples com Express.js.</li>
            </ol>
            <p>✅ Node.js é gratuito e open-source. Ideal para backend JavaScript.</p>
        `,

        course_sql: `
            <strong>📌 Roteiro Gratuito para Aprender SQL:</strong>
            <ol>
                <li>🗃️ Curso interativo da <strong>SQLZoo</strong>: <a href="https://sqlzoo.net/" target="_blank" style="color: var(--primary);">sqlzoo.net</a></li>
                <li>📚 Leia o guia da <strong>W3Schools SQL</strong>: <a href="https://www.w3schools.com/sql/" target="_blank" style="color: var(--primary);">w3schools.com/sql</a></li>
                <li>💻 Use o <strong>DB Browser for SQLite</strong> (gratuito) para praticar localmente.</li>
                <li>🚀 Projeto final: crie um banco para gerenciar sua coleção de filmes ou livros.</li>
            </ol>
            <p>✅ SQL é uma linguagem universal. Aprenda uma vez, use em qualquer banco!</p>
        `,

        course_git: `
            <strong>📌 Roteiro Gratuito para Aprender Git e GitHub:</strong>
            <ol>
                <li>🐙 Siga o guia <strong>"Git e Github para Iniciantes" da Digital Innovation One</strong>.</li>
                <li>📚 Leia o livro online gratuito: <strong>Pro Git</strong> — <a href="https://git-scm.com/book/pt-br/v2" target="_blank" style="color: var(--primary);">git-scm.com/book</a></li>
                <li>💻 Instale o Git e crie uma conta no GitHub (gratuita).</li>
                <li>🚀 Projeto final: crie um repositório com seu portfólio e faça commits diários.</li>
            </ol>
            <p>✅ Git e GitHub são essenciais e totalmente gratuitos para uso pessoal.</p>
        `,

        course_figma: `
            <strong>📌 Roteiro Gratuito para Aprender Figma:</strong>
            <ol>
                <li>🎨 Use o <strong>Figma gratuitamente</strong> no navegador: <a href="https://figma.com" target="_blank" style="color: var(--primary);">figma.com</a></li>
                <li>📚 Siga o tutorial oficial "Figma for Beginners".</li>
                <li>🎥 Canais no YouTube: "Figma em Português", "Figma Brasil".</li>
                <li>🚀 Projeto final: crie o design de um app de tarefas ou landing page.</li>
            </ol>
            <p>✅ Figma tem plano free poderoso para estudantes e freelancers.</p>
        `,

        course_docker: `
            <strong>📌 Roteiro Gratuito para Aprender Docker:</strong>
            <ol>
                <li>🐳 Siga o <strong>Get Started da Docker</strong>: <a href="https://docs.docker.com/get-started/" target="_blank" style="color: var(--primary);">docs.docker.com</a></li>
                <li>📚 Curso da <strong>freeCodeCamp no YouTube: "Docker Tutorial for Beginners"</strong></li>
                <li>💻 Instale o Docker Desktop (gratuito para uso pessoal).</li>
                <li>🚀 Projeto final: containerize uma aplicação Node.js simples.</li>
            </ol>
            <p>✅ Docker Community Edition é gratuito e open-source.</p>
        `,

        course_linux: `
            <strong>📌 Roteiro Gratuito para Aprender Linux:</strong>
            <ol>
                <li>🐧 Instale o <strong>Ubuntu</strong> (gratuito) ou use o WSL2 no Windows.</li>
                <li>📚 Curso da <strong>4Linux no YouTube: "Linux para Iniciantes"</strong></li>
                <li>📖 Leia o guia "Linux Command Line" — disponível online gratuitamente.</li>
                <li>🚀 Projeto final: automatize tarefas com scripts bash.</li>
            </ol>
            <p>✅ Linux é sinônimo de liberdade e gratuidade. Aproveite!</p>
        `,

        course_aws: `
            <strong>📌 Roteiro Gratuito para Aprender AWS:</strong>
            <ol>
                <li>☁️ Cadastre-se na <strong>AWS Free Tier</strong>: <a href="https://aws.amazon.com/pt/free/" target="_blank" style="color: var(--primary);">aws.amazon.com/free</a></li>
                <li>📚 Siga os labs gratuitos da <strong>AWS Educate</strong>.</li>
                <li>🎥 YouTube: canal "AWS em Português".</li>
                <li>🚀 Projeto final: hospede um site estático no S3.</li>
            </ol>
            <p>✅ AWS Free Tier oferece 12 meses grátis de vários serviços. Ideal para aprender!</p>
        `,

        course_restapi: `
            <strong>📌 Roteiro Gratuito para Aprender REST API:</strong>
            <ol>
                <li>🔌 Entenda os fundamentos com a <strong>MDN Web Docs</strong>: APIs Web.</li>
                <li>📚 Curso da <strong>freeCodeCamp: "APIs and Microservices"</strong></li>
                <li>🧪 Use o <strong>Postman</strong> (gratuito) para testar APIs.</li>
                <li>🚀 Projeto final: crie uma API REST com Node.js + Express que gerencia tarefas.</li>
            </ol>
            <p>✅ Tudo o que você precisa é de um editor de texto e um navegador. Vamos nessa!</p>
        `,

        course_typescript: `
            <strong>📌 Roteiro Gratuito para Aprender TypeScript:</strong>
            <ol>
                <li>🔤 Siga o <strong>Handbook Oficial</strong>: <a href="https://www.typescriptlang.org/docs/" target="_blank" style="color: var(--primary);">typescriptlang.org/docs</a></li>
                <li>📚 Curso da <strong>freeCodeCamp no YouTube: "TypeScript Course"</strong></li>
                <li>💻 Use o <strong>Playground Online</strong> para testar código sem instalar nada.</li>
                <li>🚀 Projeto final: migre um projeto JavaScript simples para TypeScript.</li>
            </ol>
            <p>✅ TypeScript é open-source e mantido pela Microsoft. Gratuito e poderoso!</p>
        `,

        course_flutter: `
            <strong>📌 Roteiro Gratuito para Aprender Flutter:</strong>
            <ol>
                <li>📱 Siga o <strong>Get Started Oficial</strong>: <a href="https://docs.flutter.dev/get-started/install" target="_blank" style="color: var(--primary);">docs.flutter.dev</a></li>
                <li>📚 Leia o livro "Flutter em Ação" (versão online gratuita).</li>
                <li>💻 Use o <strong>VS Code + extensão Flutter</strong> (tudo gratuito).</li>
                <li>🚀 Projeto final: crie um app de lista de compras multiplataforma.</li>
            </ol>
            <p>✅ Flutter é open-source e permite criar apps para Android, iOS, Web e Desktop — de graça!</p>
        `,

        course_arduino: `
            <strong>📌 Roteiro Gratuito para Aprender Arduino:</strong>
            <ol>
                <li>⚡ Baixe a <strong>IDE do Arduino</strong> (gratuita): <a href="https://www.arduino.cc/en/software" target="_blank" style="color: var(--primary);">arduino.cc</a></li>
                <li>📚 Siga os tutoriais oficiais "Getting Started with Arduino".</li>
                <li>🎥 YouTube: canais "Arduino em Português", "FilipeFlop".</li>
                <li>🚀 Projeto final: monte um semáforo ou termômetro digital.</li>
            </ol>
            <p>✅ Software 100% gratuito. Para hardware, kits iniciantes custam pouco e duram anos.</p>
        `,

        course_data_science: `
            <strong>📌 Roteiro Gratuito para Aprender Ciência de Dados:</strong>
            <ol>
                <li>📊 Curso da <strong>freeCodeCamp: "Data Science with Python"</strong></li>
                <li>📚 Use o <strong>Google Colab</strong> (gratuito) para rodar notebooks Python.</li>
                <li>📖 Livros gratuitos: "Python Data Science Handbook" (online).</li>
                <li>🚀 Projeto final: analise um dataset do Kaggle e gere gráficos com matplotlib.</li>
            </ol>
            <p>✅ Ferramentas open-source como Python, Pandas, NumPy e Jupyter são gratuitas e profissionais.</p>
        `,

        course_machine_learning: `
            <strong>📌 Roteiro Gratuito para Aprender Machine Learning:</strong>
            <ol>
                <li>🤖 Siga o curso <strong>"Machine Learning" de Andrew Ng na Coursera</strong> (audit free).</li>
                <li>📚 Use o <strong>Google Colab</strong> + bibliotecas Scikit-learn.</li>
                <li>📖 Leia "Hands-On Machine Learning" (exemplos gratuitos no GitHub).</li>
                <li>🚀 Projeto final: crie um modelo que prevê preços de casas ou classifica imagens simples.</li>
            </ol>
            <p>✅ Você não precisa de GPU cara — comece com datasets pequenos e algoritmos simples!</p>
        `,

        course_cybersecurity: `
            <strong>📌 Roteiro Gratuito para Aprender Segurança da Informação:</strong>
            <ol>
                <li>🛡️ Curso da <strong>TryHackMe (versão free)</strong>: <a href="https://tryhackme.com/" target="_blank" style="color: var(--primary);">tryhackme.com</a></li>
                <li>📚 Leia o guia "Cybersecurity for Beginners" da Cisco Networking Academy.</li>
                <li>💻 Use máquinas virtuais (VirtualBox + Kali Linux) para praticar.</li>
                <li>🚀 Projeto final: realize um teste de penetração básico em ambiente controlado.</li>
            </ol>
            <p>✅ Muitas ferramentas de segurança são open-source. Aprenda ética e legalmente!</p>
        `
    };

    return guides[productId] || `
        <p>Conteúdo exclusivo sendo preparado para você. Em breve, você receberá um guia personalizado por email.</p>
        <p>Enquanto isso, sinta-se à vontade para explorar recursos gratuitos sobre este tema na internet!</p>
    `;
}

// Função utilitária para gerar ID único — SANITIZADO
function generateUniqueId(prefix) {
    const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return id.replace(/[.#$\/[\]]/g, '_');
}

// Função auxiliar para capitalizar primeira letra
function capitalizeFirst(string) {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
}
