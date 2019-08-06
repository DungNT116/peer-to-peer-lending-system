package capstone.p2plend.util;

import java.sql.Timestamp;
import java.util.Date;
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

//	@Scheduled(cron = "* * * * * ?")
//	public void testScheduler() {				
//		System.out.println("run ..");
//	}

	@Scheduled(cron = "0 0 4 * * ?")
	public void sendMailScheduler() {
		try {
			System.out.println("Start scaning system...");
			List<Request> lstRequest = requestRepo.findAllRequestByStatus("trading");
			for (int i = 0; i < lstRequest.size(); i++) {
				Request r = lstRequest.get(i);
				Deal deal = r.getDeal();
				User borrower = r.getBorrower();
				User lender = r.getLender();
				List<Milestone> lstMilestone = deal.getMilestone();
				for (int x = 0; x < lstMilestone.size(); x++) {
					Milestone m = lstMilestone.get(x);
					if (m.getPercent() == null) {
						continue;
					}
					Long time = m.getPreviousDate() * 1000;
					Timestamp stamp = new Timestamp(time);
					Date date = new Date(stamp.getTime());
					Date currentDate = new Date();
					date.before(currentDate);
				}
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
	}

}
