import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { useState } from "react";


export default function ExportDialog({
  open,
  onClose,
  onConfirm,
}) {

  const [format, setFormat] = useState("pdf");

  const [filename, setFilename] = useState(
    `Laporan_Stok_${new Date()
      .toISOString()
      .slice(0,10)}`
  );


  const [filter, setFilter] = useState("all");


  const submit = () => {

    onConfirm({
      format,
      filename,
      filter,
    });

  };


  return (

    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle>
        Export Laporan Stok
      </DialogTitle>


      <DialogContent>


        <FormControl
          fullWidth
          sx={{mt:2}}
        >

          <InputLabel>
            Format
          </InputLabel>


          <Select
            value={format}
            label="Format"
            onChange={(e)=>
              setFormat(e.target.value)
            }
          >

            <MenuItem value="pdf">
              PDF - Laporan Resmi
            </MenuItem>


            <MenuItem value="excel">
              Excel - Analisis Data
            </MenuItem>


            <MenuItem value="csv">
              CSV - Data Raw
            </MenuItem>


          </Select>

        </FormControl>



        <TextField

          fullWidth

          label="Nama File"

          value={filename}

          onChange={(e)=>
            setFilename(e.target.value)
          }

          sx={{
            mt:3
          }}

        />



        <RadioGroup

          value={filter}

          onChange={(e)=>
            setFilter(e.target.value)
          }

          sx={{
            mt:3
          }}

        >

          <FormControlLabel
            value="all"
            control={<Radio/>}
            label="Semua Produk"
          />


          <FormControlLabel
            value="minimum"
            control={<Radio/>}
            label="Stok Minimum"
          />


          <FormControlLabel
            value="empty"
            control={<Radio/>}
            label="Stok Habis"
          />

        </RadioGroup>


      </DialogContent>



      <DialogActions>

        <Button
          onClick={onClose}
        >
          Batal
        </Button>


        <Button
          variant="contained"
          onClick={submit}
        >
          Export
        </Button>


      </DialogActions>


    </Dialog>

  );

}