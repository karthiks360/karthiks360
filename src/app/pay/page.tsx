'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';
import { MouseGlowEffect } from '@/components/MouseGlowEffect';

export default function PayPage() {
    const [paykey, setPaykey] = useState('');

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();

        if (paykey === 'PAY') {
            window.location.href = 'upi://pay?pa=karthiks360@ybl&pn=KARTHIK S&mc=0000&mode=02&purpose=00&orgid=180001&tn=Paying to KARTHIK S';
            alert('PAYING RANDOM AMOUNT');
        } else if (paykey === 'SBINKAR') {
            window.location.href = 'upi://pay?pa=karthiks360@sbi&pn=KARTHIK S&am=&mc=0000&mode=02&purpose=00&orgid=180001&tn=Paying to KARTHIK S';
            alert('SELECT UPI APP TO PAY [SBIN]');
        } else if (paykey === 'HDFCKAR') {
            window.location.href = 'upi://pay?pa=karthiks360@hdfcbank&pn=KARTHIK S&am=&mc=0000&mode=02&purpose=00&orgid=180001&tn=Paying to KARTHIK S';
            alert('SELECT UPI APP TO PAY [HDFC]');
        } else if (paykey === 'SBINSRI') {
            window.location.href = 'upi://pay?pa=karthiks360@kotak&pn=KARTHIK S&am=&mc=0000&mode=02&purpose=00&orgid=180001&tn=Paying to KARTHIK S';
            alert('SELECT UPI APP TO PAY [KKBK]');
        } else if (paykey === 'KKBK') {
            window.location.href = 'upi://pay?pa=karthiks360@kotak&pn=KARTHIK S&am=&mc=0000&mode=02&purpose=00&orgid=180001&tn=Paying to KARTHIK S';
            alert('SELECT UPI APP TO PAY [KKBK]');
        } else if (paykey === 'PAYTM') {
            alert('Currently Unavailable - Under Maintenance');
        } else {
            alert('Enter PAY in payment key box to pay random amount\n(Payment keys are case sensitive)\n Contact payment link provider for payment key');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
            <ParticleBackground />
            <MouseGlowEffect />
            <div className="relative z-10">
                <Navigation />

                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 mt-16">
                    <div className="space-y-12">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <h1 className="text-slate-900 text-4xl sm:text-5xl lg:text-6xl font-bold">
                                PAYING TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">"KARTHIK S"</span>
                            </h1>
                        </div>

                        {/* Payment Key Form */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200">
                            <form onSubmit={handlePayment} className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="paykey" className="block text-slate-700 text-lg font-medium">
                                        Enter payment Key
                                    </label>
                                    <input
                                        id="paykey"
                                        type="text"
                                        maxLength={10}
                                        value={paykey}
                                        onChange={(e) => setPaykey(e.target.value)}
                                        placeholder=""
                                        required
                                        className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                                >
                                    PAY
                                </button>
                            </form>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-blue-50/50 backdrop-blur-sm rounded-xl p-6 border border-blue-100">
                            <p className="text-slate-700 text-center text-sm leading-relaxed">
                                <strong>UPI Supported</strong> - BHIM/Phonepe/Gpay/Paytm/Amazon pay & Bank UPI apps
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t-2 border-slate-200"></div>

                        {/* Terms & Conditions */}
                        <div className="text-center">
                            <p className="text-slate-600 text-sm">
                                All payments made will be subjected to verification, T&C Apply
                            </p>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </div>
    );
}
