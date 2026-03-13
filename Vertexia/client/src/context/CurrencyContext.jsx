import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');
    const [rate, setRate] = useState(1);
    const [symbol, setSymbol] = useState('$');
    const [isIndian, setIsIndian] = useState(false);

    useEffect(() => {
        const detectCurrency = () => {
            try {
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const isIndianTZ = timeZone && (
                    timeZone.includes('Calcutta') ||
                    timeZone.includes('Kolkata') ||
                    timeZone.includes('Asia/Colombo') ||
                    timeZone.includes('Asia/Dhaka')
                );

                if (isIndianTZ) {
                    setCurrency('INR');
                    setSymbol('₹');
                    setRate(1);
                    setIsIndian(true);
                } else {
                    setCurrency('USD');
                    setSymbol('$');
                    setRate(1 / 83.5);
                    setIsIndian(false);
                }
            } catch {
                // Ultimate fallback to USD
                setCurrency('USD');
                setSymbol('$');
                setRate(1 / 83.5);
                setIsIndian(false);
            }
        };

        detectCurrency();
    }, []);

    const formatPrice = (price) => {
        if (price === undefined || price === null) return `${symbol}0`;
        const converted = price * rate;

        return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: currency === 'INR' ? 0 : 2
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, symbol, rate, formatPrice, isIndian }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
