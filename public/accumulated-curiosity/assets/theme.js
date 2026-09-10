try { const theme=localStorage.getItem('ac-theme'); if(theme==='light'||theme==='dark') document.documentElement.dataset.theme=theme; } catch {}
