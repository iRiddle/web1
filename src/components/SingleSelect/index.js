import React, { Component } from "react";
import Select from "react-select";

class SingleSelect extends Component {
  /**
   * callback from parent to update new value.
   */

  handleChange = value => {
    const { onChange } = this.props;
    onChange(value);
  };

  getOptions = () => {
    const { persona, options } = this.props;
    switch (persona) {
      case "Ranch Planner": {
        return options.map(i => {
          return {
            ...i,
            id: i.CompanyId,
            value: i.CompanyName,
            label: i.CompanyName
          };
        });
      }
      case "Harvest Planner": {
        return options.map(i => {
          return {
            ...i,
            id: i.DistrictId,
            value: i.DistrictName,
            label: i.DistrictName
          };
        });
      }
      case "Ranch Admin": {
        return options.map(i => {
          return {
            ...i,
            id: i.DistrictId,
            value: i.DistrictName,
            label: i.DistrictName
          };
        });
      }
      default:
        return options;
    }
  };

  render() {
    const { placeholder, container, value } = this.props;

    return (
      <div className={container}>
        <Select
          value={value}
          onChange={this.handleChange}
          styles={customStyles}
          placeholder={placeholder}
          className="basic-single"
          classNamePrefix="select"
          isDisabled={false}
          isLoading={false}
          isClearable={false}
          isRtl={false}
          isSearchable={true}
          name="single-select"
          options={this.getOptions()}
          theme={theme => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "EEEEEE",
              primary: "E0E0E0"
            }
          })}
        />
      </div>
    );
  }
}

export default SingleSelect;

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "gray" : "",
    padding: 20,
    borderRadius: 2
  }),
  control: (base, state) => ({
    ...base,
    minHeight: "56px",
    borderRadius: "4px",
    "&:hover": { borderColor: "#FDDA24", transition: "opacity 5000ms" },
    border: "1px solid lightgray",
    boxShadow: "none"
  }),
  menu: base => ({
    ...base,
    zIndex: 100
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 800ms";

    return { ...provided, opacity, transition };
  }
};
