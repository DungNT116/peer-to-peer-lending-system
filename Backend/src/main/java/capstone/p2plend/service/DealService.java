package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.DealRepository;
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
	JwtService jwtService;

	public List<Deal> findAll() {
		return dealRepo.findAll();
	}

	public Boolean approveRequest(Deal deal) {

		String status = "Approved";
		deal.setStatus(status);

		return false;
	}

	public Deal getOneById(int id) {
		return dealRepo.findById(id).get();
	}

	public boolean makeDeal(Deal deal, String token) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);

			Request request = requestRepo.findById(deal.getRequest().getId()).get();
			
			if(request != null) {
				return false;
			}
			
			request.setLender(user);

			deal.setRequest(request);
			deal.setStatus("dealing");

			dealRepo.save(deal);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	public boolean acceptDeal(Deal deal, String token) {
		try {
			
			Deal dealExist = dealRepo.findById(deal.getId()).get();
			dealExist.setStatus("done");
			dealRepo.save(dealExist);
			
			return true;
		} catch (Exception e) {
			return false;
		}
	}
	
	
}
