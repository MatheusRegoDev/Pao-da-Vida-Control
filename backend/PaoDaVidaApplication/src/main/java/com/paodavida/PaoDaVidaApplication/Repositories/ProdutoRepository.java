package com.paodavida.PaoDaVidaApplication.Repositories;

import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

public interface ProdutoRepository extends JpaRepository<ProdutoModel, Long>, JpaSpecificationExecutor<ProdutoModel> {
    boolean existsByNome(String nome);
    long countByCategoriaId(Long categoriaId);

    @Modifying
    @Transactional
    void deleteAllByCategoriaId(Long categoriaId);

    @Query("SELECT COUNT(DISTINCT p.categoria.id) FROM ProdutoModel p")
    long countCategoriasAtivas();

    @Query("SELECT COALESCE(SUM(p.preco * p.estoque), 0) FROM ProdutoModel p")
    BigDecimal calcularValorTotalEstoque();

    @Query("SELECT COUNT(p) FROM ProdutoModel p WHERE p.estoque < p.estoqueMinimo")
    long countEstoqueCritico();

    @Query("SELECT COALESCE(SUM(p.estoque), 0) FROM ProdutoModel p")
    BigDecimal somarEstoqueTotal();
}
