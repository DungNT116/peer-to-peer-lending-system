package capstone.p2plend.repo;

import capstone.p2plend.entity.Request;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestRepository extends JpaRepository<Request, Integer> {

	@Query(value = "SELECT * FROM request WHERE borrower_id <> :id AND lender_id is null", nativeQuery = true)
	Page<Request> findAllOtherUserRequest(Pageable pageable, @Param("id") Integer id);

	@Query(value = "SELECT * FROM request WHERE borrower_id = :id AND status = :status", nativeQuery = true)
	Page<Request> findAllUserRequestByStatus(Pageable pageable, @Param("id") Integer id,
			@Param("status") String status);

	@Query(value = "SELECT * FROM request WHERE borrower_id = :id AND status <> :status", nativeQuery = true)
	List<Request> findListAllUserRequestByExceptStatus(@Param("id") Integer id, @Param("status") String status);

	@Query(value = "SELECT * FROM request WHERE status = :status AND (borrower_id = :borrowerId OR lender_id = :lenderId)", nativeQuery = true)
	Page<Request> findAllRequestByStatusWithLenderOrBorrower(Pageable pageable, @Param("status") String status,
			@Param("borrowerId") Integer borrowerId, @Param("lenderId") Integer lenderId);

	@Query(value = "SELECT * FROM request WHERE status = :status AND lender_id = :lenderId", nativeQuery = true)
	Page<Request> findAllRequestByStatusWithLender(Pageable pageable, @Param("status") String status,
			@Param("lenderId") Integer lenderId);

	@Query(value = "SELECT * FROM request WHERE status = :status AND borrower_id = :borrowerId", nativeQuery = true)
	Page<Request> findAllRequestByStatusWithBorrower(Pageable pageable, @Param("status") String status,
			@Param("borrowerId") Integer borrowerId);
	
	@Query(value = "SELECT * FROM request WHERE status = :status", nativeQuery = true)
	List<Request> findAllRequestByStatus(@Param("status") String status);
}
