import { Button } from "@components/buttons/button/Button";
import { CloseRounded } from "@mui/icons-material";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import theme from "@theme/index";
import React from "react";

export interface DeleteMemberModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteMemberModal: React.FC<DeleteMemberModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      slotProps={{
        paper: {
          sx: {
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #E6E6E6",
            width: "450px",
            maxWidth: "450px",
            minHeight: "200px",
            backgroundColor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
          },
        },
        backdrop: {
          sx: {
            backgroundColor: "#00000066",
          },
        },
      }}
      sx={{ zIndex: theme.tokens.zIndex.modal }}
      open={open}
      onClose={onClose}
      fullWidth={false}
      maxWidth={false}
      aria-labelledby="delete-member-title"
    >
      <DialogTitle
        sx={{
          padding: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
        component="div"
      >
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            {/* <MoveFileIcon style={{ width: 18, height: 18, color: "#666666" }} /> */}
            <span style={{ fontSize: 16, fontWeight: 500, color: "#333333" }}>
              Delete Team Member?
            </span>
          </Box>
          <Typography variant="body2" sx={{ color: "#666666", mt: 0.5, paddingTop: "30PX" }}>
            Note: Deleted user will move to Default Team
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={onClose} sx={{ padding: 0 }}>
            <CloseRounded style={{ width: 18, height: 18, color: "#666666" }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          overflow: "visible",
          padding: 0,
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <DialogActions sx={{ padding: 0, justifyContent: "flex-end", marginTop: "auto" }}>
        <Button size="sm" onClick={onConfirm} variant="solid">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMemberModal;
