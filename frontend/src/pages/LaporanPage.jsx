import { Box, Grid, Typography } from "@mui/material";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Height } from "@mui/icons-material";
import useLaporan from "../hooks/useLaporan";
import { laporanMenu } from "../data/index";

const LaporanPage = () => {
    const { data, columns } = useLaporan();

    return (
        <Box sx={{ p: 3, width: "100%" }}>
            <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
                {laporanMenu.map((item, idx) => {
                    const Icon = item.icon;

                    return (
                        <Card
                            key={idx}
                            sx={{
                                flex: 1,
                                p: 2.5,
                                borderRadius: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: "#FCE4EC",
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#E91E63",
                                }}
                            >
                                <Icon />
                            </Box>

                            <Typography sx={{ fontWeight: 700 }}>
                                {item.title}
                            </Typography>

                            <Typography sx={{ fontSize: 13, color: "#9E9E9E", lineHeight: 1.4 }}>
                                {item.desc}
                            </Typography>
                        </Card>
                    );
                })}
            </Box>

            <Card
                sx={{
                    mt: 4,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    p: 3,
                    borderRadius: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography sx={{ fontWeight: 700 }}>
                        Preview Laporan Penjualan
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button sx={{
                            backgroundColor: "#057d09",
                            "&:hover": {
                                backgroundColor: "#43A047",
                            },
                            color: "#fff"
                        }}>
                            EXPORT EXCEL
                        </Button>
                        <Button sx={{
                            backgroundColor: "#E91E63",
                            "&:hover": {
                                backgroundColor: "#C2185B",
                            },
                            color: "#fff"
                        }}>
                            EXPORT PDF
                        </Button>
                    </Box>
                </Box>

                <Table columns={columns} data={data} />
            </Card>
        </Box>
    );
};

export default LaporanPage;