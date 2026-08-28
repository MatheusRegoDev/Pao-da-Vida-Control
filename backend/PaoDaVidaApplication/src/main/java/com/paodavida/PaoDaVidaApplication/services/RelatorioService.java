package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.EntradaRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.SaidaRepository;
import com.paodavida.PaoDaVidaApplication.dtos.relatorios.*;
import com.paodavida.PaoDaVidaApplication.models.EntradaModel;
import com.paodavida.PaoDaVidaApplication.models.SaidaModel;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    private final EntradaRepository entradaRepository;
    private final SaidaRepository saidaRepository;

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final DateTimeFormatter DIA_FMT = DateTimeFormatter.ofPattern("dd/MM");
    private static final DateTimeFormatter MES_FMT = DateTimeFormatter.ofPattern("MMM", new Locale("pt", "BR"));

    public enum Periodo { DIARIO, MENSAL }

    // ---------- (cards do topo) ----------

    @Transactional(readOnly = true)
    public RelatorioResumoDto resumoUltimos7dias() {
        LocalDate hoje = LocalDate.now(ZONE);
        Instant inicio = hoje.minusDays(6).atStartOfDay(ZONE).toInstant();
        Instant fim = hoje.plusDays(1).atStartOfDay(ZONE).toInstant();

        BigDecimal producaoPeriodo = entradaRepository.somarQuantidadeNoPeriodo(inicio, fim);
        BigDecimal vendaPeriodo = saidaRepository.somarQuantidadeNoPeriodo(inicio, fim);
        BigDecimal receitaPeriodo = saidaRepository.somarReceitaNoPeriodo(inicio, fim);

        BigDecimal aproveitamentoPercentual = producaoPeriodo.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : vendaPeriodo.multiply(BigDecimal.valueOf(100)).divide(producaoPeriodo, 1, RoundingMode.HALF_UP);

        return new RelatorioResumoDto(producaoPeriodo, vendaPeriodo, receitaPeriodo, aproveitamentoPercentual);
    }

    // ---------- (Gráfico Produção x Vendas e Receita) ----------
    @Transactional(readOnly = true)
    public RelatorioGraficoDto grafico(Periodo periodo){
        return periodo == Periodo.DIARIO ? graficoUltimos7dias() : graficoUltimos12meses();
    }

    // ---------- (Vendas por Categoria) ----------
    @Transactional(readOnly = true)
    public List<CategoriaVendaDto> vendasPorCategoria() {
        Instant inicio = LocalDate.now(ZONE).minusDays(6).atStartOfDay(ZONE).toInstant();
        Instant fim = LocalDate.now(ZONE).plusDays(1).atStartOfDay(ZONE).toInstant();
        return saidaRepository.vendasPorCategoria(inicio, fim);
    }

    // ---------- (Top Produtos) -----------
    @Transactional(readOnly = true)
    public List<TopProdutosDto> topProdutos() {
        Instant inicio = LocalDate.now(ZONE).minusDays(6).atStartOfDay(ZONE).toInstant();
        Instant fim = LocalDate.now(ZONE).plusDays(1).atStartOfDay(ZONE).toInstant();
        return saidaRepository.topProdutos(inicio, fim);
    }


    private RelatorioGraficoDto graficoUltimos7dias() {
        LocalDate inicio = LocalDate.now(ZONE).minusDays(6);
        Instant inicioInstante = inicio.atStartOfDay(ZONE).toInstant();
        Instant fimInstante = LocalDate.now(ZONE).plusDays(1).atStartOfDay(ZONE).toInstant();

        List<EntradaModel> entradas = entradaRepository.findAllNoPeriodo(inicioInstante, fimInstante);
        List<SaidaModel> saidas = saidaRepository.findAllNoPeriodo(inicioInstante, fimInstante);

        Map<LocalDate, BigDecimal> producaoPorDia = agruparPorDia(entradas, EntradaModel::getDataCriacao, EntradaModel::getQuantidade);
        Map<LocalDate, BigDecimal> vendaPorDia = agruparPorDia(saidas, SaidaModel::getDataCriacao, SaidaModel::getQuantidade);
        Map<LocalDate, BigDecimal> receitaPorDia = agruparPorDia(saidas, SaidaModel::getDataCriacao, SaidaModel::getValorTotal);

        List<ProducaoVendasPontoDto> producaoVendas = new ArrayList<>();
        List<ReceitaPontoDto> receita = new ArrayList<>();

        for (int i = 0; i <= 6; i++) {
            LocalDate dia = inicio.plusDays(i);
            String label = dia.format(DIA_FMT);
            producaoVendas.add(new ProducaoVendasPontoDto(
                    label,
                    producaoPorDia.getOrDefault(dia, BigDecimal.ZERO),
                    vendaPorDia.getOrDefault(dia, BigDecimal.ZERO)
            ));
            receita.add(new ReceitaPontoDto(label, receitaPorDia.getOrDefault(dia, BigDecimal.ZERO)));
        }

        return new RelatorioGraficoDto(producaoVendas, receita);
    }

    private RelatorioGraficoDto graficoUltimos12meses(){
        YearMonth inicio = YearMonth.now(ZONE).minusMonths(5);
        Instant inicioInstante = inicio.atDay(1).atStartOfDay(ZONE).toInstant();
        Instant fimInstante = YearMonth.now(ZONE).plusMonths(1).atDay(1).atStartOfDay(ZONE).toInstant();

        List<EntradaModel> entradas = entradaRepository.findAllNoPeriodo(inicioInstante, fimInstante);
        List<SaidaModel> saidas = saidaRepository.findAllNoPeriodo(inicioInstante, fimInstante);

        Map<YearMonth, BigDecimal> producaoPorMes = agruparPorMes(entradas, EntradaModel::getDataCriacao, EntradaModel::getQuantidade);
        Map<YearMonth, BigDecimal> vendaPorMes = agruparPorMes(saidas, SaidaModel::getDataCriacao, SaidaModel::getQuantidade);
        Map<YearMonth, BigDecimal> receitaPorMes = agruparPorMes(saidas, SaidaModel::getDataCriacao, SaidaModel::getValorTotal);

        List<ProducaoVendasPontoDto> producaoVendas = new ArrayList<>();
        List<ReceitaPontoDto> receita = new ArrayList<>();

        for (int i = 0; i <= 5; i++) {
            YearMonth mes = inicio.plusMonths(i);
            String label = capitalizar(mes.atDay(1).format(MES_FMT));
            producaoVendas.add(new ProducaoVendasPontoDto(
                    label,
                    producaoPorMes.getOrDefault(mes, BigDecimal.ZERO),
                    vendaPorMes.getOrDefault(mes, BigDecimal.ZERO)
            ));
            receita.add(new ReceitaPontoDto(label, receitaPorMes.getOrDefault(mes, BigDecimal.ZERO)));
        }

        return new RelatorioGraficoDto(producaoVendas, receita);
    }



    private <T> Map<LocalDate, BigDecimal> agruparPorDia(
            List<T> registros, Function<T, Instant> dataExtractor, Function<T, BigDecimal> valorExtractor) {
        return registros.stream().collect(Collectors.groupingBy(
                r -> dataExtractor.apply(r).atZone(ZONE).toLocalDate(),
                Collectors.reducing(BigDecimal.ZERO, valorExtractor, BigDecimal::add)
        ));
    }

    private <T> Map<YearMonth, BigDecimal> agruparPorMes(
            List<T> registros, Function<T, Instant> dataExtractor, Function<T, BigDecimal> valorExtractor) {
        return registros.stream().collect(Collectors.groupingBy(
                r -> YearMonth.from(dataExtractor.apply(r).atZone(ZONE).toLocalDate()),
                Collectors.reducing(BigDecimal.ZERO, valorExtractor, BigDecimal::add)
        ));
    }

    private String capitalizar(String texto) {
        return texto.isEmpty() ? texto : texto.substring(0, 1).toUpperCase() + texto.substring(1);
    }
}
