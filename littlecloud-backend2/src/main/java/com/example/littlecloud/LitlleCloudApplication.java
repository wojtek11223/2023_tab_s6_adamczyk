package com.example.littlecloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;


@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class LitlleCloudApplication {

	public static void main(String[] args) {
		SpringApplication.run(LitlleCloudApplication.class, args);
	}

}
