// Repositories/specifications/SaidaSpecification.java
package com.paodavida.PaoDaVidaApplication.Repositories.specifications;

import com.paodavida.PaoDaVidaApplication.models.SaidaModel;
import org.springframework.data.jpa.domain.Specification;

public class SaidaSpecification {

    public static Specification<SaidaModel> comProduto(Long produtoId) {
        return (root, query, cb) -> produtoId == null
                ? null
                : cb.equal(root.get("produto").get("id"), produtoId);
    }

    public static Specification<SaidaModel> comNomeProduto(String nome) {
        return (root, query, cb) -> nome == null || nome.isBlank()
                ? null
                : cb.like(cb.lower(root.get("produto").get("nome")), "%" + nome.toLowerCase() + "%");
    }
}