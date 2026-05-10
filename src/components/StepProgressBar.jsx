import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';

/**
 * Step Progress Bar Component
 * Shows current step, title, and elapsed time
 * RTL-aware layout
 */
export const StepProgressBar = ({ 
  currentStep = 1, 
  totalSteps = 3, 
  stepTitles = ['تفاصيل الحجز', 'بيانات الدفع', 'تأكيد الدفع'],
  showTimer = true 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [stepStartTime, setStepStartTime] = useState(Date.now());

  useEffect(() => {
    if (!showTimer) return;
    
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - stepStartTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer, stepStartTime]);

  useEffect(() => {
    setElapsedTime(0);
    setStepStartTime(Date.now());
  }, [currentStep]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div dir="rtl" className="w-full bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 mb-8 border border-slate-200">
      {/* Step Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        key={currentStep}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-slate-900">
            {stepTitles[currentStep - 1]}
          </h2>
          {showTimer && (
            <div className="flex items-center gap-2 text-slate-600">
              <Clock size={18} />
              <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-slate-500">الخطوة {currentStep} من {totalSteps}</p>
      </motion.div>

      {/* Step Progress Line */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={stepNumber} className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                    transition-all duration-300 mb-2
                    ${isCompleted ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-200' : 
                      'bg-slate-300 text-slate-600'}
                  `}
                >
                  {isCompleted ? (
                    <Check size={24} />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </motion.div>

                {/* Step Label */}
                <p className="text-xs font-semibold text-center text-slate-700 w-full px-1 line-clamp-2">
                  {stepTitles[index]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Connecting Line */}
        <div className="flex items-center gap-1 mt-6">
          {Array.from({ length: totalSteps - 1 }).map((_, index) => {
            const isCompleted = index + 1 < currentStep;
            const isCurrent = index + 1 === currentStep - 1;

            return (
              <div
                key={index}
                className={`
                  flex-1 h-1 rounded-full transition-all duration-300
                  ${isCompleted ? 'bg-green-500' : 
                    isCurrent ? 'bg-blue-300' : 
                    'bg-slate-200'}
                `}
              />
            );
          })}
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm font-medium text-slate-600">
          {Math.round((currentStep / totalSteps) * 100)}% مكتمل
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepProgressBar;
