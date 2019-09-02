package capstone.p2plend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import capstone.p2plend.util.Keccak256Hashing;

@SpringBootApplication
@EnableScheduling
public class P2pLendApplication {
	
//	private static final Logger LOGGER = LoggerFactory.getLogger(P2pLendApplication.class);

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private Keccak256Hashing hs;

	public static void main(String[] args) {
		SpringApplication.run(P2pLendApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo() {
		return (args) -> {
			String a = "a";
			System.out.println(hs.hashWithBouncyCastle(a));
			System.out.println(hs.hashWithJavaMessageDigest(a));
			String b = "b";
			System.out.println(hs.hashWithBouncyCastle(b));
			System.out.println(hs.hashWithJavaMessageDigest(b));
			
			System.out.println(passwordEncoder.encode("1"));
		};
	}
}
