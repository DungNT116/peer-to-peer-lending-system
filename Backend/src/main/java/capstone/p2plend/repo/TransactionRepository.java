package capstone.p2plend.repo;

import capstone.p2plend.entity.Transaction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

//	@Query(value = "SELECT * FROM transaction ORDER BY create_date DESC LIMIT 20", nativeQuery = true)
	List<Transaction> findTop20ByOrderByCreateDateDesc();

	Transaction findTransactionByMilestone_Id(Integer id);
}
