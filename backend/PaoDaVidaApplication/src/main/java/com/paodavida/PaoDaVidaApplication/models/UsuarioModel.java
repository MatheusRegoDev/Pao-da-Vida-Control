package com.paodavida.PaoDaVidaApplication.models;

import com.paodavida.PaoDaVidaApplication.models.enums.CargoUsuario;
import com.paodavida.PaoDaVidaApplication.models.enums.StatusUsuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Table(name = "tb_usuarios")
public class UsuarioModel implements UserDetails, Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    
    @Column(unique = true)
    private String email;
    
    private String senha;

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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(this.cargo == CargoUsuario.ADMINISTRADOR) {
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        } else if (this.cargo == CargoUsuario.GERENTE) {
            return List.of(new SimpleGrantedAuthority("ROLE_MANAGER"), new SimpleGrantedAuthority("ROLE_USER"));
        } else if (this.cargo == CargoUsuario.OPERADOR) {
            return List.of(new SimpleGrantedAuthority("ROLE_OPERATOR"), new SimpleGrantedAuthority("ROLE_USER"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.status == StatusUsuario.ATIVO;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.status == StatusUsuario.ATIVO;
    }
}
