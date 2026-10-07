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
import java.time.temporal.WeekFields;
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

    public enum Periodo { DIARIO, SEMANAL, MENSAL }

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
        return switch (periodo) {
            case SEMANAL -> graficoUltimas8semanas();
            case MENSAL -> graficoUltimos12meses();
            case DIARIO -> graficoUltimos7dias();
        };
    }

    // ---------- (Vendas por Categoria) ----------
    @Transactional(readOnly = true)
    public List<CategoriaVendaDto> vendasPorCategoria() {
        Instant inicio = LocalDate.now(ZONE).minusDays(6).atStartOfDay(ZONE).toInstant();
        Instant fim = LocalDate.now(ZONE).plusDays(1).atStartOfDay(ZONE).toInstant();

        List<Object[]> linhas = saidaRepository.vendasPorCategoria(inicio, fim);

        BigDecimal total = linhas.stream()
                .map(linha -> paraBigDecimal(linha[1]))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return linhas.stream()
                .map(linha -> {
                    BigDecimal quantidade = paraBigDecimal(linha[1]);
                    BigDecimal percentual = total.compareTo(BigDecimal.ZERO) == 0
                            ? BigDecimal.ZERO
                            : quantidade.multiply(BigDecimal.valueOf(100))
                                    .divide(total, 1, RoundingMode.HALF_UP);
                    return new CategoriaVendaDto(String.valueOf(linha[0]), quantidade, percentual);
                })
                .toList();
    }

    private BigDecimal paraBigDecimal(Object valor) {
        if (valor == null) return BigDecimal.ZERO;
        if (valor instanceof BigDecimal decimal) return decimal;
        if (valor instanceof Number numero) return new BigDecimal(numero.toString());
        return BigDecimal.ZERO;
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

    private RelatorioGraficoDto graficoUltimas8semanas(){
        LocalDate segundaAtual = primeiraFeiraDaSemana(LocalDate.now(ZONE));
        LocalDate inicio = segundaAtual.minusWeeks(7);
        Instant inicioInstante = inicio.atStartOfDay(ZONE).toInstant();
        Instant fimInstante = segundaAtual.plusWeeks(1).atStartOfDay(ZONE).toInstant();

        List<EntradaModel> entradas = entradaRepository.findAllNoPeriodo(inicioInstante, fimInstante);
        List<SaidaModel> saidas = saidaRepository.findAllNoPeriodo(inicioInstante, fimInstante);

        Map<LocalDate, BigDecimal> producaoPorSemana = agruparPorSemana(entradas, EntradaModel::getDataCriacao, EntradaModel::getQuantidade);
        Map<LocalDate, BigDecimal> vendaPorSemana = agruparPorSemana(saidas, SaidaModel::getDataCriacao, SaidaModel::getQuantidade);
        Map<LocalDate, BigDecimal> receitaPorSemana = agruparPorSemana(saidas, SaidaModel::getDataCriacao, SaidaModel::getValorTotal);

        List<ProducaoVendasPontoDto> producaoVendas = new ArrayList<>();
        List<ReceitaPontoDto> receita = new ArrayList<>();

        for (int i = 0; i < 8; i++) {
            LocalDate semana = inicio.plusWeeks(i);
            String label = semana.format(DIA_FMT); // segunda-feira da semana (dd/MM)
            producaoVendas.add(new ProducaoVendasPontoDto(
                    label,
                    producaoPorSemana.getOrDefault(semana, BigDecimal.ZERO),
                    vendaPorSemana.getOrDefault(semana, BigDecimal.ZERO)
            ));
            receita.add(new ReceitaPontoDto(label, receitaPorSemana.getOrDefault(semana, BigDecimal.ZERO)));
        }

        return new RelatorioGraficoDto(producaoVendas, receita);
    }

    /** Segunda-feira da semana ISO da data informada. */
    private LocalDate primeiraFeiraDaSemana(LocalDate data) {
        return data.with(WeekFields.ISO.dayOfWeek(), 1);
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

    private <T> Map<LocalDate, BigDecimal> agruparPorSemana(
            List<T> registros, Function<T, Instant> dataExtractor, Function<T, BigDecimal> valorExtractor) {
        return registros.stream().collect(Collectors.groupingBy(
                r -> primeiraFeiraDaSemana(dataExtractor.apply(r).atZone(ZONE).toLocalDate()),
                Collectors.reducing(BigDecimal.ZERO, valorExtractor, BigDecimal::add)
        ));
    }

    private String capitalizar(String texto) {
        return texto.isEmpty() ? texto : texto.substring(0, 1).toUpperCase() + texto.substring(1);
    }
}
