package capstone.p2plend.repo;

import capstone.p2plend.entity.DocumentFile;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentFileRepository extends JpaRepository<DocumentFile, Integer> {

	@Query(value = "SELECT * FROM document_file WHERE document_id = :id", nativeQuery = true)
	List<DocumentFile> findDocumentFiles(@Param("id") Integer id);

	@Query(value = "DELETE FROM document_file WHERE document_id = :id;", nativeQuery = true)
	void deleteByDocId(@Param("id") Integer id);
}
