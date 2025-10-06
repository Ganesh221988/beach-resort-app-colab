import React from 'react';
import { Check, Crown, Building2, Users, Star } from 'lucide-react';

export function PricingPage() {
  const ownerPlans = [
    {
      id: 'owner-free',
      name: 'Free',
      price: 0,
      billing: 'forever',
      description: 'Perfect for getting started',
      features: [
        'List up to 2 properties',
        'Basic booking management',
        'Email support',
        '10% platform commission'
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      id: 'owner-pro',
      name: 'Owner Pro',
      price: 1999,
      billing: 'monthly',
      description: 'Best for growing property businesses',
      features: [
        'Unlimited properties',
        'Advanced analytics dashboard',
        'Priority support',
        'Calendar management',
        '8% platform commission',
        'Custom pricing rules',
        'Bulk operations'
      ],
      popular: true,
      cta: 'Start Pro Plan'
    },
    {
      id: 'owner-enterprise',
      name: 'Enterprise',
      price: 4999,
      billing: 'monthly',
      description: 'For large property management companies',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        '5% platform commission',
        'API access',
        'Advanced reporting'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const brokerPlans = [
    {
      id: 'broker-free',
      name: 'Free',
      price: 0,
      billing: 'forever',
      description: 'Start your broker journey',
      features: [
        'Up to 10 bookings/month',
        'Basic commission tracking',
        'Email support',
        '15% commission rate'
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      id: 'broker-plus',
      name: 'Broker Plus',
      price: 999,
      billing: 'monthly',
      description: 'Perfect for active brokers',
      features: [
        'Unlimited bookings',
        'Advanced commission tracking',
        'Customer management tools',
        'Priority support',
        '20% commission rate',
        'Marketing materials',
        'Performance analytics'
      ],
      popular: true,
      cta: 'Start Plus Plan'
    },
    {
      id: 'broker-pro',
      name: 'Broker Pro',
      price: 1999,
      billing: 'monthly',
      description: 'For professional broker agencies',
      features: [
        'Everything in Plus',
        'Team management',
        'Custom branding',
        'API access',
        '25% commission rate',
        'Dedicated support',
        'Advanced reporting'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const PlanCard = ({ plan, userType }: { plan: any, userType: 'owner' | 'broker' }) => (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
      plan.popular ? 'border-orange-500 scale-105' : 'border-gray-200'
    }`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <Star className="h-4 w-4" />
            <span>Most Popular</span>
          </span>
        </div>
      )}
      
      <div className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          <div className="mb-4">
            <span className="text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
            {plan.price > 0 && <span className="text-gray-600">/{plan.billing}</span>}
          </div>
        </div>
        
        <ul className="space-y-4 mb-8">
          {plan.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
        
        <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          plan.popular
            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }`}>
          {plan.cta}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your business needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Owner Plans */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Property Owner Plans</h2>
            </div>
            <p className="text-lg text-gray-600">Perfect for property owners and managers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ownerPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} userType="owner" />
            ))}
          </div>
        </div>

        {/* Broker Plans */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="h-8 w-8 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Travel Broker Plans</h2>
            </div>
            <p className="text-lg text-gray-600">Designed for travel agents and brokers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brokerPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} userType="broker" />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept all major credit cards, debit cards, and UPI payments through Razorpay.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a setup fee?</h4>
              <p className="text-gray-600">No setup fees! You only pay the monthly subscription fee for your chosen plan.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">Yes, we offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}