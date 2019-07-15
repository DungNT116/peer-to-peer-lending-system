package capstone.p2plend.repo;

import capstone.p2plend.entity.Document;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
	Document findByDocumentIdAndDocumentType(String docId, String docType);
}
