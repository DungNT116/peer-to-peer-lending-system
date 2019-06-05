package capstone.p2plend.controller;

import capstone.p2plend.entity.Request;
import capstone.p2plend.service.UserService;
import capstone.p2plend.service.JwtService;
import capstone.p2plend.service.RequestService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RequestController {

	@Autowired
	RequestService requestService;

	@Autowired
	UserService accountService;

	@Autowired
	JwtService jwtService;

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PostMapping(value = "/rest/request/createRequest")
	public Integer createAccount(@RequestBody Request request, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = false;
		valid = requestService.createRequest(request, token);

		if (valid == true) {
			status = HttpStatus.OK;

		} else {
			status = HttpStatus.BAD_REQUEST;
		}

		return status.value();
	}
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/request/getById")
	public ResponseEntity<Request> getOne(@RequestBody Request request) {
		return new ResponseEntity<Request>(requestService.getOneById(request.getId()), HttpStatus.OK);
	}
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/request/all")
	public List<Request> all() {
		return requestService.findAll();
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/request/user/allRequest")
	public List<Request> findAllExceptUserRequest(@RequestHeader("Authorization") String token) {
		return requestService.findAllExceptUserRequest(token);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/request/allRequestHistoryDone")
	public List<Request> findAllRequestHistoryDone(@RequestHeader("Authorization") String token) {
		return requestService.findAllRequestHistoryDone(token);
	}
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PostMapping(value = "/rest/request/approveRequest")
	public Integer approveRequest(@RequestBody Request request, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = false;
		valid = requestService.approveRequest(request.getId(), token);

		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}

		return status.value();
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@DeleteMapping(value = "/rest/request/delete")
	public Integer deleteRequest(@RequestBody Request request, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = requestService.remove(request.getId(), token);
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}
}
