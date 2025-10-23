"use client";

import { motion } from "framer-motion";
import { Check, X, Star, Zap, Crown } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: Array<{ text: string; included: boolean }>;
  highlighted?: boolean;
  badge?: string;
  icon?: "star" | "zap" | "crown";
  buttonText?: string;
  buttonVariant?: "primary" | "secondary" | "premium";
}

interface PricingCardsProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
}

const iconMap = {
  star: Star,
  zap: Zap,
  crown: Crown,
};

export default function PricingCards({
  title = "Planes y Precios",
  subtitle = "Elige el plan perfecto para ti",
  plans,
}: PricingCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-600">{subtitle}</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const Icon = plan.icon ? iconMap[plan.icon] : Star;
          const isHighlighted = plan.highlighted;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className={`
                relative rounded-3xl p-8 border-2 transition-all
                ${
                  isHighlighted
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 border-transparent shadow-2xl"
                    : "bg-white border-gray-200 shadow-lg hover:shadow-2xl"
                }
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span
                    className={`
                    px-4 py-1 rounded-full text-xs font-bold shadow-lg
                    ${
                      isHighlighted
                        ? "bg-yellow-400 text-gray-900"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    }
                  `}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className={`
                  p-4 rounded-2xl
                  ${isHighlighted ? "bg-white/20" : "bg-blue-100"}
                `}
                >
                  <Icon
                    className={`w-8 h-8 ${isHighlighted ? "text-white" : "text-blue-600"}`}
                  />
                </div>
              </div>

              {/* Plan Name */}
              <h3
                className={`
                text-2xl font-bold text-center mb-2
                ${isHighlighted ? "text-white" : "text-gray-900"}
              `}
              >
                {plan.name}
              </h3>

              {/* Description */}
              {plan.description && (
                <p
                  className={`
                  text-center mb-6
                  ${isHighlighted ? "text-white/80" : "text-gray-600"}
                `}
                >
                  {plan.description}
                </p>
              )}

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span
                    className={`
                    text-5xl font-bold
                    ${isHighlighted ? "text-white" : "text-gray-900"}
                  `}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`
                      text-lg
                      ${isHighlighted ? "text-white/70" : "text-gray-500"}
                    `}
                    >
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    {feature.included ? (
                      <div
                        className={`
                        mt-1 rounded-full p-0.5
                        ${isHighlighted ? "bg-white/20" : "bg-green-100"}
                      `}
                      >
                        <Check
                          className={`w-4 h-4 ${isHighlighted ? "text-white" : "text-green-600"}`}
                        />
                      </div>
                    ) : (
                      <div
                        className={`
                        mt-1 rounded-full p-0.5
                        ${isHighlighted ? "bg-white/10" : "bg-gray-100"}
                      `}
                      >
                        <X
                          className={`w-4 h-4 ${isHighlighted ? "text-white/40" : "text-gray-400"}`}
                        />
                      </div>
                    )}
                    <span
                      className={`
                      flex-1 text-sm
                      ${
                        feature.included
                          ? isHighlighted
                            ? "text-white"
                            : "text-gray-700"
                          : isHighlighted
                          ? "text-white/40 line-through"
                          : "text-gray-400 line-through"
                      }
                    `}
                    >
                      {feature.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`
                w-full py-4 rounded-xl font-bold text-lg transition-all
                ${
                  isHighlighted
                    ? "bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
                    : plan.buttonVariant === "premium"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }
              `}
              >
                {plan.buttonText || "Comenzar ahora"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
