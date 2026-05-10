import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Card Mockup Component
 * Real-time credit card preview with masked number, name, and expiry
 * Shows as user types in the payment form
 */
export const CardMockup = ({ 
  cardNumber = '',
  cardHolder = 'اسم صاحب البطاقة',
  expiryDate = 'MM/YY',
  cvv = '',
  cardType = 'visa',
  showCVV = false,
  onCVVFocus = () => {}
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Get card color based on type
  const getCardGradient = () => {
    switch (cardType?.toLowerCase()) {
      case 'mastercard':
        return 'from-orange-500 to-red-500';
      case 'amex':
        return 'from-blue-700 to-blue-900';
      default: // Visa
        return 'from-blue-500 to-blue-700';
    }
  };

  // Mask card number - show first 4 and last 4 digits
  const maskCardNumber = (num) => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.length < 4) return cleaned;
    if (cleaned.length <= 8) {
      return cleaned.slice(0, 4) + '-****';
    }
    const first4 = cleaned.slice(0, 4);
    const last4 = cleaned.slice(-4);
    return `${first4}-****-****-${last4}`;
  };

  // Format expiry date
  const formatExpiryDisplay = (date) => {
    if (!date) return 'MM/YY';
    const cleaned = date.replace(/\D/g, '');
    if (cleaned.length === 0) return 'MM/YY';
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  const handleCVVClick = () => {
    setIsFlipped(true);
    onCVVFocus();
  };

  return (
    <div dir="ltr" className="w-full flex items-center justify-center perspective">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ perspective: '1000px' }}
          className="relative w-full h-56"
        >
          {/* Front of Card */}
          <motion.div
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className={`
              absolute w-full h-56 rounded-2xl shadow-2xl p-6 flex flex-col justify-between
              bg-gradient-to-br ${getCardGradient()} text-white
              border border-white/20 backdrop-blur-sm
            `}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div className="text-sm font-semibold opacity-75">VISA</div>
              <div className="text-xl font-bold">●●</div>
            </div>

            {/* Middle - Card Number */}
            <div className="space-y-3">
              <div className="text-xs opacity-75 tracking-widest">CARD NUMBER</div>
              <motion.div
                key={cardNumber}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-mono font-bold tracking-wider"
              >
                {maskCardNumber(cardNumber) || '••••-••••-••••-••••'}
              </motion.div>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-75">CARDHOLDER NAME</div>
                <motion.div
                  key={cardHolder}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-bold truncate"
                >
                  {cardHolder || 'YOUR NAME'}
                </motion.div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75">EXPIRY</div>
                <motion.div
                  key={expiryDate}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-mono font-bold"
                >
                  {formatExpiryDisplay(expiryDate)}
                </motion.div>
              </div>
            </div>

            {/* Chip */}
            <div className="absolute top-6 right-6 w-12 h-9 rounded bg-yellow-400/40 border border-yellow-300/60" />
          </motion.div>

          {/* Back of Card */}
          <motion.div
            initial={false}
            animate={{ rotateY: isFlipped ? 0 : 180 }}
            transition={{ duration: 0.6 }}
            className={`
              absolute w-full h-56 rounded-2xl shadow-2xl p-6 flex flex-col justify-between
              bg-gradient-to-br ${getCardGradient()} text-white
              border border-white/20 backdrop-blur-sm
            `}
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {/* Magnetic Strip */}
            <div className="w-full h-12 bg-black/40 rounded mt-2"></div>

            {/* CVV Section */}
            <div className="flex flex-col items-end">
              <div className="text-xs opacity-75 mb-2">CVV / SECURITY CODE</div>
              <motion.div
                key={cvv}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-16 h-8 bg-white/20 rounded text-white text-center flex items-center justify-center text-lg font-mono font-bold"
              >
                {showCVV ? cvv : '•••'}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="text-xs opacity-75">
              This side is for your reference. Never share this information.
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* CVV Click Area - Flip Card */}
      <motion.button
        onClick={handleCVVClick}
        onMouseLeave={() => setIsFlipped(false)}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        title="Click to see CVV"
      >
        {isFlipped ? <EyeOff size={18} /> : <Eye size={18} />}
      </motion.button>
    </div>
  );
};

export default CardMockup;
