package com.paodavida.PaoDaVidaApplication.models;

import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.StatusUsuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Table(name = "tb_usuarios")
public class UsuarioModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    
    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    private CargoUsuario cargo;

    private String setor;

    @Enumerated(EnumType.STRING)
    private StatusUsuario status;

    private LocalDateTime ultimoAcesso;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime criadoEm;

    private String avatar;
}
