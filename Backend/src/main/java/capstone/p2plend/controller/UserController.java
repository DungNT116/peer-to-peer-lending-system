package capstone.p2plend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import javax.mail.SendFailedException;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.User;
import capstone.p2plend.payload.LoginRespone;
import capstone.p2plend.payload.ParaRespone;
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
	public ResponseEntity<LoginRespone> login(HttpServletRequest request, @RequestBody User account) {
		LoginRespone result;
		String message;
		HttpStatus httpStatus = null;
		try {
			User user = userService.checkLogin(account);
			if (user != null) {
				String token = jwtService.generateTokenLogin(user.getUsername());
				message = "login successful";
				result = new LoginRespone(token, user.getUsername(), user.getRole(), message);
				httpStatus = HttpStatus.OK;
			} else {
				message = "Wrong userId and password";
				result = new LoginRespone(null, null, null, message);
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception ex) {
			message = "Server Error";
			result = new LoginRespone(null, null, null, message);
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<LoginRespone>(result, httpStatus);
	}

	@CrossOrigin
	@PostMapping(value = "/rest/user/createUser")
	public ResponseEntity<String> createAccount(@RequestBody User user) {
		HttpStatus httpStatus = null;
		String result = null;
		try {
			result = userService.createAccount(user);
			if (result.equalsIgnoreCase("Account successfully created")) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (SendFailedException sfe) {
			httpStatus = HttpStatus.ACCEPTED;
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<String>(result, httpStatus);
	}

	@CrossOrigin
	@PostMapping(value = "/rest/user/checkUser")
	public ResponseEntity<String> checkUser(@RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		String result = null;
		try {
			result = userService.checkUser(token);
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<String>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@PostMapping(value = "/rest/user/changePassword")
	public ResponseEntity<String> changePassowrd(@RequestParam("oldPassword") String oldPassword,
			@RequestParam("newPassword") String newPassword, @RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		String result = null;
		try {
			result = userService.changePassword(oldPassword, newPassword, token);
			if (result.equalsIgnoreCase("success")) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<String>(result, httpStatus);
	}

	@CrossOrigin
	@PostMapping(value = "/rest/user/forgotPassword")
	public ResponseEntity<String> forgotPassword(@RequestParam("username") String username,
			@RequestParam("email") String email) {
		HttpStatus httpStatus = null;
		String result = null;
		try {
			result = userService.forgotPassword(username, email);
			if (result.equalsIgnoreCase("success")) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<String>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/user/getUser")
	public ResponseEntity<User> getUser(@RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		User result = null;
		try {
			result = userService.getOneByUsername(token);
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<User>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/user/getById")
	public ResponseEntity<User> getOne(@RequestBody User user) {
		HttpStatus httpStatus = null;
		User result = null;
		try {
			result = userService.getOneById(user.getId());
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<User>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/user/users")
	public ResponseEntity<List<User>> getAllUser() {
		HttpStatus httpStatus = null;
		List<User> result = null;
		try {
			result = userService.findAll();
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<List<User>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured("ROLE_ADMIN")
	@PutMapping(value = "/rest/admin/user/activateUser")
	public ResponseEntity<Integer> activateAccount(@RequestBody User user) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = userService.activateAccount(user.getId());
			if (valid == true) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			// TODO: handle exception
		}

		return new ResponseEntity<Integer>(status.value(), status);
	}

	@CrossOrigin
	@Secured("ROLE_ADMIN")
	@PutMapping(value = "/rest/user/loanLimit")
	public ResponseEntity<Integer> changeLoanLimit(@RequestBody User user) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = userService.changeLoanLimit(user.getId(), user.getLoanLimit());
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
	@Secured("ROLE_ADMIN")
	@PutMapping(value = "/rest/admin/user/deactivateUser")
	public ResponseEntity<Integer> deactivateAccount(@RequestBody User user) {
		HttpStatus status = null;
		boolean valid = false;

		try {
			valid = userService.deactivateAccount(user.getId());
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

	@Value("#{T(java.lang.Float).parseFloat('${project.interest_rate}')}")
	private Float interestRate;
	
	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@GetMapping(value = "/rest/user/getUserMaximunLoanLimit")
	public ResponseEntity<ParaRespone> userMaximumLoanLimit(@RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		ParaRespone paraRespone = null;
		Long result = null;
		try {
			result = userService.getUserMaximunLoanLimit(token);
			if (result != null) {
				paraRespone = new ParaRespone(result, interestRate);
				httpStatus = HttpStatus.OK;
			} else {
				paraRespone = new ParaRespone(result, interestRate);
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			paraRespone = new ParaRespone(result, interestRate);
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<ParaRespone>(paraRespone, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@PutMapping(value = "/rest/user/changeUserInfo")
	public ResponseEntity<Integer> changeUserInfo(@RequestBody User user,
			@RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		boolean result = false;
		try {
			result = userService.changeUserInfo(user, token);
			if (result == true) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Integer>(httpStatus.value(), httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@GetMapping(value = "/rest/admin/user/getUsers")
	public ResponseEntity<PageDTO<User>> listUser(@RequestParam Integer page, @RequestParam Integer element) {
		HttpStatus httpStatus = null;
		PageDTO<User> result = null;
		try {
			result = userService.getUsers(page, element);
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<PageDTO<User>>(result, httpStatus);
	}
}
