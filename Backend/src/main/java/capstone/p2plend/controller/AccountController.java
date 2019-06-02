package capstone.p2plend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

import capstone.p2plend.entity.Account;
import capstone.p2plend.service.AccountService;
import capstone.p2plend.service.JwtService;

@RestController
public class AccountController {

	@Autowired
	AccountService accountService;

	@Autowired
	JwtService jwtService;

	@CrossOrigin
	@PostMapping(value = "/rest/login")
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

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/accounts")
	public ResponseEntity<List<Account>> getAllUser() {
		return new ResponseEntity<List<Account>>(accountService.findAll(), HttpStatus.OK);
	}

	@CrossOrigin
	@GetMapping(value = "/rest/account")
	public ResponseEntity<Object> getAccountByUsername(@RequestParam String username) {
		Account account = accountService.findUsername(username);
		if (account != null) {
			return new ResponseEntity<Object>(account, HttpStatus.OK);
		}
		return new ResponseEntity<Object>("Not Found User", HttpStatus.NO_CONTENT);
	}

	@CrossOrigin
	@PostMapping(value = "/rest/createAccount")
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

	@CrossOrigin
	@Secured("ROLE_ADMIN")
	@PutMapping(value = "/rest/approveAccount")
	public Integer approveAccount(@RequestParam String username) {
		HttpStatus status = null;
		boolean valid = false;
		valid = accountService.approveAccount(username);
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}

		return status.value();
	}
}
