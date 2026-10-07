package com.paodavida.PaoDaVidaApplication.Repositories;

import com.paodavida.PaoDaVidaApplication.dtos.relatorios.TopProdutosDto;
import com.paodavida.PaoDaVidaApplication.models.SaidaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public interface SaidaRepository extends JpaRepository<SaidaModel, Long>, JpaSpecificationExecutor<SaidaModel> {

    @Query("SELECT COALESCE(SUM(s.valorTotal), 0) FROM SaidaModel s " +
            "WHERE s.dataCriacao >= :inicio AND s.dataCriacao < :fim")
    BigDecimal somarReceitaNoPeriodo(@Param("inicio") Instant inicio, @Param("fim") Instant fim);

    @Query("SELECT COALESCE(SUM(s.quantidade), 0) FROM SaidaModel s " +
            "WHERE s.dataCriacao >= :inicio AND s.dataCriacao < :fim")
    BigDecimal somarQuantidadeNoPeriodo(@Param("inicio") Instant inicio, @Param("fim") Instant fim);

    @Query("SELECT s FROM SaidaModel s WHERE s.dataCriacao >= :inicio AND s.dataCriacao < :fim")
    List<SaidaModel> findAllNoPeriodo(@Param("inicio") Instant inicio, @Param("fim") Instant fim);

    // Projeção simples (Object[]): Hibernate não consegue montar o record
    // CategoriaVendaDto aqui, pois o "percentual" é calculado no serviço.
    @Query("""
    SELECT c.nome, SUM(s.quantidade)
    FROM SaidaModel s JOIN s.produto p JOIN p.categoria c
    WHERE s.dataCriacao >= :inicio AND s.dataCriacao < :fim
    GROUP BY c.nome
    ORDER BY SUM(s.quantidade) DESC
    """)
    List<Object[]> vendasPorCategoria(@Param("inicio") Instant inicio, @Param("fim") Instant fim);

    @Query("""
    SELECT p.nome, c.nome, SUM(s.quantidade), SUM(s.valorTotal)
    FROM SaidaModel s
    JOIN s.produto p
    JOIN p.categoria c
    WHERE s.dataCriacao >= :inicio AND s.dataCriacao < :fim
    GROUP BY p.nome, c.nome
    ORDER BY SUM(s.quantidade) DESC
    """
    )
    List<TopProdutosDto> topProdutos(@Param("inicio") Instant inicio, @Param("fim") Instant fim);
}
