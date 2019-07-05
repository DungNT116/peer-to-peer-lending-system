package capstone.p2plend.repo;


import org.springframework.data.jpa.repository.JpaRepository;

import capstone.p2plend.entity.BackupMilestone;

public interface BackupMilestoneRepository extends JpaRepository<BackupMilestone, Integer> {
	
}
