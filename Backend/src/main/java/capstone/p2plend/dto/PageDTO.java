package capstone.p2plend.dto;

import java.util.List;

public class PageDTO<T> {
	private int maxPage;
	private List<T> data;

	public int getMaxPage() {
		return maxPage;
	}

	public void setMaxPage(int maxPage) {
		this.maxPage = maxPage;
	}

	public List<T> getData() {
		return data;
	}

	public void setData(List<T> data) {
		this.data = data;
	}

}
