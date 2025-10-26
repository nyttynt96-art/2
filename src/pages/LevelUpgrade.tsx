import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Trophy,
  Wallet,
  CheckCircle,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  address: string;
  network: string;
  qrCode?: string;
  description: string;
}

interface LevelCosts {
  level1: number;
  level2: number;
  level3: number;
}

export default function LevelUpgrade() {
  const [, setLocation] = useLocation();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState('');
  const [requestedLevel, setRequestedLevel] = useState<1 | 2 | 3>(1);
  const [levelCosts, setLevelCosts] = useState<LevelCosts>({ level1: 10, level2: 50, level3: 100 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
    fetchLevelCosts();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment-methods/active', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success && data.paymentMethods.length > 0) {
        setPaymentMethods(data.paymentMethods);
        setSelectedMethod(data.paymentMethods[0]);
        setAmount(getLevelCost(requestedLevel).toString());
      }
    } catch (error) {
      toast.error('Failed to load payment methods');
    }
  };

  const fetchLevelCosts = async () => {
    try {
      const level1Response = await fetch('/api/admin/settings?key=LEVEL_UPGRADE_L1', {
        credentials: 'include',
      });
      const level2Response = await fetch('/api/admin/settings?key=LEVEL_UPGRADE_L2', {
        credentials: 'include',
      });
      const level3Response = await fetch('/api/admin/settings?key=LEVEL_UPGRADE_L3', {
        credentials: 'include',
      });

      const level1Data = await level1Response.json();
      const level2Data = await level2Response.json();
      const level3Data = await level3Response.json();

      setLevelCosts({
        level1: parseFloat(level1Data.settings?.[0]?.value || '10'),
        level2: parseFloat(level2Data.settings?.[0]?.value || '50'),
        level3: parseFloat(level3Data.settings?.[0]?.value || '100'),
      });
    } catch (error) {
      console.error('Failed to load level costs, using defaults');
      setLevelCosts({
        level1: 10,
        level2: 50,
        level3: 100,
      });
    }
  };

  const getLevelCost = (level: 1 | 2 | 3) => {
    return level === 1 ? levelCosts.level1 : level === 2 ? levelCosts.level2 : levelCosts.level3;
  };

  const handleLevelChange = (level: 1 | 2 | 3) => {
    setRequestedLevel(level);
    setAmount(getLevelCost(level).toString());
  };

  const copyAddress = async () => {
    if (selectedMethod) {
      try {
        await navigator.clipboard.writeText(selectedMethod.address);
        toast.success('Address copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy address');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!txHash.trim()) {
      toast.error('Please enter the transaction hash');
      return;
    }

    if (!amount || parseFloat(amount) < getLevelCost(requestedLevel)) {
      toast.error(`Invalid amount. Required: $${getLevelCost(requestedLevel)}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/level-upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          requestedLevel,
          paymentMethodId: selectedMethod.id,
          paymentTxHash: txHash,
          paymentAmount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Level upgrade request submitted successfully! Awaiting admin verification.');
        setTimeout(() => {
          setLocation('/dashboard');
        }, 2000);
      } else {
        toast.error(data.error || 'Failed to submit request');
        if (data.availableMethods) {
          setPaymentMethods(data.availableMethods);
        }
      }
    } catch (error) {
      toast.error('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-lg border-b border-slate-600/50 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 hover-lift">
              <Link href="/dashboard">
                <Button variant="ghost" className="hover-glow text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Trophy className="h-10 w-10 text-amber-500 float-animation" />
              <div>
                <h1 className="text-2xl font-bold text-white font-display drop-shadow-lg">Level Upgrade</h1>
                <p className="text-sm text-slate-300">Upgrade your level to unlock more benefits</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Level Selection */}
          <div className="lg:col-span-1">
            <Card className="dashboard-card animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-brand-pink" />
                  Select Your Level
                </CardTitle>
                <CardDescription>
                  Choose the level you want to upgrade to
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleLevelChange(level as 1 | 2 | 3)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      requestedLevel === level
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Level {level}</h3>
                        <p className="text-sm text-gray-600">
                          {level === 1 && 'Entry Level'}
                          {level === 2 && 'Advanced Level'}
                          {level === 3 && 'Expert Level'}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                        ${getLevelCost(level as 1 | 2 | 3)}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="dashboard-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>Level Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Higher earning potential
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Exclusive tasks
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="dashboard-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2 text-brand-blue" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Send the payment and enter the transaction hash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <Label>Select Payment Method</Label>
                    <select
                      value={selectedMethod?.id || ''}
                      onChange={(e) => {
                        const method = paymentMethods.find(m => m.id === e.target.value);
                        setSelectedMethod(method || null);
                      }}
                      className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name} - {method.network}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Details */}
                  {selectedMethod && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-semibold">Payment Address</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={copyAddress}
                            className="h-8"
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="p-3 bg-white rounded border font-mono text-sm break-all">
                          {selectedMethod.address}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">Network</Label>
                        <div className="p-3 bg-white rounded border mt-2">
                          {selectedMethod.network}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">Amount to Send</Label>
                        <div className="p-3 bg-white rounded border mt-2 text-xl font-bold text-green-600">
                          ${amount} USDT
                        </div>
                      </div>

                      {selectedMethod.qrCode && (
                        <div>
                          <Label className="text-sm font-semibold">QR Code</Label>
                          <div className="mt-2 p-4 bg-white rounded border inline-block">
                            <img src={selectedMethod.qrCode} alt="QR Code" className="w-48 h-48" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Transaction Hash */}
                  <div>
                    <Label htmlFor="txHash">Transaction Hash (TxHash)</Label>
                    <Input
                      id="txHash"
                      type="text"
                      placeholder="Enter your transaction hash after sending payment"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="mt-2"
                      required
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Paste the transaction hash from your wallet after completing the payment
                    </p>
                  </div>

                  {/* Amount Verification */}
                  <div>
                    <Label htmlFor="amount">Amount (for verification)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min={getLevelCost(requestedLevel)}
                      placeholder={`Minimum: $${getLevelCost(requestedLevel)}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={isSubmitting || !txHash || !selectedMethod}
                  >
                    {isSubmitting ? 'Submitting...' : `Request Level ${requestedLevel} Upgrade`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

