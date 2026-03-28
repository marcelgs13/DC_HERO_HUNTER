<h1 align="center">
  <img src="Imagens/dc_logo.png" alt="Logo DC Comics" width="40"><br>
  DC Hero Hunter
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge" alt="Status Concluído">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
</p>

<p align="center">
  <strong>Explore o multiverso da DC Comics, pesquise seus personagens favoritos e descubra quem é o mais forte no Ranking de Poder!</strong>
</p>

---

## 💻 Sobre o Projeto

O **DC Hero Hunter** é uma Aplicação Web Front-End interativa desenvolvida como requisito avaliativo para a disciplina de **Desenvolvimento Web**, sob a orientação do professor **Fábio Feliciano** no **IFPE - Campus Belo Jardim**.

O sistema consome uma API externa para catalogar dezenas de heróis, vilões e anti-heróis do universo da DC Comics. O foco arquitetônico do projeto foi a aplicação rigorosa de *Clean Code*, acessibilidade (a11y) e manipulação dinâmica do DOM utilizando Vanilla JavaScript, sem o uso de frameworks externos.

## 🚀 Funcionalidades Principais

- **🔍 Busca em Tempo Real:** Pesquisa dinâmica de personagens com sugestões automáticas via `<datalist>`.
- **🗂️ Galerias Filtradas:** Páginas dedicadas separando as entidades por alinhamento (Heróis, Vilões e Anti-Heróis/Neutros).
- **📊 Ranking de Poder (Hall da Fama):** Uma tabela interativa que lista o Top 50 personagens, permitindo ordenação por atributos específicos (Inteligência, Força, Velocidade, etc.) e filtros de alinhamento.
- **⭐ Sistema de Favoritos:** Uso avançado de `Local Storage` integrado a uma arquitetura de `<iframe>` isolado, garantindo que a lista de favoritos do usuário persista entre as sessões e se comunique com a página principal via `window.postMessage`.
- **📖 Fichas Detalhadas:** Visualização de biografia completa, local de nascimento, afiliações e barras de progresso visuais para os atributos de combate.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as tecnologias base da Web moderna:

* **HTML5:** Estrutura semântica e acessível (com uso adequado de atributos `lang="en"` e `alt` para leitores de tela).
* **CSS3:** Estilização responsiva via Flexbox e CSS Grid, com arquitetura centralizada (Single Source of Truth).
* **JavaScript (ES6+):** Lógica de negócios pura, englobando:
  * Consumo assíncrono via `Fetch API` e `Async/Await`.
  * Roteamento inteligente de páginas.
  * Algoritmos de ordenação e filtro.
* **SuperHero API:** Fonte de dados JSON (`akabab/superhero-api`).

## 📁 Estrutura de Arquivos

O projeto adota uma arquitetura de pastas profissional para facilitar a manutenção:

```text
📦 DC-Hero-Hunter
 ┣ 📂 Estilo
 ┃ ┗ 📜 style.css          # Única folha de estilos para o projeto
 ┣ 📂 Imagens              # Assets locais e ícones de tecnologia
 ┣ 📂 Js
 ┃ ┣ 📜 script.js          # Lógica principal e comunicação de API
 ┃ ┗ 📜 menu.js            # Lógica isolada do iframe de favoritos
 ┣ 📂 Paginas
 ┃ ┣ 📜 anti_herois.html
 ┃ ┣ 📜 desenvolvedor.html
 ┃ ┣ 📜 detalhes.html
 ┃ ┣ 📜 herois.html
 ┃ ┣ 📜 menu.html          # Iframe de Favoritos
 ┃ ┣ 📜 rank.html
 ┃ ┣ 📜 sobre.html
 ┃ ┣ 📜 tecnologias.html
 ┃ ┗ 📜 viloes.html
 ┗ 📜 index.html           # Ponto de entrada (Home)
