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

	public String newDocumentType(DocumentType documentType) {
		if (documentType.getName() == null || documentType.getAmountLimit() == null
				|| documentType.getAcronym() == null) {
			return "Name or Amount or Acronym cannot be null";
		}

		List<DocumentType> lstDocumentType = docTypeRepo.findAll();
		for (int i = 0; i < lstDocumentType.size(); i++) {
			DocumentType dt = lstDocumentType.get(i);
			if (dt.getName().equalsIgnoreCase(documentType.getName())) {
				return "The name " + documentType.getName() + " is already existed";
			}
			if (dt.getAcronym().equalsIgnoreCase(documentType.getAcronym())) {
				return "The acronym " + documentType.getAcronym() + " is already existed";
			}
		}

		DocumentType savedDocumentType = docTypeRepo.save(documentType);
		if (savedDocumentType != null) {
			return "success";
		}
		return "Error";
	}

	public String updateDocumentType(DocumentType documentType) {
		if (documentType.getId() == null) {
			return "Field Id cannot be null";
		}

		DocumentType existedDocType = docTypeRepo.findById(documentType.getId()).get();
		if (existedDocType == null) {
			return "There no document type with existed id";
		}

		List<DocumentType> lstDocumentType = docTypeRepo.findAll();
		for (int i = 0; i < lstDocumentType.size(); i++) {
			DocumentType dt = lstDocumentType.get(i);
			if (documentType.getName() != null) {
				if (dt.getName().equalsIgnoreCase(documentType.getName())) {
					return "The name " + documentType.getName() + " is already existed";
				}
			}
			if (documentType.getAcronym() != null) {
				if (dt.getAcronym().equalsIgnoreCase(documentType.getAcronym())) {
					return "The acronym " + documentType.getAcronym() + " is already existed";
				}
			}

		}

		if (documentType.getName() != null) {
			existedDocType.setName(documentType.getName());
		}

		if (documentType.getAmountLimit() != null) {
			existedDocType.setAmountLimit(documentType.getAmountLimit());
		}

		if (documentType.getAcronym() != null) {
			existedDocType.setAcronym(documentType.getAcronym());
		}

		DocumentType savedDocType = docTypeRepo.saveAndFlush(existedDocType);
		if (savedDocType != null)
			return "success";

		return "Error";
	}
}
