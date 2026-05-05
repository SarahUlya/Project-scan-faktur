import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import LaporanPenjualan from "../components/laporan/LaporanPenjualan";
import LaporanProdukTerlaris from "../components/laporan/LaporanProdukTerlaris";
import LaporanBarangTidakLaku from "../components/laporan/LaporanBarangTidakLaku";
import LaporanStokExpired from "../components/laporan/LaporanStokExpired";

const laporanMenu = [
  { id: 'penjualan', title: "Laporan Penjualan", desc: "Rekap transaksi dan omzet", icon: AssessmentOutlinedIcon },
  { id: 'terlaris', title: "Produk Terlaris", desc: "Analisis performa produk", icon: TrendingUpOutlinedIcon },
  { id: 'tidak-laku', title: "Barang Tidak Laku", desc: "Dead stock & slow moving", icon: AssignmentLateOutlinedIcon },
  { id: 'expired', title: "Stok & Expired", desc: "Status gudang & kadaluarsa", icon: EventBusyOutlinedIcon },
];

const LaporanPage = () => {
    const [activeTab, setActiveTab] = useState('penjualan');

    const renderContent = () => {
        switch(activeTab) {
            case 'penjualan': return <LaporanPenjualan />;
            case 'terlaris': return <LaporanProdukTerlaris />;
            case 'tidak-laku': return <LaporanBarangTidakLaku />;
            case 'expired': return <LaporanStokExpired />;
            default: return <LaporanPenjualan />;
        }
    };

    const getActiveTitle = () => {
        const active = laporanMenu.find(m => m.id === activeTab);
        return active ? active.title : 'Laporan';
    };

    return (
        <Box sx={{ minHeight: "100vh", background: '#FAFAFA' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                        Laporan & Rekapitulasi
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: 15 }}>
                        Analisis data performa Apotek Ampuh Tayu
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, background: '#fff', px: 2, py: 1.5, borderRadius: 12, border: '1px solid #F1F5F9', cursor: 'pointer' }}>
                    <Box sx={{ color: '#94A3B8' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </Box>
                    <Typography sx={{ color: '#64748B', fontSize: 14, fontWeight: 600 }}>Periode: <span style={{ color: '#E91E63', fontWeight: 700 }}>Bulan Januari 2024</span></Typography>
                    <KeyboardArrowDownIcon sx={{ color: '#94A3B8' }} />
                </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
                {laporanMenu.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <Card
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            sx={{
                                flex: 1,
                                p: 3,
                                borderRadius: 4,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: isActive ? '2px solid #E91E63' : '2px solid transparent',
                                background: isActive ? '#FFF1F2' : '#fff',
                                boxShadow: isActive ? '0 10px 30px rgba(233, 30, 99, 0.1)' : '0 4px 20px rgba(0,0,0,0.03)',
                                '&:hover': {
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    backgroundColor: isActive ? '#FCE7F3' : '#F8FAFC',
                                    borderRadius: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: isActive ? '#E91E63' : '#94A3B8',
                                    mb: 2
                                }}
                            >
                                <Icon />
                            </Box>

                            <Typography sx={{ fontWeight: 800, color: isActive ? '#1E293B' : '#475569', fontSize: 16, mb: 0.5 }}>
                                {item.title}
                            </Typography>

                            <Typography sx={{ fontSize: 13, color: isActive ? '#64748B' : '#94A3B8' }}>
                                {item.desc}
                            </Typography>
                        </Card>
                    );
                })}
            </Box>

            {activeTab === 'expired' && (
                <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                    <Box sx={{ flex: 1, background: '#FFF1F2', borderRadius: 4, p: 3, display: 'flex', alignItems: 'center', gap: 2.5, border: '1px solid #FFE4E6' }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11D48' }}>
                            <HighlightOffIcon />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 24, fontWeight: 900, color: '#E11D48', lineHeight: 1.2 }}>5</Typography>
                            <Typography sx={{ color: '#E11D48', fontWeight: 700, fontSize: 13 }}>Produk Expired</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1, background: '#FFF7ED', borderRadius: 4, p: 3, display: 'flex', alignItems: 'center', gap: 2.5, border: '1px solid #FFEDD5' }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316' }}>
                            <WarningAmberIcon />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: 24, fontWeight: 900, color: '#F97316', lineHeight: 1.2 }}>12</Typography>
                            <Typography sx={{ color: '#F97316', fontWeight: 700, fontSize: 13 }}>Produk Mendekati Expired</Typography>
                        </Box>
                    </Box>
                </Box>
            )}

            <Box sx={{ background: "#fff", borderRadius: 5, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", border: '1px solid #F1F5F9', overflow: 'hidden' }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 3,
                        borderBottom: '1px solid #F1F5F9'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ background: '#FCE7F3', color: '#E91E63', px: 1.5, py: 0.5, borderRadius: 1.5, fontSize: 11, fontWeight: 900, letterSpacing: 0.5 }}>PREVIEW</Box>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: 18, color: '#1E293B' }}>
                                Preview Laporan {getActiveTitle()}
                            </Typography>
                            <Typography sx={{ color: '#94A3B8', fontSize: 13, mt: 0.5 }}>
                                Periode: 01 Jan 2024 - 31 Jan 2024
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1.5 }}>
                        <Button sx={{
                            backgroundColor: "#16A34A",
                            borderRadius: 3,
                            px: 3,
                            fontWeight: 700,
                            "&:hover": {
                                backgroundColor: "#15803D",
                            },
                            color: "#fff",
                            display: 'flex',
                            gap: 1
                        }}>
                            <DescriptionOutlinedIcon fontSize="small" />
                            EXPORT EXCEL
                        </Button>
                        <Button sx={{
                            backgroundColor: "#E91E63",
                            borderRadius: 3,
                            px: 3,
                            fontWeight: 700,
                            "&:hover": {
                                backgroundColor: "#BE185D",
                            },
                            color: "#fff",
                            display: 'flex',
                            gap: 1
                        }}>
                            <PictureAsPdfOutlinedIcon fontSize="small" />
                            EXPORT PDF
                        </Button>
                    </Box>
                </Box>
                <Box>
                    {renderContent()}
                </Box>
            </Box>
        </Box>
    );
};

export default LaporanPage;