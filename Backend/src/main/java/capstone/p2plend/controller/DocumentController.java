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
	
	private static final Logger LOGGER = LoggerFactory.getLogger(DocumentController.class);

	@Autowired
	DocumentService docService;

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@PostMapping("/rest/document/uploadFile")
	public ResponseEntity<Integer> uploadFile(@RequestParam("documentTypeId") Integer documentTypeId,
			@RequestHeader("Authorization") String token, @RequestParam("file") MultipartFile[] file) {
		LOGGER.info("CALL method POST /rest/document/uploadFile");
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = docService.uploadDocument(documentTypeId, token, file);
			if (valid == true) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Integer>(status.value(), status);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@PostMapping("/rest/document/uploadVideo")
	public ResponseEntity<Integer> uploadVideo(@RequestParam("documentTypeId") Integer documentTypeId,
			@RequestParam("fileType") String fileType, @RequestHeader("Authorization") String token,
			@RequestParam("base64Video") String base64Video) {
		LOGGER.info("CALL method POST /rest/document/uploadVideo");
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = docService.uploadVideo(documentTypeId, fileType, token, base64Video);
			if (valid == true) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Integer>(status.value(), status);
	}

	@CrossOrigin
	@Secured({ "ROLE_USER" })
	@GetMapping("/rest/document/getUserDocument")
	public ResponseEntity<List<Document>> getUserDocument(@RequestHeader("Authorization") String token) {
		LOGGER.info("CALL method GET /rest/document/getUserDocument");
		HttpStatus httpStatus = null;
		List<Document> result = null;
		try {
			result = docService.getUserDocument(token);
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<List<Document>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@PostMapping("/rest/admin/document/validDocument")
	public ResponseEntity<Integer> validDocument(@RequestBody Document document) {
		LOGGER.info("CALL method POST /rest/admin/document/validDocument");
		HttpStatus status = null;
		Boolean valid = null;
		try {
			valid = docService.validDocumentId(document);
			if (valid == true) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Integer>(status.value(), status);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@PostMapping("/rest/admin/document/invalidDocument")
	public ResponseEntity<Integer> invalidDocument(@RequestBody Document document) {
		LOGGER.info("CALL method POST /rest/admin/document/invalidDocument");
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = docService.invalidDocumentId(document.getId());
			if (valid == true) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<Integer>(status.value(), status);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@GetMapping("/rest/admin/document/getAllPendingDocument")
	public ResponseEntity<PageDTO<Document>> getAllPendingDocument(@RequestParam Integer page,
			@RequestParam Integer element) {
		LOGGER.info("CALL method GET /rest/admin/document/getAllPendingDocument");
		HttpStatus httpStatus = null;
		PageDTO<Document> result = null;
		try {
			result = docService.getAllPendingDocument(page, element);
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<PageDTO<Document>>(result, httpStatus);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN" })
	@GetMapping("/rest/admin/document/getAllUserDocument")
	public ResponseEntity<List<Document>> getAllUserDocument(@RequestParam("username") String username) {
		LOGGER.info("CALL method GET /rest/admin/document/getAllUserDocument");
		HttpStatus httpStatus = null;
		List<Document> result = null;
		try {
			result = docService.getAllUserDocument(username);
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<List<Document>>(result, httpStatus);
	}
}
