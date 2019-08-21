package capstone.p2plend.repo;

import capstone.p2plend.entity.User;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Integer> {

	User findByUsernameAndPassword(String username, String password);
	
	User findByUsername(String username);
	
	User findByUsernameAndEmail(String username, String email);
	
	User findByEmail(String email);
	
	User findByUsernameOrEmail(String username, String email);
	
	Boolean existsByUsername(String username);
	
	Boolean existsByEmail(String email);
	
	@Query("SELECT e FROM User e")
	List<User> findUsers(Pageable pageable);
}
