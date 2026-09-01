package com.paodavida.PaoDaVidaApplication.services;

import com.paodavida.PaoDaVidaApplication.Repositories.ProdutoRepository;
import com.paodavida.PaoDaVidaApplication.dtos.dashboard.EstoqueTotalDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProdutoRepository produtoRepository;

    @Transactional(readOnly = true)
    public EstoqueTotalDto estoqueTotal() {
        return new EstoqueTotalDto(produtoRepository.somarEstoqueTotal());
    }

}
