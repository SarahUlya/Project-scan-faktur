import React, { useRef, useEffect } from 'react';
import { Box, Typography, Divider } from '@mui/material';
import {
  colors,
  radii,
  spacing,
  typography,
  shadows,
  transitions,
  zIndex,
  fieldInputSx,
  pageHeaderSx,
  statCardSx,
} from "@/theme/designTokens";

const CategoryFilter = ({ kategori, kategoriFilter, setKategoriFilter, selectedLabel }) => {
  const [search, setSearch] = React.useState('');
  const [showDropdown, setShowDropdown] = React.useState(false);
  const wrapperRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
        setSearch('');
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return kategori.filter((k) => k.nama_kategori.toLowerCase().includes(q));
  }, [search, kategori]);

  const handleSelect = (id) => {
    setKategoriFilter(String(id));
    setSearch('');
    setShowDropdown(false);
  };

  const commonInputStyle = {
    width: 190,
    height: 48,
    padding: '11px 14px',
    borderRadius: radii.sm,
    border: `1.5px solid ${colors.border}`,
    fontSize: typography.body,
    outline: 'none',
    background: colors.bgCard,
    color: colors.text,
    fontWeight: typography.semibold,
    transition: transitions.all,
    boxShadow: shadows.sm,
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = colors.primary;
    e.target.style.boxShadow = `0 0 0 3px rgba(216, 27, 96, 0.12)`;
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = colors.border;
    e.target.style.boxShadow = 'none';
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', zIndex: zIndex.dropdown }}>
      <Box ref={wrapperRef} sx={{ minWidth: 190 }}>
        <input
          type="text"
          placeholder={showDropdown ? selectedLabel : "Semua Kategori"}
          value={showDropdown ? search : selectedLabel}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={handleBlur}
          style={commonInputStyle}
        />
        {showDropdown && (
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.75,
              bgcolor: colors.bgCard,
              border: `1.5px solid ${colors.border}`,
              borderRadius: `${radii.sm}px`,
              maxHeight: 260,
              overflowY: 'auto',
              zIndex: 10,
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            }}
          >
            <Box
              onClick={() => handleSelect('semua')}
              sx={{
                p: '11px 14px',
                cursor: 'pointer',
                backgroundColor: kategoriFilter === 'semua' ? colors.primaryLight : colors.bgCard,
                color: kategoriFilter === 'semua' ? colors.primaryHover : colors.textSecondary,
                fontWeight: kategoriFilter === 'semua' ? typography.bold : typography.semibold,
                fontSize: typography.body,
                '&:hover': { backgroundColor: colors.bgMuted },
              }}
            >
              Semua Kategori
            </Box>
            <Divider sx={{ my: 0 }} />
            {filtered.map((k) => (
              <Box
                key={k.id_kategori}
                onClick={() => handleSelect(k.id_kategori)}
                sx={{
                  p: '11px 14px',
                  cursor: 'pointer',
                  backgroundColor: String(k.id_kategori) === kategoriFilter ? colors.primaryLight : colors.bgCard,
                  color: String(k.id_kategori) === kategoriFilter ? colors.primaryHover : colors.textSecondary,
                  fontWeight: String(k.id_kategori) === kategoriFilter ? typography.bold : typography.semibold,
                  fontSize: typography.body,
                  '&:hover': { backgroundColor: colors.bgMuted },
                }}
              >
                {k.nama_kategori}
              </Box>
            ))}
            {filtered.length === 0 && search && (
              <Box sx={{ p: '11px 14px', color: colors.textMuted, fontSize: typography.body, textAlign: 'center' }}>
                Kategori tidak ditemukan
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CategoryFilter;

