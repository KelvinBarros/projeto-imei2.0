const validateBtn = document.getElementById('validate-btn');
const imeiInput = document.getElementById('imei-input');
const resultDiv = document.getElementById('validation-result');

function isValidIMEI(imei) {
    // Remove non-digit characters
    const cleaned = imei.replace(/\D/g, '');
    
    // Check length
    if (cleaned.length !== 15) return false;

    // Luhn Algorithm
    let sum = 0;
    for (let i = 0; i < 14; i++) {
        let digit = parseInt(cleaned[i], 10);
        if (i % 2 === 0) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(cleaned[14], 10);
}

validateBtn.addEventListener('click', () => {
    const imei = imeiInput.value;
    const isValid = isValidIMEI(imei);
    
    resultDiv.className = `result-message ${isValid ? 'valid' : 'invalid'} show`;
    resultDiv.innerHTML = `
        <i class="fas fa-${isValid ? 'check' : 'times'}-circle"></i>
        ${isValid ? 'IMEI VÁLIDO' : 'IMEI INVÁLIDO'}
        ${isValid ? '' : '<p class="error-detail">Verifique o número e tente novamente</p>'}
    `;
});

// Limpar campo
document.getElementById('imei-input').addEventListener('input', () => {
    resultDiv.classList.remove('show');
});