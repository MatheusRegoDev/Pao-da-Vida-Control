package com.paodavida.PaoDaVidaApplication.controllers;

import com.paodavida.PaoDaVidaApplication.dtos.entradas.EntradaEstatisticaDto;
import com.paodavida.PaoDaVidaApplication.dtos.entradas.EntradaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.entradas.EntradaResponseDto;
import com.paodavida.PaoDaVidaApplication.services.EntradaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/entradas")
public class EntradaController {

    private final EntradaService entradaService;

    @PostMapping
    public ResponseEntity<EntradaResponseDto> create(@RequestBody @Valid EntradaRequestDto dto) {
        EntradaResponseDto entrada = entradaService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(entrada.id())
                .toUri();
        return ResponseEntity.created(uri).body(entrada);
    }

    @GetMapping
    public ResponseEntity<Page<EntradaResponseDto>> getAll(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) Long produtoId,
            Pageable pageable) {
        return ResponseEntity.ok(entradaService.findAll(nome, produtoId, pageable));
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<EntradaEstatisticaDto> estatisticas() {
        return ResponseEntity.ok(entradaService.estatisticas());
    }
}
