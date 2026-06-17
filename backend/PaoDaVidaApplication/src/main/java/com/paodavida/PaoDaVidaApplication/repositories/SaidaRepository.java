package com.paodavida.PaoDaVidaApplication.repositories;

import com.paodavida.PaoDaVidaApplication.models.SaidaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaidaRepository extends JpaRepository<SaidaModel, Long> {
}
