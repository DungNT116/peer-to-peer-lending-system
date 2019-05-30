package capstone.p2plend.entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "request")
public class Request {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
	@JsonIgnore
	private Account account;
	
	@Column
	private long amount;
	
	@Column
	private String borrowDay;
	
	@Column
	private String borrowDuration;
	
	@Column
	private String interestedRate;
	
	@Column
	private String typeOfContact;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public long getAmount() {
		return amount;
	}

	public void setAmount(long amount) {
		this.amount = amount;
	}

	public String getBorrowDay() {
		return borrowDay;
	}

	public void setBorrowDay(String borrowDay) {
		this.borrowDay = borrowDay;
	}

	public String getBorrowDuration() {
		return borrowDuration;
	}

	public void setBorrowDuration(String borrowDuration) {
		this.borrowDuration = borrowDuration;
	}

	public String getInterestedRate() {
		return interestedRate;
	}

	public void setInterestedRate(String interestedRate) {
		this.interestedRate = interestedRate;
	}

	public String getTypeOfContact() {
		return typeOfContact;
	}

	public void setTypeOfContact(String typeOfContact) {
		this.typeOfContact = typeOfContact;
	}

	
	
	
}
