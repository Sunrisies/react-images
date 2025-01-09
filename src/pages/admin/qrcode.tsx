import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
export const Route = createFileRoute('/admin/qrcode')({
  component: RouteComponent,
})

function RouteComponent() {
  // 状态管理
  const [inputText, setInputText] = useState(''); // 用户输入的文本
  const [qrValue, setQrValue] = useState(''); // 二维码的值
  const [fgColor, setFgColor] = useState('#000000'); // 二维码颜色
  const [bgColor, setBgColor] = useState('#ffffff'); // 背景颜色
  const [includeLogo, setIncludeLogo] = useState(false); // 是否包含 Logo
  const [logoUrl, setLogoUrl] = useState(''); // Logo 图片 URL

  // 生成二维码
  const handleGenerateQRCode = () => {
    if (inputText.trim()) {
      setQrValue(inputText);
    } else {
      alert('请输入内容');
    }
  };

  // 下载二维码
  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('qrcode') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qrcode.png';
      link.click();
    }
  };

  // 清空输入
  const handleClear = () => {
    setInputText('');
    setQrValue('');
    setFgColor('#000000');
    setBgColor('#ffffff');
    setIncludeLogo(false);
    setLogoUrl('');
  };

  return (
    <div className="min-h-screen bg-[url('your-image-url')] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">二维码生成器</h1>

      {/* 输入区域 */}
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        {/* 输入框 */}
        <div className="mb-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="请输入文本或链接"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 二维码颜色 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">二维码颜色</label>
          <input
            type="color"
            value={fgColor}
            onChange={(e) => setFgColor(e.target.value)}
            className="w-16 h-10"
          />
        </div>

        {/* 背景颜色 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">背景颜色</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-16 h-10"
          />
        </div>

        {/* 是否包含 Logo */}
        <div className="mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={includeLogo}
              onChange={(e) => setIncludeLogo(e.target.checked)}
              className="mr-2"
            />
            包含 Logo
          </label>
        </div>

        {/* Logo URL 输入框 */}
        {includeLogo && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="请输入 Logo 图片的 URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* 生成按钮 */}
        <button
          onClick={handleGenerateQRCode}
          className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          生成二维码
        </button>

        {/* 二维码显示区域 */}
        {qrValue && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <QRCodeCanvas
              id="qrcode"
              value={qrValue}
              size={256}
              fgColor={fgColor}
              bgColor={bgColor}
              level="H"
              includeMargin={true}
              imageSettings={
                includeLogo && logoUrl
                  ? {
                    src: logoUrl,
                    height: 64,
                    width: 64,
                    excavate: true,
                  }
                  : undefined
              }
            />
            <p className="mt-4 text-center text-gray-600">扫描二维码查看内容</p>
          </div>
        )}

        {/* 下载和清空按钮 */}
        {qrValue && (
          <div className="flex space-x-4">
            <button
              onClick={handleDownloadQRCode}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              下载二维码
            </button>
            <button
              onClick={handleClear}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              清空
            </button>
          </div>
        )}
      </div>
    </div>



  );
}
