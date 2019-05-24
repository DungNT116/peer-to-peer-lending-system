package capstone.p2plend.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import capstone.p2plend.entity.Account;
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

	@CrossOrigin
	@PostMapping(value = "/login")
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

	@GetMapping(value = "/account")
	public ResponseEntity<Object> getAccountByUsername(@RequestParam String username) {
		Account account = accountService.findUsername(username);
		if (account != null) {
			return new ResponseEntity<Object>(account, HttpStatus.OK);
		}
		return new ResponseEntity<Object>("Not Found User", HttpStatus.NO_CONTENT);
	}

	@CrossOrigin
	@PostMapping(value = "/createAccount")
	public Integer createAccount(@RequestBody Account account) {
		HttpStatus status = null;
		try {
			accountService.createAccount(account);
			status = HttpStatus.OK;
		} catch (Exception e) {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}
	
}
