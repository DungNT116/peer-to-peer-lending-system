package capstone.p2plend.repo;

import capstone.p2plend.entity.Request;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestRepository extends JpaRepository<Request, Integer> {

	@Query(value = "SELECT * FROM request WHERE borrower_id <> ?1 AND lender_id is null", nativeQuery = true)
	List<Request> findAllUserRequestExcept(Integer id);

	@Query(value = "SELECT request.* FROM request WHERE borrower_id = :id AND status = :status", nativeQuery = true)
	List<Request> findAllUserHistoryRequestDone(@Param("id") int id, @Param("status") String status);

}
