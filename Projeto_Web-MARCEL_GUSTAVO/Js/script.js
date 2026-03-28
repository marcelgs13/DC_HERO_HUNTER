const API_URL = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json';
let dcHeroes    = [];
let listaAtual  = [];
let favoritos   = JSON.parse(localStorage.getItem('dc_favoritos')) || [];
let heroiAtualNaPagina = null;
let isMenuReady = false;


function postParaMenu(mensagem) {
    const iframe = document.getElementById('menuIframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(mensagem, '*');
    }
}


function atualizarIframeFavoritos() {
    if (!isMenuReady || dcHeroes.length === 0) return;

    let favoritosParaMostrar = favoritos;

    if (window.location.pathname.includes('anti_herois.html')) {
        favoritosParaMostrar = favoritos.filter(fav => {
            const h = dcHeroes.find(h => h.id === fav.id);
            return h && (h.biography.alignment === 'neutral' || h.biography.alignment === '-');
        });
    } else if (window.location.pathname.includes('herois.html')) {
        favoritosParaMostrar = favoritos.filter(fav => {
            const h = dcHeroes.find(h => h.id === fav.id);
            return h && h.biography.alignment === 'good';
        });
    } else if (window.location.pathname.includes('viloes.html')) {
        favoritosParaMostrar = favoritos.filter(fav => {
            const h = dcHeroes.find(h => h.id === fav.id);
            return h && h.biography.alignment === 'bad';
        });
    }

    postParaMenu({ tipo: 'RENDER_FAVS', payload: favoritosParaMostrar });
}

// Escuta mensagens recebidas do iframe
window.addEventListener('message', (event) => {
    const msg = event.data;
    if (!msg || typeof msg !== 'object') return;

    if (msg.tipo === 'MENU_READY') {
        isMenuReady = true;
        atualizarIframeFavoritos();
    }

    if (msg.tipo === 'NAVEGAR') {
        const caminho = window.location.pathname.includes('Paginas')
            ? `detalhes.html?id=${msg.id}`
            : `Paginas/detalhes.html?id=${msg.id}`;
        window.location.href = caminho;
    }

    if (msg.tipo === 'FAVORITO_REMOVIDO') {
        favoritos = favoritos.filter(f => f.id !== msg.id);
        localStorage.setItem('dc_favoritos', JSON.stringify(favoritos));
        atualizarIframeFavoritos();
        if(window.location.pathname.includes('detalhes.html')) montarPaginaDetalhes();
    }
});


async function iniciarApp() {
    try {
        const response = await fetch(API_URL);
        const data     = await response.json();
        dcHeroes = data.filter(heroi => heroi.biography.publisher === 'DC Comics');

        if (window.location.pathname.includes('detalhes.html')) {
            montarPaginaDetalhes();
        }
        else if (window.location.pathname.includes('rank.html')) {
            const loadingMsg = document.getElementById('loading');
            if (loadingMsg) loadingMsg.classList.add('hidden');

            const tabela = document.getElementById('tabelaContainer');
            if (tabela) {
                tabela.classList.remove('hidden');
                atualizarRanking();
            }
        }
        else {
            const loadingMsg = document.getElementById('loading');
            if (loadingMsg) loadingMsg.classList.add('hidden');

            const grid = document.getElementById('resultadosGrid');
            if (grid) {
                grid.classList.remove('hidden');

                if (window.location.pathname.includes('anti_herois.html')) {
                    listaAtual = dcHeroes.filter(h => h.biography.alignment === 'neutral' || h.biography.alignment === '-');
                } else if (window.location.pathname.includes('herois.html')) {
                    listaAtual = dcHeroes.filter(h => h.biography.alignment === 'good');
                } else if (window.location.pathname.includes('viloes.html')) {
                    listaAtual = dcHeroes.filter(h => h.biography.alignment === 'bad');
                } else {
                    listaAtual = dcHeroes; 
                }

                renderizarCards(listaAtual);
                atualizarDatalist(listaAtual);
            }
        }

        atualizarIframeFavoritos();

    } catch (error) {
        console.error('Erro ao carregar a API:', error);
    }
}


function atualizarDatalist(herois) {
    const datalist = document.getElementById('sugestoes');
    if (!datalist) return;
    datalist.innerHTML = '';
    herois.forEach(heroi => {
        const option   = document.createElement('option');
        option.value   = heroi.name;
        datalist.appendChild(option);
    });
}

function renderizarCards(herois) {
    const grid = document.getElementById('resultadosGrid');
    if (!grid) return;
    grid.innerHTML = '';

    if (herois.length === 0) {
        grid.innerHTML = '<p class="status-message" style="grid-column: 1 / -1;">Nenhum personagem encontrado.</p>';
        return;
    }

    herois.forEach(heroi => {
        const card     = document.createElement('div');
        card.className = 'card';
        card.onclick   = () => {
            const caminho = window.location.pathname.includes('Paginas')
                ? `detalhes.html?id=${heroi.id}`
                : `Paginas/detalhes.html?id=${heroi.id}`;
            window.location.href = caminho;
        };
        card.innerHTML = `
            <img src="${heroi.images.md}" alt="${heroi.name}" loading="lazy">
            <div class="card-info">
                <h3 lang="en" style="text-align:center; margin-bottom:0;">${heroi.name}</h3>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Função de busca em tempo real
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const termo    = searchInput.value.toLowerCase();
        const filtrados = listaAtual.filter(h => h.name.toLowerCase().includes(termo));
        renderizarCards(filtrados);
    });
}


function montarPaginaDetalhes() {
    const urlParams = new URLSearchParams(window.location.search);
    const id        = parseInt(urlParams.get('id'));

    heroiAtualNaPagina = dcHeroes.find(h => h.id === id);

    if (!heroiAtualNaPagina) {
        document.getElementById('loadingDetalhes').textContent = 'Herói não encontrado na base de dados.';
        return;
    }

    document.getElementById('loadingDetalhes').classList.add('hidden');
    document.getElementById('detalhesContent').classList.remove('hidden');

    document.getElementById('detImg').src          = heroiAtualNaPagina.images.lg;
    document.getElementById('detName').innerHTML   = `<span lang="en">${heroiAtualNaPagina.name}</span>`;

    const nomeReal = heroiAtualNaPagina.biography.fullName ? `<span lang="en">${heroiAtualNaPagina.biography.fullName}</span>` : '-';
    const localNasc = (heroiAtualNaPagina.biography.placeOfBirth && heroiAtualNaPagina.biography.placeOfBirth !== '-') ? `<span lang="en">${heroiAtualNaPagina.biography.placeOfBirth}</span>` : '-';
    const primeiraAparicao = (heroiAtualNaPagina.biography.firstAppearance && heroiAtualNaPagina.biography.firstAppearance !== '-') ? `<span lang="en">${heroiAtualNaPagina.biography.firstAppearance}</span>` : '-';

    let alinhamento = 'Neutro';
    if (heroiAtualNaPagina.biography.alignment === 'good') alinhamento = 'Herói';
    if (heroiAtualNaPagina.biography.alignment === 'bad')  alinhamento = 'Vilão';

    document.getElementById('detFullName').innerHTML  = nomeReal;
    document.getElementById('detBirth').innerHTML     = localNasc;
    document.getElementById('detFirstApp').innerHTML  = primeiraAparicao;
    document.getElementById('detAlignment').textContent = alinhamento;

    document.getElementById('detGender').textContent  = heroiAtualNaPagina.appearance.gender || '-';
    document.getElementById('detRace').textContent    = heroiAtualNaPagina.appearance.race   || '-';
    document.getElementById('detHeight').textContent  = heroiAtualNaPagina.appearance.height[1] || '-';
    document.getElementById('detWeight').textContent  = heroiAtualNaPagina.appearance.weight[1] || '-';

    document.getElementById('detOccupation').innerHTML = `<span lang="en">${heroiAtualNaPagina.work.occupation || '-'}</span>`;
    document.getElementById('detBase').innerHTML       = `<span lang="en">${heroiAtualNaPagina.work.base       || '-'}</span>`;
    document.getElementById('detGroups').innerHTML     = `<span lang="en">${heroiAtualNaPagina.connections.groupAffiliation || '-'}</span>`;

    const statsContainer = document.getElementById('detStats');
    statsContainer.innerHTML = ''; 
    const statColors = { intelligence : '#3b82f6', strength : '#ef4444', speed : '#eab308', durability : '#22c55e', power : '#a855f7', combat : '#f97316' };

    for (const [statName, statValue] of Object.entries(heroiAtualNaPagina.powerstats)) {
        const percentage = (statValue === 'null' || statValue === null) ? 0 : statValue;
        statsContainer.innerHTML += `
            <div class="stat-row">
                <div class="stat-label">
                    <span lang="en">${statName}</span><span>${percentage}/100</span>
                </div>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width:${percentage}%; background-color:${statColors[statName]};"></div>
                </div>
            </div>`;
    }

    const btnFav   = document.getElementById('btnFavDetalhes');
    const jaExiste = favoritos.find(f => f.id === heroiAtualNaPagina.id);

    if (jaExiste) {
        btnFav.innerHTML          = '❌ Remover dos Favoritos';
        btnFav.style.backgroundColor = '#ff4c4c';
        btnFav.onclick = () => gerenciarFavoritoPaginaDetalhes('remover');
    } else {
        btnFav.innerHTML          = '⭐ Adicionar aos Favoritos';
        btnFav.style.backgroundColor = '#ff9800';
        btnFav.onclick = () => gerenciarFavoritoPaginaDetalhes('adicionar');
    }
}


function gerenciarFavoritoPaginaDetalhes(acao) {
    if (acao === 'adicionar') {
        favoritos.push({ id : heroiAtualNaPagina.id, name : heroiAtualNaPagina.name, image : heroiAtualNaPagina.images.sm });
    } else {
        favoritos = favoritos.filter(f => f.id !== heroiAtualNaPagina.id);
    }
    localStorage.setItem('dc_favoritos', JSON.stringify(favoritos));
    montarPaginaDetalhes(); 
    atualizarIframeFavoritos();
}


function atualizarRanking() {
    const filtro     = document.getElementById('filtroRank').value;
    const ordenacao  = document.getElementById('ordemRank').value;
    const corpoTabela = document.getElementById('corpoTabelaRank');
    if (!corpoTabela) return;

    let competidores = dcHeroes;
    if (filtro !== 'todos') {
        competidores = competidores.filter(h => h.biography.alignment === filtro);
    }

    const getStat = (heroi, stat) => {
        if (heroi.powerstats[stat] === 'null' || !heroi.powerstats[stat]) return 0;
        return parseInt(heroi.powerstats[stat]);
    };

    const somaTotal = (h) => getStat(h,'intelligence') + getStat(h,'strength') + getStat(h,'speed') + getStat(h,'durability') + getStat(h,'power') + getStat(h,'combat');

    competidores.sort((a, b) => {
        const vA = ordenacao === 'total' ? somaTotal(a) : getStat(a, ordenacao);
        const vB = ordenacao === 'total' ? somaTotal(b) : getStat(b, ordenacao);
        return vB - vA;
    });

    const top50 = competidores.slice(0, 50);
    corpoTabela.innerHTML = '';

    top50.forEach((heroi, index) => {
        const tr      = document.createElement('tr');
        const alin    = heroi.biography.alignment === 'good' ? '🟢 Herói' : heroi.biography.alignment === 'bad' ? '🔴 Vilão' : '⚪ Neutro';
        const valorExibido = ordenacao === 'total' ? somaTotal(heroi) : getStat(heroi, ordenacao);
        const caminhoDetalhes = window.location.pathname.includes('Paginas') ? `detalhes.html?id=${heroi.id}` : `Paginas/detalhes.html?id=${heroi.id}`;

        tr.innerHTML = `
            <td class="rank-posicao">#${index + 1}</td>
            <td>
                <div class="rank-nome-img" onclick="window.location.href='${caminhoDetalhes}'">
                    <img src="${heroi.images.sm}" alt="${heroi.name}">
                    <span lang="en">${heroi.name}</span>
                </div>
            </td>
            <td>${alin}</td>
            <td style="font-weight:bold; color:#ffc107; font-size:1.1rem;">${valorExibido} pts</td>
        `;
        corpoTabela.appendChild(tr);
    });
}

iniciarApp();