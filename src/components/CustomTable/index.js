import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TablePagination,
  TableFooter,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Tooltip,
  Paper,
  Link,
  Button,
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel
} from "@material-ui/core/";
import { Create } from "@material-ui/icons/";

import { desc, stableSort, getSorting } from "../../utils/helper";
import leafLoader from "../../../assets/images/berry.gif";

const TableCellLink = props => (
  <a href={props.url} target="pdflink" {...props} />
);

const styles = theme => ({
  root: {
    overflowX: "scroll"
  },
  row: {
    backgroundColor: "#fafafa"
  },
  tableCell: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "70%",
    padding: "4px 10px 4px 10px"
  },
  headFont: {
    fontWeight: 550
  },
  table: {
    minWidth: 700
  },
  tableWrapper: {
    overflowX: "auto"
  },
  rowFount: {
    fontWeight: 500
  },
  linkFont: {
    color: "#009dee"
  },
  wrapper: {
    display: "flex",
    justifyContent: "center"
  },
  isHoverEdit: {
    cursor: "pointer",
    "&:hover": {
      color: "black"
    }
  }
});

const Loader = ({ classes }) => (
  <TableRow>
    <TableCell
      align={"center"}
      className={classes.tableCell}
      scope={"row"}
      colSpan="10"
    >
      <div>
        <img src={leafLoader} />
      </div>
    </TableCell>
  </TableRow>
);

class CustomTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "calories",
    page: 0,
    rowsPerPage: 5,
    configTime: '',
    configTimezone: ''
  };

  createSortHandler = property => event => {
    this.handleRequestSort(event, property);
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";
    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: Number(event.target.value) });
  };

  getStatusMessage = status => {
    switch (status) {
      case "ACTIVE":
        return "User is active";

      case "PROVISIONED":
        return "User action is pending";

      case "STAGED":
        return "User is staged";

      default:
        return "No data available";
    }
  };

  handleMultipleAssignments = assignments => {
    if (!assignments) return "";

    const assignmentArray = assignments.split(",").map(item => item.trim());
    let displayedAssignments = [];
    let remainingAssignments = [];
    let assignmentObj = {
      assignment: assignments,
      tooltip: assignments
    };

    if (assignmentArray.length > 2) {
      // push first
      displayedAssignments.push(assignmentArray[0]);
      displayedAssignments.push(assignmentArray[1]);
      remainingAssignments = assignmentArray.splice(2);

      assignmentObj = {
        assignment: `${displayedAssignments
          .toString()
          .replace(",", ", ")} and ${remainingAssignments.length} more`,
        tooltip: assignments.toString().replace(",", ", ")
      };
    }
    return assignmentObj;
  };
  render() {
    const { classes, columns, data, customStyles, openEditPopup, openEdit, isEdit, arrTimePicker, tableType, languageMap } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    const hasActionColumn =
      columns.filter(col => col.id === "action").length > 0;

    return (
      <Paper className={classes.root} style={customStyles}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.row}>
              {columns.map(
                column =>
                  column.isChecked && (
                    <TableCell
                      className={classes.tableCell}
                      align="justify"
                      key={column.id}
                      sortDirection={orderBy === column.id ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement={
                          column.numeric ? "bottom-end" : "bottom-start"
                        }
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={order}
                          onClick={this.createSortHandler(column.id)}
                        >
                          <Typography
                            variant="body2"
                            gutterBottom
                            style={
                              column.id === "name" ? { paddingLeft: 0 } : null
                            }
                            className={classes.headFont}
                          >
                            {column.label}
                          </Typography>
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  ),
                this
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {!data.length && <Loader classes={classes} />}
            {stableSort(data, getSorting(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                const key = Math.random()
                  .toFixed(5)
                  .replace(".", "_");
                return (
                  <TableRow hover key={key}>
                    {columns.map(column => {
                      const columnKey = `${key}-column-${column.id}`;
                      if (column.id === "name") {
                        return (
                          column.isChecked && (
                            <Tooltip
                              key={columnKey}
                              title={
                                <div>
                                  Phone: {row.phone}
                                  <br />
                                  Email: {row.email}
                                </div>
                              }
                              placement={
                                column.numeric ? "bottom-end" : "bottom-start"
                              }
                              enterDelay={300}
                            >
                              <TableCell
                                className={classes.tableCell}
                                align="justify"
                              >
                                <Typography className={classes.rowFont}>
                                  {row.name}
                                </Typography>
                              </TableCell>
                            </Tooltip>
                          )
                        );
                      }

                      if (column.id === "action") {
                        return (
                          column.isChecked && (
                            <TableCell
                              key={columnKey}
                              className={classes.tableCell}
                              component="th"
                              scope="row"
                              align="inherit"
                              style={{ marginLeft: "40rem" }}
                            >
                              <Typography className={classes.rowFont}>
                                <Create
                                  color="disabled"
                                  className={classes.isHoverEdit}
                                  onClick={() => openEditPopup(row)}
                                />
                              </Typography>
                            </TableCell>
                          )
                        );
                      }

                      if (column.id === "ConfigValue") {
                        return (
                          column.isChecked && (
                            <TableCell
                              key={columnKey}
                              className={classes.tableCell}
                              align="justify"
                            >
                              {isEdit === true ? (
                                <React.Fragment>
                                  <FormControl variant="outlined" style={{marginTop: "5px"}}>
                                    <InputLabel htmlFor="outlined-time-simple">
                                      Time
                                    </InputLabel>
                                    <Select
                                      onChange={(event) => {
                                        this.setState({
                                          configTime: event.target.value
                                        });
                                        row[column.id] = `${event.target.value} ${row[column.id].substr(row[column.id].length - 3)}`;
                                      }}
                                      value={this.state.configTime || row[column.id].slice(0, -4)}
                                      input={<OutlinedInput labelWidth={40} name="time" id="outlined-time-simple" />}
                                    >
                                      {arrTimePicker.map((x) => <MenuItem key={x} value={x}>{x}</MenuItem>)}
                                    </Select>
                                  </FormControl>
                                  <FormControl variant="outlined" style={{marginTop: "5px"}}>
                                    <InputLabel htmlFor="outlined-time-simple">
                                      Timezone
                                    </InputLabel>
                                    <Select
                                      onChange={(event) => {
                                        this.setState({
                                          configTimezone: event.target.value
                                        });
                                        row[column.id] = `${row[column.id].slice(0, -4)} ${event.target.value}`;
                                      }}
                                      style={{ marginLeft: "5px" }}
                                      value={this.state.configTimezone || row[column.id].substr(row[column.id].length - 3)}
                                      input={<OutlinedInput labelWidth={65} name="timezone" id="outlined-timezone-simple" />}
                                    >
                                      <MenuItem value="PST">PST</MenuItem>
                                      <MenuItem value="MST">MST</MenuItem>
                                      <MenuItem value="CST">CST</MenuItem>
                                      <MenuItem value="EST">EST</MenuItem>
                                    </Select>
                                  </FormControl>
                                </React.Fragment>
                              ) : (
                                <Typography className={classes.rowFont}>
                                  {row[column.id]}
                                </Typography>
                              )}
                            </TableCell>
                          )
                        );
                      }

                      if (column.id === "actionEdit") {
                        return (
                          column.isChecked && (
                            <TableCell
                              key={columnKey}
                              className={classes.tableCell}
                              component="th"
                              scope="row"
                              align="inherit"
                              style={{ marginLeft: "40rem" }}
                            >
                              <Button
                                variant="contained"
                                size="large"
                                onClick={() => openEdit(row)}
                                style={{
                                  padding: "6px 24px",
                                  marginLeft: "12px",
                                  boxShadow: "none",
                                  cursor: "pointer"
                                }}
                              >
                                <label htmlFor="faqUpload" style={{ cursor: "pointer" }}>
                                  {isEdit === true ? languageMap && languageMap.save : languageMap && languageMap.edit}
                                </label>
                              </Button>
                            </TableCell>
                          )
                        );
                      }

                      if (tableType === "reminder") {
                        if (column.id === "CreatedBy") { // using on reminder page
                          return (
                            column.isChecked && (
                              <TableCell
                                key={columnKey}
                                className={classes.tableCell}
                                align="justify"
                              >
                                <Typography className={classes.rowFont}>
                                  {row["CreatedByName"]}
                                </Typography>
                              </TableCell>
                            )
                          );
                        }
  
                        if (column.id === "LastModifiedBy") { // using on reminder page
                          return (
                            column.isChecked && (
                              <TableCell
                                key={columnKey}
                                className={classes.tableCell}
                                align="justify"
                              >
                                <Typography className={classes.rowFont}>
                                  {row["LastModifiedByName"]}
                                </Typography>
                              </TableCell>
                            )
                          );
                        }

                        if (column.id === "CreatedOn") {
                          return (
                            <TableCell
                              key={columnKey}
                              className={classes.tableCell}
                              align="justify"
                            >
                              <Typography className={classes.rowFont}>
                                {moment(row.CreatedOn).format("DD/MM/YYYY")}
                              </Typography>
                            </TableCell>
                          );
                        }
  
                        if (column.id === "LastModifiedOn") {
                          return (
                            <TableCell
                              key={columnKey}
                              className={classes.tableCell}
                              align="justify"
                            >
                              <Typography className={classes.rowFont}>
                                {moment(row.LastModifiedOn).format("DD/MM/YYYY")}
                              </Typography>
                            </TableCell>
                          );
                        }
                      }

                      if (column.id === "assignment") {
                        return (
                          column.isChecked && (
                            <Tooltip
                              key={columnKey}
                              title={
                                this.handleMultipleAssignments(row.assignment)
                                  .tooltip
                              }
                              placement={
                                column.numeric ? "bottom-end" : "bottom-start"
                              }
                              enterDelay={300}
                            >
                              <TableCell
                                className={classes.tableCell}
                                align="justify"
                              >
                                <Typography className={classes.rowFont}>
                                  {
                                    this.handleMultipleAssignments(
                                      row.assignment
                                    ).assignment
                                  }
                                </Typography>
                              </TableCell>
                            </Tooltip>
                          )
                        );
                      }

                      if (column.id === "status") {
                        return (
                          column.isChecked && (
                            <Tooltip
                              key={columnKey}
                              title={this.getStatusMessage(row.status)}
                              placement={
                                column.numeric ? "bottom-end" : "bottom-start"
                              }
                              enterDelay={300}
                            >
                              <TableCell
                                className={classes.tableCell}
                                align="justify"
                              >
                                <Typography className={classes.rowFont}>
                                  {row.status}
                                </Typography>
                              </TableCell>
                            </Tooltip>
                          )
                        );
                      }

                      if (column.id === "lastLogOn") {
                        return (
                          <TableCell
                            key={columnKey}
                            className={classes.tableCell}
                            align="justify"
                          >
                            <Typography className={classes.rowFont}>
                              {moment(row.lastLogOn).format("DD/MM/YYYY hh:mm A")}
                            </Typography>
                          </TableCell>
                        );
                      }

                      if (column.id === "createdOn") {
                        return (
                          <TableCell
                            key={columnKey}
                            className={classes.tableCell}
                            align="justify"
                          >
                            <Typography className={classes.rowFont}>
                              {moment(row.createdOn).format("DD/MM/YYYY hh:mm A")}
                            </Typography>
                          </TableCell>
                        );
                      }

                      if (column.id === "lastModifiedOn") {
                        return (
                          <TableCell
                            key={columnKey}
                            className={classes.tableCell}
                            align="justify"
                          >
                            <Typography className={classes.rowFont}>
                              {moment(row.lastModifiedOn).format(
                                "DD/MM/YYYY hh:mm A"
                              )}
                            </Typography>
                          </TableCell>
                        );
                      }

                      if (column.id === "fileName") {
                        return (
                          <TableCell
                            key={columnKey}
                            className={classes.tableCell}
                            align="justify"
                          >
                            <Link
                              component={TableCellLink}
                              url={row.fileUrl}
                              className={classes.linkFont}
                            >
                              {row[column.id]}
                            </Link>
                          </TableCell>
                        );
                      }

                      return (
                        column.isChecked &&
                        column.id !== "action" && (
                          <TableCell
                            key={columnKey}
                            className={classes.tableCell}
                            align="justify"
                          >
                            <Typography className={classes.rowFont}>
                              {row[column.id]}
                            </Typography>
                          </TableCell>
                        )
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  native: true
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    );
  }
}

CustomTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomTable);
