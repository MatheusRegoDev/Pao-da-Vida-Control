package com.paodavida.PaoDaVidaApplication.Repositories;

import com.paodavida.PaoDaVidaApplication.models.CategoriaModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<CategoriaModel, Long> {
    boolean existsByNome(String nome);

    Page<CategoriaModel> findByNomeContainingIgnoreCase(String nome, Pageable pageable);

    @Query("SELECT COUNT(c) FROM CategoriaModel c WHERE c.totalProdutos > 0")
    long countCategoriasComProdutos();

    Optional<CategoriaModel> findTopByOrderByTotalProdutosDesc();

    Optional<CategoriaModel> findFirstByOrderByDataCriacaoDesc();
}
