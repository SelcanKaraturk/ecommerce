import React, { useState } from "react";
import { useAuth } from "../../services/AuthContex";
import { Box, Modal, Typography } from "@mui/material";

function ModalShow() {
    const { openModal, setOpenModal } = useAuth();

    const handleClose = () => {
        setOpenModal(null);
    }
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "#292929",
        color: "#fff",
        boxShadow: 24,
        p: 4,
    };
    return (
        <>
            <Modal
                open={openModal ? true : false}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h3"
                    >
                       💎 Değerli Müşterimiz,
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {openModal}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}

export default ModalShow;
