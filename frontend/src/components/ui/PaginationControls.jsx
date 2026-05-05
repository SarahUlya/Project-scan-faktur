import React from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PaginationControls = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button 
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #F1F5F9', borderRadius: 8, color: page <= 1 ? '#CBD5E1' : '#64748B', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
      >
        <ChevronLeftIcon fontSize="small" />
      </button>
      
      {Array.from({ length: totalPages }, (_, index) => {
        const isCurrent = page === index + 1;
        return (
          <button
            key={index}
            onClick={() => onChange(index + 1)}
            style={{
              minWidth: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isCurrent ? 'rgb(233, 30, 99)' : '#fff',
              border: isCurrent ? 'none' : '1px solid #F1F5F9',
              borderRadius: 8,
              color: isCurrent ? 'rgb(255, 255, 255)' : '#64748B',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              padding: '0 8px'
            }}
          >
            {index + 1}
          </button>
        )
      })}

      <button 
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #F1F5F9', borderRadius: 8, color: page >= totalPages ? '#CBD5E1' : '#64748B', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
      >
        <ChevronRightIcon fontSize="small" />
      </button>
    </div>
  );
};

export default PaginationControls;
