package capstone.p2plend.repo;

import capstone.p2plend.entity.Document;
import capstone.p2plend.entity.DocumentType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, Integer> {
	
}
