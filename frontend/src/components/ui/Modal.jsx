import React from "react";

const Modal = ({ open, onClose, children, width = 420 }) => {
	if (!open) return null;
	return (
		<div style={{
			position: "fixed",
			top: 0,
			left: 0,
			width: "100vw",
			height: "100vh",
			zIndex: 1300,
			background: "rgba(0,0,0,0.15)",
			backdropFilter: "blur(4px)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		}}>
			<div style={{
				background: "#fff",
				borderRadius: 20,
				boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
				minWidth: width,
				maxWidth: "95vw",
				padding: 0,
				position: "relative"
			}}>
				<button
					onClick={onClose}
					style={{
						position: "absolute",
						top: 18,
						right: 18,
						background: "none",
						border: "none",
						fontSize: 22,
						color: "#B0B0B0",
						cursor: "pointer"
					}}
					aria-label="Tutup"
				>
					×
				</button>
				<div style={{ padding: 36, paddingTop: 28 }}>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
