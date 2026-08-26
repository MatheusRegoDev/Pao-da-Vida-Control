package com.paodavida.PaoDaVidaApplication.controllers;


import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaEstatisticaDto;
import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.categoria.CategoriaResponseDto;
import com.paodavida.PaoDaVidaApplication.services.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;


@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<CategoriaResponseDto> create(@RequestBody @Valid CategoriaRequestDto categoriaRequestDto) {
        CategoriaResponseDto categoria = categoriaService.create(categoriaRequestDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(categoria.id())
                .toUri();
        return ResponseEntity.created(uri).body(categoria);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<Page<CategoriaResponseDto>> getAll(@RequestParam(required = false) String nome, Pageable pageable) {
        return ResponseEntity.ok(categoriaService.findAll(nome, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<CategoriaResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.findById(id));
    }

    @GetMapping("/estatisticas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<CategoriaEstatisticaDto> estatisticas() {
        return ResponseEntity.ok(categoriaService.estatisticas());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<CategoriaResponseDto> update(@PathVariable Long id, @RequestBody @Valid CategoriaRequestDto categoriaRequestDto) {
        return ResponseEntity.ok(categoriaService.update(id, categoriaRequestDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestParam(name = "forcar", defaultValue = "false") boolean forcar) {
        categoriaService.delete(id, forcar);
        return ResponseEntity.noContent().build();

    }

}
