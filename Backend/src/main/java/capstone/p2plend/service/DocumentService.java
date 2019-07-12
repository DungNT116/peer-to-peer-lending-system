package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.entity.Document;
import capstone.p2plend.entity.DocumentFile;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.DocumentRepository;
import capstone.p2plend.repo.UserRepository;

@Service
public class DocumentService {

	@Autowired
	DocumentRepository docRepo;

	@Autowired
	JwtService jwtService;

	@Autowired
	UserRepository userRepo;

	public boolean uploadDocument(Document document, String token, MultipartFile[] mf) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);
			if (document.getDocumentType() == null) {
				return false;
			}
			document.setUser(user);
			Document savedDoc = docRepo.saveAndFlush(document);

			int totalFile = mf.length;
			List<DocumentFile> lstDocImg = document.getDocumentFile();
			for (int i = 0; i < totalFile; i++) {
				for (DocumentFile di : lstDocImg) {
					String fileName = StringUtils.cleanPath(mf[i].getOriginalFilename());
					if(fileName.contains("..")) {
						return false;
//		                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
		            }
					di.setFileName(fileName);
					di.setFileType(mf[i].getContentType());
					di.setData(mf[i].getBytes());
					di.setDocument(savedDoc);
				}

			}

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean validDocumentId(Document document) {
		try {

			if (document.getDocumentId() == null) {
				return false;
			}

			Document existDoc = docRepo.findById(document.getId()).get();
			existDoc.setDocumentId(document.getDocumentId());

			return true;
		} catch (Exception e) {
			return false;
		}
	}

}
