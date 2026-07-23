package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.CategoriaRepository;
import com.paodavida.PaoDaVidaApplication.Repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaResponseDto;
import com.paodavida.PaoDaVidaApplication.exception.CategoriaComProdutosException;
import com.paodavida.PaoDaVidaApplication.exception.CategoriaDuplicadaException;
import com.paodavida.PaoDaVidaApplication.exception.NotFoundException;
import com.paodavida.PaoDaVidaApplication.models.CategoriaModel;
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

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoriaServiceTest {

    @InjectMocks
    private CategoriaService categoriaService;

    @Mock
    CategoriaRepository categoriaRepository;
    @Mock
    ProdutoRepository produtoRepository;

    private CategoriaModel categoriaExistente;
    private CategoriaRequestDto categoriaRequestDto;

    @BeforeEach
    void setUp() {
        categoriaExistente = CategoriaModel.builder()
                .id(1L)
                .nome("Pães")
                .descricao("Categoria de pães")
                .totalProdutos(0)
                .build();

        categoriaRequestDto = new CategoriaRequestDto("Pães", "Categoria de pães");
    }


    @Test
    @DisplayName("Deve criar uma nova categoria com sucesso")
    void create() {
        //Arrange
        when(categoriaRepository.existsByNome(categoriaRequestDto.nome())).thenReturn(false);
        when(categoriaRepository.save(any(CategoriaModel.class))).thenReturn(categoriaExistente);

        //Act
        CategoriaResponseDto resultado = categoriaService.create(categoriaRequestDto);

        // Assert
        Assertions.assertEquals(1L, resultado.id());
        Assertions.assertEquals("Pães", resultado.nome());
        verify(categoriaRepository).save(any(CategoriaModel.class));
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar criar uma categoria com nome duplicado")
    void createCategoriaDuplicada() {
        // Arrange
        when(categoriaRepository.existsByNome("Pães")).thenReturn(true);

        // Act & Assert
        Assertions.assertThrows(CategoriaDuplicadaException.class, () -> categoriaService.create(categoriaRequestDto));
    }

    @Test
    @DisplayName("Deve listar todas as categorias")
    void findAll() {
        //Arrange
        CategoriaModel categoriaModel1 = CategoriaModel.builder()
                .id(1L)
                .nome("Pães")
                .descricao("Categoria de pães")
                .totalProdutos(0)
                .build();

        CategoriaModel categoriaModel2 = CategoriaModel.builder()
                .id(2L)
                .nome("Bolos")
                .descricao("Categoria de bolos")
                .totalProdutos(0)
                .build();

        Pageable pageable = PageRequest.of(0, 10);
        Page<CategoriaModel> categoriaPage = new PageImpl<>(List.of(categoriaModel1, categoriaModel2), pageable, 2);
        when(categoriaRepository.findAll(pageable)).thenReturn(categoriaPage);

        //Act
        Page<CategoriaResponseDto> resultado = categoriaService.findAll(pageable);

        //Assert
        Assertions.assertEquals(2, resultado.getNumberOfElements());
    }

    @Test
    @DisplayName("Deve encontrar uma categoria pelo ID")
    void findById() {
        //Arrange
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoriaExistente));

        //Act
        CategoriaResponseDto resultado = categoriaService.findById(1L);

        //Assert
        Assertions.assertEquals(1L, resultado.id());
    }
    @Test
    @DisplayName("Deve lançar exceção ao tentar encontrar uma categoria inexistente")
    void findByIdNotFound() {
        //Arrange
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        //Act + Assert
        Assertions.assertThrows(NotFoundException.class, () -> categoriaService.findById(99L));
    }

    @Test
    @DisplayName("Deve atualizar uma categoria existente")
    void update() {
        //Arrange


        CategoriaRequestDto categoriaRequestDto = new CategoriaRequestDto("Pães Atualizado", "Categoria de pães atualizada");

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoriaExistente));
        when(categoriaRepository.save(any(CategoriaModel.class))).thenReturn(categoriaExistente);

        //Act
        CategoriaResponseDto resultado = categoriaService.update(1L, categoriaRequestDto);

        //Assert
        Assertions.assertEquals("Pães Atualizado", resultado.nome());
        Assertions.assertEquals("Categoria de pães atualizada", resultado.descricao());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar atualizar uma categoria inexistente")
    void updateNotFound() {
        //Arrange
        CategoriaRequestDto categoriaRequestDto = new CategoriaRequestDto("Pães Atualizado", "Categoria de pães atualizada");
        when(categoriaRepository.findById(99L)).thenReturn(Optional.empty());

        //Act + Assert
        Assertions.assertThrows(NotFoundException.class, () -> categoriaService.update(99L, categoriaRequestDto));
    }

    @Test
    @DisplayName("Deve excluir uma categoria existente sem produtos vinculados")
    void delete() {
        //Arrange
        CategoriaModel categoriaModel = CategoriaModel.builder()
                .id(1L)
                .nome("Pães")
                .descricao("Categoria de pães")
                .totalProdutos(0)
                .build();

        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoriaModel));
        when(produtoRepository.countByCategoriaId(1L)).thenReturn(0L);

        //Act
        categoriaService.delete(1L, false);

        //Assert
        verify(categoriaRepository).delete(categoriaModel);
        verify(produtoRepository, never()).deleteAllByCategoriaId(anyLong());
    }

    @Test
    @DisplayName("Deve lançar exceção ao excluir categoria com produtos e forcar=false")
    void deleteComProdutosEForcarFalseDeveLancarCategoriaComProdutosException() {
        //Arrange


        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoriaExistente));
        when(produtoRepository.countByCategoriaId(1L)).thenReturn(5L);

        //Act + Assert
        Assertions.assertThrows(CategoriaComProdutosException.class, () -> categoriaService.delete(1L, false));
        verify(categoriaRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Deve excluir categoria com produtos e forcar=true")
    void deleteComProdutosEForcarTrueDeveExcluirCategoria() {
        //Arrange
        when(categoriaRepository.findById(1L)).thenReturn(Optional.of(categoriaExistente));
        when(produtoRepository.countByCategoriaId(1L)).thenReturn(5L);

        //Act
        categoriaService.delete(1L, true);

        //Assert
        verify(produtoRepository).deleteAllByCategoriaId(1L);
        verify(categoriaRepository).delete(categoriaExistente);
    }
}