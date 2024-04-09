import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import { TableRow, TableSortLabel } from "@mui/material";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import Slider from "@mui/material/Slider";
import { Edit } from "@mui/icons-material";
import { deleteData, fetchData } from "app/services/rest";
import { OPPORTUNITIES_MODEL } from "app/utils/constants";
import { gridViewReqBody } from "./constants";
import GridViewHeader from "./GridViewHeader";
import SnackbarPrompt from "../../components/SnackbarPrompt";
import SnackbarAlert from "../../components/SnackbarAlert";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "opportunitySeq",
    label: "Reference",
  },
  {
    id: "name",
    label: "Name",
  },
  {
    id: "company",
    label: "Company",
  },
  {
    id: "partner",
    label: "Customer/Prospect",
  },
  {
    id: "opportunityStatus",
    label: "Sales Stage",
  },
  {
    id: "amount",
    label: "Amount",
  },
  {
    id: "probability",
    label: "Probability",
  },
  {
    id: "expectedCloseDate",
    label: "Expected Closing date",
  },
  {
    id: "user",
    label: "Assigned To",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const navigate = useNavigate();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRowData, setSelectedRowData] = useState();
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [showAlertSnackbar, setShowAlertSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id, row) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      // If checkbox is checked, add the row to selectedRowData
      newSelected = newSelected.concat(selected, id);
      setSelectedRowData(row);
    } else {
      if (selectedRowData && selectedRowData.id === id) {
        // If the clicked item has the same ID as selectedRowData, remove it from selectedRowData
        setSelectedRowData(null);
      }
      if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [rows, order, orderBy, page, rowsPerPage]
  );
  const handleEdit = async (e, id) => {
    e.stopPropagation();
    navigate(`./../edit-opportunity/${selectedRowData?.id || id}`);
  };
  const handleDelete = async () => {
    if (!selectedRowData) {
      setAlertMessage("No row selected");
      setShowAlertSnackbar(true);
      return;
    } else {
      setShowSnackbar(true);
    }
  };

  const handleDeleteConfirm = async () => {
    const records = rows
      .filter((item) => selected.indexOf(item.id) !== -1 && item)
      .map((item) => ({ id: item.id, version: item.version }));
    const delReqBody = {
      records: records,
    };
    const response = await deleteData(OPPORTUNITIES_MODEL, delReqBody);
    console.log(response);
    if (response?.status === 0) {
      setRows((prev) => prev.filter((row) => !selected.includes(row.id)));
      setSelectedRowData("");
      setSelected((prev) =>
        prev.filter((index) => index !== selectedRowData?.id)
      );
    } else {
      setAlertMessage(
        "The record(s) are referenced by other records. Please remove all the references first."
      );
      setShowAlertSnackbar(true);
    }
  };
  const handleAlertConfirm = () => {
    setShowAlertSnackbar(false);
  };
  const handleDeleteCancel = () => {
    setShowSnackbar(false);
  };

  useEffect(() => {
    const fetchGridData = async () => {
      const response = await fetchData(OPPORTUNITIES_MODEL, gridViewReqBody);
      response?.data && setRows([...response?.data]);
    };
    fetchGridData();
  }, [refresh]);
  return (
    <>
      <GridViewHeader
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleRefresh={() => setRefresh((prev) => !prev)}
      />
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        {/* Checkbox for row selection */}
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "2%" }}>
                        <Edit onClick={(e) => handleEdit(e, row?.id)} />
                      </TableCell>
                      {/* Render data cells for each column */}
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="normal"
                      >
                        {row.opportunitySeq}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.company["name"]}</TableCell>
                      <TableCell>{row.partner["fullName"]}</TableCell>
                      <TableCell>{row.opportunityStatus["name"]}</TableCell>
                      <TableCell>{row.amount}</TableCell>
                      <TableCell>
                        <Slider
                          disabled
                          // defaultValue={row.probability}
                          aria-label="Disabled slider"
                          style={{ color: "#dc2626", height: 10 }}
                          sx={{
                            "& .MuiSlider-thumb": {
                              display: "none",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.expectedCloseDate}</TableCell>
                      <TableCell>{row.user["fullName"]}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      {showSnackbar && (
        <SnackbarPrompt
          message="Do you really want to delete the selected record(s)?"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {showAlertSnackbar && (
        <SnackbarAlert message={alertMessage} onConfirm={handleAlertConfirm} />
      )}
    </>
  );
}
