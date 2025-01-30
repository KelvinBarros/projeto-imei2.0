// Seleção de elementos
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const quantityInput = document.getElementById('quantity');
const results = document.getElementById('imei-results');
const messageElement = document.getElementById('message');

// Configuração de mensagens
const messageConfig = {
    error: {
        icon: '❌',
        texts: {
            invalidNumber: 'Por favor, insira um número entre 1 e 10',
            copyError: 'Erro ao copiar os IMEIs',
            emptyField: 'Digite uma quantidade válida'
        }
    },
    warning: {
        icon: '⚠️',
        texts: {
            maxLimit: 'Quantidade máxima permitida são 10 IMEIs'
        }
    },
    success: {
        icon: '✅',
        texts: {
            generated: 'IMEIs gerados com sucesso!',
            copied: 'IMEIs copiados com sucesso!',
            cleared: 'Resultados limpos com sucesso!'
        }
    }
};

// Função para exibir mensagens
function showMessage(type, textKey) {
    const { icon, texts } = messageConfig[type];
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <span class="message-icon">${icon}</span>
        <span>${texts[textKey]}</span>
    `;
    messageElement.classList.add('show');
    
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

// Gerar IMEIs
generateBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    
    // Validações
    if (isNaN(quantity)) {
        showMessage('error', 'emptyField');
        return;
    }
    
    if (quantity > 10) {
        showMessage('warning', 'maxLimit');
        return;
    }
    
    if (quantity < 1) {
        showMessage('error', 'invalidNumber');
        return;
    }
    
    // Geração dos IMEIs
    results.value = Array.from({length: quantity}, () => generateIMEI()).join('\n');
    showMessage('success', 'generated');
});

// Copiar IMEIs
copyBtn.addEventListener('click', async () => {
    if (!results.value) {
        showMessage('error', 'emptyField');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(results.value);
        showMessage('success', 'copied');
    } catch (err) {
        showMessage('error', 'copyError');
    }
});

// Limpar resultados
clearBtn.addEventListener('click', () => {
    results.value = '';
    quantityInput.value = '';
    messageElement.classList.remove('show');
    showMessage('success', 'cleared');
});

// Funções auxiliares
function generateIMEI() {
    const base = Array.from({length: 14}, () => Math.floor(Math.random() * 10)).join('');
    return base + calculateLuhnCheckDigit(base);
}

function calculateLuhnCheckDigit(number) {
    const sum = number.split('').reduce((acc, digit, index) => {
        let num = parseInt(digit, 10);
        num = index % 2 === 0 ? num * 2 : num;
        return acc + (num > 9 ? num - 9 : num);
    }, 0);
    
    return (sum * 9) % 10;
}