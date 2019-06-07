package capstone.p2plend.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(value = { "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "deal")
public class Deal {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column
	private String status;

	@Column
	private Integer borrowTime;

	@Column
	private Integer paybackTime;

	@JsonIgnoreProperties(value = { "borrower", "lender", "deal" })
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "request_id")
	private Request request;

	@JsonIgnoreProperties(value = { "transaction", "deal" })
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "deal")
	private List<Milestone> milestone = new ArrayList<>();

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Integer getBorrowTime() {
		return borrowTime;
	}

	public void setBorrowTime(Integer borrowTime) {
		this.borrowTime = borrowTime;
	}

	public Integer getPaybackTime() {
		return paybackTime;
	}

	public void setPaybackTime(Integer paybackTime) {
		this.paybackTime = paybackTime;
	}

	public Request getRequest() {
		return request;
	}

	public void setRequest(Request request) {
		this.request = request;
	}

	public List<Milestone> getMilestone() {
		return milestone;
	}

	public void setMilestone(List<Milestone> milestone) {
		this.milestone = milestone;
	}

}
