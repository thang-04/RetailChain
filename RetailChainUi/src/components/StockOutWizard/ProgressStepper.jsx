import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProgressStepper = ({ currentStep, steps }) => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={index} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                                        isCompleted && "bg-primary text-primary-foreground",
                                        isCurrent && "bg-primary/10 border-2 border-primary text-primary",
                                        !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                                </div>
                                <span
                                    className={cn(
                                        "mt-2 text-xs font-medium text-center",
                                        isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {step}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "flex-1 h-1 mx-2 transition-all duration-300",
                                        stepNumber < currentStep ? "bg-primary" : "bg-border"
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressStepper;
