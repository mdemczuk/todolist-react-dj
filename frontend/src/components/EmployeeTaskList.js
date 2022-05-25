import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import Container from "@mui/system/Container";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DownloadIcon from "@mui/icons-material/Download";
import { visuallyHidden } from "@mui/utils";


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
    id: "description",
    numeric: false,
    disablePadding: false,
    label: <b>Description</b>,
  },
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: <b>Category</b>,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: <b>Status</b>,
  },
  {
    id: "due_date",
    numeric: false,
    disablePadding: false,
    label: <b>Due date</b>,
  },
  {
    id: "buttons",
    numeric: false,
    disablePadding: false,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
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

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EmployeeTaskList({ employeeId }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskDescription, setTaskDescription] = useState("");
  const [taskCategory, setTaskCategory] = useState();
  const [taskStatus, setTaskStatus] = useState();
  let dateNow = new Date().toISOString().split("T")[0];
  const [taskDueDate, setTaskDueDate] = useState(dateNow);

  const EnhancedTableToolbar = (props) => {
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }}
      >
        <Typography
          sx={{ flex: "1 1 60%" }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          Tasks
        </Typography>
        <Tooltip title="Add task">
          <IconButton onClick={() => setModalOpen(true)}>
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export to CSV">
        <a href= {`/api/csv_export/?owner_id=${ employeeId }`}> 
        <IconButton>
            <DownloadIcon />
          </IconButton></a>
        </Tooltip>
      </Toolbar>
    );
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeStatus = (event, index) => {
    const currentTask = data[index + page * rowsPerPage].id;
    let newData = [...data];
    newData[index + page * rowsPerPage].status = event.target.value;
    setData(newData);
    axios
      .patch(`/api/task/${currentTask}/`, {
        status: event.target.value,
      })
      .catch((error) => console.log("Error."));
  };

  const addTask = () => {
    axios
      .post("/api/task/", {
        description: taskDescription,
        status: taskStatus,
        category: taskCategory,
        due_date: taskDueDate.toISOString().split("T")[0],
        owner: employeeId,
      })
      .then(function (response) {
        axios
          .get(
            `/api/task_by_owner/?owner_id=${employeeId}`
          )
          .then(function (response) {
            setData(response.data);
          });
        setModalOpen(false);
      });
  };

  const deleteTask = (index) => {
    let inx = index + page * rowsPerPage;
    const currentTask = data[inx].id;
    let newData = [...data];
    if (inx !== -1) {
      newData.splice(inx, 1);
      setData(newData);
      console.log(data);
    }
    axios.delete(`/api/task/${currentTask}/`)
  };

  useEffect(() => {
    axios
      .get(`/api/task_by_owner/?owner_id=${employeeId}`)
      .then(function (response) {
        setData(response.data);
      });
  }, []);

  return (
    <>
      <Container sx={{ mt: 2, maxWidth: "lg" }}>
        <Box>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <EnhancedTableToolbar />
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={data.length}
                />
                <TableBody>
                  {stableSort(data, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow hover tabIndex={-1} key={data.id}>
                          <TableCell
                            component="th"
                            id={row.index}
                            scope="row"
                            padding={"auto"}
                            width={400}
                          >
                            {row.description}
                          </TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell>{row.due_date}</TableCell>
                          <TableCell>
                            <Grid
                              container
                              direction="row"
                              justifyContent="flex-end"
                            >
                              <Grid item>
                                <FormControl
                                  sx={{ minWidth: 130 }}
                                  size="small"
                                >
                                  <InputLabel>Status</InputLabel>
                                  <Select
                                    defaultValue=""
                                    onChange={(event) =>
                                      handleChangeStatus(event, index)
                                    }
                                    label="Status"
                                  >
                                    <MenuItem value={"To do"}>To do</MenuItem>
                                    <MenuItem value={"In progress"}>
                                      In progress
                                    </MenuItem>
                                    <MenuItem value={"Done"}>Done</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item>
                                <Tooltip title="Delete task">
                                  <IconButton onClick={() => deleteTask(index)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Container>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add task
          </Typography>
          <Container>
            <Box mt={3}>
              <Grid container justifyContent="space-between">
                <Grid item xs={12} mt={2}>
                  <TextField
                    label="Description"
                    variant="outlined"
                    value={taskDescription.value}
                    onChange={(event) => setTaskDescription(event.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    maxRows={4}
                  />
                </Grid>
                <Grid item>
                  <Grid container spacing={2} mt={1}>
                    <Grid item>
                      <FormControl sx={{ minWidth: 210 }} size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                          defaultValue=""
                          onChange={(event) =>
                            setTaskStatus(event.target.value)
                          }
                          label="Status"
                        >
                          <MenuItem value={"To do"}>To do</MenuItem>
                          <MenuItem value={"In progress"}>In progress</MenuItem>
                          <MenuItem value={"Done"}>Done</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl sx={{ minWidth: 210 }} size="small">
                        <InputLabel>Category</InputLabel>
                        <Select
                          defaultValue=""
                          onChange={(event) =>
                            setTaskCategory(event.target.value)
                          }
                          label="Category"
                        >
                          <MenuItem value={"Category1"}>Category1</MenuItem>
                          <MenuItem value={"Category2"}>Category2</MenuItem>
                          <MenuItem value={"Category3"}>Category3</MenuItem>
                          <MenuItem value={"Category4"}>Category4</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={2} mb={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Due date"
                      value={taskDueDate}
                      onChange={(newValue) => {
                        setTaskDueDate(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => setModalOpen(false)}
                  >
                    Close
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={addTask}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </Box>
      </Modal>
    </>
  );
}