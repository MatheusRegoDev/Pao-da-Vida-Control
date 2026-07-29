package com.paodavida.PaoDaVidaApplication.controllers;

import com.paodavida.PaoDaVidaApplication.dtos.usuarios.*;
import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario;
import com.paodavida.PaoDaVidaApplication.services.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import org.springframework.data.domain.Pageable;
import java.net.URI;
import java.util.UUID;


@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDto> create(@RequestBody @Valid UsuariosRequestDto usuarioRequestDto) {
        UsuarioResponseDto usuario = usuarioService.create(usuarioRequestDto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(usuario.id())
                .toUri();
        return ResponseEntity.created(uri).body(usuario);
    }

    @GetMapping
    public ResponseEntity<Page<UsuarioResponseDto>> findByTermoCargoSetor(
            @RequestParam(required = false) String termo,
            @RequestParam(required = false) CargoUsuario cargo,
            @RequestParam(required = false) SetorUsuario setor,
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {
        return ResponseEntity.ok(usuarioService.findByTermoCargoSetor(termo, cargo, setor, pageable));
    }

    @GetMapping("/estatisticas")
    public ResponseEntity<UsuarioEstatisticaDto> estatisticas() {
        return ResponseEntity.ok(usuarioService.estatisticas());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDto> update(
            @PathVariable UUID id,
            @Valid @RequestBody UsuarioUpdateDto dto) {
        return ResponseEntity.ok(usuarioService.update(id, dto));
    }

    @PatchMapping("/{id}/senha")
    public ResponseEntity<Void> redefinirSenha(
            @PathVariable UUID id,
            @Valid @RequestBody UsuarioRedefinirSenhaDto dto) {
        usuarioService.redefinirSenha(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UsuarioResponseDto> alterarStatus(
            @PathVariable UUID id,
            @RequestBody UsuarioRequestNovoStatus dto) {
        return ResponseEntity.ok(usuarioService.alterarStatus(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete (@PathVariable UUID id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
