package capstone.p2plend.repo;

import capstone.p2plend.entity.Transaction;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

}
