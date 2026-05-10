import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, RefreshCw, Clock } from 'lucide-react';

/**
 * OTP Card Component
 * Dedicated OTP input with countdown timer and resend functionality
 */
export const OTPCard = ({ 
  onOTPChange = () => {},
  onSubmit = () => {},
  loading = false,
  error = false,
  demoOTP = '1234',
  timeLimit = 120 // 2 minutes
}) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOTPInput = (value) => {
    // Only allow numbers, max 4 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setOtp(cleaned);
    onOTPChange(cleaned);

    // Auto-check when 4 digits are entered
    if (cleaned.length === 4) {
      checkOTP(cleaned);
    }
  };

  const checkOTP = (otpValue) => {
    const isValid = otpValue === demoOTP;
    setIsCorrect(isValid);
    setSubmitted(true);

    if (isValid) {
      setTimeout(() => {
        onSubmit(otpValue);
      }, 500);
    } else {
      setTimeout(() => {
        setSubmitted(false);
        setOtp('');
      }, 1500);
    }
  };

  const handleResendOTP = () => {
    setOtp('');
    setTimeLeft(timeLimit);
    setCanResend(false);
    setSubmitted(false);
    setIsCorrect(false);
    setResendCount(prev => prev + 1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-xl">
        {/* Header */}
        <div dir="rtl" className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">التحقق من الهوية</h3>
          <p className="text-slate-600">أدخل رمز التحقق المرسل إليك</p>
        </div>

        {/* Demo OTP Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-center"
        >
          <p className="text-sm text-blue-800">
            <span className="font-semibold">رمز التجربة:</span> {demoOTP}
          </p>
        </motion.div>

        {/* OTP Input */}
        <div dir="rtl" className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            رمز التحقق (OTP)
          </label>
          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={(e) => handleOTPInput(e.target.value)}
              placeholder="0000"
              maxLength="4"
              disabled={loading || isCorrect}
              className={`
                w-full px-4 py-4 text-3xl font-mono font-bold text-center
                rounded-lg border-2 transition-all duration-300
                ${isCorrect 
                  ? 'border-green-500 bg-green-50' 
                  : error || (submitted && !isCorrect)
                  ? 'border-red-500 bg-red-50'
                  : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            />
            
            {/* OTP Input Display */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 1 }}
                    animate={{ scale: otp[index] ? 1.1 : 1 }}
                    className={`
                      w-10 h-10 flex items-center justify-center rounded-lg text-lg font-bold
                      ${otp[index] ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}
                    `}
                  >
                    {otp[index] || '○'}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              {isCorrect ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle size={20} />
                  <span className="font-semibold">رمز صحيح! جاري المتابعة...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={20} />
                  <span className="font-semibold">رمز غير صحيح. حاول مرة أخرى</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer */}
        <div dir="rtl" className="flex items-center justify-center gap-2 mb-6 text-sm">
          <Clock size={16} className="text-slate-500" />
          <span className={`font-mono font-bold ${timeLeft < 30 ? 'text-red-600' : 'text-slate-600'}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-slate-500">الوقت المتبقي</span>
        </div>

        {/* Resend OTP */}
        <motion.button
          onClick={handleResendOTP}
          disabled={!canResend || loading}
          whileHover={{ scale: canResend ? 1.05 : 1 }}
          whileTap={{ scale: canResend ? 0.95 : 1 }}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2
            transition-all duration-300
            ${canResend
              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
          `}
        >
          <RefreshCw size={18} className={canResend ? 'animate-spin-slow' : ''} />
          إعادة إرسال الرمز {resendCount > 0 && `(${resendCount})`}
        </motion.button>

        {/* Submit Button */}
        <motion.button
          onClick={() => checkOTP(otp)}
          disabled={otp.length < 4 || loading || isCorrect}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full mt-4 py-3 px-4 rounded-lg font-bold text-white
            transition-all duration-300 flex items-center justify-center gap-2
            ${otp.length === 4 && !loading && !isCorrect
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg'
              : 'bg-slate-300 cursor-not-allowed'}
          `}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري التحقق...
            </>
          ) : (
            'التحقق'
          )}
        </motion.button>

        {/* Info */}
        <p dir="rtl" className="text-xs text-slate-500 text-center mt-4">
          تم إرسال رمز التحقق إلى بريدك الإلكتروني
        </p>
      </div>
    </motion.div>
  );
};

export default OTPCard;
