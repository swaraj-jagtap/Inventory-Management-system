import React, { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

export const BarcodeCanvas = ({ value }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            try {
                JsBarcode(canvasRef.current, value, {
                    format: 'CODE128',
                    lineColor: '#ffffff',
                    background: '#2d3748',
                    width: 2,
                    height: 50,
                    displayValue: true,
                    fontOptions: "bold",
                    font: "Inter",
                    fontSize: 16,
                    textColor: "#ffffff",
                    margin: 10
                });
            } catch (e) {
                console.error("Barcode generation failed:", e);
            }
        }
    }, [value]);

    return <canvas ref={canvasRef} />;
};

export const PrintableBarcodeCanvas = ({ value }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            try {
                JsBarcode(canvasRef.current, value, {
                    format: 'CODE128',
                    lineColor: '#000000',
                    background: '#ffffff',
                    width: 1.5,
                    height: 40,
                    displayValue: false,
                    margin: 10
                });
            } catch (e) {
                console.error("Printable Barcode generation failed:", e);
            }
        }
    }, [value]);

    return <canvas ref={canvasRef} />;
};