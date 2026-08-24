package com.paodavida.PaoDaVidaApplication.controllers;


import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoEstatisticaDto;
import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.produto.ProdutoResponseDto;
import com.paodavida.PaoDaVidaApplication.services.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;


@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<ProdutoResponseDto> create(@RequestBody @Valid ProdutoRequestDto produtoRequestDto) {
        ProdutoResponseDto produto = produtoService.create(produtoRequestDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(produto.id())
                .toUri();
        return ResponseEntity.created(uri).body(produto);
    }

    @GetMapping
    public ResponseEntity<Page<ProdutoResponseDto>> getAll(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Boolean estoqueCritico,
            Pageable pageable) {
        return ResponseEntity.ok(produtoService.findAll(nome, categoriaId, estoqueCritico, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.findById(id));
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<ProdutoEstatisticaDto> estatisticas() {
        return ResponseEntity.ok(produtoService.estatisticas());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDto> update(@PathVariable Long id, @RequestBody @Valid ProdutoRequestDto produtoRequestDto) {
        return ResponseEntity.ok(produtoService.update(id, produtoRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produtoService.delete(id);
        return ResponseEntity.noContent().build();

    }
}
