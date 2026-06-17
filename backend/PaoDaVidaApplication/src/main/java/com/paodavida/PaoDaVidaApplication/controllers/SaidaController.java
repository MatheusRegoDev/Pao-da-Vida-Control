package com.paodavida.PaoDaVidaApplication.controllers;

import com.paodavida.PaoDaVidaApplication.dtos.saida.SaidaRequestDto;
import com.paodavida.PaoDaVidaApplication.dtos.saida.SaidaResponseDto;
import com.paodavida.PaoDaVidaApplication.services.SaidaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saidas")
public class SaidaController {

    private final SaidaService service;

    public SaidaController(SaidaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SaidaResponseDto> create(@RequestBody @Valid SaidaRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<SaidaResponseDto>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SaidaResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SaidaResponseDto> update(@PathVariable Long id, @RequestBody @Valid SaidaRequestDto dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
