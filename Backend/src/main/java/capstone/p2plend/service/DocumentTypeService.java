package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.p2plend.entity.DocumentType;
import capstone.p2plend.repo.DocumentTypeRepository;

@Service
public class DocumentTypeService {

	@Autowired
	DocumentTypeRepository docTypeRepo;

	public List<DocumentType> listDocumentType() {
		List<DocumentType> lstDocType = docTypeRepo.findAll();
		if (lstDocType == null) {
			return null;
		}
		for (DocumentType dt : lstDocType) {
			dt.setDocument(null);
		}
		return lstDocType;
	}

	public boolean newDocumentType(DocumentType documentType) {
		if (documentType.getName() == null || documentType.getAmountLimit() == null
				|| documentType.getAcronym() == null) {
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

		if (documentType.getAcronym() != null) {
			existedDocType.setAcronym(documentType.getAcronym());
		}

		DocumentType savedDocType = docTypeRepo.save(existedDocType);
		if (savedDocType != null)
			return true;

		return false;
	}
}
