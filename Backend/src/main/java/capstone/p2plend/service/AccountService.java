package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import capstone.p2plend.entity.Account;
import capstone.p2plend.repo.AccountRepository;

@Service
public class AccountService {

	@Autowired
	AccountRepository accountRepo;

	@Transactional
	public List<Account> findAll() {
		return accountRepo.findAll();
	}

	@Transactional
	public Account findUsername(String username) {
		return accountRepo.findByUsername(username);
	}

	@Transactional
	public boolean checkLogin(Account account) {

		String username = account.getUsername();
		String password = account.getPassword();

		Account checkExist = accountRepo.findByUsernameAndPassword(username, password);

		if (checkExist != null) {
			return true;
		}

		return false;
	}
	
	@Transactional
	public Account createAccount(Account account) {
		return accountRepo.save(account);
	}
}