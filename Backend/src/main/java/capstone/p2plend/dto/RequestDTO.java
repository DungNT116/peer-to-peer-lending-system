package capstone.p2plend.dto;

public class RequestDTO {
	private Integer id;
	private long amount;
	private Integer fromAccount;
	private Integer toAccount;
	private Integer deal;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public long getAmount() {
		return amount;
	}

	public void setAmount(long amount) {
		this.amount = amount;
	}

	public Integer getFromAccount() {
		return fromAccount;
	}

	public void setFromAccount(Integer fromAccount) {
		this.fromAccount = fromAccount;
	}

	public Integer getToAccount() {
		return toAccount;
	}

	public void setToAccount(Integer toAccount) {
		this.toAccount = toAccount;
	}

	public Integer getDeal() {
		return deal;
	}

	public void setDeal(Integer deal) {
		this.deal = deal;
	}

//	private Date dueDate;
//	private Integer times;
//	private Date duration;
//	private Date interestDate;
//	private Date createDate;

}
