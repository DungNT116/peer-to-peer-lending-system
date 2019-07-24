package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.Document;
import capstone.p2plend.entity.DocumentFile;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.User;
import capstone.p2plend.enums.DocumentType;
import capstone.p2plend.repo.DocumentFileRepository;
import capstone.p2plend.repo.DocumentRepository;
import capstone.p2plend.repo.UserRepository;

@Service
public class DocumentService {

	@Autowired
	DocumentRepository docRepo;

	@Autowired
	DocumentFileRepository docFileRepo;

	@Autowired
	JwtService jwtService;

	@Autowired
	UserRepository userRepo;

	public boolean uploadDocument(String documentId, String documentType, String token, MultipartFile[] mf) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);
			if (documentType == null) {
				return false;
			}
			Document iDoc = new Document();
			DocumentType dt = DocumentType.valueOf(documentType.toUpperCase());
			switch (dt) {
			case ID:
				iDoc.setDocumentType("Identity Card");
				break;
			case PP:
				iDoc.setDocumentType("Passport");
				break;
			case DL:
				iDoc.setDocumentType("Driving Licence");
				break;
			default:
				return false;
			}
			Document checkExistDocument = docRepo.findUserDocument(iDoc.getDocumentType(), user.getId());
			if (checkExistDocument != null) {
				return false;
			}
			iDoc.setStatus("invalid");
			iDoc.setUser(user);
			Document savedDoc = docRepo.saveAndFlush(iDoc);

			int totalFile = mf.length;
			for (int i = 0; i < totalFile; i++) {

				String fileName = StringUtils.cleanPath(mf[i].getOriginalFilename());
//				if (fileName.contains("..")) {
//					return false;
////		                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
//				}
				DocumentFile df = new DocumentFile();
				df.setFileName(fileName);
				df.setFileType(mf[i].getContentType());
				df.setData(mf[i].getBytes());
				df.setDocument(savedDoc);
				docFileRepo.saveAndFlush(df);

			}

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public List<Document> getUserDocument(String token) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);
			List<Document> lstDoc = user.getDocument();
			for (Document d : lstDoc) {
				d.setUser(null);
			}
			return lstDoc;
		} catch (Exception e) {
			return null;
		}

	}

	public boolean validDocumentId(Document document) {
		try {

			if (document.getDocumentId() == null) {
				return false;
			}

			// Receive document with id and docId
			Document findDoc = docRepo.findByDocumentIdAndDocumentType(document.getDocumentId(),
					docRepo.findById(document.getId()).get().getDocumentType());

			if (findDoc != null) {
				return false;
			}

			Document existDoc = docRepo.findById(document.getId()).get();
			if(!existDoc.getDocumentId().equals(document.getDocumentId())) {
				return false;
			}
			existDoc.setStatus("valid");
			docRepo.saveAndFlush(existDoc);

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public PageDTO<Document> getAllInvalidDocument(Integer page, Integer element) {
		try {
			Pageable pageable = PageRequest.of(page - 1, element);
			Page<Document> lstDoc = docRepo.findAllDocumentWithStatus(pageable, "invalid");
			for (Document d : lstDoc) {
				User user = new User();
				user.setUsername(d.getUser().getUsername());
				user.setFirstName(d.getUser().getFirstName());
				user.setLastName(d.getUser().getLastName());
				d.setUser(user);

				d.setDocumentId(null);
				d.setDocumentFile(null);
			}

			PageDTO<Document> pageDTO = new PageDTO<>();
			pageDTO.setMaxPage(lstDoc.getTotalPages());
			pageDTO.setData(lstDoc.getContent());

			return pageDTO;

		} catch (Exception e) {
			return null;
		}
	}

}
