Sintetizador Modular Web

Um sintetizador polifónico interativo, construído inteiramente com tecnologias web (HTML, Tailwind CSS e Web Audio API), que corre diretamente no navegador. Este projeto transforma o seu browser num instrumento musical, permitindo criar e modular sons em tempo real.

(Nota: Substitua o URL acima por um screenshot da aplicação em funcionamento.)

Funcionalidades Principais

Pad de Notas Interativo: Um grid completo com 63 notas musicais, de Dó 1 a Si 9, com feedback visual colorido.

Síntese de Som em Tempo Real: Utiliza a Web Audio API para gerar sons puros e complexos sem a necessidade de ficheiros de áudio externos.

Mixer de Timbres:

5 Osciladores: Misture diferentes formas de onda (Senoide, Quadrada, Serra, Triângulo) e Ruído Branco para criar o seu som.

Controlos Intuitivos: Knobs rotativos permitem ajustar o volume de cada timbre de forma independente.

Osciloscópio Integrado: Um visualizador em tempo real que desenha a forma de onda do som final, permitindo "ver" a música que está a criar.

Controlos Master: Um botão de "Stop" global para silenciar todas as notas ativas e um knob de volume principal.

Polifonia: Toque múltiplas notas em simultâneo.

Design Responsivo: A interface, construída com Tailwind CSS, adapta-se a diferentes tamanhos de ecrã.

Zero Dependências: Funciona offline apenas com o ficheiro HTML, sem necessidade de instalação ou processos de build.

Como Utilizar

Este projeto foi desenhado para ser o mais simples possível de executar:

Descarregue o ficheiro: Faça o download do ficheiro frequency_pad.html.

Abra no Navegador: Abra o ficheiro frequency_pad.html em qualquer navegador web moderno (Chrome, Firefox, Safari, Edge, etc.).

E é tudo! O sintetizador está pronto a ser utilizado.

Tocar Notas: Clique nos botões coloridos para ativar ou desativar uma nota.

Modular o Som: Gire os knobs na secção "Timbres" para misturar as diferentes formas de onda. As alterações são aplicadas em tempo real a todas as notas ativas.

Controlar o Volume: Utilize o knob "Volume" para ajustar o volume geral.

Parar Tudo: Clique no botão vermelho "Stop" para silenciar todas as notas de uma só vez.

Tecnologias Utilizadas

HTML5: Para a estrutura da página.

Tailwind CSS: Para toda a estilização e layout, utilizado através da CDN oficial.

JavaScript (ES6+): Para toda a lógica de interatividade e manipulação do áudio.

Web Audio API: O coração do projeto, responsável por toda a geração e processamento de som.

Customização

O projeto foi construído com a customização em mente. Pode alterar facilmente a aparência do sintetizador editando as variáveis CSS no topo do ficheiro frequency_pad.html, dentro da tag <style>.

:root {
    /* Altere o tamanho dos botões e do texto */
    --btn-width: 10vw;
    --btn-height: 7.8vh;
    --btn-note-name-size: 1.125rem;
    --btn-freq-text-size: 0.75rem;

    /* Altere as cores dos knobs */
    --knob-sine-color: #3b82f6;
    --knob-square-color: #8b5cf6;
    /* ...e assim por diante */

    /* Altere as cores de fundo de cada nota */
    --note-do-bg: #ef4444;
    --note-re-bg: #f97316;
    /* ...e assim por diante */
}


Estrutura do Projeto

Para máxima portabilidade e simplicidade, todo o código (HTML, CSS e JavaScript) está contido num único ficheiro: frequency_pad.html.

<style>: Contém todo o CSS, incluindo as variáveis para customização.

<body>: Define a estrutura HTML da interface.

<script>: Abriga toda a lógica JavaScript, desde a criação dos botões até ao complexo manuseamento do áudio.

Este projeto serve como um excelente exemplo do poder da Web Audio API para criar aplicações de áudio interativas e complexas diretamente no navegador.
