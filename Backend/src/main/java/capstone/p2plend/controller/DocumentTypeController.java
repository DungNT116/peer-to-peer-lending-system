package capstone.p2plend.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import capstone.p2plend.entity.DocumentType;
import capstone.p2plend.service.DocumentTypeService;

@RestController
public class DocumentTypeController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(DocumentTypeController.class);

	@Autowired
	DocumentTypeService docTypeService;
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping(value = "/rest/documentType/listDocumentType")
	public ResponseEntity<List<DocumentType>> listDocumentType() {
		LOGGER.info("CALL method GET /rest/documentType/listDocumentType");
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
			LOGGER.error("Server Error", e);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<List<DocumentType>>(result, status);
	}
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@PostMapping(value = "/rest/admin/documentType/newDocumentType")
	public ResponseEntity<String> newDocumentType(@RequestBody DocumentType docType) {
		LOGGER.info("CALL method POST /rest/admin/documentType/newDocumentType");
		HttpStatus status = null;
		String result = null;
		try {
			result = docTypeService.newDocumentType(docType);
			if (result.equalsIgnoreCase("success")) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<String>(result, status);
	}
	
	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@PutMapping(value = "/rest/admin/documentType/updateDocumentType")
	public ResponseEntity<String> updateDocumentType(@RequestBody DocumentType docType) {
		LOGGER.info("CALL method PUT /rest/admin/documentType/updateDocumentType");
		HttpStatus status = null;
		String result = null;
		try {
			result = docTypeService.updateDocumentType(docType);
			if (result.equalsIgnoreCase("success")) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<String>(result, status);
	}
}
