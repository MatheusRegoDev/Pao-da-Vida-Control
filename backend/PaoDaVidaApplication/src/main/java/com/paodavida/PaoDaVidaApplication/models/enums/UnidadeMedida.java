package com.paodavida.PaoDaVidaApplication.models.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor

public enum UnidadeMedida {
    UNIDADE(false),
    KG(true),
    L(true),
    ML(true),
    FATIA(false),
    DUZIA(false),
    CAIXA(false),
    BANDEJA(false);

    private final boolean fracionavel;

    public boolean isFracionavel() {
        return fracionavel;
    }
}