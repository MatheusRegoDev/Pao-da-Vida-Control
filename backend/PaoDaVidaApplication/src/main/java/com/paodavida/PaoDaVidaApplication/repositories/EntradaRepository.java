package com.paodavida.PaoDaVidaApplication.repositories;

import com.paodavida.PaoDaVidaApplication.models.EntradaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntradaRepository extends JpaRepository<EntradaModel, Long> {
}
