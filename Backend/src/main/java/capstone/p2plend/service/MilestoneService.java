package capstone.p2plend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.p2plend.entity.Milestone;
import capstone.p2plend.repo.MilestoneRepository;

@Service
public class MilestoneService {

	@Autowired
	MilestoneRepository milestoneRepo;
	
	public boolean newMilestone(Milestone milestone) {
		try {

			milestoneRepo.saveAndFlush(milestone);
			
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	public boolean updateMilestone(Milestone milestone) {
		try {

			milestoneRepo.saveAndFlush(milestone);
			
			return true;
		} catch (Exception e) {
			return false;
		}
	}
}
