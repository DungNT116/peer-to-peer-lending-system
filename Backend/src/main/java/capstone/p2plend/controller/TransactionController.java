package capstone.p2plend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.Transaction;
import capstone.p2plend.service.TransactionService;

@RestController
public class TransactionController {

	@Autowired
	TransactionService transactionService;

	@CrossOrigin
	@GetMapping(value = "/rest/transaction/getTop20Transaction")
	public List<Transaction> getTop20TransactionOrderByCreateDateDesc() {
		return transactionService.getTopTransactionOrderByCreateDateDesc();
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PostMapping(value = "/rest/transaction/newTransaction")
	public Integer newTransaction(@RequestBody Transaction transaction) {
		HttpStatus status = null;
		boolean valid = false;
		valid = transactionService.newTransaction(transaction);
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PutMapping(value = "/rest/transaction/updateTransaction")
	public Integer updateTransaction(@RequestBody Transaction transaction) {
		HttpStatus status = null;
		boolean valid = false;
		valid = transactionService.updateTransaction(transaction);
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}
}
