package com.nourriture.commande;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.nourriture")
@EntityScan("com.nourriture")
@EnableJpaRepositories("com.nourriture")
public class CommandeAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommandeAppApplication.class, args);
	}

}
