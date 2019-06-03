import React, { Component } from "react";
import Select from "react-select";
import makeAnimated from "react-select/lib/animated";

class MultiSelect extends Component {
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
      case "Harvest Planner": {
        return options.map(i => {
          return {
            ...i,
            id: i.id,
            value: i.Name,
            label: i.Name
          };
        });
      }
      case "Ranch Planner": {
        return options.map(i => {
          return {
            ...i,
            id: i.Id,
            value: i.Name,
            label: i.Name
          };
        });
      }
      case "Regional Admin": {
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
            id: i.Id,
            value: i.Name,
            label: i.Name
          };
        });
      }
      default:
        return options;
    }
  };

  render() {
    const { placeholder, value } = this.props;
    return (
      <Select
        closeMenuOnSelect={false}
        components={makeAnimated()}
        isMulti
        value={value}
        styles={customStyles}
        onChange={this.handleChange}
        placeholder={placeholder}
        options={this.getOptions()}
        className="basic-single"
        classNamePrefix="select"
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        isRtl={false}
        isSearchable={true}
        name="multi-select"
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
    );
  }
}

export default MultiSelect;

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
