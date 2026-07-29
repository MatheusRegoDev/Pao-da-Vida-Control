package com.paodavida.PaoDaVidaApplication.Repositories;

import com.paodavida.PaoDaVidaApplication.models.UsuarioModel;
import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.SetorUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.domain.Pageable;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<UsuarioModel, UUID> {

    Optional<UsuarioModel> findByEmail(String username);

    boolean existsByEmail(String email);

    @Query("""
        SELECT u FROM UsuarioModel u
        WHERE (:termo IS NULL OR
               LOWER(u.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR
               LOWER(u.email) LIKE LOWER(CONCAT('%', :termo, '%')) OR
               LOWER(CAST(u.setor AS string)) LIKE LOWER(CONCAT('%', :termo, '%')))
        AND (:cargo IS NULL OR u.cargoUsuario = :cargo)
        AND (:setor IS NULL OR u.setor = :setor)
        """)
    Page<UsuarioModel> buscarComFiltros(String termo, CargoUsuario cargo, SetorUsuario setor, Pageable pageable);

    long countByStatusTrue();

    long countByStatusFalse();

    long countByCargoUsuario(CargoUsuario cargoUsuario);
}
