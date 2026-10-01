package com.paodavida.PaoDaVidaApplication.controllers;

import com.paodavida.PaoDaVidaApplication.dtos.dashboard.EstoqueTotalDto;
import com.paodavida.PaoDaVidaApplication.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboarController {

    private final DashboardService dashboardService;

    @GetMapping("/estoque-total")
    public ResponseEntity<EstoqueTotalDto> estoqueTotal() {
        return ResponseEntity.ok(dashboardService.estoqueTotal());
    }

    @GetMapping("resumo")
    public ResponseEntity<?> resumo() {
        return ResponseEntity.ok(dashboardService.resumo());
    }
}
