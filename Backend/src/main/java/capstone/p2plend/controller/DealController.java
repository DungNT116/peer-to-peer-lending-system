package capstone.p2plend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import capstone.p2plend.entity.Deal;
import capstone.p2plend.service.DealService;

@RestController
public class DealController {

	@Autowired
	DealService dealService;
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/deal/getById")
	public ResponseEntity<Deal> getOne(@RequestBody Deal deal) {
		return new ResponseEntity<Deal>(dealService.getOneById(deal.getId()), HttpStatus.OK);
	}
	
}
