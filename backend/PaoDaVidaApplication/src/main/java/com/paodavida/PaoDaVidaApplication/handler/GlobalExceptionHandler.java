package com.paodavida.PaoDaVidaApplication.handler;

import com.paodavida.PaoDaVidaApplication.exception.*;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCategoriaNotFoundException(NotFoundException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Registro não encontrada")
                .mensagem(ex.getMessage())
                .status(404)
                .timestamp(java.time.Instant.now())
                .build();
        return ResponseEntity.status(404).body(errorResponse);
    }

    @ExceptionHandler(CategoriaDuplicadaException.class)
    public ResponseEntity<ErrorResponse> handleCategoriaDuplicadaException(CategoriaDuplicadaException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Categoria duplicada")
                .mensagem(ex.getMessage())
                .status(409)
                .timestamp(java.time.Instant.now())
                .build();
        return ResponseEntity.status(409).body(errorResponse);
    }

    @ExceptionHandler(ProdutoDuplicadoException.class)
    public ResponseEntity<ErrorResponse> handleProdutoDuplicadoException(ProdutoDuplicadoException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Produto duplicado")
                .mensagem(ex.getMessage())
                .status(409)
                .timestamp(java.time.Instant.now())
                .build();
        return ResponseEntity.status(409).body(errorResponse);
    }

    @ExceptionHandler(CategoriaComProdutosException.class)
    public ResponseEntity<ErrorResponse> handleCategoriaComProdutosException(CategoriaComProdutosException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Categoria com produtos")
                .mensagem(ex.getMessage())
                .status(409)
                .timestamp(java.time.Instant.now())
                .totalProdutosVinculados(ex.getTotalProdutosVinculados())
                .build();
        return ResponseEntity.status(409).body(errorResponse);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        String mensagem = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));

        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Dados inválidos")
                .mensagem(mensagem)
                .status(400)
                .timestamp(java.time.Instant.now())
                .build();
        return ResponseEntity.status(400).body(errorResponse);
    }

    @ExceptionHandler(UnidadeMedidaException.class)
    public ResponseEntity<ErrorResponse> handleUnidadeMedidaException(UnidadeMedidaException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Unidade de medida inválida")
                .mensagem(ex.getMessage())
                .status(400)
                .timestamp(java.time.Instant.now())
                .build();
        return ResponseEntity.status(400).body(errorResponse);
    }

    @ExceptionHandler(UsuarioDuplicadoException.class)
    public ResponseEntity<ErrorResponse> handleUsuarioDuplicadoException(UsuarioDuplicadoException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Usuário duplicado")
                .mensagem(ex.getMessage())
                .status(409)
                .timestamp(java.time.Instant.now())
                .build();
        return ResponseEntity.status(409).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Erro interno do servidor")
                .mensagem(ex.getMessage())
                .status(500)
                .timestamp(java.time.Instant.now())
                .build();
        return ResponseEntity.status(500).body(errorResponse);
    }

    @ExceptionHandler(AutenticacaoException.class)
    public ResponseEntity<ErrorResponse> handleAutenticacaoException(AutenticacaoException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Erro de autenticação")
                .mensagem("E-mail ou senha inválidos")
                .status(401)
                .timestamp(java.time.Instant.now())
                .build();
        return ResponseEntity.status(401).body(errorResponse);
    }
}
