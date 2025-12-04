<?php
// Habilitar exibição de erros para debug (remover em produção)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configurações
$to = "seuemail@exemplo.com"; // SUBSTITUA pelo seu email real
$subject = "Nova mensagem do Portfolio";

// Verifica se é uma requisição POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validação básica
    $name = filter_var(trim($_POST["name"]), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = filter_var(trim($_POST["message"]), FILTER_SANITIZE_STRING);
    
    // Validações
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Por favor, preencha todos os campos."]);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Por favor, insira um email válido."]);
        exit;
    }
    
    // Montar o corpo do email
    $body = "Nome: $name\n";
    $body .= "Email: $email\n";
    $body .= "Mensagem:\n$message\n";
    $body .= "\n---\nEsta mensagem foi enviada através do formulário do portfolio.";
    
    // Cabeçalhos do email
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Tentar enviar o email
    try {
        $success = mail($to, $subject, $body, $headers);
        
        if ($success) {
            echo json_encode(["success" => true, "message" => "Mensagem enviada com sucesso!"]);
        } else {
            // Verificar logs de erro do servidor
            error_log("Falha no envio de email para: $to");
            echo json_encode(["success" => false, "message" => "Falha ao enviar mensagem. Tente novamente mais tarde."]);
        }
    } catch (Exception $e) {
        error_log("Erro no envio de email: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "Ocorreu um erro ao processar sua mensagem."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método não permitido."]);
}
?>