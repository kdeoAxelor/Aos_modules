import React, { useState, useEffect } from "react";
import MainPageHeader from "./MainPageHeader";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import { fetchData } from "app/services/rest";
import { OPPORTUNITIES_MODEL } from "app/utils/constants";
import OpportunityCard from "./OpportunityCard";
import {
  newDataReqBody,
  qualificationDataReqBody,
  propositionDataReqBody,
  negotiationDataReqBody,
  ClosedWonDataReqBody,
  closedLostDataReqBody,
} from "./constants";

export function MyOpportunities() {
  const [data, setData] = useState({
    newData: [],
    qualificationData: [],
    propositionData: [],
    NegotiationData: [],
    closedWonData: [],
    closedLostData: [],
  });
  const [isRefreshed, setIsRefreshed] = useState(false);

  useEffect(() => {
    const fetchNewData = async () => {
      const newDataResponse = await fetchData(
        OPPORTUNITIES_MODEL,
        newDataReqBody
      );
      const QualificationDataResponse = await fetchData(
        OPPORTUNITIES_MODEL,
        qualificationDataReqBody
      );
      const propositionDataResponse = await fetchData(
        OPPORTUNITIES_MODEL,
        propositionDataReqBody
      );
      const negotiationDataResponse = await fetchData(
        OPPORTUNITIES_MODEL,
        negotiationDataReqBody
      );
      const closedWonDataResponse = await fetchData(
        OPPORTUNITIES_MODEL,
        ClosedWonDataReqBody
      );
      const closedLostDataResponse = await fetchData(
        OPPORTUNITIES_MODEL,
        closedLostDataReqBody
      );
      setData((prev) => ({
        ...prev,
        newData: newDataResponse.data,
      }));
      setData((prev) => ({
        ...prev,
        qualificationData: QualificationDataResponse.data,
      }));
      setData((prev) => ({
        ...prev,
        propositionData: propositionDataResponse.data,
      }));
      setData((prev) => ({
        ...prev,
        NegotiationData: negotiationDataResponse.data,
      }));
      setData((prev) => ({
        ...prev,
        closedWonData: closedWonDataResponse.data,
      }));
      setData((prev) => ({
        ...prev,
        closedLostData: closedLostDataResponse.data,
      }));
    };
    fetchNewData();
  }, [isRefreshed ]);

  return (
    <>
      <MainPageHeader
        isRefreshed={isRefreshed}
        setIsRefreshed={setIsRefreshed}
      />
      <div style={{ width: "98vw", overflow: "auto" }}>
        <Grid container spacing={2} sx={{ margin: "2px" }}>
          <Grid item>
            <Grid
              container
              spacing={2}
              sx={{
                flexWrap: "nowrap",
                overflowX: "hidden",
                "@media(150px<=width< 760px)": {
                  flexWrap: "wrap",
                  flexDirection: " column",
                  width: "90%",
                  margin: "0px",
                },
              }}
            >
              <Grid item>
                <Paper
                  sx={{
                    height: "70vh",
                    width: "300px",
                    backgroundColor: "#f8f9fa",
                    "@media(150px<=width< 760px)": {
                      width: "90vw",
                    },
                    "@media(150px<=width< 760px)": {
                      width: "90vw",
                      height: "fit-content",
                    },
                  }}
                >
                  <Typography>New</Typography>
                  <Grid
                    sx={{
                      width: "90%",
                      flexWrap: "nowrap",
                      overflowY: "auto",
                      margin: "10px",
                      height: "90%",
                      backgroundColor: "white",
                    }}
                  >
                    {data?.newData?.map((item, index) => (
                      <OpportunityCard
                        setData={setData}
                        i={1} //in which column to store data
                        item={item}
                        key={index}
                      />
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    height: "70vh",
                    width: "300px",
                    backgroundColor: "#f8f9fa",
                    "@media(150px<=width< 760px)": {
                      width: "90vw",
                      height: "fit-content",
                    },
                  }}
                >
                  <Typography>Qualification</Typography>
                  <Grid
                    sx={{
                      width: "90%",
                      flexWrap: "nowrap",
                      overflowY: "auto",
                      margin: "10px",
                      height: "90%",
                      backgroundColor: "white",
                    }}
                  >
                    {data?.qualificationData?.map((item, index) => (
                      <OpportunityCard
                        setData={setData}
                        i={2}
                        item={item}
                        key={index}
                      />
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    height: "70vh",
                    width: "300px",
                    backgroundColor: "#f8f9fa",
                    "@media(150px<=width< 760px)": {
                      width: "90vw",
                      height: "fit-content",
                    },
                  }}
                >
                  <Typography>Proposition</Typography>
                  <Grid
                    sx={{
                      width: "90%",
                      flexWrap: "nowrap",
                      overflowY: "auto",
                      margin: "10px",
                      height: "90%",
                      backgroundColor: "white",
                    }}
                  >
                    {data?.propositionData?.map((item, index) => (
                      <OpportunityCard
                        setData={setData}
                        i={3}
                        item={item}
                        key={index}
                      />
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    height: "70vh",
                    width: "300px",
                    backgroundColor: "#f8f9fa",
                    "@media(150px<=width< 760px)": {
                      width: "90vw",
                      height: "fit-content",
                    },
                  }}
                >
                  <Typography>Negotiation</Typography>
                  <Grid
                    sx={{
                      width: "90%",
                      flexWrap: "nowrap",
                      overflowY: "auto",
                      margin: "10px",
                      height: "90%",
                      backgroundColor: "white",
                    }}
                  >
                    {data?.NegotiationData?.map((item, index) => (
                      <OpportunityCard
                        setData={setData}
                        i={4}
                        item={item}
                        key={index}
                      />
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    height: "70vh",
                    width: "300px",
                    backgroundColor: "#f8f9fa",
                    "@media(150px<=width< 760px)": {
                      width: "90vw",
                      height: "fit-content",
                    },
                  }}
                >
                  <Typography>Closed Won</Typography>
                  <Grid
                    sx={{
                      width: "90%",
                      flexWrap: "nowrap",
                      overflowY: "auto",
                      margin: "10px",
                      height: "90%",
                      backgroundColor: "white",
                    }}
                  >
                    {data?.closedWonData?.map((item, index) => (
                      <OpportunityCard
                        setData={setData}
                        i={5}
                        item={item}
                        key={index}
                      />
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  sx={{
                    height: "70vh",
                    width: "300px",
                    backgroundColor: "#f8f9fa",
                    "@media(150px<=width< 760px)": {
                      width: "90vw",
                      height: "fit-content",
                    },
                  }}
                >
                  <Typography>Closed Lost</Typography>
                  <Grid
                    sx={{
                      width: "90%",
                      flexWrap: "nowrap",
                      overflowY: "auto",
                      margin: "10px",
                      height: "90%",
                      backgroundColor: "white",
                    }}
                  >
                    {data?.closedLostData?.map((item, index) => (
                      <OpportunityCard
                        setData={setData}
                        i={6}
                        item={item}
                        key={index}
                      />
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default MyOpportunities;
