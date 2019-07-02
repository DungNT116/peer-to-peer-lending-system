package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Milestone;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.DealRepository;
import capstone.p2plend.repo.MilestoneRepository;
import capstone.p2plend.repo.RequestRepository;
import capstone.p2plend.repo.UserRepository;

@Service
public class DealService {

	@Autowired
	DealRepository dealRepo;

	@Autowired
	UserRepository userRepo;

	@Autowired
	RequestRepository requestRepo;

	@Autowired
	MilestoneRepository milestoneRepo;

	@Autowired
	JwtService jwtService;

	public boolean newDeal(Deal deal) {
		try {

			dealRepo.saveAndFlush(deal);

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean updateDeal(Deal deal) {
		try {

			dealRepo.saveAndFlush(deal);

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public List<Deal> findAll() {
		return dealRepo.findAll();
	}

	public Deal getOneById(int id) {
		return dealRepo.findById(id).get();
	}

	public boolean makeDeal(Deal deal, String token) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);
			List<Milestone> listMilestone = deal.getMilestone();

			Deal existDeal = dealRepo.findById(deal.getId()).get();
			existDeal.setStatus("dealing");
			existDeal.setBorrowTime(deal.getBorrowTime());
			existDeal.setPaybackTime(deal.getPaybackTime());
			
			List<Milestone> lstMs = existDeal.getMilestone();
			for(Milestone m : lstMs) {
				milestoneRepo.deleteMilestoneByDealId(m.getDeal().getId());	
			}			
			
			for (Milestone m : listMilestone) {
				m.setDeal(existDeal);
			}
			existDeal.setMilestone(listMilestone);
			Deal savedDeal = dealRepo.saveAndFlush(existDeal);

			Request existRequest = savedDeal.getRequest();
			if (existRequest.getLender() == null) {
				existRequest.setLender(user);
			}
			existRequest.setStatus("dealing");
			requestRepo.saveAndFlush(existRequest);

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean acceptDeal(Deal deal, String token) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);

			Deal dealExist = dealRepo.findById(deal.getId()).get();
			dealExist.setStatus("accepted");
			dealRepo.saveAndFlush(dealExist);

			Request request = dealExist.getRequest();
			request.setStatus("trading");
			request.setBorrowDate(deal.getRequest().getBorrowDate());
			if (request.getLender() == null) {
				request.setLender(user);
			}
			requestRepo.saveAndFlush(request);
			
			return true;
		} catch (Exception e) {
			return false;
		}
	}

}
