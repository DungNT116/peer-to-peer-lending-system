package capstone.p2plend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.entity.DocumentFile;
import capstone.p2plend.service.DocumentFileService;

@RestController
public class DocumentFileController {

	@Autowired
	DocumentFileService dfService;

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PostMapping("/rest/documentFile/uploadFile")
	public Integer uploadFile(@RequestParam("file") MultipartFile[] file) {
		HttpStatus status = null;
		boolean valid = false;
		valid = dfService.uploadDocument(file);
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping("/rest/documentFile/downloadFile")
	public DocumentFile uploadFile(@RequestParam("id") Integer id) {
		return dfService.downloadDocument(id);
	}
}
