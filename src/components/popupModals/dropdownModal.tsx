import MoveFileIcon from "@assets/icons/move-file.svg?react";

import { SelectInput } from "@components/input/selectInput/SelectInput";
import { CloseRounded } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import theme from "@theme/index";
import React from "react";

export interface DropDownModalProps {
  open: boolean;
  onClose: () => void;
  teams: { id: string; name: string }[];
  value: string;
  onChange: (teamId: string) => void;
  onConfirm: () => void;
  confirmDisabled?: boolean;
  memberName?: string;
  currentTeamName?: string;
}

export const DropDownModal: React.FC<DropDownModalProps> = ({
  open,
  onClose,
  teams,
  value,
  onChange,
  onConfirm,

  memberName = "Member",

}) => {
  return (
    <Dialog
      slotProps={{
        paper: {
          sx: {
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #E6E6E6",
            width: "434px",

            height: "229px",
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
      aria-labelledby="move-member-title"
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
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <MoveFileIcon style={{ width: 18, height: 18, color: "#666666" }} />
            <span style={{ fontSize: 16, fontWeight: 500, color: "#333333", paddingLeft: "18px" }}>{`Move ${memberName}`}</span>
          </Box>
          <Typography variant="body2" sx={{ color: "#666666", ml: 4, mt: 5, paddingTop: "20px", paddingLeft: "40px" }}>
            Default Team
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
      >
        <Box sx={{ width: "100%" }}>
          <SelectInput
            label=""
            value={value}
            onChange={(e) => onChange(e.target.value as string)}
            options={teams.map((t) => ({ value: t.id, label: t.name }))}
            placeholder="Select a new team"
            zIndex={theme.tokens.zIndex.modal + 1}


          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 0, justifyContent: "flex-end", marginTop: "auto" }}>

        <Button
          variant="outlined"
          onClick={onConfirm}

          sx={{
            height: "36px",
            width: "auto",
            backgroundColor: "#6E41E2",
            textTransform: "none",
            fontSize: "12px",
            fontWeight: 500,
            borderRadius: "4px",
            boxShadow: "none",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#7B52F4",
              boxShadow: "none",
            },
          }}
        >
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DropDownModal;
