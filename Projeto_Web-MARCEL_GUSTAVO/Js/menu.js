// Escuta mensagens enviadas pela página principal
window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg && msg.tipo === 'RENDER_FAVS') {
        renderizarFavoritos(msg.payload);
    }
});


function renderizarFavoritos(listaFavs) {
    const lista = document.getElementById('favoritesList');
    lista.innerHTML = '';

    if (!listaFavs || listaFavs.length === 0) {
        lista.innerHTML = '<p class="empty-msg">Nenhum favorito para esta categoria.</p>';
        return;
    }

    listaFavs.forEach(fav => {
        const div = document.createElement('div');
        div.className = 'fav-item';
        
        // Solicita navegação para a página de detalhes
        div.addEventListener('click', () => {
            window.parent.postMessage({ tipo: 'NAVEGAR', id: fav.id }, '*');
        });

        div.innerHTML = `
            <img src="${fav.image}" alt="${fav.name}">
            <span lang="en">${fav.name}</span>
            <button class="remove-btn" title="Remover dos favoritos">X</button>
        `;

        // Solicita a remoção do favorito
        div.querySelector('.remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            window.parent.postMessage({ tipo: 'FAVORITO_REMOVIDO', id: fav.id }, '*');
        });

        lista.appendChild(div);
    });
}


window.parent.postMessage({ tipo: 'MENU_READY' }, '*');