package capstone.p2plend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import capstone.p2plend.entity.Request;
import capstone.p2plend.repo.AccountRepository;
import capstone.p2plend.repo.RequestRepository;

@Service
public class RequestService {

	@Autowired
	RequestRepository requestRepo;

	@Autowired
	AccountRepository accountRepo;
	
	
	
	@Transactional
	public Request createRequest(Request request) {
		return requestRepo.save(request);
	}
}
