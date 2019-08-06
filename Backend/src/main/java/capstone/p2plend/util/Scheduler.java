package capstone.p2plend.util;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Milestone;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.RequestRepository;
import capstone.p2plend.service.EmailService;

@Component
public class Scheduler {

	@Autowired
	EmailService emailService;
	
	@Autowired
	RequestRepository requestRepo;
	
//	@Scheduled(cron = "0 55 15 * * ?")
//	public void testScheduler() {				
//		
//	}
	
//	@Scheduled(cron = "0 0 1 * * ?")
	public void testScheduler() {				
		try {
			List<Request> lstRequest = requestRepo.findAllRequestByStatus("trading");
			for(int i = 0; i < lstRequest.size(); i++) {
				Request r = lstRequest.get(i);
				Deal deal = r.getDeal();
				User borrower = r.getBorrower();
				User lender = r.getLender();
				List<Milestone> lstMilestone = deal.getMilestone();
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
	}
	
}
