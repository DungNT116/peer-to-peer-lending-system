package capstone.p2plend.payload;

public class ParaRespone {

	private Long loanLimit;
	private Float interestRate;

	public ParaRespone() {
	}
	
	public ParaRespone(Long loanLimit, Float interestRate) {
		super();
		this.loanLimit = loanLimit;
		this.interestRate = interestRate;
	}

	public Long getLoanLimit() {
		return loanLimit;
	}

	public void setLoanLimit(Long loanLimit) {
		this.loanLimit = loanLimit;
	}

	public Float getInterestRate() {
		return interestRate;
	}

	public void setInterestRate(Float interestRate) {
		this.interestRate = interestRate;
	}
	
}
