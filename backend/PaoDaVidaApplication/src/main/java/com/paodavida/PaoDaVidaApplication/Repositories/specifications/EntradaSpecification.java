package com.paodavida.PaoDaVidaApplication.Repositories.specifications;

import com.paodavida.PaoDaVidaApplication.models.EntradaModel;
import org.springframework.data.jpa.domain.Specification;

public class EntradaSpecification {

    public static Specification<EntradaModel> comProduto(Long produtoId) {
        return (root, query, cb) -> produtoId == null
                ? null
                : cb.equal(root.get("produto").get("id"), produtoId);
    }

    public static Specification<EntradaModel> comNomeProduto(String nome) {
        return (root, query, cb) -> nome == null || nome.isBlank()
                ? null
                : cb.like(cb.lower(root.get("produto").get("nome")), "%" + nome.toLowerCase() + "%");
    }
}