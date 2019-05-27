package capstone.p2plend.controller;

import capstone.p2plend.entity.Request;
import capstone.p2plend.service.RequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RequestController {

	@Autowired
	private RequestService requestService;

	@CrossOrigin
	@PostMapping(value = "/api/request/createRequest")
	public Integer createAccount(@RequestBody Request request) {
		HttpStatus status = null;
		try {
			
			requestService.createRequest(request);
			status = HttpStatus.OK;
		} catch (Exception e) {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}

}
