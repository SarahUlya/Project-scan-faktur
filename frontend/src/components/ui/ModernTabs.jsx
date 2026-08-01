import React from "react";
import { Box } from "@mui/material";
import {
  colors,
 spacing,
 typography,
 radii,
 shadows,
 transitions,
} from "@/theme/designTokens";

const ModernTabs = ({ tabs = [], activeTab, onChange }) => (
  <Box sx={{ display: "flex", gap: 0, borderBottom: `1px solid ${colors.borderLight}`, mb: 2 }}>
    {tabs.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        type="button"
        style={{
          padding: "12px 20px",
          background: "none",
          border: "none",
          borderBottom: activeTab === tab.value ? `2px solid ${colors.primary}` : "2px solid transparent",
          color: activeTab === tab.value ? colors.primary : colors.textSecondary,
          fontWeight: activeTab === tab.value ? 600 : 500,
          fontSize: 14,
          cursor: "pointer",
          outline: "none",
        }}
      >
        {tab.label}
        {tab.badge != null && (
          <span
            style={{
              marginLeft: 8,
              padding: "2px 8px",
              borderRadius: 10,
              background: activeTab === tab.value ? colors.primaryLight : colors.bgMuted,
              color: activeTab === tab.value ? colors.primary : colors.textMuted,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {tab.badge}
          </span>
        )}
      </button>
    ))}
  </Box>
);

export default ModernTabs;
