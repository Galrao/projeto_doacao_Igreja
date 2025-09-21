document.addEventListener('DOMContentLoaded', function() {

    const now = new Date();
    const localDatetime = now.toISOString().slice(0, 16);
    document.getElementById('data').value = localDatetime;
    
    loadDonations();
    
    document.getElementById('donation-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const doador = document.getElementById('doador').value;
        const item = document.getElementById('item').value;
        const tipo = document.getElementById('tipo').value;
        const quantidade = document.getElementById('quantidade').value;
        const beneficiario = document.getElementById('beneficiario').value;
        const data = document.getElementById('data').value;
        
        // Criar objeto de doação
        const donation = {
            doador,
            item,
            tipo,
            quantidade,
            beneficiario,
            data: formatDateTime(data)
        };
        
        // Adicionar à lista
        addDonationToList(donation);
        
        // Salvar no localStorage
        saveDonation(donation);
        
        // Resetar formulário
        this.reset();
        
        // Restaurar a data e hora atual
        document.getElementById('data').value = localDatetime;
        
        // Mostrar mensagem de sucesso
        alert('Doação registrada com sucesso!');
    });
    
    document.getElementById('donation-list').addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-delete') || e.target.parentElement.classList.contains('btn-delete')) {
            const row = e.target.closest('tr');
            const donorName = row.cells[1].textContent;
            if (confirm(`Tem certeza que deseja excluir a doação de ${donorName}?`)) {
                row.remove();
                removeDonationFromStorage(donorName);
                alert('Doação excluída com sucesso!');
            }
        }
        
        if (e.target.classList.contains('btn-edit') || e.target.parentElement.classList.contains('btn-edit')) {
            alert('Funcionalidade de edição será implementada em breve!');
        }
    });
});

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR');
}

function addDonationToList(donation) {
    const tbody = document.getElementById('donation-list');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${donation.data}</td>
        <td>${donation.doador}</td>
        <td>${donation.item} (${donation.quantidade})</td>
        <td>${donation.beneficiario}</td>
        <td>
            <button class="btn-edit"><i class="fas fa-edit"></i></button>
            <button class="btn-delete"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
}

function saveDonation(donation) {
    let donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations.push(donation);
    localStorage.setItem('donations', JSON.stringify(donations));
}

function loadDonations() {
    const donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations.forEach(donation => {
        addDonationToList(donation);
    });
}

function removeDonationFromStorage(donorName) {
    let donations = JSON.parse(localStorage.getItem('donations')) || [];
    donations = donations.filter(donation => donation.doador !== donorName);
    localStorage.setItem('donations', JSON.stringify(donations));
}