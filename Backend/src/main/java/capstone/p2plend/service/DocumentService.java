package capstone.p2plend.service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
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
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.DocumentFileRepository;
import capstone.p2plend.repo.DocumentRepository;
import capstone.p2plend.repo.DocumentTypeRepository;
import capstone.p2plend.repo.UserRepository;
import capstone.p2plend.util.Keccak256Hashing;

@Service
public class DocumentService {
	
	@Autowired
	Keccak256Hashing kh;

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

	public boolean uploadDocument(Integer docTypeId, String token, MultipartFile[] mf) throws IOException {
		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);
		if (docTypeId == null || docTypeId == 2 || user == null || username == null) {
			return false;
		}
		Document iDoc = new Document();

		Document checkExistDocument = docRepo.findUserDocumentExceptStatus(docTypeId, user.getId(), "invalid");
		if (checkExistDocument != null) {
			return false;
		}

		checkExistDocument = docRepo.findUserDocumentWithStatus(docTypeId, user.getId(), "invalid");
		if (checkExistDocument != null) {
			iDoc = checkExistDocument;
			docFileRepo.deleteAllByDocId(checkExistDocument.getId());
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
	}

	public boolean uploadVideo(Integer docTypeId, String fileType, String token, String base64Video) {
		if (base64Video == null || token == null) {
			return false;
		}
		String[] splits = base64Video.split(",");
		String base64 = splits[1];
		System.out.println(splits[0]);

		boolean checkBase64 = Base64.isBase64(base64);
		if (checkBase64 == false) {
			return false;
		}

		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);
		if (docTypeId == null || docTypeId != 2) {
			return false;
		}
		Document iDoc = new Document();

		Document checkExistDocument = docRepo.findUserDocumentExceptStatus(docTypeId, user.getId(), "invalid");
		if (checkExistDocument != null) {
			return false;
		}

		checkExistDocument = docRepo.findUserDocumentWithStatus(docTypeId, user.getId(), "invalid");
		if (checkExistDocument != null) {
			iDoc = checkExistDocument;
			docFileRepo.deleteAllByDocId(checkExistDocument.getId());
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
	}

	public List<Document> getUserDocument(String token) {
		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);
		List<Document> lstDoc = user.getDocument();
		if (lstDoc == null) {
			return null;
		}
		for (Document d : lstDoc) {
			d.setUser(null);
		}
		return lstDoc;

	}

	public List<Document> getAllUserDocument(String username) {
		User user = userRepo.findByUsername(username);
		if (user == null) {
			return null;
		}
		List<Document> lstDoc = user.getDocument();
		if (lstDoc == null) {
			return null;
		}
		for (Document d : lstDoc) {
			d.setUser(null);
		}
		return lstDoc;
	}

	public boolean validDocumentId(Document document) {
		if (document.getDocumentId() == null || document.getId() == null) {
			return false;
		}

		Document checkDocExist = docRepo.findById(document.getId()).get();

		// Receive document with id and docId
		Document findDoc = docRepo.findByDocumentIdAndDocumentType(document.getDocumentId(),
				checkDocExist.getDocumentType().getId());
		if (findDoc != null) {
			return false;
		}

		Document existDoc = docRepo.findById(document.getId()).get();
		existDoc.setDocumentId(document.getDocumentId());
		existDoc.setStatus("valid");
		docRepo.save(existDoc);

		User user = existDoc.getUser();
		List<Document> lstUserDocument = user.getDocument();

		Long limit = 0L;
		int count = 0;
		for (int i = 0; i < lstUserDocument.size(); i++) {
			Document d = lstUserDocument.get(i);
			if (d.getDocumentType().getName().equalsIgnoreCase("Identity Card")
					&& d.getStatus().equalsIgnoreCase("valid")) {
				limit += d.getDocumentType().getAmountLimit();
				count = 1;
				lstUserDocument.remove(i);
				break;
			}
		}

		if (count == 1) {
			for (int i = 0; i < lstUserDocument.size(); i++) {
				Document d = lstUserDocument.get(i);
				if (d.getDocumentType().getName().equalsIgnoreCase("Video")
						&& d.getStatus().equalsIgnoreCase("valid")) {
					limit += d.getDocumentType().getAmountLimit();
					user.setLoanLimit(limit);
					user = userRepo.save(user);
					count = 2;
					lstUserDocument.remove(i);
					break;
				}
			}
		}

		if (count == 2) {
			for (int i = 0; i < lstUserDocument.size(); i++) {
				Document d = lstUserDocument.get(i);
				if (!d.getDocumentType().getName().equalsIgnoreCase("Identity Card")
						&& !d.getDocumentType().getName().equalsIgnoreCase("Video")
						&& d.getStatus().equalsIgnoreCase("valid")) {
					limit += d.getDocumentType().getAmountLimit();
					user.setLoanLimit(limit);
					user = userRepo.save(user);
				}
			}
		}

		return true;
	}

	public PageDTO<Document> getAllPendingDocument(Integer page, Integer element) {
		if (page == null || element == null) {
			return null;
		}
		Pageable pageable = PageRequest.of(page - 1, element);
		Page<Document> lstDoc = docRepo.findAllDocumentWithStatus(pageable, "pending");
		if (lstDoc == null) {
			return null;
		}
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

	}

	public boolean invalidDocumentId(Integer id) {
		if (id == null) {
			return false;
		}

		Document existDoc = docRepo.findById(id).get();
		if (existDoc == null) {
			return false;
		}
		existDoc.setStatus("invalid");
		docRepo.saveAndFlush(existDoc);

		return true;
	}

	public File getHashFile(String token) throws IOException {
		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);
		List<Document> lstDocument = user.getDocument();
		lstDocument.toString();

		File file = new File("write.txt");
		Writer writer = new BufferedWriter(new FileWriter(file));
		String contents = kh.hashWithBouncyCastle(lstDocument.toString());
		
		
		
		writer.write(contents);
		writer.close();
		
		return file;
	}
	
	public File getHashFileTest() throws IOException {
		File file = new File("write.txt");
		Writer writer = new BufferedWriter(new FileWriter(file));
		String contents = kh.hashWithBouncyCastle("This is the hash sample");
		
		writer.write(contents);
		writer.close();
		
		return file;
	}
}