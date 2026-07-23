package com.paodavida.PaoDaVidaApplication.Repositories;

import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface ProdutoRepository extends JpaRepository<ProdutoModel, Long> {
    boolean existsByNome(String nome);
    long countByCategoriaId(Long categoriaId);

    @Modifying
    @Transactional
    void deleteAllByCategoriaId(Long categoriaId);
}
