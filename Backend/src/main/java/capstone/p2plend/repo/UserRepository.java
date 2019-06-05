package capstone.p2plend.repo;

import capstone.p2plend.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

	User findByUsernameAndPassword(String username, String password);
	
	User findByUsername(String username);
	
	Optional<User> findByUsernameOrEmail(String username, String email);
	
	Boolean existsByUsername(String username);
	
	Boolean existsByEmail(String email);
}
