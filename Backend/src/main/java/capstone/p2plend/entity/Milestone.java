package capstone.p2plend.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(value = { "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "Milestone")
public class Milestone {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column
	private Long previousDate;

	@Column
	private Long presentDate;

	@Column
	private String type;

	@JsonInclude(JsonInclude.Include.ALWAYS)
	@Column
	private Float percent;

	@JsonIgnoreProperties(value = { "milestone" })
	@OneToOne(mappedBy = "milestone", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private Transaction transaction;

	@JsonIgnoreProperties(value = { "milestone" })
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deal_id")
	private Deal deal;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Long getPreviousDate() {
		return previousDate;
	}

	public void setPreviousDate(Long previousDate) {
		this.previousDate = previousDate;
	}

	public Long getPresentDate() {
		return presentDate;
	}

	public void setPresentDate(Long presentDate) {
		this.presentDate = presentDate;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Float getPercent() {
		return percent;
	}

	public void setPercent(Float percent) {
		this.percent = percent;
	}

	public Transaction getTransaction() {
		return transaction;
	}

	public void setTransaction(Transaction transaction) {
		this.transaction = transaction;
	}

	public Deal getDeal() {
		return deal;
	}

	public void setDeal(Deal deal) {
		this.deal = deal;
	}

}
