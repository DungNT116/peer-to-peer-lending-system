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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.entity.DocumentFile;
import capstone.p2plend.service.DocumentFileService;

@RestController
public class DocumentFileController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(DocumentFileController.class);

	@Autowired
	DocumentFileService dfService;

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@PostMapping("/rest/documentFile/uploadFile")
	public ResponseEntity<Integer> uploadFile(@RequestParam("file") MultipartFile[] file) {
		LOGGER.info("CALL method POST /rest/documentFile/uploadFile");
		HttpStatus status = null;
		boolean valid = false;
		try {
			valid = dfService.uploadDocument(file);
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
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping("/rest/documentFile/downloadFile")
	public ResponseEntity<DocumentFile> uploadFile(@RequestParam("id") Integer id) {
		LOGGER.info("CALL method GET /rest/documentFile/downloadFile");
		HttpStatus status = null;
		DocumentFile result = null;
		try {
			result = dfService.downloadDocument(id);
			if (result != null) {
				status = HttpStatus.OK;
			} else {
				status = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<DocumentFile>(result, status);
	}

	@CrossOrigin
	@Secured({ "ROLE_ADMIN", "ROLE_USER" })
	@GetMapping("/rest/documentFile/getDocumentFiles")
	public ResponseEntity<List<DocumentFile>> getDocumentFiles(@RequestParam("id") Integer id) {
		LOGGER.info("CALL method GET /rest/documentFile/getDocumentFiles");
		HttpStatus httpStatus = null;
		List<DocumentFile> result = null;
		try {
			result = dfService.getDocumentFiles(id);
			if (result != null) {
				httpStatus = HttpStatus.OK;
			} else {
				httpStatus = HttpStatus.BAD_REQUEST;
			}
		} catch (Exception e) {
			LOGGER.error("Server Error", e);
			httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<List<DocumentFile>>(result, httpStatus);
	}
}
