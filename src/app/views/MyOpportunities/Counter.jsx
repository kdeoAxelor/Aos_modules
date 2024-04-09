import React, { useEffect, useState } from "react";
import { Input, InputLabel } from "@mui/material";

const Counter = ({
  label,
  name,
  setInitialState,
  initialValue,
  editable,
  active,
}) => {
  const [counter, setCounter] = useState(0);

  const handleNumericChange = (e) => {
    const inputValue = parseFloat(e.target.value);

    if (!isNaN(inputValue) && inputValue >= 0) {
      setCounter(parseFloat(inputValue.toFixed(2)));

      setInitialState((prev) => ({
        ...prev,
        [e.target.name]: inputValue.toFixed(2),
      }));
    }
  };
  useEffect(() => {
    setCounter(initialValue);
  }, [initialValue]);
  return (
    <>
      <InputLabel>{label}</InputLabel>
      <Input
        type="number"
        value={counter?.toFixed(2)}
        step="1.00"
        name={name}
        style={{
          marginTop: "2%",
        }}
        onChange={(e) => handleNumericChange(e)}
        readOnly={active === 4 || active === 5 ? true : !editable}
        disableUnderline={
          active === 4 || active === 5 || editable === false ? true : false
        }
      />
    </>
  );
};

export default Counter;
