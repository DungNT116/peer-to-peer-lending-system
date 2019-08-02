package capstone.p2plend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import capstone.p2plend.service.EmailService;

@SpringBootApplication
public class P2pLendApplication {

	@Autowired
	EmailService emailService;
	
	public static void main(String[] args) {
		SpringApplication.run(P2pLendApplication.class, args);
	}

}
