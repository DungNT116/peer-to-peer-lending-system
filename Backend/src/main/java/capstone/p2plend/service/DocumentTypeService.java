package capstone.p2plend.service;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import capstone.p2plend.entity.Document;
import capstone.p2plend.entity.DocumentFile;
import capstone.p2plend.entity.DocumentType;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.DocumentFileRepository;
import capstone.p2plend.repo.DocumentTypeRepository;

@Service
public class DocumentTypeService {

	@Autowired
	DocumentTypeRepository docTypeRepo;

	public List<DocumentType> listDocumentType() {
		List<DocumentType> lstDocType = docTypeRepo.findAll();
		if (listDocumentType() == null) {
			return null;
		}
		return lstDocType;
	}

	public boolean newDocumentType(DocumentType documentType) {
		if (documentType.getName() == null || documentType.getAmountLimit() == null) {
			return false;
		}
		DocumentType savedDocumentType = docTypeRepo.save(documentType);
		if (savedDocumentType != null) {
			return true;
		}
		return false;
	}

	public boolean updateDocumentType(DocumentType documentType) {
		if (documentType.getId() == null)
			return false;
		DocumentType existedDocType = docTypeRepo.findById(documentType.getId()).get();
		if (existedDocType == null)
			return false;

		if (documentType.getName() != null) {
			existedDocType.setName(documentType.getName());
		}

		if (documentType.getAmountLimit() != null) {
			existedDocType.setAmountLimit(documentType.getAmountLimit());
		}

		DocumentType savedDocType = docTypeRepo.save(existedDocType);
		if (savedDocType != null)
			return true;

		return false;
	}
}
