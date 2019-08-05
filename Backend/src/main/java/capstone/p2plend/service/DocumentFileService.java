package capstone.p2plend.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.entity.Document;
import capstone.p2plend.entity.DocumentFile;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.DocumentFileRepository;

@Service
public class DocumentFileService {

	@Autowired
	DocumentFileRepository docFileRepo;

	public boolean uploadDocument(MultipartFile[] mf) throws IOException {
		if (mf == null) {
			return false;
		}

		int number = mf.length;
		for (int i = 0; i < number; i++) {
			String fileName = StringUtils.cleanPath(mf[i].getOriginalFilename());

			DocumentFile df = new DocumentFile();
			df.setFileName(fileName);
			df.setFileType(mf[i].getContentType());
			df.setData(mf[i].getBytes());

			docFileRepo.saveAndFlush(df);
		}

		return true;
	}

	public DocumentFile downloadDocument(Integer id) {
		if (id == null) {
			return null;
		}
		DocumentFile df = docFileRepo.findById(id).get();
		if (df == null) {
			return null;
		}
		return df;
	}

	public List<DocumentFile> getDocumentFiles(Integer id) {
		List<DocumentFile> lstDocFile = docFileRepo.findDocumentFiles(id);
		if (lstDocFile == null) {
			return null;
		}
		for (DocumentFile df : lstDocFile) {
			User user = df.getDocument().getUser();
			Document document = new Document();

			User attachUser = new User();
			attachUser.setUsername(user.getUsername());
			attachUser.setFirstName(user.getFirstName());
			attachUser.setLastName(user.getLastName());
			document.setUser(attachUser);
			df.setDocument(document);
		}
		return lstDocFile;
	}
}
