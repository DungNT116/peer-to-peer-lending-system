package capstone.p2plend.repo;

import capstone.p2plend.entity.Document;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
	
	Document findByDocumentIdAndDocumentType(String docId, String docType);
	
	@Query(value = "SELECT * FROM document WHERE document_id is null", nativeQuery = true)
	List<Document> findAllNullDocument();
		
	@Query(value = "SELECT * FROM document WHERE document_type = :documentType AND user_id = :id", nativeQuery = true)
	Document findUserDocument(@Param("documentType") String documentType, @Param("id") Integer id);
}
