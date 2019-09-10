package capstone.p2plend.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import capstone.p2plend.util.EmailModule;

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
	EmailModule emailModule;

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

		Pageable pageable = PageRequest.of(page - 1, element, Sort.by("create_date").descending());
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

	public String newTransaction(Transaction transaction) {
		if (transaction.getMilestone().getId() == null) {
			return "Milestone ID cannot be null";
		}
		if (transaction.getAmount() == null || transaction.getCreateDate() == null || transaction.getIdTrx() == null
				|| transaction.getReceiver() == null || transaction.getSender() == null
				|| transaction.getStatus() == null || transaction.getAmountValid() == null) {
			return "Required field are missing";
		}

		String senderUsername = transaction.getSender();

		int idMilestone = transaction.getMilestone().getId();
		Milestone existMilestone = milestoneRepo.findById(transaction.getMilestone().getId()).get();
		if (existMilestone.getTransaction() != null) {
			return "Milestone already have a transaction";
		}
		Milestone milestone = milestoneRepo.findById(idMilestone).get();
		if (milestone == null) {
			return "No milestone found with that ID";
		}

		Transaction trx = new Transaction();
		trx.setAmount(transaction.getAmount());
		trx.setCreateDate(transaction.getCreateDate());
		trx.setIdTrx(transaction.getIdTrx());
		trx.setReceiver(transaction.getReceiver());
		trx.setSender(transaction.getSender());
		trx.setStatus(transaction.getStatus());
		trx.setAmountValid(transaction.getAmountValid());
		milestone.setTransaction(trx);
		trx.setMilestone(milestone);
		Transaction savedTrx = transactionRepo.saveAndFlush(trx);
		if (savedTrx == null) {
			return "Error when save transaction to database";
		}

		Milestone getMilestone = milestoneRepo.findById(idMilestone).get();
		Deal savedDeal = getMilestone.getDeal();
		System.out.println(savedDeal.getId());

		List<Milestone> lstMilestone = milestoneRepo.findListMilestoneByDealId(savedDeal.getId());

		for (int i = 0; i < lstMilestone.size(); i++) {
			Milestone m = lstMilestone.get(i);
			if (m.getPercent() == null) {
				lstMilestone.remove(i);
			}
		}

		int countComplete = 0;
		for (int i = 0; i < lstMilestone.size(); i++) {
			Milestone m = lstMilestone.get(i);
			if (m.getTransaction() != null) {
				if (m.getTransaction().getStatus().equalsIgnoreCase("COMPLETED")) {
					countComplete++;
				}
			}
		}
		if (countComplete == lstMilestone.size()) {
			Request request = savedTrx.getMilestone().getDeal().getRequest();
			request.setStatus("done");
			Request savedRq = requestRepo.save(request);
			if (savedRq == null) {
				return "Error while adjust request status";
			}
		}

		Long time = transaction.getCreateDate() * 1000L;
		Timestamp stamp = new Timestamp(time);
		Date date = new Date(stamp.getTime());

		User user = userRepo.findByUsername(senderUsername);
		emailModule.sendSimpleMessage(user.getEmail(), "Successful transaction execution",
				"Transaction id: " + transaction.getIdTrx() + "\n" 
						+ "Send date: " + date + "\n"
						+ "Send from: " + transaction.getSender() + "\n"
						+ "Send to: " + transaction.getReceiver() + "\n"
						+ "Send amount(in VND): " + transaction.getAmount() + "\n"
						+ "Send amount(in USD): " + transaction.getAmountValid() + "\n");

		return "success";
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
