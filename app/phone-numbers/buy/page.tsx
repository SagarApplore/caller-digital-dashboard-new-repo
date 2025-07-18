'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/organisms/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Info,
  Search,
  Phone,
  ChevronDown,
  MapPin,
  Tag,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/protected-route';
import Dashboard from '@/components/templates/dashboard';
import { useRouter } from 'next/navigation';
import phoneNumbersService, { SearchResult } from '@/services/phone-numbers.service';

// Flag Icon Component
const FlagIcon = ({ countryCode }: { countryCode: string }) => {
  const getFlagStyle = (code: string) => {
    switch (code) {
      case 'US':
        return 'bg-gradient-to-b from-red-500 via-white to-blue-500';
      case 'IN':
        return 'bg-gradient-to-b from-orange-500 via-white to-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className={`w-6 h-4 rounded-sm ${getFlagStyle(countryCode)} border border-gray-300 flex items-center justify-center`}>
      {countryCode === 'US' && (
        <div className="w-3 h-2 bg-blue-600 rounded-sm"></div>
      )}
      {countryCode === 'IN' && (
        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
      )}
    </div>
  );
};

interface Country {
  code: string;
  name: string;
  flag: string;
  flagText: string;
  dialCode: string;
}

interface BuyNumberForm {
  country: string;
  type: string;
  number: string;
  capabilities: string[];
}

const countries: Country[] = [
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    flagText: 'US',
    dialCode: '+1'
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    flagText: 'IN',
    dialCode: '+91'
  }
];

const numberTypes = [
  { value: 'any', label: 'Any' },
  { value: 'local', label: 'Local' },
  { value: 'national', label: 'National', disabled: true },
  { value: 'mobile', label: 'Mobile', disabled: true },
  { value: 'toll-free', label: 'Toll-Free' }
];

const capabilities = [
  { value: 'any', label: 'Any' },
  { value: 'voice', label: 'Voice' },
  { value: 'sms', label: 'SMS' },
  { value: 'mms', label: 'MMS' }
];

export default function BuyNumbersPage() {
  const [formData, setFormData] = useState<BuyNumberForm>({
    country: 'IN',
    type: 'any',
    number: '',
    capabilities: ['any']
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [apiId, setApiId] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const selectedCountry = countries.find(c => c.code === formData.country);

  // Pagination helpers
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const handlePageChange = async (page: number) => {
    if (page === currentPage) return;
    
    setIsLoadingMore(true);
    try {
      const request = {
        country: formData.country,
        type: formData.type === 'any' ? undefined : formData.type,
        capabilities: formData.capabilities.includes('any') ? undefined : formData.capabilities,
        prefix: formData.number || undefined,
        page: page,
        limit: itemsPerPage
      };

      const results = await phoneNumbersService.searchAvailableNumbers(request);
      setSearchResults(results.numbers);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading page:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleCapabilityChange = (value: string, checked: boolean) => {
    setFormData(prev => {
      let newCapabilities = [...prev.capabilities];
      
      if (value === 'any') {
        if (checked) {
          newCapabilities = ['any'];
        } else {
          newCapabilities = newCapabilities.filter(c => c !== 'any');
        }
      } else {
        if (checked) {
          newCapabilities = newCapabilities.filter(c => c !== 'any');
          newCapabilities.push(value);
        } else {
          newCapabilities = newCapabilities.filter(c => c !== value);
        }
      }
      
      // If no capabilities selected, default to 'any'
      if (newCapabilities.length === 0) {
        newCapabilities = ['any'];
      }
      
      return { ...prev, capabilities: newCapabilities };
    });
  };

  const handleSearch = async () => {
    if (!formData.country) {
      toast({
        title: 'Error',
        description: 'Please select a country',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);
    try {
      const request = {
        country: formData.country,
        type: formData.type === 'any' ? undefined : formData.type,
        capabilities: formData.capabilities.includes('any') ? undefined : formData.capabilities,
        prefix: formData.number || undefined,
        page: 1,
        limit: itemsPerPage
      };

      // Call the backend API to search for available numbers
      const results = await phoneNumbersService.searchAvailableNumbers(request);
      
      console.log('Search results:', results); // Debug log
      console.log('API ID:', results.api_id); // Debug log
      
      setSearchResults(results.numbers);
      setTotalResults(results.total || results.numbers.length);
      console.log("results",results)
      setApiId(results.api_id);
      setShowResults(true);
      setCurrentPage(1); // Reset to first page for new search results
      
      toast({
        title: 'Success',
        description: `Found ${results.total || results.numbers.length} available numbers for ${selectedCountry?.name}`,
      });
      
    } catch (error) {
      console.error('Error searching for numbers:', error);
      toast({
        title: 'Error',
        description: 'Failed to search for available numbers',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleBuyNumber = async (number: SearchResult) => {
    try {
      // Create Razorpay order
      const orderResponse = await phoneNumbersService.createPhoneNumberOrder({
        phoneNumber: number.number,
        region: number.region,
        monthly_rental_rate: number.monthly_rental_rate,
        voice_enabled: number.voice_enabled,
        country: formData.country
      });

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const { order } = orderResponse;

      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // @ts-ignore - Razorpay is loaded globally
        const razorpay = new (window as any).Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency,
          name: 'Caller Digital',
          description: `Purchase ${number.number}`,
          order_id: order.id,
          handler: async function (response: any) {
            try {
              // Verify payment on backend
              const verificationResponse = await phoneNumbersService.verifyPhoneNumberPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verificationResponse.success) {
                // Call Python API to register the purchased number
                try {
                  await phoneNumbersService.registerNumberWithPythonAPI(number.number, response, apiId);
                  console.log('Successfully registered number with Python API:', number.number, 'API ID:', apiId);
                } catch (pythonApiError) {
                  console.error('Failed to register number with Python API:', pythonApiError);
                  // Don't fail the entire transaction if Python API fails
                  // Just log the error and continue
                }

                toast({
                  title: 'Success',
                  description: `Successfully purchased ${number.number}`,
                });
                
                // Navigate back to phone numbers page
                router.push('/phone-numbers');
              } else {
                throw new Error(verificationResponse.message || 'Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast({
                title: 'Error',
                description: 'Payment verification failed',
                variant: 'destructive',
              });
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || ''
          },
          theme: {
            color: '#16a34a' // Green color matching the app theme
          },
          modal: {
            ondismiss: function() {
              // Remove script when modal is dismissed
              document.body.removeChild(script);
            }
          }
        });

        razorpay.open();
      };

      script.onerror = () => {
        toast({
          title: 'Error',
          description: 'Failed to load payment gateway',
          variant: 'destructive',
        });
        document.body.removeChild(script);
      };
      
    } catch (error) {
      console.error('Error buying number:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to purchase number',
        variant: 'destructive',
      });
    }
  };

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Buy Numbers",
          subtitle: {
            text: "Search and acquire phone numbers",
          },
          children: (
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ),
        }}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <Phone className="h-6 w-6 text-green-600" />
                  Search for Available Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Country Selection */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        Country
                        <Info className="h-4 w-4 text-gray-400" />
                      </Label>
                      <Select value={formData.country} onValueChange={handleCountryChange}>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-green-500 focus:ring-green-500">
                          <SelectValue>
                            {selectedCountry && (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <FlagIcon countryCode={selectedCountry.code} />
                                  <span className="text-xs text-gray-500 font-mono">({selectedCountry.flagText})</span>
                                </div>
                                <span className="text-gray-900 font-medium">
                                  {selectedCountry.name} ({selectedCountry.dialCode})
                                </span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="border-gray-200 shadow-lg">
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code} className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <FlagIcon countryCode={country.code} />
                                  <span className="text-xs text-gray-500 font-mono">({country.flagText})</span>
                                </div>
                                <span className="text-gray-900 font-medium">
                                  {country.name} ({country.dialCode})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Number Type Selection - Commented out for now */}
                    {/* <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">Type</Label>
                      <p className="text-sm text-gray-600">Choose a number type that suits your requirement.</p>
                      <RadioGroup value={formData.type} onValueChange={handleTypeChange} className="space-y-3">
                        {numberTypes.map((type) => (
                          <div key={type.value} className="flex items-center space-x-3">
                            <RadioGroupItem 
                              value={type.value} 
                              id={type.value}
                              disabled={type.disabled}
                              className="text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <Label 
                              htmlFor={type.value} 
                              className={`text-sm font-medium ${type.disabled ? 'text-gray-400' : 'text-gray-700'}`}
                            >
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div> */}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Number Input */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Number</Label>
                      <div className="flex gap-2">
                        <Select value="number" disabled>
                          <SelectTrigger className="w-24 h-12 border-gray-300 bg-gray-50">
                            <SelectValue>Number</SelectValue>
                          </SelectTrigger>
                        </Select>
                        <Input
                          placeholder="Enter a prefix or a number"
                          value={formData.number}
                          onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                          className="flex-1 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </div>

                    {/* Capability Selection - Commented out for now */}
                    {/* <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">Capability</Label>
                      <p className="text-sm text-gray-600">Choose what capability you want for your number.</p>
                      <div className="space-y-3">
                        {capabilities.map((capability) => (
                          <div key={capability.value} className="flex items-center space-x-3">
                            <Checkbox
                              id={capability.value}
                              checked={formData.capabilities.includes(capability.value)}
                              onCheckedChange={(checked) => 
                                handleCapabilityChange(capability.value, checked as boolean)
                              }
                              className="text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <Label htmlFor={capability.value} className="text-sm font-medium text-gray-700">
                              {capability.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-green-600 hover:bg-green-700 px-8 py-3 h-12 text-base font-medium"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Search Results */}
            {showResults && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                    <Search className="h-6 w-6 text-green-600" />
                    Available Numbers ({totalResults})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-4 font-medium text-gray-700">Number & Region</th>
                          <th className="text-left py-4 px-4 font-medium text-gray-700">Voice Enabled</th>
                          <th className="text-left py-4 px-4 font-medium text-gray-700">Monthly Rental Rate</th>
                          <th className="text-left py-4 px-4 font-medium text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((number, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{number.number}</div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <MapPin className="h-3 w-3" />
                                  {number.region}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                number.voice_enabled 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {number.voice_enabled ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1">
                                
                                <span className="font-medium text-gray-900">{number.monthly_rental_rate}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Button
                                onClick={() => handleBuyNumber(number)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
                              >
                                Buy Number
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Showing {totalResults > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} results
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1 || isLoadingMore}
                          className="flex items-center gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              disabled={isLoadingMore}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages || isLoadingMore}
                          className="flex items-center gap-1"
                        >
                          {isLoadingMore ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                              Loading...
                            </>
                          ) : (
                            <>
                              Next
                              <ChevronRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Dashboard>
    </ProtectedRoute>
  );
} 