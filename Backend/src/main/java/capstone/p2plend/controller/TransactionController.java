package capstone.p2plend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
	public ResponseEntity<List<Transaction>> getTop20TransactionOrderByCreateDateDesc() {
		HttpStatus httpStatus = null;
		List<Transaction> result = null;
		try {
			result = transactionService.getTopTransactionOrderByCreateDateDesc();
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<List<Transaction>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@GetMapping(value = "/rest/transaction/getAllUserTransaction")
	public ResponseEntity<PageDTO<Transaction>> getAllUserTransaction(@RequestParam Integer page,
			@RequestParam Integer element, @RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		PageDTO<Transaction> result = null;
		try {
			result = transactionService.getAllUserTransaction(page, element, token);
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception ex) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<PageDTO<Transaction>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@PostMapping(value = "/rest/transaction/newTransaction")
	public ResponseEntity<Integer> newTransaction(@RequestBody Transaction transaction) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = transactionService.newTransaction(transaction);
			if (valid == true) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Integer>(status.value(), status);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PutMapping(value = "/rest/transaction/updateTransaction")
	public ResponseEntity<Integer> updateTransaction(@RequestBody Transaction transaction) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = transactionService.updateTransaction(transaction);
			if (valid == true) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Integer>(status.value(), status);
	}
}
