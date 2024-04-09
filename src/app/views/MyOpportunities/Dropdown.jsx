import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchData } from "app/services/rest";

const Dropdown = ({
  handleSearchInputChange,
  name,
  initialValue,
  model,
  reqBody,
  editable,
  activeStepper,
}) => {
  const [optionList, setOptionList] = useState([]);
  const [open, setOpen] = useState(false);
  const loading = open && optionList.length === 0;


  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const res = await fetchData(model, reqBody);
        setOptionList(res?.data || []);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptionList([]);
    }
  }, [open]);

  return (
    <>
      <Autocomplete
        sx={{ minWidth: 120, width: "30%" }}
        value={initialValue}
        open={open}
        forcePopupIcon={
          activeStepper === 4 || activeStepper === 5 ? false : editable
        }
        readOnly={activeStepper === 4 || activeStepper === 5 ? true : !editable}
        onChange={(e, value) => handleSearchInputChange(value, name)}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(optionList, value) =>
          optionList.name === value.name ||
          optionList.fullName === value.fullName
        }
        getOptionLabel={(optionList) =>
          optionList?.name || optionList?.fullName || ""
        }
        options={optionList}
        loading={loading}
        renderInput={(params) => (
          <TextField
            sx={{
              p: 0,
              color:
                activeStepper === 4 || activeStepper === 5 || editable === false
                  ? "blue"
                  : "black",
            }}
            {...params}
            variant="standard"
            InputProps={{
              sx: {
                color:
                  activeStepper === 4 ||
                  activeStepper === 5 ||
                  editable === false
                    ? "blue"
                    : "black"
              },
              ...params.InputProps,
              ...(activeStepper === 4 ||
              activeStepper === 5 ||
              editable === false
                ? { disableUnderline: true }
                : null),
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </>
  );
};

export default Dropdown;
