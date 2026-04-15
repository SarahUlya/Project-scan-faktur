import React from "react";
import { Button as MuiButton } from "@mui/material";

const Button = ({ children, color = "primary", variant = "contained", sx = {}, ...props }) => {
	const colorStyles = color === "pink"
		? {
				background: '#E91E63',
				color: '#FFFFFF',
				fontWeight: 700,
				borderRadius: 2,
				boxShadow: 'none',
				px: 3,
				'&:hover': { background: '#F06292' },
			}
		: {};
	return (
		<MuiButton variant={variant} sx={{ textTransform: 'none', ...colorStyles, ...sx }} {...props}>
			{children}
		</MuiButton>
	);
};

export default Button;
