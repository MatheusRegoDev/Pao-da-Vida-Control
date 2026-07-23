package com.paodavida.PaoDaVidaApplication.Repositories;

import com.paodavida.PaoDaVidaApplication.models.CategoriaModel;
import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;

import static com.paodavida.PaoDaVidaApplication.models.enums.UnidadeMedida.UNIDADE;


@DataJpaTest
class ProdutoRepositoryTest {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    private CategoriaModel categoriaModel;

    @BeforeEach
    void setUp() {
        categoriaModel = categoriaRepository.save(
                CategoriaModel.builder()
                        .nome("Pães")
                        .descricao("Categoria de pães")
                        .totalProdutos(0)
                        .build()
        );
    }

    @Test
    @DisplayName("Deve retornar true quando existir um produto com o nome informado")
    void existsByNome() {
        // Arrange
        String nomeProdutoExistente = "Pão Francês";

        produtoRepository.save(
                ProdutoModel.builder()
                        .nome(nomeProdutoExistente)
                        .categoria(categoriaModel)
                        .unidade(UNIDADE)
                        .preco(BigDecimal.valueOf(0.25))
                        .build()
        );
        // Act
        boolean exists = produtoRepository.existsByNome(nomeProdutoExistente);

        Assertions.assertTrue(exists);
    }

    @Test
    @DisplayName("Deve retornar false quando não existir um produto com o nome informado")
    void notExistsByNome() {
        // Arrange
        String nomeProdutoInexistente = "Pão de Queijo";
        // Act
        boolean exists = produtoRepository.existsByNome(nomeProdutoInexistente);
        // Assert
        Assertions.assertFalse(exists);
    }

    @Test
    @DisplayName("Deve retornar a quantidade de produtos associados a uma categoria")
    void countByCategoriaId() {
        // Arrange
        produtoRepository.save(
                ProdutoModel.builder()
                        .nome("Pão Francês")
                        .categoria(categoriaModel)
                        .unidade(UNIDADE)
                        .preco(BigDecimal.valueOf(0.25))
                        .build()
        );
        produtoRepository.save(
                ProdutoModel.builder()
                        .nome("Pão de Forma")
                        .categoria(categoriaModel)
                        .unidade(UNIDADE)
                        .preco(BigDecimal.valueOf(1.50))
                        .build()
        );
        // Act
        long count = produtoRepository.countByCategoriaId(categoriaModel.getId());
        // Assert
        Assertions.assertEquals(2, count);
    }

    @Test
    @DisplayName("Deve retornar 0 quando não houver produtos associados a uma categoria")
    void countByCategoriaIdWhenNoProducts() {
        // Act
        long count = produtoRepository.countByCategoriaId(categoriaModel.getId());
        // Assert
        Assertions.assertEquals(0, count);
    }

    @Test
    @DisplayName("Deve deletar todos os produtos associados a uma categoria")
    void deleteAllByCategoriaId() {
        // Arrange
        produtoRepository.save(
                ProdutoModel.builder()
                        .nome("Pão Francês")
                        .categoria(categoriaModel)
                        .unidade(UNIDADE)
                        .preco(BigDecimal.valueOf(0.25))
                        .build()
        );
        produtoRepository.save(
                ProdutoModel.builder()
                        .nome("Pão de Forma")
                        .categoria(categoriaModel)
                        .unidade(UNIDADE)
                        .preco(BigDecimal.valueOf(1.50))
                        .build()
        );
        // Act
        produtoRepository.deleteAllByCategoriaId(categoriaModel.getId());
        long countAfterDelete = produtoRepository.countByCategoriaId(categoriaModel.getId());
        // Assert
        Assertions.assertEquals(0, countAfterDelete);
    }

    @Test
    @DisplayName("Deve deletar todos os produtos associados a uma categoria mesmo quando não houver produtos")
    void deleteAllByCategoriaIdWhenNoProducts() {
        // Act
        produtoRepository.deleteAllByCategoriaId(categoriaModel.getId());
        long countAfterDelete = produtoRepository.countByCategoriaId(categoriaModel.getId());
        // Assert
        Assertions.assertEquals(0, countAfterDelete);
    }
}