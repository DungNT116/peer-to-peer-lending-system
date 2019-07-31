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
@Table(name = "BackupDeal")
public class BackupDeal {

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

	@JsonIgnoreProperties(value = { "backupDeal" })
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deal_id", referencedColumnName = "id")
	private Deal deal;

	@JsonIgnoreProperties(value = { "backupDeal" })
	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "backupDeal")
	private List<BackupMilestone> backupMilestone = new ArrayList<>();

	public BackupDeal() {
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

	public Deal getDeal() {
		return deal;
	}

	public void setDeal(Deal deal) {
		this.deal = deal;
	}

	public List<BackupMilestone> getBackupMilestone() {
		return backupMilestone;
	}

	public void setBackupMilestone(List<BackupMilestone> backupMilestone) {
		this.backupMilestone = backupMilestone;
	}

}
