'use client';

import { useEffect, useRef, useState } from 'react';

export default function ViewerPage() {
  const containerRef = useRef(null);
  const [ip, setIp] = useState('로딩 중...');
  const [status, setStatus] = useState('불러오는 중...');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => setIp(d.ip))
      .catch(() => setIp('Unknown'));
  }, []);

  useEffect(() => {
    if (!ip || ip === '로딩 중...') return;

    async function renderPDF() {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';

      const pdf = await pdfjsLib.getDocument('/worksheet.pdf').promise;
      setStatus('');

      const container = containerRef.current;
      if (!container) return;
      container.innerHTML = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const dpr = window.devicePixelRatio || 1;
        const baseScale = Math.min(2.0, (window.innerWidth - 32) / page.getViewport({ scale: 1 }).width);
        const viewport = page.getViewport({ scale: baseScale * dpr });

        const wrap = document.createElement('div');
        wrap.style.cssText = `position:relative; margin:0 auto 24px; width:${viewport.width / dpr}px; height:${viewport.height / dpr}px; box-shadow:0 4px 24px rgba(0,0,0,0.5); border-radius:4px; overflow:hidden;`;

        const pdfCanvas = document.createElement('canvas');
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        pdfCanvas.style.cssText = `width:${viewport.width / dpr}px; height:${viewport.height / dpr}px; display:block;`;
        await page.render({ canvasContext: pdfCanvas.getContext('2d'), viewport }).promise;

        const wm = document.createElement('canvas');
        wm.width = viewport.width;
        wm.height = viewport.height;
        wm.style.cssText = `position:absolute; top:0; left:0; width:${viewport.width / dpr}px; height:${viewport.height / dpr}px; pointer-events:none;`;

        const ctx = wm.getContext('2d');
        const text = `이수열 학습지  |  ${ip}`;
        const fontSize = Math.max(14, viewport.width * 0.022);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = 'rgba(60,60,60,0.12)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cols = 3, rows = 5;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            ctx.save();
            ctx.translate((viewport.width / cols) * (c + 0.5), (viewport.height / rows) * (r + 0.5));
            ctx.rotate(-25 * Math.PI / 180);
            ctx.fillText(text, 0, 0);
            ctx.restore();
          }
        }

        wrap.appendChild(pdfCanvas);
        wrap.appendChild(wm);
        container.appendChild(wrap);
      }
    }

    renderPDF();
  }, [ip]);

  return (
    <div style={{ background: '#1a1a1a', minHeight: '100vh' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#111', borderBottom: '1px solid #333', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>📄 학습지 뷰어</span>
        <span style={{ color: '#888', fontSize: 12, background: '#222', border: '1px solid #333', borderRadius: 6, padding: '4px 10px' }}>
          접속 IP: {ip}
        </span>
      </div>

      {status && (
        <p style={{ color: '#888', textAlign: 'center', paddingTop: 60, fontSize: 14 }}>{status}</p>
      )}

      <div ref={containerRef} style={{ padding: '32px 16px 60px', maxWidth: 900, margin: '0 auto' }} />

      <style>{`* { -webkit-user-select: none; user-select: none; } body { margin: 0; }`}</style>
    </div>
  );
}
