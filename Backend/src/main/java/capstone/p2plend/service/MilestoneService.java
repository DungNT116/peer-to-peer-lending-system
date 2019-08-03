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
		if (milestone == null) {
			return false;
		}
		milestoneRepo.saveAndFlush(milestone);
		return true;
	}

	public boolean updateMilestone(Milestone milestone) {
		if (milestone == null) {
			return false;
		}
		milestoneRepo.saveAndFlush(milestone);
		return true;
	}
}
