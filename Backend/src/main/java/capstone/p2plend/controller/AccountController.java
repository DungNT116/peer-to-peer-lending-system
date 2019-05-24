package capstone.p2plend.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import capstone.p2plend.entity.Account;
import capstone.p2plend.exception.AccountNotFoundException;
import capstone.p2plend.repo.AccountRepository;
import capstone.p2plend.service.AccountService;
import capstone.p2plend.service.JwtService;

@RestController
@RequestMapping("/api")
public class AccountController {

//	private final AccountRepository repository;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private AccountService accountService;

//	AccountController(AccountRepository repository) {
//		this.repository = repository;
//	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<String> login(HttpServletRequest request, @RequestBody Account account) {
		String result = "";
		HttpStatus httpStatus = null;
		try {
			if (accountService.checkLogin(account)) {
				result = jwtService.generateTokenLogin(account.getUsername());
				httpStatus = HttpStatus.OK;
			} else {
				result = "Wrong userId and password";
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception ex) {
			result = "Server Error";
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<String>(result, httpStatus);
	}

	@GetMapping(value = "/accounts")
	public ResponseEntity<List<Account>> getAllUser() {
		return new ResponseEntity<List<Account>>(accountService.findAll(), HttpStatus.OK);
	}

	@GetMapping(value = "/accounts/{id}")
	public ResponseEntity<Object> getAccountById(@PathVariable int id) {
		Account user = accountService.findById(id);
		if (user != null) {
			return new ResponseEntity<Object>(user, HttpStatus.OK);
		}
		return new ResponseEntity<Object>("Not Found User", HttpStatus.NO_CONTENT);
	}

	@PostMapping(value = "/users")
	public ResponseEntity<String> createAccount(@RequestBody Account account) {
		if (accountService.add(account)) {
			return new ResponseEntity<String>("Created!", HttpStatus.CREATED);
		} else {
			return new ResponseEntity<String>("User Existed!", HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping(value = "/account/{id}")
	public ResponseEntity<String> deleteAccountById(@PathVariable int id) {
		accountService.delete(id);
		return new ResponseEntity<String>("Deleted!", HttpStatus.OK);
	}
}
