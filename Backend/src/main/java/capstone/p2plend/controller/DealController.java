package capstone.p2plend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import capstone.p2plend.entity.Account;

@RestController
public class DealController {

//	@CrossOrigin
//	@Secured("ROLE_USER")
//	@PutMapping(value = "/rest/accounts")
//	public ResponseEntity<List<Account>> getAllUser() {
//		return new ResponseEntity<List<Account>>(accountService.findAll(), HttpStatus.OK);
//	}
	
}
