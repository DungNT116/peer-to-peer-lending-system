package capstone.p2plend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class P2pLendApplication {
	
//	private static final Logger LOGGER = LoggerFactory.getLogger(P2pLendApplication.class);

//	@Autowired
//	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(P2pLendApplication.class, args);
	}

//	@Bean
//	public CommandLineRunner demo() {
//		return (args) -> {
//			LOGGER.info("CALL method POST");
//		};
//	}
}
