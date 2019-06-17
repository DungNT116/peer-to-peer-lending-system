import React from "react";

// reactstrap components
import { Pagination, PaginationItem, PaginationLink, Col } from "reactstrap";
import { apiLink } from "api";
import { connect } from 'react-redux';

class PaginationSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: [],
      // isPrintThreeDots: false
    }
    this.isPrintThreeDots = false;
    this.sendDataToDataTable = this.sendDataToDataTable.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
  }

  componentDidMount() {
    this.renderPagination();
  }

  async sendDataToDataTable(index) {
    //setState for page variable
    await this.props.changePage(index);

    //onChange will call getRequest() to get list request with page update in function above
    this.props.onChange();
  }

  //index is the page number and it will be render in this function
  renderPagination(maxPage, currentPage, index) {
    var lastPageThreeDots = maxPage - 3;
    var firstPageThreeDots = 3;
    var numberOfNextPage = 1;
    if (maxPage <= 6) {
      return (<PaginationItem onClick={() => this.sendDataToDataTable(index)} key={index} className={(() => {
        if (index === currentPage) {
          return "active";
        } else {
          return "";
        }
      })()}>
        <PaginationLink>
          {index}
        </PaginationLink>
      </PaginationItem>);
    } else {

      // }
      // console.log("currentPage: " + currentPage)
      //3 case: 
      //currentPage in first 9 pages
      //currentPage in last 9 pages
      //currentPage in middle of last and first 9 pages

      //currentPage in first 9 pages
      if (currentPage <= firstPageThreeDots) {
        // 3 case:
        //index [0, currentPage + 3]
        //index [maxPage -3, maxPage]
        // render component ...
        if (index <= currentPage + numberOfNextPage) {
          //index in [currentPage, currentPage + 3]
          //example index: 2, currentPage = 1 
          //-> this block code will render the paginationItem
          return (<PaginationItem onClick={() => this.sendDataToDataTable(index)} key={index} className={(() => {
            if (index === currentPage) {
              return "active";
            } else {
              return "";
            }
          })()}>
            <PaginationLink>
              {index}
            </PaginationLink>
          </PaginationItem>);
        } else if (index >= maxPage - numberOfNextPage) {
          //index in last 3 pages
          return (<PaginationItem onClick={() => this.sendDataToDataTable(index)} key={index} className={(() => {
            if (index === currentPage) {
              return "active";
            } else {
              return "";
            }
          })()}>
            <PaginationLink>
              {index}
            </PaginationLink>
          </PaginationItem>);
        } else if (index === currentPage + numberOfNextPage + 1) {
          // render component ...
          return (<PaginationItem onClick={(e) => e.preventDefault()} key="...">
            <PaginationLink>
              ...
          </PaginationLink>
          </PaginationItem>);

        } else {
          // do nothing 
        }
      } else if (currentPage >= lastPageThreeDots) {
        //current Page in last 9 pages
        if (index <= numberOfNextPage + 2) { // <= 3
          return (<PaginationItem onClick={() => this.sendDataToDataTable(index)} key={index} className={(() => {
            if (index === currentPage) {
              return "active";
            } else {
              return "";
            }
          })()}>
            <PaginationLink>
              {index}
            </PaginationLink>
          </PaginationItem>);
        } else if (index >= currentPage - numberOfNextPage) {
          //render currentPage and the 3 previous pages
          return (<PaginationItem onClick={() => this.sendDataToDataTable(index)} key={index} className={(() => {
            if (index === currentPage) {
              return "active";
            } else {
              return "";
            }
          })()}>
            <PaginationLink>
              {index}
            </PaginationLink>
          </PaginationItem>);
        } else if (index === currentPage - numberOfNextPage - 1) {
          //render component ...
          return (<PaginationItem onClick={(e) => e.preventDefault()} key="...">
            <PaginationLink>
              ...
        </PaginationLink>
          </PaginationItem>);

        } else {
          // do nothing 
        }
      } else {
        // currentPage in the middle
        if (index <= numberOfNextPage + 2) { // <= 3
          return (<PaginationItem onClick={() => this.sendDataToDataTable(index)} key={index} className={(() => {
            if (index === currentPage) {
              return "active";
            } else {
              return "";
            }
          })()}>
            <PaginationLink>
              {index}
            </PaginationLink>
          </PaginationItem>);;
        } else if (index <= currentPage + numberOfNextPage && index >= currentPage - numberOfNextPage) {
          //index in [currentPage-3, currentPage, currentPage +3]
          return (<PaginationItem onClick={() => this.sendDataToDataTable(index)} key={index} className={(() => {
            if (index === currentPage) {
              return "active";
            } else {
              return "";
            }
          })()}>
            <PaginationLink>
              {index}
            </PaginationLink>
          </PaginationItem>);
        } else if (index >= maxPage - numberOfNextPage) {
          //index in [maxPage-3, maxPage]
          return (<PaginationItem onClick={() => this.sendDataToDataTable(index)} key={index} className={(() => {
            if (index === currentPage) {
              return "active";
            } else {
              return "";
            }
          })()}>
            <PaginationLink>
              {index}
            </PaginationLink>
          </PaginationItem>);
        } else if (index === currentPage + numberOfNextPage + 1) {
          //render component ...
          return (<PaginationItem onClick={(e) => e.preventDefault()} key="...">
            <PaginationLink>
              ...
        </PaginationLink>
          </PaginationItem>);
        } else if (index === currentPage - numberOfNextPage - 1) {
          //render component ...
          return (<PaginationItem onClick={(e) => e.preventDefault()} key="...2">
            <PaginationLink>
              ...
        </PaginationLink>
          </PaginationItem>);

        } else {
          // do nothing
        }
      }
    }
  }



  render() {
    // let isPrintThreeDots = false;
    // lg="4" md="4" sm="4"
    return (
      <>
        <Col className={(() => {
          if (this.props.maxPage <= 6) {
            return "offset-md-4";
          } else {
            return "offset-md-3";
          }
        })()}>
          <nav aria-label="Page navigation example">
            <Pagination>
              <PaginationItem>
                <PaginationLink href="#pablo" onClick={e => e.preventDefault()}>
                  <i className="fa fa-angle-left" />
                </PaginationLink>
              </PaginationItem>
              {Array.from(Array(this.props.maxPage)).map((maxPage, index) =>
                this.renderPagination(this.props.maxPage, this.props.currentPage, index + 1)
              )}
              <PaginationItem>
                <PaginationLink href="#pablo" onClick={e => e.preventDefault()}>
                  <i className="fa fa-angle-right" />
                </PaginationLink>
              </PaginationItem>
            </Pagination>
          </nav>
        </Col>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tokenReducer: state.tokenReducer,
    paging: state.paging
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    setPage: (page) => {
      dispatch({
        type: "SET_PAGE_NUMBER",
        payload: page
      });
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaginationSection);
