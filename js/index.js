document.getElementById('generate-btn').addEventListener('click', function () {
    const quantityInput = document.getElementById('quantity');
    const quantity = quantityInput.value.trim() === '' ? 1 : parseInt(quantityInput.value, 10); // Assume 1 se estiver vazio
    const results = document.getElementById('imei-results');
    const errorMessage = document.getElementById('error-message');

    // Limpa a mensagem de erro anterior
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    // Validação da quantidade
    if (isNaN(quantity) || quantity < 1 || quantity > 10) {
        errorMessage.textContent = 'Por favor, insira um número válido entre 1 e 10.';
        errorMessage.style.display = 'block'; // Exibe a mensagem de erro
        return;
    }

    // Gera os IMEIs
    results.value = '';
    for (let i = 0; i < quantity; i++) {
        const imei = generateIMEI();
        results.value += imei + '\n';
    }
});

// Restante do JavaScript (copiar, limpar, gerar IMEI, etc.)

document.getElementById('copy-btn').addEventListener('click', function () {
    const results = document.getElementById('imei-results');

    // Usa a API moderna para copiar o texto
    navigator.clipboard.writeText(results.value)
        .then(() => {
            alert('IMEIs copiados para a área de transferência!');
        })
        .catch((err) => {
            alert('Erro ao copiar os IMEIs. Tente novamente.');
            console.error(err);
        });
});

document.getElementById('clear-btn').addEventListener('click', function () {
    // Limpa o campo de resultados
    document.getElementById('imei-results').value = '';
});

function generateIMEI() {
    let imei = '';
    for (let i = 0; i < 14; i++) {
        imei += Math.floor(Math.random() * 10);
    }
    imei += calculateLuhnCheckDigit(imei);
    return imei;
}

function calculateLuhnCheckDigit(number) {
    let sum = 0;
    for (let i = 0; i < number.length; i++) {
        let digit = parseInt(number.charAt(i), 10);
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) {
                digit = digit - 9;
            }
        }
        sum += digit;
    }
    return (sum * 9) % 10;
}