package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import capstone.p2plend.entity.User;
import capstone.p2plend.repo.UserRepository;

@Service
public class UserService {

	@Autowired
	UserRepository accountRepo;

	@Transactional
	public List<User> findAll() {
		return accountRepo.findAll();
	}
	
	@Transactional
	public User getOneById(int id) {
		User account = accountRepo.findById(id).get();
		account.setPassword(null);		
		return account;
	}

	@Transactional
	public User findUsername(String username) {
		return accountRepo.findByUsername(username);
	}

	@Transactional
	public boolean checkLogin(User account) {

		String username = account.getUsername();
		String password = account.getPassword();

		User checkExist = accountRepo.findByUsernameAndPassword(username, password);

		if (checkExist != null) {
			return true;
		}

		return false;
	}
	
	@Transactional
	public User createAccount(User account) {
		
		account.setRole(null);
		account.setStatus("pending");
		
		return accountRepo.save(account);
	}
	
	@Transactional
	public boolean activeAccount(int id) {
		boolean valid = false;		
		try {
			User account = accountRepo.findById(id).get();
			account.setRole("ROLE_USER");
			account.setStatus("active");			
			accountRepo.save(account);
			valid = true;
		} catch (Exception e) {
			valid = false;
			return valid;
		}		
		return valid;
	}
	
	@Transactional
	public boolean deactivateAccount(int id) {
		boolean valid = false;		
		try {
			User account = accountRepo.findById(id).get();
			account.setRole(null);
			account.setStatus("deactivate");			
			accountRepo.save(account);
			valid = true;
		} catch (Exception e) {
			valid = false;
			return valid;
		}		
		return valid;
	}
}