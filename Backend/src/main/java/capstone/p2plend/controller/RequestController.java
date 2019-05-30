package capstone.p2plend.controller;

import capstone.p2plend.entity.Account;
import capstone.p2plend.entity.Request;
import capstone.p2plend.service.AccountService;
import capstone.p2plend.service.JwtService;
import capstone.p2plend.service.RequestService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RequestController {

	@Autowired
	private RequestService requestService;
	
	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private AccountService accountService;

	@CrossOrigin
	@PostMapping(value = "/rest/createRequest")
	@PreAuthorize("hasAnyRole(['ROLE_ADMIN','ROLE_USER')]")
	public Integer createAccount(@RequestBody Request request, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		try {
			String username = jwtService.getUsernameFromToken(token);

			Account account = accountService.findUsername(username);
			
			request.setAccount(account);
			
			requestService.createRequest(request);
			status = HttpStatus.OK;
		} catch (Exception e) {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}

	
	@CrossOrigin
	@GetMapping(value = "/rest/allRequest")
	public List<Request> all() {						
		return requestService.findAll();
	}
}
