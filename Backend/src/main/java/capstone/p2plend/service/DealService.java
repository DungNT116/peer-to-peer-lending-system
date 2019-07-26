package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.p2plend.entity.BackupDeal;
import capstone.p2plend.entity.BackupMilestone;
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
			
			User existUser = existDeal.getUser();
			if(existUser.getId() == user.getId()) {
				return false;
			}
			
			existDeal.setStatus("dealing");
			existDeal.setBorrowTime(deal.getBorrowTime());
			existDeal.setPaybackTime(deal.getPaybackTime());
			existDeal.setUser(user);
			
			
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
	
	public boolean cancelDeal(int id, String token) {
		try {
			
			Deal deal = dealRepo.findById(id).get();
			BackupDeal backupDeal = deal.getBackupDeal();
			List<BackupMilestone> lstBackupMilestone = backupDeal.getBackupMilestone();
			
			Request request = deal.getRequest();
			request.setLender(null);
			request.setStatus("pending");
			requestRepo.saveAndFlush(request);
			
			List<Milestone> lstMs = deal.getMilestone();
			for(Milestone m : lstMs) {
				milestoneRepo.deleteMilestoneByDealId(m.getDeal().getId());	
			}
			
			deal.setBorrowTime(backupDeal.getBorrowTime());
			deal.setPaybackTime(backupDeal.getPaybackTime());
			deal.setStatus(backupDeal.getStatus());
			deal.setUser(request.getBorrower());
			Deal savedDeal = dealRepo.saveAndFlush(deal);
			
			List<Milestone> newLstMilestone = new ArrayList<>();
			for(BackupMilestone bm : lstBackupMilestone) {
				Milestone milestone = new Milestone();
				milestone.setPercent(bm.getPercent());
				milestone.setPresentDate(bm.getPresentDate());
				milestone.setPreviousDate(bm.getPreviousDate());
				milestone.setType(bm.getType());
				milestone.setDeal(savedDeal);
				newLstMilestone.add(milestone);
			}
			savedDeal.setMilestone(newLstMilestone);
			dealRepo.saveAndFlush(deal);
			
			return true;
		} catch (Exception e) {
			return false;
		}
	}

}
