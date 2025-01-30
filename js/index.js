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
    }, 4000);
}

// Gerar IMEIs
generateBtn.addEventListener('click', () => {
    // Pega o valor e converte para número (trata NaN e 0)
    let quantity = parseInt(quantityInput.value) || 1;
    const originalValue = quantity;
    
    // Limita entre 1 e 10
    if (quantity < 1 || quantity > 10) {
        showMessage('error', 'invalidNumber');
        return;
    }    
    
    if (quantity !== originalValue) {
        quantityInput.value = quantity;
        showMessage('warning', 'adjustedValue', { value: quantity });
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
    const digits = number.split('').reverse().map(Number);
    let sum = 0;
    
    digits.forEach((digit, index) => {
        if (index % 2 === 1) { // Dobra a cada segundo dígito (direita para esquerda)
            digit *= 2;
            sum += digit > 9 ? digit - 9 : digit;
        } else {
            sum += digit;
        }
    });
    
    return (10 - (sum % 10)) % 10;
}