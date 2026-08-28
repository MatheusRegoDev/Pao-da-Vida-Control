package com.paodavida.PaoDaVidaApplication.controllers;

import com.paodavida.PaoDaVidaApplication.dtos.saidas.SaidaEstatisticaDto;
import com.paodavida.PaoDaVidaApplication.dtos.saidas.SaidaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.saidas.SaidaResponseDto;
import com.paodavida.PaoDaVidaApplication.services.SaidaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/saidas")
public class SaidaController {

    private final SaidaService saidaService;

    @PostMapping
    @PreAuthorize("!hasRole('OPERADOR')")
    public ResponseEntity<SaidaResponseDto> create(@RequestBody @Valid SaidaRequestDto dto) {
        SaidaResponseDto saida = saidaService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(saida.id())
                .toUri();
        return ResponseEntity.created(uri).body(saida);
    }

    @GetMapping
    @PreAuthorize("!hasRole('OPERADOR')")
    public ResponseEntity<Page<SaidaResponseDto>> getAll(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Long produtoId,
            Pageable pageable) {
        return ResponseEntity.ok(saidaService.findAllWithFilters(nome, produtoId, pageable));
    }

    @GetMapping("/estatisticas")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'GERENTE')")
    public ResponseEntity<SaidaEstatisticaDto> estatisticas() {
        return ResponseEntity.ok(saidaService.estatistica());
    }

    @PutMapping("/{id}")
    @PreAuthorize("!hasRole('OPERADOR')")
    public ResponseEntity<SaidaResponseDto> update(@PathVariable Long id, @RequestBody @Valid SaidaRequestDto dto) {
        return ResponseEntity.ok(saidaService.update(id, dto));
    }

}
