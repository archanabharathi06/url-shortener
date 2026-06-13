import React, { useRef } from 'react';
import { Download, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const QrModal = ({ isOpen, onClose, shortUrl, title = 'Link QR Code' }) => {
  const qrRef = useRef(null);

  const downloadPng = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');

    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `sniplink-qr-${Math.random().toString(36).substring(7)}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-6 py-4">
        {/* QR Code Container */}
        <div
          ref={qrRef}
          className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-inner flex items-center justify-center"
        >
          {shortUrl ? (
            <QRCodeCanvas
              value={shortUrl}
              size={200}
              level="H"
              includeMargin={false}
            />
          ) : (
            <div className="h-[200px] w-[200px] bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
              Generating...
            </div>
          )}
        </div>

        {/* Info detail */}
        <div className="text-center flex flex-col gap-1 px-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Short Link URL
          </span>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-brand hover:underline break-all"
          >
            {shortUrl}
          </a>
        </div>

        {/* Buttons */}
        <div className="flex justify-center w-full border-t border-slate-50 pt-5">
          <Button onClick={downloadPng} className="w-full sm:w-auto px-5">
            <Download className="h-4 w-4 mr-2" />
            Download PNG
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QrModal;
