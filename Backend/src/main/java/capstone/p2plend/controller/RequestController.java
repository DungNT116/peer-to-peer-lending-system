package capstone.p2plend.controller;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.Request;
import capstone.p2plend.service.UserService;
import capstone.p2plend.service.JwtService;
import capstone.p2plend.service.RequestService;

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
import org.springframework.web.bind.annotation.RequestParam;
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
	@Secured({ "ROLE_USER" })
	@PostMapping(value = "/rest/request/createRequest")
	public ResponseEntity<Integer> createRequest(@RequestBody Request request,
			@RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = requestService.createRequest(request, token);
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
	@GetMapping(value = "/rest/request/user/allRequest")
	public ResponseEntity<PageDTO<Request>> findAllOtherUserRequest(@RequestParam Integer page,
			@RequestParam Integer element, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		PageDTO<Request> result = null;
		try {
			result = requestService.findAllOtherUserRequest(page, element, token);
			if (result != null) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<PageDTO<Request>>(result, status);
	}

//	@CrossOrigin
//	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
//	@GetMapping(value = "/rest/request/user/allNewRequest")
//	public ResponseEntity<PageDTO<Request>> findAllOtherUserNewRequest(@RequestParam Integer page,
//			@RequestParam Integer element, @RequestHeader("Authorization") String token) {
//		HttpStatus status = null;
//		PageDTO<Request> result = null;
//		try {
//			result = requestService.findAllOtherUserRequestSortByDateDesc(page, element, token);
//			if (result != null) {
//				status = HttpStatus.OK;
//			} else {
//				status = HttpStatus.BAD_REQUEST;
//			}
//		} catch (Exception e) {
//			status = HttpStatus.INTERNAL_SERVER_ERROR;
//		}
//		return new ResponseEntity<PageDTO<Request>>(result, status);
//	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@GetMapping(value = "/rest/request/allRequestHistoryDone")
	public ResponseEntity<PageDTO<Request>> findAllRequestHistoryStatusDone(@RequestParam Integer page,
			@RequestParam Integer element, @RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		PageDTO<Request> result = null;
		try {
			result = requestService.findUserAllRequestByStatus(page, element, token, "done");
			if (result != null) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<PageDTO<Request>>(result, status);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@GetMapping(value = "/rest/request/all_request_dealing_by_borrower_or_lender")
	public ResponseEntity<PageDTO<Request>> findAllRequestByStatusDealingWithLenderOrBorrower(
			@RequestParam Integer page, @RequestParam Integer element, @RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		PageDTO<Request> result = null;
		try {
			result = requestService.findAllRequestByStatusWithLenderOrBorrower(page, element, token, "dealing");
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception ex) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<PageDTO<Request>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@GetMapping(value = "/rest/request/all_request_trading_by_borrower")
	public ResponseEntity<PageDTO<Request>> findAllRequestByStatusTradingWithBorrower(@RequestParam Integer page,
			@RequestParam Integer element, @RequestHeader("Authorization") String token) {
		PageDTO<Request> result = null;
		HttpStatus httpStatus = null;
		try {
			result = requestService.findAllRequestByStatusWithBorrower(page, element, token, "trading");
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception ex) {
			result = null;
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<PageDTO<Request>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@GetMapping(value = "/rest/request/all_request_trading_by_lender")
	public ResponseEntity<PageDTO<Request>> findAllRequestByStatusTradingWithLender(@RequestParam Integer page,
			@RequestParam Integer element, @RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		PageDTO<Request> result = null;
		try {
			result = requestService.findAllRequestByStatusWithLender(page, element, token, "trading");
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception ex) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<PageDTO<Request>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@GetMapping(value = "/rest/request/allRequestHistoryPending")
	public ResponseEntity<PageDTO<Request>> findAllUserRequestStatusPending(@RequestParam Integer page,
			@RequestParam Integer element, @RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		PageDTO<Request> result = null;
		try {
			result = requestService.findUserAllRequestByStatus(page, element, token, "pending");
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception ex) {
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<PageDTO<Request>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@DeleteMapping(value = "/rest/request/delete")
	public ResponseEntity<Integer> deleteRequest(@RequestBody Request request,
			@RequestHeader("Authorization") String token) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = requestService.remove(request, token);
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
}
