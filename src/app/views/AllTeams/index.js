import React, { useState, useEffect } from "react";
import { fetchData } from "./../../services/rest";
import { TEAM_MODEL } from "app/utils/constants";
import Header from "./TeamsHeader";
import SingleTeam from "./Team";
import { Box } from "@mui/material";

export function AllTeams() {
  const [data, setData] = useState([]);
  const [pageOffset, setPageOffset] = useState(0);
  const [pageLimit, setPageLimit] = useState(6);
  const [totalData, setTotalData] = useState(0);
  const [subscriptions, setSubscriptions] = useState({});

  const handleSubscribed = (event, cardId) => {
    setSubscriptions((prevSubscriptions) => ({
      ...prevSubscriptions,
      [cardId]: !prevSubscriptions[cardId],
    }));
    event.stopPropagation();
  };

  useEffect(() => {
    const initialDataReqBody = {
      offset: pageOffset,
      fields: ["name", "description"],
      limit: pageLimit,
      data: {
        _domain: null,
        _domainContext: {
          _model: TEAM_MODEL,
          _id: null,
        },
        _domains: [],
        operator: "and",
        criteria: [],
      },
    };
    const fetchPartners = async () => {
      const response = await fetchData(TEAM_MODEL, initialDataReqBody);
      setData(response?.data);
      setTotalData(response?.total);
    };
    fetchPartners();
  }, [pageOffset, pageLimit]);

  return (
    <>
      <Header
        data={data}
        setData={setData}
        pageOffset={pageOffset}
        pageLimit={pageLimit}
        setPageOffset={setPageOffset}
        setPageLimit={setPageLimit}
        totalData={totalData}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", overflow: "hidden" }}>
        {data?.map((item, index) => {
          return (
            <SingleTeam
              key={index}
              item={item}
              handleSubscribed={handleSubscribed}
              subscriptions={subscriptions}
              index={index}
              setData={setData}
              totalData={totalData}
              pageOffset={pageOffset}
            />
          );
        })}
      </Box>
    </>
  );
}

export default AllTeams;
