import { Container } from "@mui/system";
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers-pro";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EmployeeList() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  let dateNow = new Date().toISOString().split("T")[0];
  const [employmentDate, setEmploymentDate] = useState(dateNow);
  let navigate = useNavigate();

  const addEmployee = () => {
    axios
      .post("/api/employee/", {
        first_name: firstName,
        last_name: lastName,
        email: emailAddress,
        mobile: mobileNumber,
        employment_date: employmentDate.toISOString().split("T")[0],
      })
      .then(function (response) {
        axios
          .get("/api/employee/")
          .then(function (response) {
            setData(response.data);
          });
        setModalOpen(false);
      });
  };

  useEffect(() => {
    axios.get("/api/employee/").then(function (response) {
      setData(response.data);
    });
  }, []);

  return (
    <>
      <Container maxWidth="md">
        <Grid container justifyContent="space-between" mb={4}>
          <Grid item xs="auto" mt={4}>
            <h2>Employee list</h2>
          </Grid>
          <Grid item mt={4}>
            <Button variant="contained" onClick={() => setModalOpen(true)}>
              Add employee
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>#</b>
                </TableCell>
                <TableCell align="right">
                  <b>First</b>
                </TableCell>
                <TableCell align="right">
                  <b>Last</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={row.id}
                  hover={true}
                  onClick={() => {
                    navigate("/employee/" + (index + 1));
                  }}
                >
                  <TableCell component="th" scope="row">
                    <b>{index + 1}</b>
                  </TableCell>
                  <TableCell align="right">{row.first_name}</TableCell>
                  <TableCell align="right">{row.last_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add employee
          </Typography>
          <Container>
            <Box mt={3}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <TextField
                    label="First name"
                    variant="outlined"
                    value={firstName.value}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Last name"
                    variant="outlined"
                    value={lastName.value}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </Grid>
                <Grid item xs={12} mt={2}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    value={emailAddress.value}
                    onChange={(event) => {
                      setEmailAddress(event.target.value);
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} mt={2}>
                  <TextField
                    label="Mobile"
                    variant="outlined"
                    value={mobileNumber.value}
                    onChange={(event) => setMobileNumber(event.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} mt={2} mb={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Employment date"
                      value={employmentDate}
                      onChange={(newValue) => {
                        setEmploymentDate(newValue);
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
                  <Button variant="contained" onClick={addEmployee}>
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
