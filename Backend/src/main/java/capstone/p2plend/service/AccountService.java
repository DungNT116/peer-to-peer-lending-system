package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.p2plend.entity.Account;
import capstone.p2plend.repo.AccountRepository;

@Service
public class AccountService {
	public static List<Account> listAccount = new ArrayList<Account>();
	static {
		Account accountKai = new Account("kai", "123456");
		accountKai.setRoles(new String[] { "ROLE_ADMIN" });
		Account accountSena = new Account("sena", "123456");
		accountSena.setRoles(new String[] { "ROLE_USER" });
		listAccount.add(accountKai);
		listAccount.add(accountSena);
	}

	@Autowired
	AccountRepository accountRepo;
	
	public List<Account> findAll() {
		return accountRepo.findAll();
	}

	public Account findById(int id) {
		for (Account account : listAccount) {
			if (account.getId() == id) {
				return account;
			}
		}
		return null;
	}

	public boolean add(Account account) {
		for (Account accountExist : listAccount) {
			if (account.getId() == accountExist.getId()
					|| StringUtils.equals(account.getUsername(), accountExist.getUsername())) {
				return false;
			}
		}
		listAccount.add(account);
		return true;
	}

	public void delete(int id) {
		listAccount.removeIf(account -> account.getId() == id);
	}

	public Account loadAccountByUsername(String accountname) {
		for (Account account : listAccount) {
			if (account.getUsername().equals(accountname)) {
				return account;
			}
		}
		return null;
	}

	public boolean checkLogin(Account account) {
		for (Account accountExist : listAccount) {
			if (StringUtils.equals(account.getUsername(), accountExist.getUsername())
					&& StringUtils.equals(account.getPassword(), accountExist.getPassword())) {
				return true;
			}
		}
		return false;
	}
}