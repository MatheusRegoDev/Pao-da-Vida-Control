package com.paodavida.PaoDaVidaApplication.services;


import com.paodavida.PaoDaVidaApplication.Repositories.CategoriaRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoResponseDto;
import com.paodavida.PaoDaVidaApplication.exception.NotFoundException;
import com.paodavida.PaoDaVidaApplication.exception.ProdutoDuplicadoException;
import com.paodavida.PaoDaVidaApplication.exception.UnidadeMedidaException;
import com.paodavida.PaoDaVidaApplication.models.CategoriaModel;
import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Optional;

import static com.paodavida.PaoDaVidaApplication.models.enums.UnidadeMedida.UNIDADE;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @InjectMocks
    private ProdutoService produtoService;

    @Mock
    ProdutoRepository produtoRepository;

    @Mock
    CategoriaRepository categoriaRepository;

    private ProdutoModel produtoExistente;
    private CategoriaModel categoriaExistente;

    private ProdutoRequestDto produtoRequestDto;

    @BeforeEach
    private void setUp() {
        categoriaExistente = CategoriaModel.builder()
                .id(1L)
                .nome("Pães")
                .descricao("Categoria de pães")
                .totalProdutos(0)
                .build();

        produtoExistente = ProdutoModel.builder()
                .id(1L)
                .nome("Pão Francês")
                .categoria(categoriaExistente)
                .unidade(UNIDADE)
                .preco(new BigDecimal("0.50"))
                .estoque(new BigDecimal("100"))
                .estoqueMinimo(new BigDecimal("10"))
                .build();

        produtoRequestDto = new ProdutoRequestDto(
                "Pão Francês",
                1L,
                UNIDADE,
                new BigDecimal("0.50"),
                new BigDecimal("100"),
                new BigDecimal("10")
        );


    }

    @Test
    @DisplayName("Deve criar um novo produto com sucesso")
    void create() {
        // Arrange
        when(produtoRepository.existsByNome(produtoRequestDto.nome())).thenReturn(false);
        when(categoriaRepository.findById(produtoRequestDto.categoriaId())).thenReturn(Optional.of(categoriaExistente));
        when(produtoRepository.save(any(ProdutoModel.class))).thenReturn(produtoExistente);

        //Act
        var resultado = produtoService.create(produtoRequestDto);

        //Assert
        Assertions.assertEquals(1L, resultado.id());
        Assertions.assertEquals("Pão Francês", resultado.nome());
        Assertions.assertEquals(1L, resultado.categoriaId());
        Assertions.assertEquals(UNIDADE, resultado.unidade());
        Assertions.assertEquals(new BigDecimal("0.50"), resultado.preco());
        Assertions.assertEquals(new BigDecimal("100"), resultado.estoque());
        Assertions.assertEquals(new BigDecimal("10"), resultado.estoqueMinimo());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar criar um produto com nome duplicado")
    void createProdutoComNomeDuplicado() {
        // Arrange
        when(produtoRepository.existsByNome(produtoRequestDto.nome())).thenReturn(true);

        // Act & Assert
        Assertions.assertThrows(ProdutoDuplicadoException.class, () -> produtoService.create(produtoRequestDto));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar criar um produto com categoria inexistente")
    void createProdutoComCategoriaInexistente() {
        // Arrange
        when(produtoRepository.existsByNome(produtoRequestDto.nome())).thenReturn(false);
        when(categoriaRepository.findById(produtoRequestDto.categoriaId())).thenReturn(Optional.empty());

        // Act & Assert
        Assertions.assertThrows(NotFoundException.class, () -> produtoService.create(produtoRequestDto));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar criar um produto com unidade de medida não fracionável e estoque fracionado")
    void createProdutoComUnidadeNaoFracionavelEEstoqueFracionado() {
        // Arrange
        when(categoriaRepository.findById(produtoRequestDto.categoriaId())).thenReturn(Optional.of(categoriaExistente));
        ProdutoRequestDto produtoRequestDtoFracionado = new ProdutoRequestDto(
                "Pão Francês",
                1L,
                UNIDADE,
                new BigDecimal("0.50"),
                new BigDecimal("100.5"), // Estoque fracionado
                new BigDecimal("10")
        );
        // Act & Assert
        Assertions.assertThrows(UnidadeMedidaException.class, () -> produtoService.create(produtoRequestDtoFracionado));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar criar um produto com unidade de medida não fracionável e estoque mínimo fracionado")
    void createProdutoComUnidadeNaoFracionavelEEstoqueMinimoFracionado() {
        // Arrange
        when(categoriaRepository.findById(produtoRequestDto.categoriaId())).thenReturn(Optional.of(categoriaExistente));
        ProdutoRequestDto produtoRequestDtoFracionado = new ProdutoRequestDto(
                "Pão Francês",
                1L,
                UNIDADE,
                new BigDecimal("0.50"),
                new BigDecimal("100"), // Estoque inteiro
                new BigDecimal("10.5") // Estoque mínimo fracionado
        );
        // Act & Assert
        Assertions.assertThrows(UnidadeMedidaException.class, () -> produtoService.create(produtoRequestDtoFracionado));
    }

    @Test
    @DisplayName("Deve encontrar um produto pelo ID")
    void findById() {
        // Arrange
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoExistente));
        // Act
        ProdutoResponseDto resultado = produtoService.findById(1L);
        // Assert
        Assertions.assertEquals(produtoExistente.getId(), resultado.id());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar encontrar um produto inexistente")
    void findByIdNotFound() {
        // Arrange
        when(produtoRepository.findById(99L)).thenReturn(Optional.empty());
        // Act & Assert
        Assertions.assertThrows(NotFoundException.class, () -> produtoService.findById(99L));
    }

    @Test
    @DisplayName("Deve listar todos os produtos")
    void findAll() {
        // Arrange
        ProdutoModel produtoModel1 = ProdutoModel.builder()
                .id(1L)
                .nome("Pão Francês")
                .categoria(categoriaExistente)
                .unidade(UNIDADE)
                .preco(new BigDecimal("0.50"))
                .estoque(new BigDecimal("100"))
                .estoqueMinimo(new BigDecimal("10"))
                .build();

        ProdutoModel produtoModel2 = ProdutoModel.builder()
                .id(2L)
                .nome("Pão de Forma Integral")
                .categoria(categoriaExistente)
                .unidade(UNIDADE)
                .preco(new BigDecimal("15.00"))
                .estoque(new BigDecimal("50"))
                .estoqueMinimo(new BigDecimal("5"))
                .build();

        Pageable pageable = PageRequest.of(0, 10);
        Page<ProdutoModel> produtoPage = new PageImpl<>(java.util.List.of(produtoModel1, produtoModel2), pageable, 2);

        when(produtoRepository.findAll(pageable)).thenReturn(produtoPage);
        // Act
        var resultado = produtoService.findAll(pageable);
        // Assert
        Assertions.assertEquals(2, resultado.getTotalElements());
    }

    @Test
    @DisplayName("Deve atualizar um produto existente")
    void update() {
        //Arrange
        ProdutoRequestDto produtoRequestEsperado = new ProdutoRequestDto(
                "Pão Francês doce",
                1L,
                UNIDADE,
                new BigDecimal("0.60"),
                new BigDecimal("120"),
                new BigDecimal("15")
        );
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoExistente));
        when(categoriaRepository.findById(produtoRequestEsperado.categoriaId())).thenReturn(Optional.of(categoriaExistente));
        when(produtoRepository.save(any(ProdutoModel.class))).thenReturn(produtoExistente);

        //Act
        var resultado = produtoService.update(1L, produtoRequestEsperado);

        //Assert
        Assertions.assertEquals(produtoRequestEsperado.nome(), resultado.nome());
        Assertions.assertEquals(produtoRequestEsperado.categoriaId(), resultado.categoriaId());
        Assertions.assertEquals(produtoRequestEsperado.unidade(), resultado.unidade());
        Assertions.assertEquals(produtoRequestEsperado.preco(), resultado.preco());
        Assertions.assertEquals(produtoRequestEsperado.estoque(), resultado.estoque());
        Assertions.assertEquals(produtoRequestEsperado.estoqueMinimo(), resultado.estoqueMinimo());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar atualizar um produto inexistente")
    void updateProdutoInexistente() {
        //Arrange
        ProdutoRequestDto produtoRequestEsperado = new ProdutoRequestDto(
                "Pão Carteira",
                1L,
                UNIDADE,
                new BigDecimal("0.60"),
                new BigDecimal("120"),
                new BigDecimal("15")
        );
        when(produtoRepository.findById(99L)).thenReturn(Optional.empty());

        //Act + Assert
        Assertions.assertThrows(NotFoundException.class, () -> {
            produtoService.update(99L, produtoRequestEsperado);
        });
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar atualizar um produto com categoria inexistente")
    void updateProdutoComCategoriaInexistente() {
        //Arrange
        ProdutoRequestDto produtoRequestEsperado = new ProdutoRequestDto(
                "Pão Carteira",
                99L, // Categoria inexistente
                UNIDADE,
                new BigDecimal("0.60"),
                new BigDecimal("120"),
                new BigDecimal("15")
        );
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoExistente));
        when(categoriaRepository.findById(produtoRequestEsperado.categoriaId())).thenReturn(Optional.empty());

        //Act + Assert
        Assertions.assertThrows(NotFoundException.class, () -> {
            produtoService.update(1L, produtoRequestEsperado);
        });
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar atualizar um produto com unidade de medida não fracionável e estoque fracionado")
    void updateProdutoComUnidadeNaoFracionavelEEstoqueFracionado() {
        //Arrange
        ProdutoRequestDto produtoRequestEsperado = new ProdutoRequestDto(
                "Pão Carteira",
                1L,
                UNIDADE,
                new BigDecimal("0.60"),
                new BigDecimal("120.5"), // Estoque fracionado
                new BigDecimal("15")
        );
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoExistente));
        when(categoriaRepository.findById(produtoRequestEsperado.categoriaId())).thenReturn(Optional.of(categoriaExistente));

        //Act + Assert
        Assertions.assertThrows(UnidadeMedidaException.class, () -> {
            produtoService.update(1L, produtoRequestEsperado);
        });
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar atualizar um produto com unidade de medida fracionável e estoque mínimo não fracionado")
    void updateProdutoComUnidadeFracionavelEEstoqueNaoFracionado() {
        //Arrange
        ProdutoRequestDto produtoRequestEsperado = new ProdutoRequestDto(
                "Pão Carteira",
                1L,
                UNIDADE,
                new BigDecimal("0.60"),
                new BigDecimal("120"),
                new BigDecimal("15.5") // Estoque mínimo fracionado
        );
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoExistente));
        when(categoriaRepository.findById(produtoRequestEsperado.categoriaId())).thenReturn(Optional.of(categoriaExistente));

        //Act + Assert
        Assertions.assertThrows(UnidadeMedidaException.class, () -> {
            produtoService.update(1L, produtoRequestEsperado);
        });
    }

    @Test
    @DisplayName("Deve excluir um produto existente")
    void delete() {
        //Arrange
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produtoExistente));

        //Act
        produtoService.delete(1L);

        //Assert
        verify(produtoRepository).delete(produtoExistente);
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar excluir um produto inexistente")
    void deleteProdutoInexistente() {
        //Arrange
        when(produtoRepository.findById(99L)).thenReturn(Optional.empty());

        //Act + Assert
        Assertions.assertThrows(NotFoundException.class, () -> {
            produtoService.delete(99L);
        });
    }
}