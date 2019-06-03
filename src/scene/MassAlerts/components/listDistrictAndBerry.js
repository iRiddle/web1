import React, { Component } from "react";
import { Typography, Icon, Link } from "@material-ui/core";

class ListDistrictAndBerry extends Component {
  handleOnClick = index => {
    const { onClick } = this.props;
    onClick(index);
  };

  render() {
    const { dataList } = this.props;

    return (
      <div className="alert-options-container" style={{ marginTop: "20px" }}>
        <div className="alert-option">
          {dataList.length>0 && dataList.map((x, index) => {
            return (
              <React.Fragment key={x.districtId}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  style={{ fontWeight: "bold" }}
                >
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => this.handleOnClick(index)}
                  >
                    <Icon
                      className="far fa-trash-alt"
                      style={{
                        fontSize: "15px",
                        color: "#009dee",
                        marginRight: "40px"
                      }}
                    />
                  </Link>
                  {x.districtName}
                </Typography>

                {x.attribute.length>0 && x.attribute.map((y, index) => {
                  return (
                    <div className="alert-option" key={index} style={{ marginTop: "10px" }}>
                      <div className="alert-option-districts">
                        <div className="alert-option-district-item" style={{ marginLeft: "70px", marginTop: "10px" }}>
                          <Typography variant="subtitle2" gutterBottom>
                            <Icon className="fas fa-chevron-right" style={{ fontSize: "11px", marginRight: "10px" }} />
                            {y.companyName}
                          </Typography>

                          <div className="alert-option-berry-field">
                            <Typography variant="subtitle2" gutterBottom style={{ marginLeft: "20px" }}>
                              {y.berryTypeName} &nbsp;&nbsp;&nbsp;&nbsp; {y.ranchName}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}                
              </React.Fragment>
            )
          })}
        </div>
      </div>
    );
  }
}

export default ListDistrictAndBerry;
