package com.paodavida.PaoDaVidaApplication.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Table(name = "tb_saidas")
public class SaidaModel implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id")
    private ProdutoModel produto;

    private Integer quantidade;
    
    private BigDecimal valorUnitario;
    
    private BigDecimal valorTotal;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime data;
    
    private String observacao;
    
    private String responsavel;
}
