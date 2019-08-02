package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Milestone;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.Transaction;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.MilestoneRepository;
import capstone.p2plend.repo.RequestRepository;
import capstone.p2plend.repo.TransactionRepository;
import capstone.p2plend.repo.UserRepository;

@Service
public class TransactionService {

	@Autowired
	TransactionRepository transactionRepo;

	@Autowired
	MilestoneRepository milestoneRepo;

	@Autowired
	UserRepository userRepo;

	@Autowired
	RequestRepository requestRepo;

	@Autowired
	JwtService jwtService;

	public List<Transaction> getTopTransactionOrderByCreateDateDesc() {

		List<Transaction> listTrans = transactionRepo.findTop20ByOrderByCreateDateDesc();
		if (listTrans == null) {
			return null;
		}

		List<Transaction> transactions = new ArrayList<>();
		for (Transaction t : listTrans) {
			Transaction transaction = new Transaction();
			transaction.setId(t.getId());
			transaction.setSender(t.getSender());
			transaction.setReceiver(t.getReceiver());
			transaction.setCreateDate(t.getCreateDate());
			transaction.setAmount(t.getAmount());
			transaction.setStatus(t.getStatus());
			transaction.setIdTrx(t.getIdTrx());
			transaction.setAmountValid(t.getAmountValid());
			transactions.add(transaction);
		}

		return transactions;
	}

	public PageDTO<Transaction> getAllUserTransaction(Integer page, Integer element, String token) {
		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);

		if (user == null)
			return null;

		Pageable pageable = PageRequest.of(page - 1, element);
		Page<Transaction> listTrx = transactionRepo.findAllUserTransaction(pageable, username);

		if (listTrx == null)
			return null;

		List<Transaction> transactions = new ArrayList<>();
		for (Transaction t : listTrx) {
			Transaction transaction = new Transaction();
			transaction.setId(t.getId());
			transaction.setSender(t.getSender());
			transaction.setReceiver(t.getReceiver());
			transaction.setCreateDate(t.getCreateDate());
			transaction.setAmount(t.getAmount());
			transaction.setStatus(t.getStatus());
			transaction.setIdTrx(t.getIdTrx());
			transaction.setAmountValid(t.getAmountValid());
			transactions.add(transaction);
		}

		PageDTO<Transaction> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(listTrx.getTotalPages());
		pageDTO.setData(transactions);
		return pageDTO;
	}

	public boolean newTransaction(Transaction transaction) {
		if (transaction.getMilestone().getId() == null) {
			return false;
		}
		Milestone existMilestone = milestoneRepo.findById(transaction.getMilestone().getId()).get();
		if (existMilestone.getTransaction() != null) {
			return false;
		}
		Milestone milestone = milestoneRepo.findById(transaction.getMilestone().getId()).get();
		if (transaction.getAmount() == null || transaction.getCreateDate() == null || transaction.getIdTrx() == null
				|| transaction.getReceiver() == null || transaction.getSender() == null
				|| transaction.getStatus() == null || transaction.getAmountValid() == null) {
			return false;
		}
		transaction.setMilestone(milestone);
		Transaction savedTrx = transactionRepo.saveAndFlush(transaction);
		if (savedTrx == null) {
			return false;
		}
		Deal savedDeal = savedTrx.getMilestone().getDeal();
		List<Milestone> lstMilestone = savedDeal.getMilestone();
		int countComplete = 0;
		for (int i = 0; i < lstMilestone.size(); i++) {
			Milestone m = lstMilestone.get(i);
			if (m.getTransaction().getStatus().equalsIgnoreCase("completed")) {
				countComplete++;
			}
		}
		if (countComplete == lstMilestone.size()) {
			Request request = savedTrx.getMilestone().getDeal().getRequest();
			request.setStatus("done");
			requestRepo.save(request);
		}
		return true;
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
