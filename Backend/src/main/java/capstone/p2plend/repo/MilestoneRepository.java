package capstone.p2plend.repo;

import capstone.p2plend.entity.Milestone;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface MilestoneRepository extends JpaRepository<Milestone, Integer> {

	@Transactional
	@Modifying
	@Query(value = "DELETE FROM milestone WHERE deal_id = :dealId", nativeQuery = true)
	void deleteMilestoneByDealId(@Param("dealId") Integer dealId);
	
	@Query(value = "SELECT * FROM milestone WHERE deal_id = :dealId", nativeQuery = true)
	List<Milestone> findListMilestoneByDealId(@Param("dealId") Integer dealId);
	
}
