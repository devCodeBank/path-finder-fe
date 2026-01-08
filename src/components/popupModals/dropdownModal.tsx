import MoveFileIcon from "@assets/icons/move-file.svg?react";
import { Button } from "@components/buttons/button/Button";
import { SelectInput } from "@components/input/selectInput/SelectInput";
import { CloseRounded } from "@mui/icons-material";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
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
}

export const DropDownModal: React.FC<DropDownModalProps> = ({ open, onClose, teams, value, onChange, onConfirm, confirmDisabled }) => {
  return (
    <Dialog
      slotProps={{
        paper: {
          sx: {
            padding: 3,
            borderRadius: theme.tokens.radius.md,
          },
        },
        backdrop: {
          sx: {
            backgroundColor: theme.tokens.color.background.overlay,
          },
        },
      }}
      sx={{ zIndex: theme.tokens.zIndex.modal }}
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="move-member-title"
    >
      <DialogTitle
        sx={{
          paddingX: 0,
          paddingTop: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
        component="div"
      >
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <MoveFileIcon style={{ width: 24, height: 24, color: theme.tokens.color.text.secondary }} />
            <span>Move Member</span>
          </Box>
          <Typography variant="body2" sx={{ color: theme.tokens.color.text.primary, opacity: 0.75, ml: 4, mt: 0.5 }}>
            Default Team
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={onClose} sx={{ padding: 0 }}>
            <CloseRounded style={{ width: 16, height: 16, color: theme.tokens.color.text.secondary }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflow: "visible", marginTop: 2, paddingX: 0 }}>
        <SelectInput
          label="Move to team"
          value={value}
          onChange={(e) => onChange(e.target.value as string)}
          options={teams.map((t) => ({ value: t.id, label: t.name }))}
          zIndex={theme.tokens.zIndex.modal + 1}
        />
      </DialogContent>
      <DialogActions sx={{ padding: 0, gap: 1.5 }}>
        <Button size="sm" variant="neutral" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={onConfirm} variant="solid" disabled={Boolean(confirmDisabled)}>
          Move
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DropDownModal;
