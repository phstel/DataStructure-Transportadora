let filaDePacotes = [];
let pacotesEntregues = [];

const filaPacotes = document.getElementById('filaPacotes');
const entregasRealizadas = document.getElementById('entregasPacote');
const informacoesEntrega = document.getElementById('infoEntrega');
const entregador = document.getElementById('entregador');

async function gerarDestinatario() {
    const resposta = await fetch('https://randomuser.me/api/');
    const dados = await resposta.json();
    return dados.results[0];
}

function gerarTempoEntrega() {
    return Math.floor(Math.random() * 5);
};

async function gerarPacote() {
    const destinatario = await gerarDestinatario();
    const tempoEntrega = gerarTempoEntrega();
    
    return {
        id: Date.now(),
        destinatario: `${destinatario.name.first} ${destinatario.name.last}`,
        endereco: `${destinatario.location.street.name}, ${destinatario.location.street.number}`,
        cidade: `${destinatario.location.city}, ${destinatario.location.state}`,
        pais: destinatario.location.country,
        tempoEntrega: tempoEntrega,
        foto: destinatario.picture.thumbnail
    }
}

async function adicionarPacote() {
    const pacote = await gerarPacote();
    
    filaDePacotes.push(pacote);
    atualizarFilaDePacotes();
}

function atualizarFilaDePacotes() {
    filaPacotes.innerHTML = '';

    filaDePacotes.forEach(pacote => {
        const pacoteElement = document.createElement('div');
        pacoteElement.className = 'pacote';
        pacoteElement.innerHTML = `
            <h3>Pacote #${pacote.id}</h3>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <img src="${pacote.foto}" alt="${pacote.destinatario}" style="border-radius: 50%;">
                <p><strong>Destinatário:</strong> ${pacote.destinatario}</p>
            </div>
            <p><strong>Endereço:</strong> ${pacote.endereco}</p>
            <p><strong>Cidade:</strong> ${pacote.cidade}</p>
            <p><strong>País:</strong> ${pacote.pais}</p>
            <p class="tempo"><strong>Tempo estimado:</strong> ${pacote.tempoEntrega} segundos</p>
        `;
        filaPacotes.appendChild(pacoteElement);
    });
}

function entregarPacote() {
    const pacote = filaDePacotes[0];
    informacoesEntrega.innerHTML = `
        <h3>Entregando pacote para ${pacote.destinatario}</h3>
        <p>Endereço: ${pacote.endereco}, ${pacote.cidade}</p>
        <p>Tempo estimado: ${pacote.tempoEntrega} segundos</p>
    `;
   
    setTimeout(() => {
        entregador.style.left = 'calc(100% - 90px)';

        setTimeout(() => {
            const pacoteEntregue = filaDePacotes.shift();
            pacotesEntregues.unshift(pacoteEntregue);

            atualizarFilaDePacotes();
            atualizarEntregasRealizadas();

            entregador.style.left = '10px';
            informacoesEntrega.innerHTML = '<h3>Entrega concluída!</h3>';
        }, pacote.tempoEntrega * 1000);
    }, 100);
}

function atualizarEntregasRealizadas() {
    entregasRealizadas.innerHTML = '';

    pacotesEntregues.forEach(pacote => {
        const pacoteElement = document.createElement('div');
        pacoteElement.className = 'pacote entregue';
        pacoteElement.innerHTML = `
            <h3>Pacote #${pacote.id} - ENTREGUE</h3>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <img src="${pacote.foto}" alt="${pacote.destinatario}" style="border-radius: 50%;">
                <p><strong>Destinatário:</strong> ${pacote.destinatario}</p>
            </div>
            <p><strong>Endereço:</strong> ${pacote.endereco}</p>
            <p><strong>Cidade:</strong> ${pacote.cidade}</p>
            <p><strong>País:</strong> ${pacote.pais}</p>
            <p class="tempo"><strong>Tempo de entrega:</strong> ${pacote.tempoEntrega} segundos</p>
        `;
        entregasRealizadas.appendChild(pacoteElement);
    });
}