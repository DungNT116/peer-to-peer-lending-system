package capstone.p2plend.repo;

import capstone.p2plend.entity.Document;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentRepository extends JpaRepository<Document, Integer> {
	
	@Query(value = "SELECT * FROM document WHERE document_id = :status AND document_type_id = :documentTypeId", nativeQuery = true)
	Document findByDocumentIdAndDocumentType(@Param("documentId") String documentId, @Param("documentTypeId") Integer documentTypeId);
	
	@Query(value = "SELECT * FROM document WHERE status = :status", nativeQuery = true)
	Page<Document> findAllDocumentWithStatus(Pageable pageable, @Param("status") String status);
		
	@Query(value = "SELECT * FROM document WHERE document_type_id = :documentTypeId AND user_id = :id", nativeQuery = true)
	Document findUserDocument(@Param("documentType") Integer documentTypeId, @Param("id") Integer id);
}
