package com.paodavida.PaoDaVidaApplication.Repositories;

import com.paodavida.PaoDaVidaApplication.models.CategoriaModel;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class CategoriaRepositoryTest {

    @Autowired
     private CategoriaRepository categoriaRepository;

    @Test
    @DisplayName("Deve retornar true quando existir uma categoria com o nome informado")
    void existsByNome() {
        // Arrange
        String nomeCategoriaExistente = "Pães";
        CategoriaModel categoria = CategoriaModel.builder()
                .nome(nomeCategoriaExistente)
                .descricao("Categoria de pães")
                .totalProdutos(0)
                .build();
        categoriaRepository.save(categoria);

        // Act
        boolean exists = categoriaRepository.existsByNome(nomeCategoriaExistente);

        // Assert
        Assertions.assertTrue(exists);
    }

    @Test
    @DisplayName("Deve retornar false quando não existir uma categoria com o nome informado")
    void existsByNomeNaoExistente() {
        // Arrange
        String nomeCategoriaNaoExistente = "Pães";
        // Não salva a categoria

        // Act
        boolean exists = categoriaRepository.existsByNome(nomeCategoriaNaoExistente);

        // Assert
        Assertions.assertFalse(exists);
    }
}