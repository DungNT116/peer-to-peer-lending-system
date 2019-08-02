package capstone.p2plend.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.Document;
import capstone.p2plend.entity.DocumentType;
import capstone.p2plend.entity.Request;
import capstone.p2plend.service.DocumentService;
import capstone.p2plend.service.DocumentTypeService;

@RestController
public class DocumentTypeController {

	@Autowired
	DocumentTypeService docTypeService;
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/documentType/listDocumentType")
	public ResponseEntity<List<DocumentType>> listDocumentType() {
		HttpStatus status = null;
		List<DocumentType> result = null;
		try {
			result = docTypeService.listDocumentType();
			if (result != null) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<List<DocumentType>>(result, status);
	}
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@PostMapping(value = "/rest/admin/documentType/newDocumentType")
	public ResponseEntity<Integer> newDocumentType(@RequestBody DocumentType docType) {
		HttpStatus status = null;
		boolean result = false;
		try {
			result = docTypeService.newDocumentType(docType);
			if (result == true) {
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
	@Secured({ "ROLE_ADMIN" })
	@PutMapping(value = "/rest/admin/documentType/updateDocumentType")
	public ResponseEntity<Integer> updateDocumentType(@RequestBody DocumentType docType) {
		HttpStatus status = null;
		boolean result = false;
		try {
			result = docTypeService.updateDocumentType(docType);
			if (result == true) {
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
