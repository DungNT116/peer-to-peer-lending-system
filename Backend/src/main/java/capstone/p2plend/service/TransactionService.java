package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.Transaction;
import capstone.p2plend.repo.TransactionRepository;

@Service
public class TransactionService {

	@Autowired
	TransactionRepository transactionRepo;

	public List<Transaction> getTopTransactionOrderByCreateDateDesc() {

		
		List<Transaction> listTrans = transactionRepo.findTop20ByOrderByCreateDateDesc();
		
		List<Transaction> transactions = new ArrayList<>();		
		for (Transaction t : listTrans) {
			Transaction transaction = new Transaction();
			transaction.setId(t.getId());
			transaction.setSender(t.getSender());
			transaction.setReceiver(t.getReceiver());
			transaction.setCreateDate(t.getCreateDate());
			transaction.setAmount(t.getAmount());
			transaction.setStatus(t.getStatus());
			transactions.add(transaction);
		}

		return transactions;
	}

	public boolean newTransaction(Transaction transaction) {
		try {

			transactionRepo.saveAndFlush(transaction);

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean updateTransaction(Transaction transaction) {
		try {

			transactionRepo.saveAndFlush(transaction);

			return true;
		} catch (Exception e) {
			return false;
		}
	}
}
