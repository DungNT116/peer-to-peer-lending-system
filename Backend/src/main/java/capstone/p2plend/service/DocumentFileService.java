package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.entity.DocumentFile;
import capstone.p2plend.repo.DocumentFileRepository;

@Service
public class DocumentFileService {

	@Autowired
	DocumentFileRepository docFileRepo;

	public boolean uploadDocument(MultipartFile[] mf) {
		try {

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
		} catch (Exception e) {
			return false;
		}
	}

	public DocumentFile downloadDocument(int id) {
		return docFileRepo.findById(id).get();
	}

	public List<DocumentFile> getDocumentFiles(Integer id) {
		try {

			List<DocumentFile> lstDocFile = docFileRepo.findDocumentFiles(id);
			
			for(DocumentFile df : lstDocFile) {
				df.setDocument(null);
			}
					
			return lstDocFile;
			
		} catch (Exception e) {
			return null;
		}
	}
}
