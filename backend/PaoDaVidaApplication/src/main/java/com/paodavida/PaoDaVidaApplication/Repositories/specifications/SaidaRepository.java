package com.paodavida.PaoDaVidaApplication.Repositories.specifications;

import com.paodavida.PaoDaVidaApplication.models.SaidaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;

public interface SaidaRepository extends JpaRepository<SaidaModel, Long>, JpaSpecificationExecutor<SaidaModel> {

    @Query("SELECT COALESCE(SUM(s.valorTotal), 0) FROM SaidaModel s " +
            "WHERE s.dataCriacao >= :inicio AND s.dataCriacao < :fim")
    BigDecimal somarReceitaNoPeriodo(@Param("inicio") Instant inicio, @Param("fim") Instant fim);

    @Query("SELECT COALESCE(SUM(s.quantidade), 0) FROM SaidaModel s " +
            "WHERE s.dataCriacao >= :inicio AND s.dataCriacao < :fim")
    BigDecimal somarQuantidadeNoPeriodo(@Param("inicio") Instant inicio, @Param("fim") Instant fim);
}
