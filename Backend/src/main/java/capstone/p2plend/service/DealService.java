package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.p2plend.entity.Deal;
import capstone.p2plend.repo.DealRepository;

@Service
public class DealService {

	@Autowired
	DealRepository dealRepo;
	
	public List<Deal> findAll(){
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
	
	public Deal makeDeal() {
		
		return null;
	}
}