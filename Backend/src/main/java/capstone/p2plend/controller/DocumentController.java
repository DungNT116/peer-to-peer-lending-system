package capstone.p2plend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.Document;
import capstone.p2plend.service.DocumentService;

@RestController
public class DocumentController {

	@Autowired
	DocumentService docService;

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PostMapping("/rest/document/uploadFile")
	public Integer uploadFile(@RequestParam("documentId") String documentId,
			@RequestParam("documentType") String documentType, @RequestHeader("Authorization") String token,
			@RequestParam("file") MultipartFile[] file) {
		HttpStatus status = null;
		boolean valid = false;
		valid = docService.uploadDocument(documentId, documentType, token, file);
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping("/rest/document/getUserDocument")
	public ResponseEntity<List<Document>> getUserDocument(@RequestHeader("Authorization") String token) {
		HttpStatus httpStatus = null;
		List<Document> result = null;
		try {
			result = docService.getUserDocument(token);
			httpStatus = HttpStatus.OK;
		} catch (Exception e) {
			httpStatus = HttpStatus.BAD_REQUEST;
		}
		return new ResponseEntity<List<Document>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@PostMapping("/rest/admin/document/validDocument")
	public Integer validDocument(@RequestBody Document document) {
		HttpStatus status = null;
		boolean valid = false;
		valid = docService.validDocumentId(document);
		if (valid == true) {
			status = HttpStatus.OK;
		} else {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@GetMapping("/rest/admin/document/getAllInvalidDocument")
	public ResponseEntity<PageDTO<Document>> getAllUnvalidDocument(@RequestParam Integer page,
			@RequestParam Integer element) {
		HttpStatus httpStatus = null;
		PageDTO<Document> result = null;
		try {
			result = docService.getAllInvalidDocument(page, element);
			httpStatus = HttpStatus.OK;
		} catch (Exception e) {
			httpStatus = HttpStatus.BAD_REQUEST;
		}
		return new ResponseEntity<PageDTO<Document>>(result, httpStatus);
	}
}
