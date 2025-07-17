'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/organisms/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/atoms/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  X, 
  Info,
  Phone,
  Settings,
  MoreVertical,
  Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/protected-route';
import Dashboard from '@/components/templates/dashboard';
import phoneNumbersService, { PhoneNumber } from '@/services/phone-numbers.service';
import { useRouter } from 'next/navigation';

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(true);
  const [selectedAction, setSelectedAction] = useState('');
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const fetchPhoneNumbers = async () => {
    try {
      setIsLoading(true);
      const data = await phoneNumbersService.getPhoneNumbers();
      setPhoneNumbers(data);
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load phone numbers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const handleSearch = () => {
    // Search is handled by filtering the local state
    console.log('Searching for:', searchTerm);
  };

  const handleFilter = () => {
    // Implement filter functionality
    console.log('Opening filter modal');
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNumbers(phoneNumbers.map(num => num.id));
    } else {
      setSelectedNumbers([]);
    }
  };

  const handleSelectNumber = (numberId: string, checked: boolean) => {
    if (checked) {
      setSelectedNumbers(prev => [...prev, numberId]);
    } else {
      setSelectedNumbers(prev => prev.filter(id => id !== numberId));
    }
  };

  const handleAction = async () => {
    if (!selectedAction) {
      toast({
        title: 'Warning',
        description: 'Please select an action first',
        variant: 'destructive',
      });
      return;
    }

    if (selectedNumbers.length === 0) {
      toast({
        title: 'Warning',
        description: 'Please select at least one phone number',
        variant: 'destructive',
      });
      return;
    }

    setIsPerformingAction(true);
    try {
      switch (selectedAction) {
        case 'assign':
          // This would need a modal to select application
          toast({
            title: 'Info',
            description: 'Please use the individual action menu to assign applications',
          });
          break;
        case 'unassign':
          await phoneNumbersService.bulkUnassignApplication(selectedNumbers);
          toast({
            title: 'Success',
            description: 'Applications unassigned successfully',
          });
          break;
        case 'delete':
          await phoneNumbersService.bulkDelete(selectedNumbers);
          toast({
            title: 'Success',
            description: 'Phone numbers deleted successfully',
          });
          break;
        case 'suspend':
          await phoneNumbersService.bulkSuspend(selectedNumbers);
          toast({
            title: 'Success',
            description: 'Phone numbers suspended successfully',
          });
          break;
        default:
          toast({
            title: 'Error',
            description: 'Unknown action selected',
            variant: 'destructive',
          });
      }
      
      // Refresh the data
      await fetchPhoneNumbers();
      setSelectedNumbers([]);
      setSelectedAction('');
    } catch (error) {
      console.error('Error performing action:', error);
      toast({
        title: 'Error',
        description: 'Failed to perform action',
        variant: 'destructive',
      });
    } finally {
      setIsPerformingAction(false);
    }
  };

  const filteredNumbers = phoneNumbers.filter(number =>
    number.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    number.alias.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const numbersWithoutApplications = phoneNumbers?.filter(number => 
    !number.configuration || number.configuration === '-'
  );

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Dashboard
          header={{
            title: "Your Numbers",
            subtitle: {
              text: "Manage your phone numbers",
            },
          }}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </Dashboard>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Your Numbers",
          subtitle: {
            text: "Manage your phone numbers",
          },
          children: (
            <Button 
              onClick={() => router.push('/phone-numbers/buy')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buy Number
            </Button>
          ),
        }}
      >
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Alert Banner */}
            {showAlert && numbersWithoutApplications.length > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  You have {numbersWithoutApplications.length} phone number(s) without assigned applications. 
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-orange-800 underline"
                    onClick={() => setShowAlert(false)}
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Search and Filter Bar */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search phone numbers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleFilter}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {filteredNumbers.length} of {phoneNumbers.length} numbers
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedNumbers.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {selectedNumbers.length} number(s) selected
                      </span>
                      <Select value={selectedAction} onValueChange={setSelectedAction}>
                        <SelectTrigger className="w-48 border-gray-300">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assign">Assign Application</SelectItem>
                          <SelectItem value="unassign">Unassign Application</SelectItem>
                          <SelectItem value="delete">Delete Numbers</SelectItem>
                          <SelectItem value="suspend">Suspend Numbers</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAction}
                        disabled={!selectedAction || isPerformingAction}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isPerformingAction ? 'Processing...' : 'Apply'}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedNumbers([])}
                      className="border-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Phone Numbers Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Phone Numbers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">
                          <Checkbox
                            checked={selectedNumbers.length === phoneNumbers.length && phoneNumbers.length > 0}
                            onCheckedChange={handleSelectAll}
                            className="border-gray-300"
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Number</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Alias</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Capabilities</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Configuration</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNumbers.map((number) => (
                        <tr key={number.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <Checkbox
                              checked={selectedNumbers.includes(number.id)}
                              onCheckedChange={(checked) => handleSelectNumber(number.id, checked as boolean)}
                              className="border-gray-300"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-900">{number.number}</div>
                            <div className="text-sm text-gray-500">{number.area}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900">{number.alias}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="capitalize">
                              {number.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {number.capabilities.map((capability, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {capability}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-900">{number.configuration}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={number.status === 'active' ? 'default' : 'secondary'}
                              className={number.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                            >
                              {number.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredNumbers.length === 0 && (
                  <div className="text-center py-12">
                    <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No phone numbers found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ? 'Try adjusting your search terms.' : 'Get started by purchasing your first phone number.'}
                    </p>
                    {!searchTerm && (
                      <Button 
                        onClick={() => router.push('/phone-numbers/buy')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Buy Number
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Dashboard>
    </ProtectedRoute>
  );
} 