package com.paodavida.PaoDaVidaApplication.Repositories;

import com.paodavida.PaoDaVidaApplication.models.EntradaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;

public interface EntradaRepository extends JpaRepository<EntradaModel, Long>, JpaSpecificationExecutor<EntradaModel> {

    @Query("SELECT COALESCE(SUM(e.quantidade), 0) FROM EntradaModel e " +
            "WHERE e.dataCriacao >= :inicio AND e.dataCriacao < :fim")
    BigDecimal somarQuantidadeNoPeriodo(@Param("inicio") Instant inicio, @Param("fim") Instant fim);

    @Query("SELECT COUNT(e) FROM EntradaModel e " +
            "WHERE e.dataCriacao >= :inicio AND e.dataCriacao < :fim")
    long contarNoPeriodo(@Param("inicio") Instant inicio, @Param("fim") Instant fim);
}
