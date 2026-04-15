import React from "react";
import { Paper } from "@mui/material";

const Card = ({ children, sx = {}, ...props }) => (
  <Paper elevation={0} sx={{ borderRadius: 3, p: 3, background: '#fff', boxShadow: '0 2px 8px rgba(233,30,99,0.04)', ...sx }} {...props}>
    {children}
  </Paper>
);

export default Card;
