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
import org.springframework.web.bind.annotation.RequestHeader;
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
		HttpStatus status = null;
		Deal result = null;
		try {
			result = dealService.getOneById(deal.getId());
			if (result != null) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Deal>(result, status);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PutMapping(value = "/rest/deal/makeDeal")
	public ResponseEntity<Integer> makeDeal(@RequestBody Deal deal, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = dealService.makeDeal(deal, token);
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
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PutMapping(value = "/rest/deal/acceptDeal")
	public ResponseEntity<Integer> acceptDeal(@RequestBody Deal deal, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = dealService.acceptDeal(deal, token);
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
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PutMapping(value = "/rest/deal/cancelDeal")
	public ResponseEntity<Integer> cancelDeal(@RequestBody Deal deal, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = dealService.cancelDeal(deal.getId(), token);
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

//	@CrossOrigin
//	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
//	@PostMapping(value = "/rest/deal/newDeal")
//	public ResponseEntity<Integer> newTransaction(@RequestBody Deal deal) {
//		HttpStatus status = null;
//		boolean valid = false;
//		try {
//			valid = dealService.newDeal(deal);
//			if (valid == true) {
//				status = HttpStatus.OK;
//			} else {
//				status = HttpStatus.BAD_REQUEST;
//			}
//		} catch (Exception e) {
//			status = HttpStatus.INTERNAL_SERVER_ERROR;
//		}
//		return new ResponseEntity<Integer>(status.value(), status);
//	}

//	@CrossOrigin
//	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
//	@PutMapping(value = "/rest/deal/updateDeal")
//	public ResponseEntity<Integer> updateDeal(@RequestBody Deal deal) {
//		HttpStatus status = null;
//		boolean valid = false;
//		try {
//			valid = dealService.updateDeal(deal);
//			if (valid == true) {
//				status = HttpStatus.OK;
//			} else {
//				status = HttpStatus.BAD_REQUEST;
//			}
//		} catch (Exception e) {
//			status = HttpStatus.INTERNAL_SERVER_ERROR;
//		}
//
//		return new ResponseEntity<Integer>(status.value(), status);
//	}
}
