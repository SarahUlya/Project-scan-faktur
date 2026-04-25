import { Box, Typography, IconButton, Chip } from "@mui/material";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useManajemenUser from "../hooks/useManajemenUser";

const ManajemenUserPage = () => {
  const { users, handleEdit, handleDelete, handleTambah } = useManajemenUser();

  // Definisi kolom ditaruh di sini agar bisa pakai komponen UI
  const columns = [
    { header: "NO", accessor: "no", width: "60px", align: "center" },
    { 
      header: "NAMA LENGKAP", 
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{row.nama}</Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{row.email}</Typography>
        </Box>
      )
    },
    { header: "USERNAME", accessor: "username" },
    { 
      header: "ROLE", 
      render: (row) => {
        const isPink = row.role === 'ADMIN';
        return (
          <Chip 
            label={row.role} 
            size="small" 
            sx={{ 
              bgcolor: isPink ? "#FCE4EC" : "#E3F2FD", 
              color: isPink ? "#E91E63" : "#2196F3",
              fontWeight: 'bold', fontSize: 10 
            }} 
          />
        );
      }
    },
    { 
      header: "STATUS", 
      render: (row) => (
        <Chip 
          label={row.status} 
          size="small" 
          sx={{ 
            bgcolor: row.status === "Aktif" ? "#E8F5E9" : "#F5F5F5", 
            color: row.status === "Aktif" ? "#4CAF50" : "#9E9E9E" 
          }} 
        />
      )
    },
    { 
      header: "AKSI", 
      align: "center",
      render: (row) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.id)} size="small" sx={{ border: '1px solid #eee' }}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)} size="small" sx={{ border: '1px solid #eee' }}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      )
    },
  ];

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <Button 
          variant="contained" 
          startIcon={<PersonAddAlt1Icon />}
          onClick={handleTambah}
          sx={{ color: "white", bgcolor: "#E91E63", borderRadius: 3, "&:hover": { bgcolor: "#C2185B" } }}
        >
          Tambah User
        </Button>
      </Box>

      <Card sx={{ p: 0, borderRadius: 3, overflow: "hidden" }}>
        <Table columns={columns} data={users} />
        <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid #eee' }}>
          <Typography variant="caption" color="text.secondary">
            © 2024 Apotek Ampuh Tayu Management System • Versi 1.0.0-PRO
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default ManajemenUserPage;