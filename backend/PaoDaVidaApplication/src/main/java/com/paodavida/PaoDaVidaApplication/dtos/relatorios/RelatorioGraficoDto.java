package com.paodavida.PaoDaVidaApplication.dtos.relatorios;

import java.util.List;

public record RelatorioGraficoDto(
        List<ProducaoVendasPontoDto> producaoVendas,
        List<ReceitaPontoDto> receita
) {
}
