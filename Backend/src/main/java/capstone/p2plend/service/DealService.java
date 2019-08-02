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

	public List<Deal> findAll() {
		return dealRepo.findAll();
	}

	public Deal getOneById(Integer id) {
		if (id == null) {
			return null;
		}
		return dealRepo.findById(id).get();
	}

	public boolean makeDeal(Deal deal, String token) {
		if (deal.getMilestone() == null || deal.getId() == null || deal.getBorrowTime() == null
				|| deal.getPaybackTime() == null)
			return false;

		String username = jwtService.getUsernameFromToken(token);
		if (username == null) {
			return false;
		}
		User user = userRepo.findByUsername(username);
		if (user == null) {
			return false;
		}
		List<Milestone> listMilestone = deal.getMilestone();
		if (listMilestone == null) {
			return false;
		}

		Deal existDeal = dealRepo.findById(deal.getId()).get();
		if (existDeal == null) {
			return false;
		}

		User existUser = existDeal.getUser();
		if (existUser.getId() == user.getId()) {
			return false;
		}

		existDeal.setStatus("dealing");
		existDeal.setBorrowTime(deal.getBorrowTime());
		existDeal.setPaybackTime(deal.getPaybackTime());
		existDeal.setUser(user);

		List<Milestone> lstMs = existDeal.getMilestone();

		for (Milestone m : lstMs) {
			milestoneRepo.deleteMilestoneByDealId(m.getDeal().getId());
		}

		for (Milestone m : listMilestone) {
			m.setDeal(existDeal);
		}
		existDeal.setMilestone(listMilestone);
		Deal savedDeal = dealRepo.saveAndFlush(existDeal);

		Request existRequest = savedDeal.getRequest();
		if (existRequest == null) {
			return false;
		}

		if (existRequest.getLender() == null) {
			existRequest.setLender(user);
		}

		existRequest.setStatus("dealing");
		requestRepo.saveAndFlush(existRequest);

		return true;
	}

	public boolean acceptDeal(Deal deal, String token) {
		if(deal.getId() == null) return false;
		
		String username = jwtService.getUsernameFromToken(token);
		if (username == null) {
			return false;
		}
		User user = userRepo.findByUsername(username);
		if (user == null) {
			return false;
		}

		Deal dealExist = dealRepo.findById(deal.getId()).get();
		if (dealExist == null) {
			return false;
		}

		dealExist.setStatus("accepted");
		dealRepo.save(dealExist);

		Request request = dealExist.getRequest();
		if (request == null) {
			return false;
		}

		request.setStatus("trading");
		request.setBorrowDate(deal.getRequest().getBorrowDate());
		if (request.getLender() == null) {
			request.setLender(user);
		}
		requestRepo.save(request);

		return true;
	}

	public boolean cancelDeal(Deal dealGet, String token) {
		if(dealGet.getId() == null) {
			return false;
		}
		
		Deal deal = dealRepo.findById(dealGet.getId()).get();
		if (deal == null) {
			return false;
		}
		BackupDeal backupDeal = deal.getBackupDeal();
		if (backupDeal == null) {
			return false;
		}

		List<BackupMilestone> lstBackupMilestone = backupDeal.getBackupMilestone();
		if (lstBackupMilestone == null) {
			return false;
		}

		Request request = deal.getRequest();
		if (request == null) {
			return false;
		}

		request.setLender(null);
		request.setStatus("pending");
		requestRepo.saveAndFlush(request);

		List<Milestone> lstMs = deal.getMilestone();
		if (lstMs == null) {
			return false;
		}

		for (Milestone m : lstMs) {
			milestoneRepo.deleteMilestoneByDealId(m.getDeal().getId());
		}

		deal.setBorrowTime(backupDeal.getBorrowTime());
		deal.setPaybackTime(backupDeal.getPaybackTime());
		deal.setStatus(backupDeal.getStatus());
		deal.setUser(request.getBorrower());
		Deal savedDeal = dealRepo.saveAndFlush(deal);

		List<Milestone> newLstMilestone = new ArrayList<>();
		for (BackupMilestone bm : lstBackupMilestone) {
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
	}

}
