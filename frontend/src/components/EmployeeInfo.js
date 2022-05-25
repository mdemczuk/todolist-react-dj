import axios from "axios";
import {
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";

export default function EmployeeInfo({employeeId}) {
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get(`/api/employee/${employeeId}/`)
      .then(function (response) {
        setData(response.data);
        document.title = `${response.data.first_name} ${response.data.last_name}`;
      });
  }, []);

  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            <List>
              <ListItem disablePadding>
                  <ListItemText><h2>{data.first_name} {data.last_name}</h2></ListItemText>
              </ListItem>
              <ListItem disablePadding>
                  <ListItemText><b>Email:</b> {data.email}</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                  <ListItemText><b>Mobile:</b> {data.mobile}</ListItemText>
              </ListItem>
              <ListItem disablePadding>
                  <ListItemText><b>Employment date:</b> {data.employment_date}</ListItemText>
              </ListItem>
            </List>
        </Box>
      </Container>
    </>
  );
}
