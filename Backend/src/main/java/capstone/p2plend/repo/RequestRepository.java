package capstone.p2plend.repo;

import capstone.p2plend.entity.Request;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RequestRepository extends JpaRepository<Request, Integer> {

	@Query(value = "SELECT * FROM request WHERE from_account_id <> ?1", nativeQuery = true)
	List<Request> findAllRequestExcept(Integer id);

}
