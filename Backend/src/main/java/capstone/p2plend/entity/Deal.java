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
@Table(name = "Deal")
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

	@JsonIgnoreProperties(value = { "deal" })
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "request_id", referencedColumnName = "id")
	private Request request;

	@JsonIgnoreProperties(value = { "deal" })
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "deal")
	private List<Milestone> milestone = new ArrayList<>();

	@JsonIgnoreProperties(value = { "deal" })
	@OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "deal")
	private BackupDeal backupDeal;

	public Deal() {
	}

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

	public BackupDeal getBackupDeal() {
		return backupDeal;
	}

	public void setBackupDeal(BackupDeal backupDeal) {
		this.backupDeal = backupDeal;
	}

}
