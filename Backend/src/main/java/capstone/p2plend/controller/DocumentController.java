package capstone.p2plend.controller;

import org.apache.tomcat.util.http.fileupload.UploadContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import capstone.p2plend.service.DocumentService;

@RestController
public class DocumentController {

	@Autowired
	DocumentService docService;
	
//	@PostMapping("/rest/document/uploadFile")
	
}
