package com.paodavida.PaoDaVidaApplication.Repositories.specifications;

import com.paodavida.PaoDaVidaApplication.models.ProdutoModel;
import org.springframework.data.jpa.domain.Specification;

public class ProdutoSpecification {

    public static Specification<ProdutoModel> comNome(String nome) {
        return (root, query, cb) -> nome == null || nome.isBlank()
                ? null
                : cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%");
    }

    public static Specification<ProdutoModel> comCategoria(Long categoriaId) {
        return (root, query, cb) -> categoriaId == null
                ? null
                : cb.equal(root.get("categoria").get("id"), categoriaId);
    }

    public static Specification<ProdutoModel> comEstoqueCritico(Boolean critico) {
        return (root, query, cb) -> critico == null
                ? null
                : critico
                ? cb.lessThan(root.get("estoque"), root.get("estoqueMinimo"))
                : cb.greaterThanOrEqualTo(root.get("estoque"), root.get("estoqueMinimo"));
    }
}