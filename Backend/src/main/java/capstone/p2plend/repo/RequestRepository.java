package capstone.p2plend.repo;

import capstone.p2plend.entity.Request;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestRepository extends JpaRepository<Request, Integer> {

	@Query(value = "SELECT * FROM request WHERE borrower_id <> :id AND lender_id is null", nativeQuery = true)
	Page<Request> findAllUserRequestExcept(Pageable pageable, @Param("id") Integer id);

	@Query(value = "SELECT * FROM request WHERE borrower_id = :id AND status = :status", nativeQuery = true)
	Page<Request> findAllUserRequestByStatus(Pageable pageable, @Param("id") Integer id, @Param("status") String status);

	
}
