package capstone.p2plend.controller;

import org.apache.tomcat.util.http.fileupload.UploadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import capstone.p2plend.entity.Document;
import capstone.p2plend.service.DocumentService;

@RestController
public class DocumentController {

	@Autowired
	DocumentService docService;

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PostMapping("/rest/document/uploadFile")
	public Integer uploadFile(@RequestBody Document document, @RequestHeader("Authorization") String token,
			@RequestPart("file") MultipartFile[] file) {
		HttpStatus status = null;
		boolean valid = false;
		valid = docService.uploadDocument(document, token, file);
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}

	
	
}
