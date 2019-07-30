package capstone.p2plend.service;

import java.util.List;

import org.apache.tomcat.util.codec.binary.Base64;
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
import capstone.p2plend.entity.DocumentType;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.DocumentFileRepository;
import capstone.p2plend.repo.DocumentRepository;
import capstone.p2plend.repo.DocumentTypeRepository;
import capstone.p2plend.repo.UserRepository;

@Service
public class DocumentService {

	@Autowired
	DocumentRepository docRepo;

	@Autowired
	DocumentFileRepository docFileRepo;

	@Autowired
	DocumentTypeRepository docTypeRepo;

	@Autowired
	JwtService jwtService;

	@Autowired
	UserRepository userRepo;

	public boolean uploadDocument(Integer docTypeId, String token, MultipartFile[] mf) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);
			if (docTypeId == null || docTypeId == 2) {
				return false;
			}
			Document iDoc = new Document();

			Document checkExistDocument = docRepo.findUserDocument(docTypeId, user.getId());
			if (checkExistDocument != null) {
				return false;
			}
			DocumentType docType = docTypeRepo.findById(docTypeId).get();

			iDoc.setDocumentType(docType);
			iDoc.setStatus("pending");
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

	public boolean uploadVideo(Integer docTypeId, String fileType, String token, String base64Video) {
		try {

			String[] splits = base64Video.split(",");
			String base64 = splits[1];
			System.out.println(splits[0]);
			
			
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);
			if (docTypeId == null || docTypeId != 2) {
				return false;
			}
			Document iDoc = new Document();

			Document checkExistDocument = docRepo.findUserDocument(docTypeId, user.getId());
			if (checkExistDocument != null) {
				return false;
			}
			DocumentType docType = docTypeRepo.findById(docTypeId).get();

			iDoc.setDocumentType(docType);
			iDoc.setStatus("pending");
			iDoc.setUser(user);
			Document savedDoc = docRepo.saveAndFlush(iDoc);

//			byte[] name = Base64.getEncoder().encode((base64Video.getBytes()));
//			byte[] decodedString = Base64.getDecoder().decode(new String(name).getBytes("UTF-8"));
//            System.out.println(new String(decodedString));

			byte[] byteArray = Base64.decodeBase64(base64.getBytes());
            
			DocumentFile df = new DocumentFile();
			df.setFileName(username + "_Video");
			df.setData(byteArray);
			df.setFileType(fileType);
			df.setDocument(savedDoc);
			docFileRepo.saveAndFlush(df);

			return true;
		} catch (Exception e) {
			return false; // TODO: handle exception
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

	public List<Document> getAllUserDocument(String username) {
		try {
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
					document.getDocumentType().getId());

			if (findDoc != null) {
				return false;
			}

			Document existDoc = docRepo.findById(document.getId()).get();
			existDoc.setDocumentId(document.getDocumentId());
			existDoc.setStatus("valid");
			docRepo.saveAndFlush(existDoc);

			User user = existDoc.getUser();
			List<Document> lstUserDocument = user.getDocument();
			Long limit = 0L;
			for (Document d1 : lstUserDocument) {
				if (d1.getDocumentType().getId() == 1 && d1.getStatus().equalsIgnoreCase("valid")) {
					limit += d1.getDocumentType().getAmountLimit();
					for (Document d2 : lstUserDocument) {
						if (d2.getDocumentType().getId() == 2 && d2.getStatus().equalsIgnoreCase("valid")) {
							limit += d2.getDocumentType().getAmountLimit();
							user.setLoanLimit(limit);
							userRepo.saveAndFlush(user);

							for (Document d3 : lstUserDocument) {
								if (d3.getDocumentType().getId() != 1 && d3.getDocumentType().getId() != 2
										&& d3.getStatus().equalsIgnoreCase("valid")) {
									limit += d3.getDocumentType().getAmountLimit();
									user.setLoanLimit(limit);
									userRepo.saveAndFlush(user);
								}
							}
						}
					}
				}
			}

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public PageDTO<Document> getAllPendingDocument(Integer page, Integer element) {
		try {
			Pageable pageable = PageRequest.of(page - 1, element);
			Page<Document> lstDoc = docRepo.findAllDocumentWithStatus(pageable, "pending");
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

	public boolean invalidDocumentId(Integer id) {
		try {

			if (id == null) {
				return false;
			}

			Document existDoc = docRepo.findById(id).get();
			existDoc.setStatus("invalid");
			docRepo.saveAndFlush(existDoc);

			return true;
		} catch (Exception e) {
			return false;
		}
	}
}