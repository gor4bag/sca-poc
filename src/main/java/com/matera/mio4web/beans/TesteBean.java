package com.matera.mio4web.beans;

import jakarta.faces.view.ViewScoped;
import jakarta.inject.Named;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Named
@ViewScoped
public class TesteBean {
	
	private String nome = "Lucas"; 
	private String sobrenome;
	private String resultado;
	
	public void mostrarNome() {
		this.resultado = "Seu nome eh: " + nome;
	}
	
}
