import React, { useEffect, useRef } from 'react';
import { Sun, Home } from 'lucide-react';

/**
 * A component to display and print a price label for a product.
 * @param {{ product: { name: string, price: number, category?: string, barcodeValue?: string } }} props
 */
const PriceLabel = ({ product }) => {
    const printRef = useRef(null);

    // === Render barcode in preview ===
    useEffect(() => {
        const canvas = printRef.current?.querySelector('canvas');
        if (canvas && window.JsBarcode && product?.barcodeValue) {
            try {
                window.JsBarcode(canvas, product.barcodeValue, {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 1,
                    height: 35,
                    displayValue: false,
                    margin: 2,
                });
            } catch (err) {
                console.error("Failed to render barcode for preview", err);
            }
        }
    }, [product]);

    const handlePrint = () => {
        const printableElement = printRef.current;
        if (!printableElement) return;

        const elementToPrint = printableElement.cloneNode(true);

        const canvas = elementToPrint.querySelector('canvas');
        if (canvas && window.JsBarcode) {
            try {
                const tempCanvas = document.createElement('canvas');
                window.JsBarcode(tempCanvas, product.barcodeValue || '123456789', {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 4,
                    height: 38,
                    displayValue: false,
                    // margin:,
                });
                const imgDataUrl = tempCanvas.toDataURL('image/png');
                const img = document.createElement('img');
                img.src = imgDataUrl;
                img.style.width = '100%';
                img.style.height = 'auto';
                canvas.parentNode.replaceChild(img, canvas);
            } catch (e) {
                console.error("Failed to generate barcode image for printing.", e);
            }
        }

        const innerContentToPrint = elementToPrint.innerHTML;

        const styleSheets = Array.from(document.styleSheets)
            .map(sheet =>
                sheet.href
                    ? `<link rel="stylesheet" href="${sheet.href}">`
                    : `<style>${Array.from(sheet.cssRules).map(rule => rule.cssText).join('')}</style>`
            )
            .join('\n');

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
    <html>
        <head>
            <title>Print Label</title>
            ${styleSheets}
        </head>
        <body style="margin:0; padding:0; display:flex; justify-content:center; align-items:center; height:100vh;">
            <div class="printable-area">${innerContentToPrint}</div>
        </body>
    </html>
`);

        iframeDoc.close();

        iframe.onload = function () {
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                document.body.removeChild(iframe);
            }, 250);
        };
    };

    if (!product) return null;

    const isOutdoor = product.category?.toLowerCase().includes('outdoor');
    const isIndoor = product.category?.toLowerCase().includes('indoor');

    return (
        <div className="font-sans flex flex-col items-center text-center">
            {/* The visual label component */}
            <div
                ref={printRef}
                className="printable-area bg-white text-black rounded-md w-[45mm] p-[2mm] border border-gray-300 shadow-md flex flex-col items-center text-center"
            >
                {/* === HEADER === */}
                <div className="text-center">
                    <h2 className="text-[10px] leading-tight tracking-wide font-extrabold uppercase italic">Vrindavan Garden Center</h2>
                    <p className="text-[9px] leading-tight text-gray-600">Ph: 9767126970 / 9850372837</p>
                </div>

                <div className="border-t border-black my-0.5" />


                {/* === BODY === */}
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <div className="flex items-center justify-center gap-x-1">
                        <h4 className="font-bold text-[12px] leading-tight">{product.name}</h4>
                        {isIndoor && (
                            <div className="flex items-center gap-x-1 text-[9px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full border-black">
                                <Home size={16} />
                            </div>
                        )}
                        {isOutdoor && (
                            <div className="flex items-center gap-x-1 text-[9px] bg-orange-100 text-orange-800 px-0.5 py-0.5 rounded-full">
                                <Sun size={16} />
                            </div>
                        )}
                    </div>
                </div>

                {/* === FOOTER === */}
                <div className="mt-auto pt-[1mm] text-center">
                    {product.price && (
                        <p className="font-black text-[11px] leading-none tracking-tighter mb-[1mm]">
                            MRP : ₹{product.price}
                        </p>
                    )}
                    <div className="flex justify-center">
                        <canvas className="h-[10px] w-[50px]" />
                    </div>
                </div>
            </div>

            {/* No-print button */}
            <div className="flex justify-center mt-4 no-print">
                <button
                    onClick={handlePrint}
                    className="py-2 px-4 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Print Label
                </button>
            </div>
        </div>
    );
};

export default PriceLabel;
