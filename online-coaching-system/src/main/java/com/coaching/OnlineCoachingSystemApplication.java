package com.coaching;

import org.springframework.boot.SpringApplication;  
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.coaching")
public class OnlineCoachingSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(OnlineCoachingSystemApplication.class, args);
	}

}
 