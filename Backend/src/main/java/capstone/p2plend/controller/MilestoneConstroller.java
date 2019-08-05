package capstone.p2plend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import capstone.p2plend.entity.Milestone;
import capstone.p2plend.service.MilestoneService;

@RestController
public class MilestoneConstroller {

	@Autowired
	MilestoneService milestoneService;

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@PostMapping(value = "/rest/milestone/newMilestone")
	public ResponseEntity<Integer> newMilestone(@RequestBody Milestone milestone) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = milestoneService.newMilestone(milestone);
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
	@Secured({ "ROLE_USER" })
	@PutMapping(value = "/rest/milestone/updateMilestone")
	public ResponseEntity<Integer> updateMilestone(@RequestBody Milestone milestone) {
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = milestoneService.updateMilestone(milestone);
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
