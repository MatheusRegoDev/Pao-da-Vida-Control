package com.paodavida.PaoDaVidaApplication.exception;

public class CategoriaComProdutosException extends RuntimeException {
    private final long totalProdutosVinculados;
    public CategoriaComProdutosException(String message, long totalProdutosVinculados) {
        super(message);
        this.totalProdutosVinculados = totalProdutosVinculados;
    }

    public long getTotalProdutosVinculados() {
        return totalProdutosVinculados;
    }
}

