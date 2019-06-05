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
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

import capstone.p2plend.entity.User;
import capstone.p2plend.service.UserService;
import capstone.p2plend.service.JwtService;

@RestController
public class UserController {

	@Autowired
	UserService userService;

	@Autowired
	JwtService jwtService;

	@CrossOrigin
	@PostMapping(value = "/rest/login")
	public ResponseEntity<String> login(HttpServletRequest request, @RequestBody User account) {
		String result = "";
		HttpStatus httpStatus = null;
		try {
			if (userService.checkLogin(account)) {
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
	@PostMapping(value = "/rest/user/createUser")
	public Integer createAccount(@RequestBody User user) {
		HttpStatus status = null;
		try {
			userService.createAccount(user);
			status = HttpStatus.OK;
		} catch (Exception e) {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/user/getById")
	public ResponseEntity<User> getOne(@RequestBody User user) {
		return new ResponseEntity<User>(userService.getOneById(user.getId()), HttpStatus.OK);
	}
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/users")
	public ResponseEntity<List<User>> getAllUser() {
		return new ResponseEntity<List<User>>(userService.findAll(), HttpStatus.OK);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/user/getByUsername")
	public ResponseEntity<Object> getAccountByUsername(@RequestBody User user) {
		User account = userService.findUsername(user.getUsername());
		if (account != null) {
			return new ResponseEntity<Object>(account, HttpStatus.OK);
		}
		return new ResponseEntity<Object>("Not Found User", HttpStatus.NO_CONTENT);
	}

	@CrossOrigin
	@Secured("ROLE_ADMIN")
	@PutMapping(value = "/rest/user/activeUser")
	public Integer approveAccount(@RequestBody User user) {
		HttpStatus status = null;
		boolean valid = false;
		valid = userService.activeAccount(user.getId());
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}

		return status.value();
	}
	
	@CrossOrigin
	@Secured("ROLE_ADMIN")
	@PutMapping(value = "/rest/user/approveUser")
	public Integer deactivateAccount(@RequestBody User user) {
		HttpStatus status = null;
		boolean valid = false;
		valid = userService.deactivateAccount(user.getId());
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}

		return status.value();
	}
}
