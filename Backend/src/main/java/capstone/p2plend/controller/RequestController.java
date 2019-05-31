package capstone.p2plend.controller;

import capstone.p2plend.entity.Account;
import capstone.p2plend.entity.Request;
import capstone.p2plend.service.AccountService;
import capstone.p2plend.service.JwtService;
import capstone.p2plend.service.RequestService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
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
	AccountService accountService;
	
	@Autowired
	JwtService jwtService;
	
	@CrossOrigin
	@PostMapping(value = "/rest/createRequest")
	public Integer createAccount(@RequestBody Request request, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		try {

			String username = jwtService.getUsernameFromToken(token);
			
			Account account = accountService.findUsername(username);
			
			request.setFromAccount(account);
			
			requestService.createRequest(request);
			status = HttpStatus.OK;
		} catch (Exception e) {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}

	@CrossOrigin
	@GetMapping(value = "/rest/all")
	public List<Request> all() {						
		return requestService.findAll();
	}
	
	@CrossOrigin
	@GetMapping(value = "/rest/allRequest")
	public List<Request> exceptUserRequest( @RequestHeader("Authorization") String token){
		
		String username = jwtService.getUsernameFromToken(token);
		
		Account account = accountService.findUsername(username);
		
		return requestService.findAllExceptUserRequest(account.getId());
	}
}
