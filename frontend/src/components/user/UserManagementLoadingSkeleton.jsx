import React from "react";
import { Box, Skeleton } from "@mui/material";
import { colors } from "@/theme/designTokens";

const UserManagementLoadingSkeleton = () => {
  return (
    <Box>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Skeleton
            variant="text"
            width={240}
            height={36}
            animation="wave"
          />

          <Skeleton
            variant="text"
            width={340}
            height={22}
            animation="wave"
          />
        </Box>

        <Skeleton
          variant="rounded"
          width={180}
          height={42}
          animation="wave"
        />
      </Box>

      {/* Card */}
      <Box
        sx={{
          bgcolor: colors.bgCard,
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${colors.border}`,
        }}
      >

        {/* Table Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "80px 2fr 1.3fr 1fr 1fr 100px",
            gap: 2,
            px: 3,
            py: 2,
            bgcolor: colors.bgLight,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              height={20}
              width="80%"
              animation="wave"
            />
          ))}
        </Box>

        {/* Table Body */}
        {Array.from({ length: 8 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "80px 2fr 1.3fr 1fr 1fr 100px",
              gap: 2,
              px: 3,
              py: 2,
              alignItems: "center",
              borderBottom:
                index !== 7
                  ? `1px solid ${colors.border}`
                  : "none",
            }}
          >
            {/* No */}
            <Skeleton
              width={25}
              height={20}
              animation="wave"
            />

            {/* Nama */}
            <Box>
              <Skeleton
                width="70%"
                height={22}
                animation="wave"
              />

              <Skeleton
                width="50%"
                height={18}
                animation="wave"
              />
            </Box>

            {/* Username */}
            <Skeleton
              width="80%"
              height={22}
              animation="wave"
            />

            {/* Role */}
            <Skeleton
              variant="rounded"
              width={70}
              height={28}
              animation="wave"
            />

            {/* Status */}
            <Skeleton
              variant="rounded"
              width={90}
              height={28}
              animation="wave"
            />

            {/* Action */}
            <Skeleton
              variant="circular"
              width={36}
              height={36}
              animation="wave"
            />
          </Box>
        ))}

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${colors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton width={200} height={20} animation="wave" />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Skeleton
              variant="rounded"
              width={34}
              height={34}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width={34}
              height={34}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width={34}
              height={34}
              animation="wave"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserManagementLoadingSkeleton;