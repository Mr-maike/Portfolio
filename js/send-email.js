// Função para lidar com o envio do formulário
function handleFormSubmit(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário
    
    // Coletar dados do formulário
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Validação básica no front-end
    if (!formData.name || !formData.email || !formData.message) {
        alertify.error('Por favor, preencha todos os campos.');
        return;
    }
    
    if (!validateEmail(formData.email)) {
        alertify.error('Por favor, insira um email válido.');
        return;
    }
    
    // Mostrar loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Enviar dados para o PHP
    fetch('send_email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Sucesso - mostrar alerta e limpar formulário
            alertify.success(data.message);
            event.target.reset(); // Limpar formulário
            
            // Fechar modal se estiver em um
            const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
            if (modal) {
                setTimeout(() => {
                    modal.hide();
                }, 1500);
            }
        } else {
            // Erro
            alertify.error(data.message || 'Erro ao enviar mensagem.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alertify.error('Erro de conexão. Tente novamente.');
    })
    .finally(() => {
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

// Função auxiliar para validar email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Adicionar event listener ao formulário quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Inicializar Alertify com configurações personalizadas
    alertify.set('notifier', 'position', 'top-right');
    alertify.set('notifier', 'delay', 5);
});